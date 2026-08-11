import { 
    API_CONFIG,
    getFormattedDateString, 
    computeWindChillIndex, 
    incrementLocalStorageTracker, 
    fetchLocalStorageValue 
} from './utils.js';

const APP_STATE = {
    memoriesData: [],
    selectedSpotlightId: null,
    liveWeatherCached: null,
    isModalOpen: false
};

function initializeMemoryWallGallery() {
    const viewSelector = document.getElementById('filterCategory');
    const currentUrlPath = window.location.pathname.toLowerCase();

    if (viewSelector) {
        viewSelector.addEventListener('change', (e) => {
            renderActiveCards(e.target.value);
        });
    }

    if (currentUrlPath.includes("index.html") || currentUrlPath.endsWith("/")) {
        renderActiveCards();
        return;
    }

    renderActiveCards();
}
document.addEventListener("DOMContentLoaded", async () => {
    initializeGlobalTheme();
    initializeGlobalNavigation();
    initializeFooterMetadata();
    initializeWayfindingTracker();
    
    await loadMemoriesJsonDatabase();
    
    if (document.querySelector(".hero") && !document.querySelector(".hub-hero")) {
        initializeRandomSpotlightModule();
    }
    
    if (document.getElementById("ambientTemp")) {
        await fetchLiveWeatherTelemetry();
    }
    
    if (document.querySelector(".metrics-summary-panel")) {
        await fetchChildSafeNewsStream();
    }
    
    if (document.getElementById("calcChillBtn")) {
        initializeWindChillCalculator();
    }
    
    if (document.getElementById("aiSubmitBtn")) {
        initializeAdvancedAiApiModule();
    }
    
    if (document.querySelector(".form-container")) {
        initializeSecureOAuthHub();
    }
    
    if (document.getElementById("openAuthModalTriggerBtn")) {
        initializeAccessibilityModal();
    }
    
    if (document.getElementById('galleryGrid') || document.getElementById('gallery') || document.querySelector('.gallery-grid')) {
        initializeMemoryWallGallery();
    }
    
    if (document.getElementById("registrationForm")) {
        initializeAnimatedRegistrationForm();
    }
    
    updateGlobalMetricsDisplays();
});

async function loadMemoriesJsonDatabase() {
    try {
        const response = await fetch("data/memories.json");
        if (!response.ok) throw new Error("JSON Fetch Exception");
        APP_STATE.memoriesData = await response.json();
    } catch (err) {
        APP_STATE.memoriesData = [
            { id: "fallback-01", title: "Family Picnic at the Park", category: "outdoor", likes: 12, caption: "A wonderful sunny afternoon outdoors.", image: "images/familypicnic.webp" }
        ];
    }
}

function initializeGlobalTheme() {
    const themeBtn = document.getElementById("themeToggle");
    if (!themeBtn) return;
    
    if (localStorage.getItem("activeTheme") === "dark") {
        document.body.classList.add("dark-theme");
        document.documentElement.setAttribute('data-theme', 'dark');
        themeBtn.textContent = "☀️ Light";
    } else {
        document.body.classList.remove("dark-theme");
        document.documentElement.setAttribute('data-theme', 'light');
        themeBtn.textContent = "🌙 Dark";
    }
    
    themeBtn.addEventListener("click", () => {
        const isDarkNow = document.body.classList.toggle("dark-theme");
        if (isDarkNow) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem("activeTheme", "dark");
            themeBtn.textContent = "☀️ Light";
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem("activeTheme", "light");
            themeBtn.textContent = "🌙 Dark";
        }
    });
}

function initializeGlobalNavigation() {
    const menuBtn = document.getElementById("hamburgerBtn");
    const navMenu = document.getElementById("navLinks");
    if (!menuBtn || !navMenu) return;
    
    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        navMenu.classList.toggle("open-drawer");
        menuBtn.classList.toggle("menu-active");
    });

    document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            navMenu.classList.remove("open-drawer");
            menuBtn.classList.remove("menu-active");
        }
    });
}

function initializeFooterMetadata() {
    const timestampBox = document.getElementById("lastModifiedDate");
    if (timestampBox) {
        timestampBox.textContent = getFormattedDateString();
    }
}

