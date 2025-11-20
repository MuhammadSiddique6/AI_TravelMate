import pickle
import pandas as pd
import sys
import json
import os
import traceback
import numpy as np
import requests

try:
    # --- Base Directory ---
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # --- Load Model and Mappings ---
    pickle_path = os.path.join(base_dir, "travel_model.pkl")
    with open(pickle_path, "rb") as f:
        model_data = pickle.load(f)

    model = model_data.get("model")
    interest_mapping = model_data.get("interest_mapping")
    site_mapping = model_data.get("site_mapping")

    if not all([model, interest_mapping, site_mapping]):
        raise ValueError("❌ Model or mappings missing in pickle file")

    # --- Load Dataset ---
    dataset_path = os.path.join(base_dir, "travel_dataset.csv")
    if not os.path.exists(dataset_path):
        raise FileNotFoundError("❌ travel_dataset.csv missing in aittravel folder")

    dataset = pd.read_csv(dataset_path)
    dataset.columns = [c.strip().lower() for c in dataset.columns]  # normalize column names

    # --- Find recommended_place column dynamically ---
    place_col = None
    for c in dataset.columns:
        if "place" in c or "site" in c or "location" in c or "name" in c:
            place_col = c
            break

    if not place_col:
        raise ValueError("❌ Could not find any column containing place names in CSV")

    # --- If city column missing, try to extract from place names ---
    if "city" not in dataset.columns:
        dataset["city"] = dataset[place_col].astype(str).str.extract(r"[-–]\s*(.*)")
        dataset["city"] = dataset["city"].fillna("Unknown").str.strip()

    # --- Read Input from Node.js ---
    input_text = sys.stdin.readline().strip()
    if not input_text:
        raise ValueError("❌ No input received from Node.js")

    input_data = json.loads(input_text)
    interest = input_data.get("interest")
    budget = input_data.get("budget")
    mood_weather_code = input_data.get("weather_code")

    if interest is None or budget is None or mood_weather_code is None:
        raise ValueError("❌ Missing required fields: 'interest', 'budget', or 'weather_code'")

    # --- Reverse interest mapping ---
    reverse_interest_mapping = {v: k for k, v in interest_mapping.items()}
    if interest not in reverse_interest_mapping:
        raise ValueError(f"❌ Unknown interest: {interest}")

    interest_encoded = reverse_interest_mapping[interest]

    # --- Major Cities with Coordinates ---
    city_coords = {
        "Lahore": (31.5204, 74.3587),
        "Islamabad": (33.6844, 73.0479),
        "Karachi": (24.8607, 67.0011),
        "Quetta": (30.1798, 66.9750),
        "Skardu": (35.2976, 75.6334),
        "Hunza": (36.3167, 74.6500),
        "Bahawalpur": (29.3956, 71.6836),
        "Thatta": (24.7464, 67.9235),
        "Abbottabad": (34.1463, 73.2117),
        "Chitral": (35.8500, 71.7833),
        "Rawalakot": (33.8500, 73.7667),
    }

    # --- Function to fetch real-time weather code ---
    def get_weather_code(lat, lon):
        try:
            url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
            res = requests.get(url, timeout=10)
            res.raise_for_status()
            data = res.json()
            return int(data["current_weather"]["weathercode"])
        except Exception:
            return None

    # --- Compare each city’s weather to user's mood weather ---
    city_similarity = []
    for city, (lat, lon) in city_coords.items():
        city_weather = get_weather_code(lat, lon)
        if city_weather is not None:
            similarity = 1 / (1 + abs(city_weather - mood_weather_code))
            city_similarity.append((city, city_weather, similarity))

    if not city_similarity:
        raise ValueError("❌ Unable to fetch real-time weather for any city")

    # --- Sort by similarity and take top 3 matching cities ---
    city_similarity.sort(key=lambda x: x[2], reverse=True)
    top_cities = city_similarity[:3]

    # --- Make model predictions for top cities ---
    predictions = []
    for city, city_weather, similarity in top_cities:
        df = pd.DataFrame([{
            "interest_cat": interest_encoded,
            "weather_code": city_weather,
            "budget": budget
        }])

        probs = model.predict_proba(df)[0]
        top_idx = np.argmax(probs)
        predicted_place = site_mapping[top_idx]

        # --- Get local recommended places for that city ---
        city_places = (
            dataset[dataset["city"].str.lower() == city.lower()][place_col]
            .dropna()
            .unique()
            .tolist()
        )

        # If no city-specific places found, fallback to model prediction
        if not city_places:
            city_places = [predicted_place]

        predictions.append({
            "city": city,
            "city_weather_code": city_weather,
            "similarity_score": round(similarity, 3),
            "recommended_places": city_places
        })

    # --- Output JSON ---
    print(json.dumps({
        "success": True,
        "based_on": "real-time weather",
        "user_mood_weather_code": mood_weather_code,
        "prediction": predictions
    }))

except Exception as e:
    print("ERROR TRACEBACK:", file=sys.stderr)
    traceback.print_exc()
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
