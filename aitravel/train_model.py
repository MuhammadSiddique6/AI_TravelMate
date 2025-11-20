import pandas as pd
import random
from sklearn.tree import DecisionTreeClassifier
import pickle

interests = ["historical", "nature", "cultural", "adventure"]

# Weather codes (WMO standard)
weathers = {
    0: "clear sky", 1: "mainly clear", 2: "partly cloudy", 3: "overcast",
    45: "fog", 48: "depositing rime fog", 51: "light drizzle", 53: "moderate drizzle",
    55: "dense drizzle", 56: "freezing drizzle", 57: "dense freezing drizzle",
    61: "slight rain", 63: "moderate rain", 65: "heavy rain", 66: "freezing rain",
    67: "heavy freezing rain", 71: "slight snow", 73: "moderate snow", 75: "heavy snow",
    77: "snow grains", 80: "rain showers", 81: "heavy rain showers", 82: "violent rain showers",
    85: "snow showers", 86: "heavy snow showers", 95: "thunderstorm",
    96: "thunderstorm with hail", 99: "heavy thunderstorm with hail"
}

places = [
    "Badshahi Mosque – Lahore", "Lahore Fort – Lahore", "Shalimar Gardens – Lahore",
    "Wazir Khan Mosque – Lahore", "Sheesh Mahal – Lahore", "Minar-e-Pakistan – Lahore",
    "Data Darbar – Lahore", "Greater Iqbal Park – Lahore",
    # Islamabad / Rawalpindi
    "Faisal Mosque – Islamabad", "Pakistan Monument – Islamabad",
    "Lok Virsa Museum – Islamabad", "Saidpur Village – Islamabad",
    "Margalla Hills – Islamabad", "Rawal Lake – Islamabad",
    "Daman-e-Koh – Islamabad", "Taxila Museum – Rawalpindi",
    # Northern Areas
    "Hunza Valley – Gilgit-Baltistan", "Fairy Meadows – Gilgit-Baltistan",
    "Skardu – Gilgit-Baltistan", "Deosai Plains – Skardu", "K2 Base Camp – Skardu",
    "Naltar Valley – Gilgit", "Khunjerab Pass – Hunza", "Rakaposhi Base Camp – Nagar",
    "Attabad Lake – Hunza", "Passu Cones – Hunza",
    # KPK
    "Swat Valley – KPK", "Malam Jabba – Swat", "Kumrat Valley – Upper Dir",
    "Chitral – KPK", "Kalash Valley – Chitral", "Siri Paye Meadows – Shogran",
    "Naran Kaghan – KPK", "Ayubia National Park – Abbottabad", "Thandiani – Abbottabad",
    # Sindh
    "Makli Necropolis – Thatta", "Mohenjo Daro – Larkana", "Ranikot Fort – Jamshoro",
    "Gorakh Hills – Dadu", "Chaukhandi Tombs – Karachi", "Clifton Beach – Karachi",
    "Quaid-e-Azam Mausoleum – Karachi", "Haleji Lake – Thatta",
    # Balochistan
    "Hingol National Park – Lasbela", "Princess of Hope – Makran Coast",
    "Kund Malir Beach – Balochistan", "Hanna Lake – Quetta", "Pir Ghaib Waterfall – Bolan",
    # Punjab
    "Rohtas Fort – Jhelum", "Khewra Salt Mines – Jhelum", "Hiran Minar – Sheikhupura",
    "Noor Mahal – Bahawalpur", "Derawar Fort – Bahawalpur", "Lal Suhanra Park – Bahawalpur",
    "Soon Valley – Khushab", "Katas Raj Temples – Chakwal",
    # AJK
    "Neelum Valley – Azad Kashmir", "Ratti Gali Lake – Neelum Valley",
    "Arang Kel – Neelum Valley", "Banjosa Lake – Rawalakot", "Bagh Valley – AJK"
]

# --- Step 3: Generate Random Dataset ---
records = []
for _ in range(600):
    interest = random.choice(interests)
    weather_code = random.choice(list(weathers.keys()))
    budget = random.randint(4000, 30000)
    recommended_site = random.choice(places)
    records.append([interest, weather_code, budget, recommended_site])

df = pd.DataFrame(records, columns=["interest", "weather_code", "budget", "recommended_site"])

df["interest_cat"] = df["interest"].astype("category").cat.codes
df["recommended_site_cat"] = df["recommended_site"].astype("category").cat.codes

X = df[["interest_cat", "weather_code", "budget"]]
y = df["recommended_site_cat"]

model = DecisionTreeClassifier(max_depth=10, random_state=42)
model.fit(X, y)

model_data = {
    "model": model,
    "interest_mapping": dict(enumerate(df["interest"].astype("category").cat.categories)),
    "site_mapping": dict(enumerate(df["recommended_site"].astype("category").cat.categories)),
    "weather_codes": weathers
}

with open("travel_model.pkl", "wb") as f:
    pickle.dump(model_data, f)

df.to_csv("travel_dataset.csv", index=False)

print(f"✅ Model trained successfully with {len(df)} records and saved as travel_model.pkl & travel_dataset.csv!")