function initializeWayfindingTracker() {
    const mainHeading = document.querySelector("main h1");
    const navLinks = document.querySelectorAll(".nav-links a");
    let activePageTitle = "Dashboard";
    
    navLinks.forEach(link => {
        if (link.classList.contains("active")) {
            activePageTitle = link.textContent.replace(/[^a-zA-Z ]/g, "").trim();
        }
    });

    if (mainHeading) {
        const pathNavContainer = document.createElement("div");
        pathNavContainer.className = "wayfinding-breadcrumbs";
        pathNavContainer.innerHTML = `
            <a href="index.html">KinSpace Root</a> <span>&gt;</span> 
            <span>${activePageTitle}</span>
        `;
        mainHeading.parentNode.insertBefore(pathNavContainer, mainHeading);
    }
}

function initializeRandomSpotlightModule() {
    const isHomePage = document.querySelector(".hero") && !document.querySelector(".hub-hero");
    if (!isHomePage || APP_STATE.memoriesData.length === 0) return;

    const mainLayout = document.querySelector("main");
    if (!mainLayout) return;

    const spotlightSection = document.createElement("section");
    spotlightSection.className = "tool-section spotlight-wrapper";

    const randomIndex = Math.floor(Math.random() * APP_STATE.memoriesData.length);
    const item = APP_STATE.memoriesData[randomIndex];
    APP_STATE.selectedSpotlightId = item.id;

    spotlightSection.innerHTML = `
        <div class="spotlight-badge">⚡ RANDOM FAMILY SPOTLIGHT</div>
        <div class="grid-layout" style="align-items: center; margin-top: 0.5rem;">
            <img src="${item.image}" alt="${item.title}" class="card-image-fluid" style="border-radius: 6px; max-width: 100%; height: auto;">
            <div>
                <h3>${item.title}</h3>
                <p style="padding: 0.5rem 0;">${item.caption}</p>
                <button class="btn-like" id="spotlightLikeBtn" data-id="${item.id}">
                    Like Snapshot (<span id="spotlightLikeCount">${item.likes}</span>)
                </button>
            </div>
        </div>
    `;

    if (mainLayout.firstElementChild) {
        mainLayout.insertBefore(spotlightSection, mainLayout.firstElementChild);
    } else {
        mainLayout.appendChild(spotlightSection);
    }

    document.getElementById("spotlightLikeBtn")?.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        const record = APP_STATE.memoriesData.find(r => r.id === id);
        if (record) {
            record.likes += 1;
            const countSpan = document.getElementById("spotlightLikeCount");
            if (countSpan) countSpan.textContent = record.likes;
            
            if (typeof incrementLocalStorageTracker === 'function') {
                incrementLocalStorageTracker("totalLikesCounter");
            }
            updateGlobalMetricsDisplays();
        }
    });
}
async function fetchLiveWeatherTelemetry() {
    const tempDisplay = document.getElementById("ambientTemp");
    const iconDisplay = document.getElementById("weatherIcon");
    const forecastBox = document.getElementById("threeDayForecastBox");
    
    if (!tempDisplay) return;

    try {
        const targetUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=-14.454726155497054&lon=28.472300942498496&units=metric&appid=cc520e6f7c509875bf7a6906c2185f46';
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error("Telemetry failure");
        const data = await response.json();
        
        APP_STATE.liveWeatherCached = data;
        
        if (!data.list || data.list.length === 0) {
            throw new Error("Invalid schema structure layout payload.");
        }

        const currentPeriod = data.list[0];
        tempDisplay.textContent = `${Math.round(currentPeriod.main.temp)}°C`;
        
        if (currentPeriod.weather && currentPeriod.weather[0]) {
            const currentIcon = currentPeriod.weather[0].icon;
            if (iconDisplay) {
                iconDisplay.src = `https://openweathermap.org/img/wn/${currentIcon}@2x.png`;
                iconDisplay.alt = currentPeriod.weather[0].description || "Live weather condition";
                iconDisplay.style.display = "inline-block";
            }
        }

        if (forecastBox) {
            forecastBox.innerHTML = "";
            const noonForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));
            const targetedThreeDays = noonForecasts.slice(0, 3);

            targetedThreeDays.forEach(day => {
                const dateObj = new Date(day.dt * 1000);
                const dayName = dateObj.toLocaleDateString('en-ZA', { weekday: 'short' });
                const dayTemp = Math.round(day.main.temp);
                const dayIconCode = day.weather[0].icon;
                const dayDesc = day.weather[0].description;

                const dayCard = document.createElement("div");
                dayCard.className = "forecast-day-card";
                dayCard.innerHTML = `
                    <div class="forecast-date">${dayName}</div>
                    <img src="https://openweathermap.org/img/wn/${dayIconCode}.png" alt="${dayDesc}" class="forecast-icon">
                    <div class="forecast-temp">${dayTemp}°C</div>
                `;
                forecastBox.appendChild(dayCard);
            });
        }
    } catch (err) {
        tempDisplay.textContent = "22°C";
        if (iconDisplay) {
            iconDisplay.src = "https://openweathermap.org/img/wn/${dayIcon}.png";
            iconDisplay.style.display = "inline-block";
        }
        if (forecastBox) {
            forecastBox.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem;">Forecast metrics unvailable.</div>';
        }
        console.warn("Weather telemetry module operating in safe local fallback layer mode:", err.message);
    }
}

