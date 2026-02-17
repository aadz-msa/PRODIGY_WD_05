/* ============================================
   Weather App – Premium JavaScript
   Production-Ready with Enhanced Animations
   ============================================ */

// ──────────────────────────────────────────────
// 🔑  OpenWeatherMap API Configuration
// ──────────────────────────────────────────────
const API_KEY = "ee25c0615fedd27225478bc5b35dc2e8";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// ── DOM References ───────────────────────────
const cityInput   = document.getElementById("cityInput");
const searchBtn   = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const loader      = document.getElementById("loader");
const errorBox    = document.getElementById("error");
const errorText   = document.getElementById("errorText");
const weatherBox  = document.getElementById("weather");
const weatherIcon = document.getElementById("weatherIcon");
const tempEl      = document.getElementById("temp");
const descEl      = document.getElementById("desc");
const cityNameEl  = document.getElementById("cityName");
const humidityEl  = document.getElementById("humidity");
const windEl      = document.getElementById("wind");
const iconGlow    = document.getElementById("iconGlow");
const ambientBg   = document.getElementById("ambientBg");
const sunnyBlobs  = document.getElementById("sunnyBlobs");
const rainContainer = document.getElementById("rainContainer");
const snowContainer = document.getElementById("snowContainer");

// ── Premium Gradient Themes ──────────────────
// Enhanced gradients with multiple color stops for depth
const gradients = {
  clear: {
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #f6d365 100%)",
    orbs: ["rgba(255, 200, 100, 0.4)", "rgba(255, 150, 100, 0.3)", "rgba(255, 170, 100, 0.25)"],
    iconGlow: "rgba(255, 200, 100, 0.6)"
  },
  clouds: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #5a67d8 100%)",
    orbs: ["rgba(150, 150, 200, 0.35)", "rgba(100, 120, 180, 0.3)", "rgba(120, 140, 200, 0.25)"],
    iconGlow: "rgba(150, 150, 200, 0.5)"
  },
  rain: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    orbs: ["rgba(100, 150, 200, 0.3)", "rgba(50, 100, 150, 0.25)", "rgba(70, 120, 180, 0.2)"],
    iconGlow: "rgba(100, 150, 200, 0.5)"
  },
  drizzle: {
    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)",
    orbs: ["rgba(100, 200, 255, 0.4)", "rgba(0, 230, 250, 0.3)", "rgba(50, 200, 200, 0.25)"],
    iconGlow: "rgba(100, 200, 255, 0.6)"
  },
  thunderstorm: {
    background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #2d2d44 100%)",
    orbs: ["rgba(100, 100, 150, 0.25)", "rgba(80, 80, 120, 0.2)", "rgba(60, 60, 100, 0.15)"],
    iconGlow: "rgba(150, 150, 200, 0.4)"
  },
  snow: {
    background: "linear-gradient(135deg, #e6e9f0 0%, #eef1f5 50%, #c4d7e8 100%)",
    orbs: ["rgba(200, 220, 255, 0.5)", "rgba(180, 200, 240, 0.4)", "rgba(160, 190, 230, 0.35)"],
    iconGlow: "rgba(200, 220, 255, 0.7)"
  },
  mist: {
    background: "linear-gradient(135deg, #606c88 0%, #3f4c6b 50%, #485563 100%)",
    orbs: ["rgba(150, 160, 180, 0.35)", "rgba(130, 140, 160, 0.3)", "rgba(140, 150, 170, 0.25)"],
    iconGlow: "rgba(150, 160, 180, 0.5)"
  },
  haze: {
    background: "linear-gradient(135deg, #8e9eab 0%, #606c88 50%, #3f4c6b 100%)",
    orbs: ["rgba(160, 170, 190, 0.35)", "rgba(140, 150, 170, 0.3)", "rgba(150, 160, 180, 0.25)"],
    iconGlow: "rgba(160, 170, 190, 0.5)"
  },
  fog: {
    background: "linear-gradient(135deg, #a8c0c7 0%, #8e9eab 50%, #637074 100%)",
    orbs: ["rgba(170, 190, 200, 0.4)", "rgba(150, 170, 180, 0.35)", "rgba(160, 180, 190, 0.3)"],
    iconGlow: "rgba(170, 190, 200, 0.5)"
  },
  default: {
    background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)",
    orbs: ["rgba(30, 40, 80, 0.4)", "rgba(20, 30, 60, 0.3)", "rgba(25, 35, 70, 0.25)"],
    iconGlow: "rgba(50, 60, 100, 0.5)"
  }
};

// ── Event Listeners ──────────────────────────

// Search button click with ripple effect
searchBtn.addEventListener("click", (e) => {
  createRipple(e, searchBtn);
  handleCitySearch();
});

// Enter key in input
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleCitySearch();
  }
});

// Geolocation button click with ripple effect
locationBtn.addEventListener("click", (e) => {
  createRipple(e, locationBtn);
  getWeatherByLocation();
});

// Input focus animations
cityInput.addEventListener("focus", () => {
  cityInput.parentElement.classList.add("focused");
});

