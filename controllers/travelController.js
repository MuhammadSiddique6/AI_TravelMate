const { PythonShell } = require("python-shell");
const path = require("path");

exports.getRecommendation = async (req, res) => {
  try {
    const { interest, budget, weather_code } = req.body;

    if (!interest || !budget || weather_code === undefined) {
      return res.status(400).json({
        error: "Missing required fields: interest, budget, or weather_code",
      });
    }

    // 🌦️ Weather mapping (both numeric and descriptive supported)
    const weather_map = {
      0: "clear sky",
      1: "mainly clear",
      2: "partly cloudy",
      3: "overcast",
      45: "fog",
      48: "depositing rime fog",
      51: "light drizzle",
      53: "moderate drizzle",
      55: "dense drizzle",
      56: "freezing drizzle",
      57: "dense freezing drizzle",
      61: "slight rain",
      63: "moderate rain",
      65: "heavy rain",
      66: "freezing rain",
      67: "heavy freezing rain",
      71: "slight snow",
      73: "moderate snow",
      75: "heavy snow",
      77: "snow grains",
      80: "rain showers",
      81: "heavy rain showers",
      82: "violent rain showers",
      85: "snow showers",
      86: "heavy snow showers",
      95: "thunderstorm",
      96: "thunderstorm with hail",
      99: "heavy thunderstorm with hail",
    };

    // Reverse map to support text input like "clear sky"
    const reverse_map = Object.fromEntries(
      Object.entries(weather_map).map(([code, desc]) => [desc.toLowerCase(), Number(code)])
    );

    let weather_numeric;

    if (typeof weather_code === "number") {
      weather_numeric = weather_code;
    } else if (typeof weather_code === "string") {
      const lower = weather_code.toLowerCase();
      if (reverse_map[lower] !== undefined) {
        weather_numeric = reverse_map[lower];
      } else {
        return res.status(400).json({
          error: `Invalid weather_code string. Use one of: ${Object.values(weather_map)
            .slice(0, 10)
            .join(", ")}...`,
        });
      }
    } else {
      return res.status(400).json({
        error: "weather_code must be a number or a valid description string",
      });
    }

    // 🧠 PythonShell options
    const options = {
      mode: "json",
      pythonOptions: ["-u"],
      scriptPath: path.join(__dirname, "../aitravel"),
    };

    const pyshell = new PythonShell("predict_travel.py", options);

    // Send input JSON to Python
    pyshell.send({
      interest,
      weather_code: weather_numeric,
      budget,
    });

    let result = null;

    pyshell.on("message", (message) => {
      result = message;
    });

    pyshell.end((err) => {
      if (err) {
        console.error("❌ Python error:", err);
        return res.status(500).json({ error: "Prediction failed" });
      }

      if (!result || result.error) {
        console.error("⚠️ Invalid result from Python:", result);
        return res
          .status(500)
          .json({ error: result?.error || "No result from model" });
      }

      res.json({
        success: true,
        weather_description: weather_map[weather_numeric],
        recommendation: result.prediction,
      });
    });
  } catch (error) {
    console.error("❌ Server error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