async function fetchChildSafeNewsStream() {
    const metricsPanel = document.querySelector(".metrics-summary-panel");
    if (!metricsPanel) return;

    const newsMarquee = document.createElement("div");
    newsMarquee.style.cssText = "background: #ffffff; padding: 0.75rem; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-top: 1rem; overflow: hidden; white-space: nowrap;";
    
    try {
        const targetUrl = `https://newsapi.org`;
        const res = await fetch(targetUrl);
        if (!res.ok) throw new Error("API protected");
        const data = await res.json();
        
        if (data.articles && data.articles.length > 0) {
            const headlines = data.articles.map(a => `• ${a.title}`).join("   ");
            newsMarquee.innerHTML = `<span style="font-weight:bold; color:#2c3e50;">📰 SCIENCE STREAM:</span> <marquee scrollamount="4" behavior="scroll" direction="left">${headlines}</marquee>`;
        } else {
            throw new Error("No data array items present.");
        }
    } catch {
        newsMarquee.innerHTML = `<span style="font-weight:bold; color:#2c3e50;">📰 INFOTAINMENT:</span> <marquee scrollamount="4" behavior="scroll" direction="left">• Local community workshops scheduled for this weekend. • Exploring nature preserves safe habits guidelines framework.</marquee>`;
    }

    metricsPanel.parentNode.insertBefore(newsMarquee, metricsPanel);
}

function initializeWindChillCalculator() {
    const calcBtn = document.getElementById("calcChillBtn");
    if (!calcBtn) return;

    calcBtn.addEventListener("click", () => {
        const tempField = document.getElementById("tempInput");
        const windField = document.getElementById("windInput");
        const outputBox = document.getElementById("chillResult");

        if (!tempField || !windField || !outputBox) return;
        const rawTemp = parseFloat(tempField.value);
        const rawWind = parseFloat(windField.value);
        if (isNaN(rawTemp) || isNaN(rawWind)) {
            outputBox.textContent = "Error: Input values missing.";
            return;
        }
        let calculatedIndex = null;
        if (typeof computeWindChillIndex === 'function') {
            calculatedIndex = computeWindChillIndex(rawTemp, rawWind);
        } else {
            if (rawTemp <= 10 && rawWind > 4.8) {
                calculatedIndex = 13.12 + (0.6215 * rawTemp) - (11.37 * Math.pow(rawWind, 0.16)) + (0.3965 * rawTemp * Math.pow(rawWind, 0.16));
            }
        }
        if (calculatedIndex === null) {
            outputBox.textContent = "N/A (Temp must be ≤ 10°C and Wind > 4.8 km/h)";
        } else {
            outputBox.textContent = `Wind Chill Index: ${calculatedIndex.toFixed(1)}°C`;
            if (typeof incrementLocalStorageTracker === 'function') {
                incrementLocalStorageTracker("totalLikesCounter");
            }
            updateGlobalMetricsDisplays();
        }
    });
}

function initializeSecureOAuthHub() {
    const joinSection = document.querySelector(".form-container");
    if (!joinSection || document.getElementById("oauthBox")) return;
    const oauthWrapper = document.createElement("div");
    oauthWrapper.id = "oauthBox";
    oauthWrapper.className = "oauth-container";
    oauthWrapper.innerHTML = `
        <div style="text-align: center; margin: 1rem 0; font-weight: bold; opacity: 0.7;">— OR CONTINUE WITH SECURE OAUTH —</div>
        <button type="button" class="btn-oauth" id="googleAuthBtn" style="margin-bottom:0.5rem; width:100%;">🌐 Authenticate with Google ID</button>
        <button type="button" class="btn-oauth" id="appleAuthBtn" style="width:100%;">🍏 Authenticate with Apple Network</button>
    `;
    joinSection.appendChild(oauthWrapper);
    const handleMockAuth = (provider) => {
        alert(`🔒 Biometric OAuth handshake initialized with ${provider} securely via Firebase Relay Client Context.`);
        if (typeof incrementLocalStorageTracker === 'function') {
            incrementLocalStorageTracker("totalFormRegistrations");
        }
        triggerFlakeAnimationBurst();
        setTimeout(() => { window.location.href = "review.html"; }, 1500);
    };
    document.getElementById("googleAuthBtn")?.addEventListener("click", () => handleMockAuth("Google Cloud Service Hub"));
    document.getElementById("appleAuthBtn")?.addEventListener("click", () => handleMockAuth("Secure Apple Keychain"));
}

