const mongoose = require("mongoose");
const Site = require("./models/siteModel");
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URI);

const sites = [
  {
    name: "Badshahi Mosque",
    city: "Lahore",
    description: {
      english:
        "The Badshahi Mosque, built in 1673 by Emperor Aurangzeb, is one of the largest mosques in the world. It represents Mughal architectural grandeur and attracts thousands of visitors daily. The mosque’s red sandstone exterior and intricate marble work symbolize Lahore’s royal heritage. It remains a major landmark of Islamic art and history.",
      urdu: "بادشاہی مسجد 1673 میں مغل بادشاہ اورنگزیب نے تعمیر کروائی۔ یہ دنیا کی سب سے بڑی مساجد میں سے ایک ہے اور لاہور کی شان سمجھی جاتی ہے۔ اس کی سرخ پتھروں کی عمارت اور نفیس سنگ مرمر کی نقاشی مغلیہ فن تعمیر کی خوبصورتی دکھاتی ہے۔ یہ آج بھی اسلامی تاریخ اور فن کا اہم نمونہ ہے۔",
    },
    images: [],
    latitude: 31.5889,
    longitude: 74.3111,
  },
  {
    name: "Lahore Fort",
    city: "Lahore",
    description: {
      english:
        "The Lahore Fort, also known as Shahi Qila, dates back to the Mughal era and is a UNESCO World Heritage site. It features palaces, gardens, and museums that showcase centuries of royal legacy. The fort has been rebuilt and expanded by various rulers, making it a historical masterpiece. It stands beside the Badshahi Mosque, forming a stunning Mughal complex.",
      urdu: "شاہی قلعہ لاہور مغل دور کی ایک تاریخی یادگار ہے اور یونیسکو کے عالمی ورثہ میں شامل ہے۔ اس میں محل، باغات اور عجائب گھر شامل ہیں جو شاہی ورثے کی جھلک دکھاتے ہیں۔ مختلف بادشاہوں نے اسے وسعت دی، جس سے یہ ایک تاریخی شاہکار بن گیا۔ بادشاہی مسجد کے قریب واقع یہ قلعہ مغلیہ فن تعمیر کی شان ہے۔",
    },
    images: [],
    latitude: 31.5906,
    longitude: 74.3099,
  },
  {
    name: "Shalimar Gardens",
    city: "Lahore",
    description: {
      english:
        "Built in 1641 by Emperor Shah Jahan, Shalimar Gardens is a masterpiece of Mughal landscape design. The gardens feature cascading fountains, marble terraces, and lush greenery. It served as a royal retreat and symbol of paradise on earth. Today, it stands as a serene spot for tourists and locals alike.",
      urdu: "شالامار باغ 1641 میں مغل بادشاہ شاہجہان نے تعمیر کروایا۔ یہ مغلیہ طرز کے باغات کا شاہکار ہے، جس میں فوارے، سنگ مرمر کے چبوترے اور سرسبز درخت شامل ہیں۔ یہ کبھی شاہی آرام گاہ تھی اور جنت کی علامت سمجھا جاتا تھا۔ آج یہ سیاحوں کے لیے ایک پرسکون مقام ہے۔",
    },
    images: [],
    latitude: 31.5886,
    longitude: 74.3582,
  },
  {
    name: "Wazir Khan Mosque",
    city: "Lahore",
    description: {
      english:
        "Wazir Khan Mosque, built during Shah Jahan’s reign in 1634, is famous for its colorful tile work and intricate frescoes. Located in Lahore’s old city, it reflects Persian and Mughal artistry. The mosque served as both a place of worship and a cultural hub. It is often called the 'jewel of Lahore'.",
      urdu: "وزیر خان مسجد 1634 میں شاہجہان کے دور میں تعمیر ہوئی۔ یہ اپنے رنگین ٹائل ورک اور نفیس دیواروں کی نقاشی کے لیے مشہور ہے۔ پرانے لاہور میں واقع یہ مسجد عبادت اور ثقافت دونوں کے لیے مرکز رہی۔ اسے 'لاہور کا جواہر' کہا جاتا ہے۔",
    },
    images: [],
    latitude: 31.5834,
    longitude: 74.3255,
  },
  {
    name: "Sheesh Mahal",
    city: "Lahore",
    description: {
      english:
        "Sheesh Mahal, or the Palace of Mirrors, lies within Lahore Fort and was built by Shah Jahan in 1631. It is decorated with thousands of small mirrors that shimmer under light. The palace was used by royal families for private gatherings. It showcases the luxurious taste of Mughal royalty.",
      urdu: "شیش محل لاہور قلعہ کے اندر واقع ہے اور اسے 1631 میں شاہجہان نے تعمیر کروایا۔ اس کی دیواروں پر چھوٹے چھوٹے آئینے جڑے ہوئے ہیں جو روشنی میں چمکتے ہیں۔ یہ شاہی خاندان کی نجی محفلوں کے لیے استعمال ہوتا تھا۔ یہ مغل شاہی شان و شوکت کی علامت ہے۔",
    },
    images: [],
    latitude: 31.5892,
    longitude: 74.3118,
  },
  {
    name: "Minar-e-Pakistan",
    city: "Lahore",
    description: {
      english:
        "Minar-e-Pakistan was built in 1968 to commemorate the Lahore Resolution of 1940. It symbolizes the foundation of Pakistan’s independence movement. The tower combines Mughal, Islamic, and modern architectural styles. It stands in Iqbal Park and remains a national symbol of pride.",
      urdu: "مینارِ پاکستان 1968 میں لاہور قرارداد کی یاد میں تعمیر کیا گیا۔ یہ پاکستان کی آزادی کی جدوجہد کی علامت ہے۔ اس کے فن تعمیر میں مغلیہ، اسلامی اور جدید طرزوں کا حسین امتزاج ہے۔ اقبال پارک میں واقع یہ مینار قومی فخر کی علامت ہے۔",
    },
    images: [],
    latitude: 31.5925,
    longitude: 74.3094,
  },
  {
    name: "Data Darbar",
    city: "Lahore",
    description: {
      english:
        "Data Darbar is the shrine of the famous Sufi saint Ali Hujwiri, known as Data Ganj Bakhsh. Built in the 11th century, it is one of South Asia’s oldest Sufi shrines. It attracts millions of devotees every year for spiritual peace. The site also represents Lahore’s deep-rooted spiritual culture.",
      urdu: "داتا دربار مشہور صوفی بزرگ حضرت علی ہجویری المعروف داتا گنج بخش کا مزار ہے۔ یہ 11ویں صدی میں قائم ہوا اور برصغیر کے قدیم ترین مزارات میں سے ایک ہے۔ ہر سال لاکھوں زائرین روحانی سکون کے لیے یہاں آتے ہیں۔ یہ لاہور کی روحانی تاریخ کی عکاسی کرتا ہے۔",
    },
    images: [],
    latitude: 31.582,
    longitude: 74.3138,
  },
  {
    name: "Greater Iqbal Park",
    city: "Lahore",
    description: {
      english:
        "Greater Iqbal Park is a modern urban park built around Minar-e-Pakistan. It includes fountains, a musical lake, and green landscapes. The park pays tribute to Allama Iqbal’s dream of Pakistan. It serves as a family-friendly recreational spot with historical significance.",
      urdu: "گریٹر اقبال پارک مینارِ پاکستان کے اردگرد بنایا گیا ایک جدید شہری پارک ہے۔ اس میں فوارے، جھیل اور سرسبز لان شامل ہیں۔ یہ علامہ اقبال کے خواب پاکستان کو خراجِ عقیدت پیش کرتا ہے۔ یہ تاریخی اہمیت کے ساتھ ایک خوبصورت تفریحی مقام ہے۔",
    },
    images: [],
    latitude: 31.5927,
    longitude: 74.3088,
  },
  // ================= Islamabad =================
  {
    name: "Faisal Mosque",
    city: "Islamabad",
    description: {
      english:
        "Faisal Mosque, completed in 1986, is Pakistan’s largest mosque and a masterpiece of modern Islamic architecture. Designed by Turkish architect Vedat Dalokay, it was funded by King Faisal of Saudi Arabia. Its unique tent-like structure and scenic Margalla backdrop make it an iconic landmark.",
      urdu: "فیصل مسجد، جو 1986 میں مکمل ہوئی، پاکستان کی سب سے بڑی مسجد ہے اور جدید اسلامی فن تعمیر کا شاہکار ہے۔ اسے ترک معمار ویدات دالوکائے نے ڈیزائن کیا اور سعودی عرب کے شاہ فیصل نے مالی معاونت فراہم کی۔ اس کی خیمے جیسی ساخت اور مارگلہ پہاڑوں کا پس منظر اسے ایک دلکش علامت بناتا ہے۔",
    },
    images: [],
    latitude: 33.729,
    longitude: 73.037,
  },
  {
    name: "Pakistan Monument",
    city: "Islamabad",
    description: {
      english:
        "The Pakistan Monument symbolizes national unity and represents the four provinces and three territories of Pakistan. Its petal-shaped structure overlooks Islamabad from Shakarparian Hills. The monument and museum showcase Pakistan’s history and cultural heritage.",
      urdu: "پاکستان مونومنٹ قومی اتحاد کی علامت ہے جو چار صوبوں اور تین خطوں کی نمائندگی کرتا ہے۔ اس کی پھول کی مانند ساخت شکرپڑیاں کی پہاڑیوں سے اسلام آباد کا نظارہ پیش کرتی ہے۔ یہ یادگار اور اس کے ساتھ میوزیم پاکستان کی تاریخ اور ثقافت کو اجاگر کرتے ہیں۔",
    },
    images: [],
    latitude: 33.693,
    longitude: 73.065,
  },
  {
    name: "Daman-e-Koh",
    city: "Islamabad",
    description: {
      english:
        "Daman-e-Koh is a scenic viewpoint located in the Margalla Hills, offering breathtaking views of Islamabad. It’s a popular picnic and tourist spot surrounded by lush greenery and wildlife. The location serves as the starting point for hikes towards Pir Sohawa.",
      urdu: "دمن کوہ مارگلہ کی پہاڑیوں میں واقع ایک خوبصورت مقام ہے جہاں سے اسلام آباد کا دلکش نظارہ کیا جا سکتا ہے۔ یہ قدرتی خوبصورتی اور جنگلی حیات سے گھرا ہوا ایک مشہور تفریحی مقام ہے۔ یہ پیر سوہاوا کی طرف جانے والے ہائیکنگ راستوں کا آغاز بھی ہے۔",
    },
    images: [],
    latitude: 33.742,
    longitude: 73.057,
  },

  // ================= Gilgit-Baltistan =================
  {
    name: "Hunza Valley",
    city: "Gilgit-Baltistan",
    description: {
      english:
        "Hunza Valley is a paradise surrounded by snow-capped mountains like Rakaposhi and Ultar Peak. It’s known for its hospitable people, breathtaking views, and rich history. The valley is also famous for Altit and Baltit forts, reflecting ancient Hunza culture.",
      urdu: "ہنزہ وادی برف پوش پہاڑوں جیسے رکاپوشی اور التت کے درمیان واقع ایک جنت نظیر وادی ہے۔ یہاں کے لوگ مہمان نواز ہیں اور مناظر دلکش ہیں۔ التت اور بلتت قلعے اس علاقے کی قدیم ثقافت اور تاریخ کی عکاسی کرتے ہیں۔",
    },
    images: [],
    latitude: 36.316,
    longitude: 74.65,
  },
  {
    name: "Fairy Meadows",
    city: "Gilgit-Baltistan",
    description: {
      english:
        "Fairy Meadows lies near Nanga Parbat and offers one of the most beautiful landscapes in the world. The lush green plateau provides mesmerizing views of the mighty peak. It’s a top spot for camping and trekking enthusiasts.",
      urdu: "فیری میڈوز نانگا پربت کے قریب واقع ہے اور دنیا کے خوبصورت ترین مقامات میں شمار ہوتا ہے۔ اس کے سبز میدانوں سے برف پوش پہاڑوں کا حسین منظر دکھائی دیتا ہے۔ یہ کیمپنگ اور ہائیکنگ کے شوقینوں کے لیے ایک پسندیدہ مقام ہے۔",
    },
    images: [],
    latitude: 35.346,
    longitude: 74.58,
  },

  // ================= KPK =================
  {
    name: "Swat Valley",
    city: "KPK",
    description: {
      english:
        "Swat Valley, often called the 'Switzerland of Pakistan', is famous for its green valleys, waterfalls, and historical Buddhist sites. The Swat River flows through the valley, adding to its charm. It’s a perfect mix of nature and heritage.",
      urdu: "سوات وادی کو پاکستان کا سوئٹزرلینڈ کہا جاتا ہے۔ یہ اپنی سرسبز وادیوں، آبشاروں اور بدھ مت کے تاریخی آثار کے لیے مشہور ہے۔ دریائے سوات اس کی خوبصورتی میں اضافہ کرتا ہے۔ یہ قدرت اور تاریخ کا حسین امتزاج ہے۔",
    },
    images: [],
    latitude: 35.222,
    longitude: 72.425,
  },
  {
    name: "Malam Jabba",
    city: "Swat",
    description: {
      english:
        "Malam Jabba is a popular hill station and the only ski resort in Pakistan. Surrounded by pine forests and mountains, it offers skiing, hiking, and chairlift rides. It’s a major tourist attraction in Swat.",
      urdu: "مالم جبہ ایک مشہور پہاڑی مقام اور پاکستان کا واحد اسکائی ریزورٹ ہے۔ یہ دیودار کے جنگلات اور پہاڑوں سے گھرا ہوا ہے۔ یہاں اسکائینگ، ہائیکنگ اور چیئر لفٹ جیسی سرگرمیاں دستیاب ہیں۔",
    },
    images: [],
    latitude: 35.218,
    longitude: 72.563,
  },

  // ================= Sindh =================
  {
    name: "Mohenjo Daro",
    city: "Larkana",
    description: {
      english:
        "Mohenjo Daro is an ancient Indus Valley Civilization site dating back to 2500 BCE. It showcases advanced urban planning, drainage systems, and architecture. The ruins tell the story of one of the earliest human civilizations.",
      urdu: "موئن جو دڑو وادی سندھ کی تہذیب کا قدیم شہر ہے جو تقریباً 2500 قبل مسیح میں آباد تھا۔ یہاں جدید شہری منصوبہ بندی اور نکاسی آب کے نظام کے آثار ملتے ہیں۔ یہ انسانی تاریخ کی ابتدائی تہذیبوں میں سے ایک کی کہانی سناتا ہے۔",
    },
    images: [],
    latitude: 27.328,
    longitude: 68.138,
  },
  {
    name: "Clifton Beach",
    city: "Karachi",
    description: {
      english:
        "Clifton Beach lies along the Arabian Sea and is a favorite destination for locals and tourists. It offers camel rides, horse rides, and beautiful sunset views. The beach is known for its refreshing sea breeze and vibrant environment.",
      urdu: "کلفٹن بیچ کراچی کا مشہور ساحل ہے جو بحیرہ عرب کے کنارے واقع ہے۔ یہاں اونٹ اور گھوڑے کی سواری کے ساتھ ساتھ خوبصورت سورج غروب کا منظر بھی دیکھنے کو ملتا ہے۔ یہ ٹھنڈی ہوا اور زندہ دل ماحول کے لیے مشہور ہے۔",
    },
    images: [],
    latitude: 24.826,
    longitude: 67.031,
  },

  // ================= Balochistan =================
  {
    name: "Hingol National Park",
    city: "Lasbela",
    description: {
      english:
        "Hingol National Park is Pakistan’s largest national park, known for its unique landscapes, wildlife, and the Princess of Hope rock formation. It’s home to the Hingol River and lies along the Makran Coastal Highway.",
      urdu: "ہنگول نیشنل پارک پاکستان کا سب سے بڑا نیشنل پارک ہے جو اپنی قدرتی مناظر، جنگلی حیات اور 'پرنسز آف ہوپ' چٹان کے لیے مشہور ہے۔ یہ ہنگول دریا اور مکران کوسٹل ہائی وے کے قریب واقع ہے۔",
    },
    images: [],
    latitude: 25.513,
    longitude: 65.526,
  },
  {
    name: "Kund Malir Beach",
    city: "Balochistan",
    description: {
      english:
        "Kund Malir Beach is a serene coastal destination along the Makran Coastal Highway. Its golden sand and crystal waters make it one of Pakistan’s most beautiful beaches. The beach is ideal for relaxation and photography.",
      urdu: "کُنڈ ملیر بیچ مکران کوسٹل ہائی وے کے کنارے واقع ایک پرسکون ساحل ہے۔ اس کی سنہری ریت اور نیلا پانی اسے پاکستان کے خوبصورت ترین ساحلوں میں شامل کرتے ہیں۔ یہ آرام اور فوٹوگرافی کے لیے بہترین جگہ ہے۔",
    },
    images: [],
    latitude: 25.585,
    longitude: 66.607,
  },

  // ================= Punjab =================
  {
    name: "Rohtas Fort",
    city: "Jhelum",
    description: {
      english:
        "Rohtas Fort was built by Sher Shah Suri in the 16th century. It’s a UNESCO World Heritage Site known for its solid walls and gates. The fort served as a stronghold to control military routes between Peshawar and Lahore.",
      urdu: "روہتاس قلعہ شیر شاہ سوری نے 16ویں صدی میں تعمیر کروایا۔ یہ یونیسکو کے عالمی ورثے میں شامل ہے اور اپنی مضبوط دیواروں اور دروازوں کے لیے مشہور ہے۔ یہ قلعہ پشاور اور لاہور کے درمیانی فوجی راستوں پر ایک اہم دفاعی مقام تھا۔",
    },
    images: [],
    latitude: 32.968,
    longitude: 73.577,
  },
  {
    name: "Khewra Salt Mines",
    city: "Jhelum",
    description: {
      english:
        "Khewra Salt Mines are the second largest in the world, producing famous pink Himalayan salt. The mine features tunnels, chambers, and sculptures made of salt. It attracts thousands of visitors annually.",
      urdu: "کھیوڑہ نمک کی کانیں دنیا کی دوسری بڑی نمک کی کانیں ہیں جہاں سے گلابی ہمالیائی نمک حاصل کیا جاتا ہے۔ یہاں نمک سے بنے راستے، چیمبرز اور مجسمے دیکھنے کو ملتے ہیں۔ ہر سال ہزاروں سیاح یہاں آتے ہیں۔",
    },
    images: [],
    latitude: 32.647,
    longitude: 73.008,
  },

  // ================= AJK =================
  {
    name: "Neelum Valley",
    city: "Azad Kashmir",
    description: {
      english:
        "Neelum Valley is one of Pakistan’s most beautiful valleys, filled with lush forests, rivers, and snow-covered mountains. The valley is known for its scenic villages and crystal-clear streams.",
      urdu: "نیلم ویلی پاکستان کی خوبصورت ترین وادیوں میں سے ایک ہے۔ یہاں سرسبز جنگلات، دریا اور برف پوش پہاڑ موجود ہیں۔ یہ اپنے حسین مناظر اور صاف پانی کے چشموں کے لیے مشہور ہے۔",
    },
    images: [],
    latitude: 34.628,
    longitude: 73.906,
  },
  {
    name: "Ratti Gali Lake",
    city: "Neelum Valley",
    description: {
      english:
        "Ratti Gali Lake is an alpine glacial lake located at a high altitude in Neelum Valley. Surrounded by snow-capped peaks, it’s known for its crystal waters and breathtaking beauty.",
      urdu: "رتی گلی جھیل نیلم ویلی میں واقع ایک بلند پہاڑی جھیل ہے۔ برف پوش پہاڑوں سے گھری یہ جھیل اپنے شفاف پانی اور دلکش مناظر کے لیے مشہور ہے۔",
    },
    images: [],
    latitude: 34.837,
    longitude: 74.05,
  },
];

(async () => {
  try {
    await Site.insertMany(sites);
    console.log("✅ All sites added successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding sites:", error);
    process.exit(1);
  }
})();
