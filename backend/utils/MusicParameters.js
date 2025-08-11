// Emotion → baseline energy & valence
export const analyzeEmotions = (userDistribution) => {
    const parsedUserEmotions = parseUserEmotions(userDistribution);
    console.log("Parsed User Emotions:", parsedUserEmotions);
    const vector = computeVector(parsedUserEmotions);
    console.log("Vector:", vector);
    const moodTerms = getMoodTerms(vector);
    console.log("Mood Terms:", moodTerms);
    return moodTerms;
}

const emotions = {
    happy: { energy: 0.8, valence: 0.9 },
    sad: { energy: 0.3, valence: 0.2 },
    angry: { energy: 0.8, valence: 0.2 },
    surprised: { energy: 0.7, valence: 0.6 },
    fearful: { energy: 0.6, valence: 0.3 },
    disgusted: { energy: 0.4, valence: 0.2 },
    neutral: { energy: 0.5, valence: 0.5 },
    calm: { energy: 0.3, valence: 0.6 }
};

// Mood buckets (energy x valence → Spotify search terms)
// const moodGrid = [
//     { cond: e => e.energy <= 0.33 && e.valence <= 0.33, terms: ["sad", "melancholy", "piano"] },
//     { cond: e => e.energy <= 0.33 && e.valence <= 0.66, terms: ["calm", "chill", "focus"] },
//     { cond: e => e.energy <= 0.33 && e.valence > 0.66, terms: ["romantic", "soft", "acoustic"] },

//     { cond: e => e.energy <= 0.66 && e.valence <= 0.33, terms: ["moody", "dark", "grunge"] },
//     { cond: e => e.energy <= 0.66 && e.valence <= 0.66, terms: ["neutral", "ambient", "study"] },
//     { cond: e => e.energy <= 0.66 && e.valence > 0.66, terms: ["chill happy", "soft pop", "light upbeat"] },

//     { cond: e => e.energy > 0.66 && e.valence <= 0.33, terms: ["angry", "metal", "punk"] },
//     { cond: e => e.energy > 0.66 && e.valence <= 0.66, terms: ["excited", "energetic", "rock"] },
//     { cond: e => e.energy > 0.66 && e.valence > 0.66, terms: ["happy", "dance", "party"] }
// ];

function parseUserEmotions(raw) {
    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (e) {
        console.error("Invalid JSON:", e.message);
        return {};
    }

    // Flatten if it's a nested 2D array
    const flatArray = Array.isArray(parsed[0]) ? parsed.flat() : parsed;

    const distribution = {};
    for (const { confidence, emotion } of flatArray) {
        const key = emotion.trim();
        distribution[key] = +(confidence / 100).toFixed(2);
    }

    return distribution;
}

function computeVector(distribution) {
    let energy = 0, valence = 0, total = 0;
    for (const emo in distribution) {
        const key = emo.toLowerCase();
        if (emotions[key]) {
            energy += emotions[key].energy * distribution[emo];
            valence += emotions[key].valence * distribution[emo];
            total += distribution[emo];
        } else {
            console.warn(`⚠️ Ignored unknown emotion: ${emo}`);
        }
    }
    if (total > 0) {
        energy /= total;
        valence /= total;
    }
    return { energy: +energy.toFixed(2), valence: +valence.toFixed(2) };
}

// Step 2: Match vector to mood keywords
// function getMoodTerms(vector) {
//     return moodGrid.find(m => m.cond(vector)).terms;
// }

