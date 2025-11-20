const Site = require("../models/siteModel");
const { synthesize } = require("../services/ttsService");
const axios = require("axios");

exports.addSite = async (req, res) => {
  try {
    const { name, city, description, images, latitude, longitude, category, crowd_density } = req.body;

    // 1️⃣ Fetch 7-day weather data from Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=7&timezone=auto`;
    const { data } = await axios.get(weatherUrl);

    const weekly_weather = data.daily.time.map((date, index) => ({
      date: date,
      temperature: data.daily.temperature_2m_max[index],
      description: `Weather code: ${data.daily.weathercode[index]}`,
    }));

    // 2️⃣ Create site with weather info
    const site = await Site.create({
      name,
      city,
      description,
      images,
      latitude,
      longitude,
      category,
      crowd_density,
      weekly_weather,
    });

    res.status(201).json({ message: "Site added successfully", site });
  } catch (error) {
    res.status(500).json({ message: "Error adding site", error: error.message });
  }
};

exports.getAllSites = async (req, res) => {
  try {
    const sites = await Site.find();
    res.status(200).json(sites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sites", error: error.message });
  }
};

exports.getSiteById = async (req, res) => {
  try {
    const { id } = req.params;
    const { lang, selectedDate, selectedDay } = req.body; // from frontend

    if (!lang) {
      return res
        .status(400)
        .json({ message: "Language (lang) is required: 'ur' or 'en'" });
    }

    // 1️⃣ Find site
    const site = await Site.findById(id);
    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    // 2️⃣ Get latest 7-day weather from free API (Open-Meteo)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${site.latitude}&longitude=${site.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

    const weatherResponse = await axios.get(weatherUrl);
    const dailyWeather = weatherResponse.data.daily;

    // 3️⃣ Format weekly weather data
    const weeklyWeather = dailyWeather.time.map((date, i) => ({
      date,
      temp_max: dailyWeather.temperature_2m_max[i],
      temp_min: dailyWeather.temperature_2m_min[i],
      precipitation: dailyWeather.precipitation_sum[i],
    }));

    // 4️⃣ Update site’s weekly weather in DB
    site.weekly_weather = weeklyWeather;
    site.last_selected = { date: selectedDate, day: selectedDay };
    await site.save();

    // 5️⃣ Select language description
    const langKey = lang === "ur" ? "urdu" : "english";
    const descriptionText = site.description?.[langKey] || "No description available.";
    const textToSpeak = `${site.name}. ${descriptionText}`;

    // 6️⃣ Generate or reuse audio
    let audio_b64 = site.voice_guide?.[langKey];
    if (!audio_b64) {
      const ttsBase64 = await synthesize(textToSpeak, lang);
      site.voice_guide[langKey] = ttsBase64;
      await site.save();
      audio_b64 = ttsBase64;
    }

    // 7️⃣ Respond with everything
    res.status(200).json({
      site: {
        name: site.name,
        city: site.city,
        description: descriptionText,
        images: site.images,
        last_selected: site.last_selected,
        weekly_weather: site.weekly_weather,
      },
      audio_b64,
      content_type: "audio/mpeg",
      message: `Audio generated in ${lang === "ur" ? "Urdu" : "English"}`,
    });
  } catch (error) {
    console.error("Error fetching site:", error);
    res
      .status(500)
      .json({ message: "Error fetching site", error: error.message });
  }
};
