import React, { useState, useEffect } from 'react';
import { Cloud, Umbrella, Thermometer, Coffee, Tv, MapPin, Search, Music } from 'lucide-react';
import AnimatedWeatherIcon from "react-animated-weather";   // ⭐ ADDED (animated icons)
import Header from './components/Header';
import ThemeSelector from './components/ThemeSelector';
import Mascot from './components/Mascot';

// --- API UTILITIES ---

// Open-Meteo doesn't require an API key! Great for portfolio projects.
const getWeather = async (city) => {
  try {
    // 1. Geocoding: Get Lat/Lon from City Name
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found");
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Weather: Get current weather using Lat/Lon
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
    );
    const weatherData = await weatherRes.json();

    return {
      city: name,
      country: country,
      temp: weatherData.current_weather.temperature,
      wind: weatherData.current_weather.windspeed,
      code: weatherData.current_weather.weathercode,
      isDay: weatherData.current_weather.is_day,
      max: weatherData.daily.temperature_2m_max[0],
      min: weatherData.daily.temperature_2m_min[0],
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

// --- LOGIC ENGINE (The "Smart" Part) ---

const getAdvice = (temp, code, wind) => {
  const isRaining = code >= 51 && code <= 67;
  const isSnowing = code >= 71 && code <= 77;

  const vibes = {
    cold: [
      "Hibernation mode activated. Do not leave the blanket fort.",
      "Today feels like the world set its thermostat to 'Nope'.",
      "Your heater is your best friend. Maybe your only friend.",
      "Perfect day to write poetry about how cold your soul feels.",
    ],
    chilly: [
      "Perfect weather for reading a book by the window dramatically.",
      "Crisp but cozy. Main character vibes.",
      "You may or may not develop a scarf addiction today.",
      "Ideal weather for long walks and existential thoughts.",
    ],
    mild: [
      "Actually pleasant. Go touch some grass.",
      "Weather so decent it almost feels suspicious.",
      "Solid 8/10 day for living your best life.",
      "Great day for running errands you’ve been avoiding for months.",
    ],
    hot: [
      "It's hot. Find AC or a pool immediately.",
      "Everything feels sticky. Including your soul.",
      "The sun is doing the absolute most today.",
      "Perfect day to regret wearing anything even slightly thick.",
    ],
    rain: [
      "Wet socks tragedy waiting to happen. Stay home and cuddle.",
      "The sky is crying, and honestly same.",
      "Today’s vibe: moist disappointment.",
      "Good day to pretend you’re in a dramatic music video.",
    ]
  };

const outfits = {
  cold: [
    "Insulated coat and scarf",
    "Thermal layers with a heavy jacket",
    "Wool gloves, hat, and thick boots",
  ],
  chilly: [
    "Hoodie or light coat",
    "Sweater with long pants",
    "Layered shirt, hoodie, and jacket",
  ],
  mild: [
    "Light jacket or cardigan",
    "Long-sleeve shirt with jeans",
    "Denim jacket with a simple tee",
  ],
  hot: [
    "Shorts and a loose shirt",
    "Tank top with breathable fabrics",
    "Light cotton or linen outfit",
  ],
  rain: [
    "Raincoat with umbrella",
    "Waterproof jacket and boots",
    "Hooded coat with quick-dry clothing",
  ]
};

const foods = {
  cold: [
    "Hot chocolate that warms you up like a gentle hug and gives you quick cozy energy.",
    "A hearty stew that keeps your tummy full and happy when the air feels extra cold.",
    "Curry with warm little spices that help your body feel toasty from the inside.",
    "Roast dishes that give steady comfort and help you stay warm longer.",
    "Soft, buttery pastries that feel like a tiny warm treat on a chilly day."
  ],
  chilly: [
    "Tomato soup that gently warms you and feels comforting in the cool air.",
    "A simple rice bowl that gives calm, steady energy without feeling heavy.",
    "Warm tea with bread that feels like a soft little comfort snack.",
    "Pasta that gives easy warmth and keeps you feeling balanced."
  ],
  mild: [
    "A cozy sandwich with a nice balance of flavors that fits the gentle weather.",
    "Light pasta that feels just right for mild days, not too warm and not too heavy.",
    "Warm-but-light noodle dishes that are friendly on your stomach.",
    "A tidy little lunch bowl with grains and greens that matches the calm weather.",
    "A smoothie that’s refreshing in a soft, pleasant way."
  ],
  hot: [
    "Fresh salads that cool you down and keep you hydrated when it’s toasty outside.",
    "Cold noodles that feel refreshing and help your body stay comfy in the heat.",
    "A sweet fruit bowl that gives hydrating, sunny energy.",
    "Iced drinks that cool you off and help you relax in hot weather.",
    "Light seafood dishes that are easy to eat and won’t make you feel overheated."
  ],
  rain: [
    "Warm noodle soup that feels cozy and soothing on drizzly days.",
    "Soft bread that’s gentle and comforting when the weather feels gloomy.",
    "A cup of tea that brings warm, calm feelings during rainy moments.",
    "A simple broth that warms you without feeling too heavy."
  ]
};

  const warnings = {
    cold: ["Watch out for ice!", "Stay warm and don’t overdo outdoor time."],
    rain: ["Slippery roads!", "Umbrella discipline required."],
    wind: ["High winds! Goodbye hat.", "Wind may attempt to yeet you."],
    heat: ["Stay hydrated!", "Limit sun exposure!"],
  };

  let group = "mild";
  if (temp < 5) group = "cold";
  else if (temp < 15) group = "chilly";
  else if (temp < 25) group = "mild";
  else group = "hot";

  if (isRaining) group = "rain";

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  let outfit = pick(outfits[group]);
  if (isRaining) outfit += " (Don't be a hero.)";

  let vibe = pick(vibes[group]);
  let food = pick(foods[group]);

  let warning = null;
  if (isRaining) warning = pick(warnings.rain);
  if (wind > 20) warning = pick(warnings.wind);
  if (temp < 5 && isSnowing) warning = pick(warnings.cold);
  if (temp > 28) warning = pick(warnings.heat);

  return { outfit, vibe, food, warning };
};


// --- WEATHER-AWARE NEWS BANK — replaces chaotic Gen-Z set ---

const NEWS_BANK = {
  clear: [
    "Sunshine levels in ${city} officially classified as immaculate.",
    "Experts report: blue skies causing unexpected happiness in ${city}.",
    "Local flowers in ${city} are thriving and asking for compliments."
  ],
  rain: [
    "Rainfall in ${city} reaches 'dramatic anime scene' levels.",
    "Umbrellas in ${city} have achieved maximum emotional damage resistance.",
    "Puddles in ${city} now legally qualify as micro-lakes."
  ],
  cold: [
    "Temperature in ${city} has entered 'please stay inside' territory.",
    "Residents seen waddling like penguins across ${city}.",
    "City declares emergency sweater weather supremacy."
  ],
  hot: [
    "Heatwave in ${city} has personally offended several citizens.",
    "Locals report spontaneous sweating and mild regret.",
    "Officials warn: asphalt may now be a lava-type Pokémon."
  ],
  wind: [
    "Wind speeds in ${city} approaching anime cape-flutter levels.",
    "Local hats missing; wind is the primary suspect.",
    "City residents struggle to look cool while being blown sideways."
  ]
};


// --- getNews FIXED (weather-aware) ---

const getNews = (city, temp, code, wind) => {
  let type = "clear";

  if (code >= 51 && code <= 67) type = "rain";
  else if (temp < 6) type = "cold";
  else if (temp > 28) type = "hot";
  else if (wind > 20) type = "wind";

  const bank = NEWS_BANK[type];
  const raw = bank[Math.floor(Math.random() * bank.length)];

  return raw.replace("${city}", city).replace("${temp}", temp);
};


// --- UI COMPONENTS ---

const Card = ({ title, icon: Icon, children, color }) => (
  <div className={`p-4 rounded-3xl border-4 border-gray-900/10 shadow-lg ${color} transition-transform hover:-translate-y-1`}>
    <div className="flex items-center gap-2 mb-2 text-gray-800 font-bold uppercase tracking-wider text-xs">
      <Icon size={16} />
      {title}
    </div>
    <div className="text-gray-900 font-medium leading-relaxed">
      {children}
    </div>
  </div>
);

export default function App() {
  const [city, setCity] = useState("Tokyo");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [advice, setAdvice] = useState({});
  const [headline, setHeadline] = useState("");

  const [headlineIndex, setHeadlineIndex] = useState(0); // ⭐ ADDED (TV ticker)

  // ⭐ ADDED: theme presets and persistence (default = Sakura as requested)
  const themes = {
    sakura: {
      wrapperBg: "bg-[#FFF5F5]",
      headerBg: "bg-[#FFD6E0]",
      mainCardBg: "bg-[#FFE4EC]",
      cardAccent: "text-[#4B3F42]",
      iconAccent: "#F56C9E",
      tickerBg: "bg-gray-800",
      mascotGlow: "shadow-pink-300/50"
    },
    bubblegum: {
      wrapperBg: "bg-[#FFF0FA]",
      headerBg: "bg-[#FFB6E6]",
      mainCardBg: "bg-[#FFD6F2]",
      cardAccent: "text-[#6C3B6F]",
      iconAccent: "#FF4EB8",
      tickerBg: "bg-purple-800",
      mascotGlow: "shadow-pink-400/40"
    },
    midnight: {
      wrapperBg: "bg-[#0D0F26]",
      headerBg: "bg-[#23254A]",
      mainCardBg: "bg-[#1A1A3A]",
      cardAccent: "text-[#E8EAF6]",
      iconAccent: "#FFE066",
      tickerBg: "bg-black",
      mascotGlow: "shadow-yellow-300/20"
    },
    cotton: {
      wrapperBg: "bg-[#F2F7FF]",
      headerBg: "bg-[#FCE4FF]",
      mainCardBg: "bg-[#E7F0FF]",
      cardAccent: "text-[#3A3D54]",
      iconAccent: "#88B5FF",
      tickerBg: "bg-blue-800",
      mascotGlow: "shadow-blue-200/30"
    }
  };
  const [theme, setTheme] = useState(() => {
    // Start with Sakura unless user has saved preference
    return localStorage.getItem("kawaii_theme") || "sakura";
  });

  useEffect(() => {
    localStorage.setItem("kawaii_theme", theme);
  }, [theme]);

  const fetchWeather = async () => {
    setLoading(true);
    setError(false);
    const data = await getWeather(city);
    if (data) {
      setWeather(data);
    } else {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  useEffect(() => {
    if (weather) {
      setAdvice(getAdvice(weather.temp, weather.code, weather.wind));
      setHeadline(getNews(weather.city, weather.temp, weather.code, weather.wind));
    }
  }, [weather]);

  // ⭐ NEW — TV Ticker Logic (one headline ➜ scroll ➜ next)
  useEffect(() => {
    if (!weather) return;
    const interval = setInterval(() => {
      setHeadline(getNews(weather.city, weather.temp, weather.code, weather.wind));
      setHeadlineIndex(prev => prev + 1);
    }, 12000); // duration = CSS animation

    return () => clearInterval(interval);
  }, [weather]);

  // ⭐ Weather code → Animated icon mapping
  const mapIcon = (code) => {
    if (code === 0) return "CLEAR_DAY";
    if (code >= 1 && code <= 3) return "PARTLY_CLOUDY_DAY";
    if (code >= 51 && code <= 67) return "RAIN";
    if (code >= 71 && code <= 77) return "SNOW";
    if (code >= 95) return "THUNDERSTORM";
    return "CLOUDY";
  };

  // ⭐ Icon color influenced by theme (you asked icons change with theme)
  const iconColorForTheme = themes[theme] ? themes[theme].iconAccent : "#00AEEF";

  return (
    // wrapper background is controlled by theme; original classes preserved
    <div className={`${themes[theme].wrapperBg} min-h-screen font-sans p-4 md:p-8 flex items-center justify-center transition-colors`}>

      {/* ⭐ THEME SELECTOR */}
      <div className="fixed top-4 left-4 z-50">
        <ThemeSelector theme={theme} setTheme={setTheme} />
      </div>

      {/* ⭐ KAWAII FLOATING MASCOT — use uploaded file path (will be transformed to URL by environment) */}
      <Mascot src={"/mascot.png"} alt="Kawaii Mascot" glowClass={themes[theme].mascotGlow} />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* --- HEADER SECTION (Search) --- */}
        <div className={`${themes[theme].headerBg} md:col-span-12 p-6 rounded-3xl border-4 border-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4`}>
          <div className="flex items-center gap-3">
             <div className="bg-white p-3 rounded-full border-2 border-pink-300 dark:border-pink-500">
               <Cloud className="text-pink-500" size={32} />
             </div>
             <div>
               <h1 className={`text-3xl font-black ${themes[theme].cardAccent} tracking-tight`}>KAWAII WEATHER</h1>
               <p className="text-pink-600 font-medium text-sm">Your Cute Daily Forecast</p>
             </div>
          </div>

          <div className="flex w-full md:w-auto gap-2">
            <input 
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
              placeholder="Enter city..."
              className="w-full md:w-64 px-6 py-3 rounded-full border-2 border-pink-300 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-pink-500 font-bold text-gray-600 placeholder-pink-300"
            />
            <button 
              onClick={fetchWeather}
              className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 transition-colors shadow-md active:translate-y-1"
            >
              <Search size={24} />
            </button>
          </div>
        </div>

        {/* --- ERROR STATE --- */}
        {error && (
          <div className="md:col-span-12 bg-red-100 text-red-500 p-4 rounded-2xl text-center font-bold border-2 border-red-200 dark:bg-red-800 dark:text-red-200">
            Oops! Couldn't find that city. Try "London" or "Tokyo"!
          </div>
        )}

        {/* --- LOADING STATE --- */}
        {loading && !error && (
           <div className="md:col-span-12 py-20 text-center text-pink-400 font-bold text-xl animate-pulse">
             Fetching cute clouds... ☁️
           </div>
        )}

        {/* --- MAIN CONTENT --- */}
        {!loading && weather && (
          <>
            {/* 1. MAIN WEATHER CARD */}
            <div className={`${themes[theme].mainCardBg} md:col-span-5 rounded-3xl p-8 border-4 border-white shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden`}>
               <div className="absolute top-4 right-4 bg-white/50 px-3 py-1 rounded-full text-xs font-bold text-cyan-700">
                  LIVE
               </div>

               {/* ⭐ Animated Icon */}
               <AnimatedWeatherIcon
                 icon={mapIcon(weather.code)}
                 color={iconColorForTheme}
                 size={80}
                 animate={true}
               />

               <MapPin className={`text-cyan-600 mb-2 ${themes[theme].cardAccent}`} />
               <h2 className={`text-4xl font-black mb-1 ${themes[theme].cardAccent}`}>{weather.city}</h2>
               <p className={`font-medium mb-6 ${themes[theme].cardAccent}`}>{weather.country}</p>

               <div className={`text-8xl font-black mb-2 tracking-tighter ${themes[theme].cardAccent}`}>
                 {Math.round(weather.temp)}°
               </div>

               <div className={`flex gap-4 font-bold px-6 py-2 rounded-xl ${themes[theme].cardAccent}`} >
                  <span className="bg-white/40 px-3 py-1 rounded-xl">H: {Math.round(weather.max)}°</span>
                  <span className="bg-white/40 px-3 py-1 rounded-xl">L: {Math.round(weather.min)}°</span>
               </div>
            </div>

            {/* 2. THE ADVISOR GRID */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Vibe Check (Sarcasm) */}
              <Card title="Vibe Check" icon={Music} color={`${"bg-[#FFF4C3]"} ${themes[theme].mainCardBg}`}>
                {advice.vibe}
              </Card>


              {/* OOTD (Clothing) */}
              <Card title="Fit Check" icon={Umbrella} color={`${"bg-[#E2F0CB]"} ${themes[theme].mainCardBg}`}>
                {advice.outfit}
              </Card>

              {/* Menu (Food) */}
              <Card title="Menu Rec" icon={Coffee} color={`${"bg-[#FFE2E2]"} ${themes[theme].mainCardBg}`}>
                Recommended nutrient intake: <br/>
                <span className="text-lg text-pink-600">{advice.food}</span>
              </Card>

              {/* Warnings / Stats */}
              <Card title="Alerts" icon={Thermometer} color={`${"bg-[#E0E7FF]"} ${themes[theme].mainCardBg}`}>
                {advice.warning ? (
                  <span className="text-red-500 font-bold animate-pulse">⚠️ {advice.warning}</span>
                ) : (
                  <span className="text-indigo-400">No warnings. The sky is behaving.</span>
                )}
                <div className="mt-2 text-xs text-indigo-400">Wind: {weather.wind} km/h</div>
              </Card>
            </div>

            {/* 3. NEWS TICKER */}
            <div className={`${themes[theme].tickerBg} md:col-span-12 rounded-2xl p-4 border-4 border-gray-600 shadow-xl text-green-400 font-mono overflow-hidden flex items-center gap-4`}>
               <Tv size={20} className="shrink-0" />

               {/* ⭐ New TV-style ticker */}
               <div className="headline-item whitespace-nowrap">
                 <span className="font-bold mr-4">BREAKING NEWS:</span> 
                 <span className="tracking-wide fade-in">{headline}</span>
               </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