cityInput.addEventListener("blur", () => {
  cityInput.parentElement.classList.remove("focused");
});

// ── Core Functions ───────────────────────────

/**
 * Validates the input and triggers a city-based weather fetch.
 */
function handleCitySearch() {
  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name.");
    shakeElement(cityInput.parentElement);
    return;
  }

  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
  fetchWeather(url);
}

/**
 * Uses the Geolocation API to get the user's coordinates,
 * then fetches weather for that location.
 */
function getWeatherByLocation() {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser.");
    return;
  }

  // Show loader immediately while browser prompts for permission
  showLoader();

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const url = `${BASE_URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
      fetchWeather(url);
    },
    (err) => {
      // Handle different geolocation errors
      switch (err.code) {
        case err.PERMISSION_DENIED:
          showError("Location access was denied. Please allow it in your browser settings.");
          break;
        case err.POSITION_UNAVAILABLE:
          showError("Location information is unavailable.");
          break;
        case err.TIMEOUT:
          showError("Location request timed out. Try again.");
          break;
        default:
          showError("An unknown error occurred while fetching location.");
      }
    }
  );
}

/**
 * Fetches weather data from OpenWeatherMap and updates the UI.
 * @param {string} url – Full API URL
 */
async function fetchWeather(url) {
  showLoader();

  try {
    const response = await fetch(url);

    // API returns 200 even for some errors; check the status code
    if (!response.ok) {
      if (response.status === 404) {
        showError("City not found. Please check the spelling and try again.");
      } else if (response.status === 401) {
        showError("Invalid API key. Please update your key in script.js.");
      } else {
        showError(`Something went wrong (HTTP ${response.status}). Please try again.`);
      }
      return;
    }

    const data = await response.json();
    displayWeather(data);
  } catch {
    showError("Network error. Please check your connection and try again.");
  }
}

/**
 * Renders weather data into the UI with staggered animations.
 * @param {Object} data – OpenWeatherMap response JSON
 */
function displayWeather(data) {
  // Extract values
  const city        = data.name;
  const country     = data.sys.country;
  const temp        = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const icon        = data.weather[0].icon;
  const humidity    = data.main.humidity;
  const wind        = data.wind.speed;
  const condition   = data.weather[0].main.toLowerCase();

  // Populate DOM with staggered reveal
  cityNameEl.textContent  = `${city}, ${country}`;
  tempEl.textContent      = temp;
  descEl.textContent      = description;
  humidityEl.textContent  = `${humidity}%`;
  windEl.textContent      = `${wind} m/s`;
  
  // Set weather icon with load animation
  weatherIcon.style.opacity = "0";
  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
  weatherIcon.alt = description;
  
  weatherIcon.onload = () => {
    weatherIcon.style.transition = "opacity 0.5s ease";
    weatherIcon.style.opacity = "1";
  };

  // Apply premium gradient based on weather condition
  applyTheme(condition, temp);

  // Toggle visibility with animation
  hideLoader();
  hideError();
  
  // Add reveal animation
  weatherBox.classList.remove("active");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      weatherBox.classList.add("active");
      animateCounter(tempEl, 0, temp, 1000);
    });
  });
}

// ── UI Helpers ───────────────────────────────

/**
 * Shows the loading spinner and hides other sections.
 */
function showLoader() {
  weatherBox.classList.remove("active");
  errorBox.classList.remove("active");
  loader.classList.add("active");
}

/**
 * Hides the loading spinner.
 */
function hideLoader() {
  loader.classList.remove("active");
}

/**
 * Displays an error message with animation.
 * @param {string} message – Error message to display
 */
function showError(message) {
  hideLoader();
  weatherBox.classList.remove("active");
  errorText.textContent = message;
  errorBox.classList.remove("active");
  
  // Force reflow to replay animation
  void errorBox.offsetWidth;
  errorBox.classList.add("active");
}

/**
 * Hides the error box.
 */
function hideError() {
  errorBox.classList.remove("active");
}

/**
 * Applies a complete theme (background, orbs, icon glow) based on weather.
 * @param {string} condition – Weather condition string
 * @param {number} [temp] – Temperature in Celsius
 */
function applyTheme(condition, temp) {
  const theme = 
    gradients[condition] ||
    gradients[Object.keys(gradients).find((k) => condition.includes(k))] ||
    gradients.default;

  // Apply background gradient with smooth transition
  document.body.style.background = theme.background;

  // Apply ambient orb colors
  const orbs = ambientBg.querySelectorAll(".ambient-orb");
  orbs.forEach((orb, index) => {
    if (theme.orbs[index]) {
      orb.style.background = theme.orbs[index];
    }
  });

  // Apply icon glow
  if (iconGlow) {
    iconGlow.style.background = theme.iconGlow;
  }

  // Toggle sunny blob animation
  if (condition === "clear") {
    sunnyBlobs.classList.add("active");
  } else {
    sunnyBlobs.classList.remove("active");
  }

  // Toggle rain animation
  if (condition === "rain" || condition === "drizzle" || condition === "thunderstorm") {
    createRaindrops();
    rainContainer.classList.add("active");
  } else {
    rainContainer.classList.remove("active");
    setTimeout(() => {
      if (!rainContainer.classList.contains("active")) {
        rainContainer.innerHTML = "";
      }
    }, 1000);
  }

  // Toggle snow animation (also for cold / negative temperatures)
  const isCold = typeof temp === "number" && temp <= 0;
  if (condition === "snow" || isCold) {
    createSnowflakes();
    snowContainer.classList.add("active");
  } else {
    snowContainer.classList.remove("active");
    setTimeout(() => {
      if (!snowContainer.classList.contains("active")) {
        snowContainer.innerHTML = "";
      }
    }, 1000);
  }
}

/**
 * Creates a ripple effect on button click.
 * @param {Event} e – Click event
 * @param {HTMLElement} button – Button element
 */
function createRipple(e, button) {
  const ripple = document.createElement("span");
  ripple.style.cssText = `
    position: absolute;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s ease-out forwards;
    pointer-events: none;
  `;

  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  // Add ripple keyframes if not exists
  if (!document.getElementById("ripple-style")) {
    const style = document.createElement("style");
    style.id = "ripple-style";
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(1);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  button.style.position = "relative";
  button.style.overflow = "hidden";
  button.appendChild(ripple);

  ripple.addEventListener("animationend", () => ripple.remove());
}

/**
 * Shakes an element to indicate an error.
 * @param {HTMLElement} element – Element to shake
 */
function shakeElement(element) {
  element.style.animation = "none";
  void element.offsetWidth; // Trigger reflow
  element.style.animation = "shake 0.5s ease";
  
  // Add shake keyframes if not exists
  if (!document.getElementById("shake-style")) {
    const style = document.createElement("style");
    style.id = "shake-style";
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10% { transform: translateX(-8px); }
        20% { transform: translateX(8px); }
        30% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        50% { transform: translateX(-4px); }
        60% { transform: translateX(4px); }
        70% { transform: translateX(-2px); }
        80% { transform: translateX(2px); }
        90% { transform: translateX(-1px); }
      }
    `;
    document.head.appendChild(style);
  }

  element.addEventListener("animationend", () => {
    element.style.animation = "";
  }, { once: true });
}