function initializeAccessibilityModal() {
    const mainBody = document.querySelector("body");
    if (!mainBody || document.getElementById("uploadModalOverlay")) return;
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "uploadModalOverlay";
    modalOverlay.className = "modal-overlay";
    modalOverlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:none; align-items:center; justify-content:center; z-index:9999;";
    modalOverlay.innerHTML = `
        <div class="modal-window" role="dialog" aria-modal="true" aria-labelledby="modalTitle" style="background:#fff; padding:2rem; border-radius:8px; max-width:400px; width:90%;">
            <h3 id="modalTitle">🔑 Safe Space Session Authorization</h3>
            <p style="margin: 1rem 0; line-height: 1.5;">You are initiating configuration commands. Ensure parameters remain secure.</p>
            <div style="display:flex; gap:1rem; justify-content: flex-end;">
                <button id="closeModalBtn" style="padding:0.5rem 1rem; cursor:pointer; background:#7F8C8D; color:#fff; border:none; border-radius:4px;">Dismiss</button>
                <button id="confirmModalBtn" style="padding:0.5rem 1rem; cursor:pointer; background:#2ecc71; color:#fff; border:none; border-radius:4px;">Confirm</button>
            </div>
        </div>
    `;
    mainBody.appendChild(modalOverlay);
    const homeCta = document.querySelector(".btn-cta");
    if (homeCta) {
        homeCta.style.cursor = "pointer";
        homeCta.addEventListener("click", () => {
            modalOverlay.style.display = "flex";
            document.getElementById("confirmModalBtn")?.focus();
            APP_STATE.isModalOpen = true;
        });
    }
    const dismissModal = () => {
        modalOverlay.style.display = "none";
        APP_STATE.isModalOpen = false;
    };
    document.getElementById("closeModalBtn")?.addEventListener("click", dismissModal);
    document.getElementById("confirmModalBtn")?.addEventListener("click", () => {
        dismissModal();
        window.location.href = "join.html";
    });
}

function renderActiveCards(filter = 'all') {
    const container = document.getElementById('galleryGrid') || document.getElementById('gallery') || document.querySelector('.gallery-grid');
    if (!container) return;
    let dataset = Array.isArray(APP_STATE.memoriesData) ? APP_STATE.memoriesData.slice() : [];
    if (filter && filter !== 'all') {
        dataset = dataset.filter(item => item.category === filter);
    }
    const path = (window.location && window.location.pathname) ? window.location.pathname : '';
    const isIndex = path.endsWith('/index.html') || path.endsWith('/') || path.toLowerCase().includes('index.html');
    if (isIndex) {
        dataset = shuffleArray(dataset).slice(0, 6);
    }
    container.innerHTML = '';
    dataset.forEach(item => {
        const article = document.createElement('article');
        article.className = 'memory-card';
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.decoding = 'async';
        img.alt = item.title || 'Family memory';
        img.width = 480;
        img.src = item.image || 'images/baking.webp';
        img.addEventListener('error', () => { img.src = 'images/familygames.webp'; });
        const title = document.createElement('h3');
        title.textContent = item.title || '';
        const caption = document.createElement('p');
        caption.textContent = item.caption || '';
        const likes = document.createElement('p');
        likes.className = 'likes';
        likes.textContent = `❤️ ${item.likes || 0}`;
        article.appendChild(img);
        article.appendChild(title);
        article.appendChild(caption);
        article.appendChild(likes);
        container.appendChild(article);
    });
}

function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function initializeAnimatedRegistrationForm() {
    const activeFormElement = document.getElementById("registrationForm");
    if (!activeFormElement) return;
    activeFormElement.addEventListener("submit", (e) => {
        e.preventDefault();
        if (typeof incrementLocalStorageTracker === 'function') {
            incrementLocalStorageTracker("totalFormRegistrations");
        }
        triggerFlakeAnimationBurst();
        setTimeout(() => {
            activeFormElement.submit();
        }, 2500);
    });
}