// Enhanced mood mapping with personalized discovery
// const moodGrid = [
//     // Low Energy, Low Valence (Deep, Reflective)
//     {
//         cond: e => e.energy <= 0.33 && e.valence <= 0.33,
//         terms: [
//             "melancholic soundscapes",
//             "emotional piano ballads",
//             "sad indie folk",
//             "ambient melancholy",
//             "heartfelt acoustic",
//             "rainy day introspection",
//             "lo-fi sad beats",
//             "soulful ballads"
//         ]
//     },
//     // Low Energy, Medium Valence (Calm, Focused)
//     {
//         cond: e => e.energy <= 0.33 && e.valence <= 0.66,
//         terms: [
//             "chill focus beats",
//             "ambient study music",
//             "peaceful piano",
//             "zen meditation",
//             "concentration flow",
//             "mindful moments",
//             "deep work soundtrack",
//             "calm focus"
//         ]
//     },
//     // Low Energy, High Valence (Content, Serene)
//     {
//         cond: e => e.energy <= 0.33 && e.valence > 0.66,
//         terms: [
//             "acoustic morning",
//             "indie folk warmth",
//             "chill acoustic love",
//             "gentle happiness",
//             "soft morning light",
//             "peaceful acoustic",
//             "tender moments",
//             "serene soundscapes"
//         ]
//     },
//     // Medium Energy, Low Valence (Moody, Complex)
//     {
//         cond: e => e.energy <= 0.66 && e.valence <= 0.33,
//         terms: [
//             "indie sadcore",
//             "dark pop vibes",
//             "moody alternative",
//             "emotional rock",
//             "atmospheric indie",
//             "brooding electronica",
//             "deep indie",
//             "melancholy pop"
//         ]
//     },
//     // Medium Energy, Medium Valence (Balanced, Versatile)
//     {
//         cond: e => e.energy <= 0.66 && e.valence <= 0.66,
//         terms: [
//             "indie discovery",
//             "eclectic mix",
//             "vibey tunes",
//             "indie gems",
//             "chillwave beats",
//             "indie anthems",
//             "alternative vibes",
//             "indie mix"
//         ]
//     },
//     // Medium Energy, High Valence (Upbeat, Positive)
//     {
//         cond: e => e.energy <= 0.66 && e.valence > 0.66,
//         terms: [
//             "indie pop sunshine",
//             "feel good indie",
//             "indie dance party",
//             "indie summer",
//             "indie roadtrip",
//             "indie happiness",
//             "indie good vibes",
//             "indie feel good"
//         ]
//     },
//     // High Energy, Low Valence (Intense, Powerful)
//     {
//         cond: e => e.energy > 0.66 && e.valence <= 0.33,
//         terms: [
//             "intense rock ballads",
//             "powerful alternative",
//             "emotional rock",
//             "dark energy",
//             "power ballads",
//             "intense anthems",
//             "rock catharsis",
//             "powerful vocals"
//         ]
//     },
//     // High Energy, Medium Valence (Energetic, Dynamic)
//     {
//         cond: e => e.energy > 0.66 && e.valence <= 0.66,
//         terms: [
//             "indie rock energy",
//             "alternative anthems",
//             "indie workout",
//             "rock revival",
//             "indie party",
//             "festival vibes",
//             "indie rock mix",
//             "alternative energy"
//         ]
//     },
//     // High Energy, High Valence (Euphoric, Joyful)
//     {
//         cond: e => e.energy > 0.66 && e.valence > 0.66,
//         terms: [
//             "indie dance party",
//             "feel good pop",
//             "indie summer hits",
//             "indie disco",
//             "indie dancefloor",
//             "indie celebration",
//             "indie euphoria",
//             "indie joyride"
//         ]
//     }
// ];