/**
 * Animates a number counting up from start to end.
 * @param {HTMLElement} element – Element to animate
 * @param {number} start – Starting value
 * @param {number} end – Ending value
 * @param {number} duration – Animation duration in ms
 */
function animateCounter(element, start, end, duration) {
  const startTime = performance.now();
  const diff = end - start;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out cubic)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + diff * easeOut);
    
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ── Initialize ───────────────────────────────

/**
 * Creates raindrop elements for the rain animation.
 */
function createRaindrops() {
  // Avoid re-creating if already populated
  if (rainContainer.children.length > 0) return;

  const count = 80;
  for (let i = 0; i < count; i++) {
    const drop = document.createElement("div");
    drop.classList.add("raindrop");
    drop.style.left = Math.random() * 100 + "%";
    drop.style.height = Math.random() * 18 + 12 + "px";
    drop.style.animationDuration = Math.random() * 0.5 + 0.4 + "s";
    drop.style.animationDelay = Math.random() * 2 + "s";
    drop.style.opacity = Math.random() * 0.4 + 0.3;
    rainContainer.appendChild(drop);

    // Some drops get splashes
    if (Math.random() > 0.6) {
      const splash = document.createElement("div");
      splash.classList.add("raindrop-splash");
      splash.style.left = drop.style.left;
      splash.style.animationDelay = (parseFloat(drop.style.animationDelay) + parseFloat(drop.style.animationDuration)) + "s";
      splash.style.animationDuration = "0.6s";
      rainContainer.appendChild(splash);
    }
  }
}

/**
 * Creates snowflake elements for the snow animation.
 */
function createSnowflakes() {
  // Avoid re-creating if already populated
  if (snowContainer.children.length > 0) return;

  const count = 60;
  for (let i = 0; i < count; i++) {
    const flake = document.createElement("div");
    flake.classList.add("snowflake");

    // Vary sizes
    const sizeRoll = Math.random();
    if (sizeRoll < 0.3) flake.classList.add("snowflake--small");
    else if (sizeRoll > 0.85) flake.classList.add("snowflake--large");

    flake.style.left = Math.random() * 100 + "%";
    flake.style.animationDuration = Math.random() * 5 + 5 + "s";
    flake.style.animationDelay = Math.random() * 5 + "s";
    flake.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
    flake.style.opacity = Math.random() * 0.5 + 0.4;
    snowContainer.appendChild(flake);
  }
}

// Set initial theme
applyTheme("default");

// Add subtle parallax effect to ambient orbs on mouse move
document.addEventListener("mousemove", (e) => {
  const { clientX, clientY } = e;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  const moveX = (clientX - centerX) / 50;
  const moveY = (clientY - centerY) / 50;

  const orbs = ambientBg.querySelectorAll(".ambient-orb");
  orbs.forEach((orb, index) => {
    const factor = (index + 1) * 0.5;
    orb.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
  });
});