function triggerFlakeAnimationBurst() {
    const particlePool = ["🎉", "✨", "🌸", "🛡️", "🌟"];
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement("div");
        particle.className = "flake-particle";
        particle.textContent = particlePool[Math.floor(Math.random() * particlePool.length)];
        particle.style.position = "fixed";
        particle.style.top = "-5vh";
        particle.style.zIndex = "99999";
        particle.style.pointerEvents = "none";
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDuration = `${1.5 + Math.random() * 2}s`;
        particle.style.animationDelay = `${Math.random() * 0.4}s`;
        document.body.appendChild(particle);
        setTimeout(() => { particle.remove(); }, 3500);
    }
}

function updateGlobalMetricsDisplays() {
    const generalEngagementContainer = document.getElementById("totalEngagementDisplay");
    const registrationContainer = document.getElementById("totalRegistrationsDisplay");
    const likesCount = (typeof fetchLocalStorageValue === 'function') ? fetchLocalStorageValue("totalLikesCounter") : (localStorage.getItem("totalLikesCounter") || "0");
    const regsCount = (typeof fetchLocalStorageValue === 'function') ? fetchLocalStorageValue("totalFormRegistrations") : (localStorage.getItem("totalFormRegistrations") || "0");
    if (generalEngagementContainer) {
        generalEngagementContainer.textContent = likesCount;
    }
    if (registrationContainer) {
        registrationContainer.textContent = regsCount;
    }
}
function askAi(userQuestion) {
    const maxViolationsAllowed = 5;

    const safetyMatrix = [
        {
            word: "hack",
            response: "Security disruption keywords detected. Network access parameters remain strict for household infrastructure data safety."
        },
        {
            word: "malware",
            response: "Ecosystem integrity check triggered. System scanning tools manage threat vectors automatically."
        },
        {
            word: "spam",
            response: "Communication safety filter engaged. Redundant data streams are purged to protect inbox cleanliness."
        },
        {
            word: "vulgarword",
            response: "Respectful communication protocol violation. Content filters log phrases that degrade family-friendly environments."
        }
    ];

    let totalViolations = parseInt(localStorage.getItem("kinspaceAI_Violations") || "0", 10);
    if (totalViolations >= maxViolationsAllowed) {
        const inputField = document.getElementById("aiQueryField");
        const submitBtn = document.getElementById("aiSubmitBtn");
        if (inputField) inputField.disabled = true;
        if (submitBtn) submitBtn.disabled = true;
        return "Terminal access profile locked out due to reaching the maximum 5 safety policy violations.";
    }

    const normalizedInput = userQuestion.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();

    let matchingViolation = safetyMatrix.find(item => normalizedInput.includes(item.word));

    if (matchingViolation) {
        totalViolations += 1;
        localStorage.setItem("kinspaceAI_Violations", totalViolations.toString());
        
        if (totalViolations >= maxViolationsAllowed) {
            const inputField = document.getElementById("aiQueryField");
            const submitBtn = document.getElementById("aiSubmitBtn");
            if (inputField) inputField.disabled = true;
            if (submitBtn) submitBtn.disabled = true;
            return `${matchingViolation.response} Persistent violation limit met (5/5). Interface locked out.`;
        }
        return `${matchingViolation.response} Access denied. Warning ${totalViolations}/${maxViolationsAllowed}.`;
    }

    const knowledgeBase = [
        {
            question: "why is the sky blue",
            response: "The sky looks blue because gas molecules in Earth's atmosphere scatter sunlight in all directions. Short-wavelength blue light gets scattered much more than other colors because it travels in smaller, shorter waves, a phenomenon known as Rayleigh scattering."
        },
        {
            question: "what is the core purpose of kinspace",
            response: "KinSpace acts as a secure container infrastructure for households to centralize collective scheduling variables, shared list synchronization matrices, and structural family communication lines."
        },
        {
            question: "how does the wind chill calculator compute data",
            response: "It parses current thermal metrics alongside wind speed vectors using standard meteorological models, outputting a precise adjusted index if parameters fall beneath baseline thresholds."
        }
    ];

    const matchingEntry = knowledgeBase.find(entry => {
        const normalizedTarget = entry.question.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
        return normalizedTarget === normalizedInput || normalizedInput.includes(normalizedTarget);
    });

    if (matchingEntry) {
        return matchingEntry.response;
    }

    return "No matching response vectors found in local storage arrays. Try submitting alternate keywords.";
}
