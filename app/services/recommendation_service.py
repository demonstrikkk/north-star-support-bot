from __future__ import annotations

ACTIVITY_ALIASES = {
    "hiking": "hiking",
    "hike": "hiking",
    "camping": "camping",
    "camp": "camping",
    "backpacking": "backpacking",
    "backpack": "backpacking",
    "cold weather": "cold_weather",
    "cold-weather": "cold_weather",
    "winter": "cold_weather",
}

PREFERENCE_ALIASES = {
    "warm and dry": "warm_dry",
    "warm": "warm_dry",
    "dry": "warm_dry",
    "rainy": "rainy",
    "rain": "rainy",
    "cold": "cold",
    "near my vehicle": "vehicle",
    "vehicle": "vehicle",
    "car camping": "vehicle",
    "carrying my gear": "carrying",
    "carrying": "carrying",
    "portable": "carrying",
    "lower weight": "lower_weight",
    "lightweight": "lower_weight",
    "extra comfort": "comfort",
    "comfort": "comfort",
    "clothing": "clothing",
    "sleeping equipment": "sleeping",
    "sleeping": "sleeping",
}

RECOMMENDATIONS = {
    ("hiking", "warm_dry"): (
        "Breathable hiking apparel",
        "Lightweight, breathable layers are a practical category for warm, dry trails.",
    ),
    ("hiking", "rainy"): (
        "Waterproof hiking apparel",
        "Waterproof outer layers help keep wet conditions manageable on the trail.",
    ),
    ("hiking", "cold"): (
        "Insulated outdoor layers",
        "Insulated layers are the most suitable category for colder hiking conditions.",
    ),
    ("camping", "vehicle"): (
        "Spacious camping shelters",
        "When you stay near a vehicle, a roomier shelter category can prioritize comfort.",
    ),
    ("camping", "carrying"): (
        "Lightweight camping equipment",
        "Lightweight categories are easier to carry from the trailhead to camp.",
    ),
    ("backpacking", "lower_weight"): (
        "Ultralight packs and sleep systems",
        "These categories help reduce carried weight on longer backpacking routes.",
    ),
    ("backpacking", "comfort"): (
        "Supportive packs and insulated sleeping equipment",
        "These categories place more emphasis on carrying and sleeping comfort.",
    ),
    ("cold_weather", "clothing"): (
        "Insulated outdoor apparel",
        "Insulated clothing categories are appropriate for cold-weather outdoor activity.",
    ),
    ("cold_weather", "sleeping"): (
        "Cold-weather sleeping equipment",
        "This category is the appropriate place to start for lower-temperature nights.",
    ),
}


def normalize_activity(value: str) -> str | None:
    lowered = value.lower().strip()
    for alias, canonical in ACTIVITY_ALIASES.items():
        if alias in lowered:
            return canonical
    return None


def normalize_preference(value: str) -> str | None:
    lowered = value.lower().strip()
    for alias, canonical in PREFERENCE_ALIASES.items():
        if alias in lowered:
            return canonical
    return None


def get_question(activity: str) -> tuple[str, list[tuple[str, str]]]:
    questions = {
        "hiking": (
            "What conditions do you expect?",
            [("Warm and dry", "pref_warm_dry"), ("Rainy", "pref_rainy"), ("Cold", "pref_cold")],
        ),
        "camping": (
            "Will you stay near your vehicle or carry your equipment?",
            [("Near my vehicle", "pref_vehicle"), ("Carrying my gear", "pref_carrying")],
        ),
        "backpacking": (
            "What matters most?",
            [("Lower weight", "pref_lower_weight"), ("Extra comfort", "pref_comfort")],
        ),
        "cold_weather": (
            "Which type of gear are you looking for?",
            [("Clothing", "pref_clothing"), ("Sleeping equipment", "pref_sleeping")],
        ),
    }
    return questions[activity]


def recommend(activity: str, preference: str) -> tuple[str, str] | None:
    return RECOMMENDATIONS.get((activity, preference))