const moodGrid = [
    // Low Energy, Low Valence (Deep, Reflective)
    {
        cond: e => e.energy <= 0.33 && e.valence <= 0.33,
        terms: [
            "melancholic soundscapes",
            "emotional piano ballads",
            "sad folk",
            "ambient melancholy",
            "heartfelt acoustic",
            "rainy day introspection",
            "lo-fi sad beats",
            "soulful ballads"
        ]
    },
    // Low Energy, Medium Valence (Calm, Focused)
    {
        cond: e => e.energy <= 0.33 && e.valence <= 0.66,
        terms: [
            "chill focus beats",
            "ambient study music",
            "peaceful piano",
            "zen meditation",
            "concentration flow",
            "mindful moments",
            "deep work soundtrack",
            "calm focus"
        ]
    },
    // Low Energy, High Valence (Content, Serene)
    {
        cond: e => e.energy <= 0.33 && e.valence > 0.66,
        terms: [
            "acoustic morning",
            "folk warmth",
            "chill acoustic love",
            "gentle happiness",
            "soft morning light",
            "peaceful acoustic",
            "tender moments",
            "serene soundscapes"
        ]
    },
    // Medium Energy, Low Valence (Moody, Complex)
    {
        cond: e => e.energy <= 0.66 && e.valence <= 0.33,
        terms: [
            "sadcore",
            "dark pop vibes",
            "moody alternative",
            "emotional rock",
            "atmospheric synths",
            "brooding electronica",
            "deep blues",
            "melancholy pop"
        ]
    },
    // Medium Energy, Medium Valence (Balanced, Versatile)
    {
        cond: e => e.energy <= 0.66 && e.valence <= 0.66,
        terms: [
            "eclectic mix",
            "vibey tunes",
            "groove lounge",
            "chillwave beats",
            "anthemic pop",
            "alternative vibes",
            "versatile playlist",
            "groovy rhythms"
        ]
    },
    // Medium Energy, High Valence (Upbeat, Positive)
    {
        cond: e => e.energy <= 0.66 && e.valence > 0.66,
        terms: [
            "pop sunshine",
            "feel good tunes",
            "dance party",
            "summer hits",
            "roadtrip anthems",
            "happy vibes",
            "good mood music",
            "celebration mix"
        ]
    },
    // High Energy, Low Valence (Intense, Powerful)
    {
        cond: e => e.energy > 0.66 && e.valence <= 0.33,
        terms: [
            "intense rock ballads",
            "powerful alternative",
            "heavy metal drive",
            "dark energy",
            "power ballads",
            "intense anthems",
            "rock catharsis",
            "powerful vocals"
        ]
    },
    // High Energy, Medium Valence (Energetic, Dynamic)
    {
        cond: e => e.energy > 0.66 && e.valence <= 0.66,
        terms: [
            "rock energy",
            "alternative anthems",
            "workout mix",
            "festival vibes",
            "party starters",
            "dynamic beats",
            "electro drive",
            "dancefloor energy"
        ]
    },
    // High Energy, High Valence (Euphoric, Joyful)
    {
        cond: e => e.energy > 0.66 && e.valence > 0.66,
        terms: [
            "euphoric dance",
            "feel good pop",
            "summer festival",
            "disco fever",
            "dancefloor joy",
            "celebration hits",
            "party euphoria",
            "joyride tunes"
        ]
    }
];

// Enhanced mood term selection with context awareness
function getMoodTerms(vector) {
    const mood = moodGrid.find(m => m.cond(vector));
    // const timeBasedTerms = getTimeBasedTerms();
    const seasonalTerms = getSeasonalTerms();

    // Combine mood terms with contextual terms
    const allTerms = [
        ...mood.terms,
        // ...timeBasedTerms,
        ...seasonalTerms
    ];

    // Shuffle and get unique terms
    const shuffled = [...new Set(allTerms)].sort(() => 0.5 - Math.random());
    const query = shuffled.slice(0, 3);
    const suggestions = shuffled.slice(3);

    return {
        query: query.join(', '),
        suggestions
    };
}

// Add context awareness based on time of day
function getTimeBasedTerms() {
    const hour = new Date().getHours();
    if (hour < 12) return ["morning energy", "wake up", "sunrise"];
    if (hour < 18) return ["daytime", "afternoon", "workout"];
    return ["evening vibes", "night drive", "late night"];
}

// Add seasonal context
function getSeasonalTerms() {
    const month = new Date().getMonth();
    if (month >= 11 || month < 2) return ["winter", "cozy", "holiday"];
    if (month < 5) return ["spring", "renewal", "fresh"];
    if (month < 8) return ["summer", "sunny", "beach"];
    return ["autumn", "fall", "cozy"];
}