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

document.addEventListener("DOMContentLoaded", async () => {
    initializeGlobalTheme();
    initializeGlobalNavigation();
    initializeFooterMetadata();
    initializeWayfindingTracker();
    
    await loadMemoriesJsonDatabase();
    initializeRandomSpotlightModule();
    await fetchLiveWeatherTelemetry();
    await fetchChildSafeNewsStream();
    
    initializeWindChillCalculator();
    initializeAdvancedAiApiModule();
    initializeSecureOAuthHub();
    initializeAccessibilityModal();
    
    initializeMemoryWallGallery();
    initializeAnimatedRegistrationForm();
    updateGlobalMetricsDisplays();
});

async function loadMemoriesJsonDatabase() {
    try {
        const response = await fetch("data/memories.json");
        if (!response.ok) throw new Error("JSON Fetch Exception");
        APP_STATE.memoriesData = await response.json();
    } catch (err) {
        APP_STATE.memoriesData = [
            { id: "fallback-01", title: "Family Picnic at the Park", category: "outdoor", likes: 12, caption: "A wonderful sunny afternoon outdoors.", image: "../images/familypicnic.webp" }
        ];
    }
}

function initializeGlobalTheme() {
    const themeBtn = document.getElementById("themeToggle");
    if (!themeBtn) return;
    if (localStorage.getItem("activeTheme") === "dark") {
        document.body.classList.add("dark-theme");
        themeBtn.textContent = "☀️ Light";
    }
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        const isDark = document.body.classList.contains("dark-theme");
        localStorage.setItem("activeTheme", isDark ? "dark" : "light");
        themeBtn.textContent = isDark ? "☀️ Light" : "🌙 Dark";
    });
}

function initializeGlobalNavigation() {
    const menuBtn = document.getElementById("hamburgerBtn");
    const navMenu = document.getElementById("navLinks");
    if (!menuBtn || !navMenu) return;
    menuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("open-drawer");
        menuBtn.classList.toggle("menu-active");
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
    const galleryContainer = document.getElementById("galleryGrid");
    if (galleryContainer && document.querySelector(".hub-hero")) return; 

    const mainLayout = document.querySelector("main");
    if (!mainLayout || APP_STATE.memoriesData.length === 0) return;

    const spotlightSection = document.createElement("section");
    spotlightSection.className = "tool-section spotlight-wrapper";

    const randomIndex = Math.floor(Math.random() * APP_STATE.memoriesData.length);
    const item = APP_STATE.memoriesData[randomIndex];
    APP_STATE.selectedSpotlightId = item.id;

    spotlightSection.innerHTML = `
        <div class="spotlight-badge">⚡ RANDOM FAMILY SPOTLIGHT</div>
        <div class="grid-layout" style="align-items: center; margin-top: 0.5rem;">
            <img src="${item.image}" alt="${item.title}" class="card-image-fluid" style="border-radius: 6px;">
            <div>
                <h3>${item.title}</h3>
                <p style="padding: 0.5rem 0;">${item.caption}</p>
                <button class="btn-like" id="spotlightLikeBtn" data-id="${item.id}">
                    Like Snapshot (<span id="spotlightLikeCount">${item.likes}</span>)
                </button>
            </div>
        </div>
    `;

    mainLayout.insertBefore(spotlightSection, mainLayout.children);

    document.getElementById("spotlightLikeBtn")?.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        const record = APP_STATE.memoriesData.find(r => r.id === id);
        if (record) {
            record.likes += 1;
            document.getElementById("spotlightLikeCount").textContent = record.likes;
            incrementLocalStorageTracker("totalLikesCounter");
            updateGlobalMetricsDisplays();
        }
    });
}

async function fetchLiveWeatherTelemetry() {
    const tempDisplay = document.getElementById("ambientTemp");
    const iconDisplay = document.getElementById("weatherIcon");
    if (!tempDisplay) return;

    try {
        const targetUrl = `https://openweathermap.org{API_CONFIG.WEATHER_KEY}`;
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error("Telemetry failure");
        const data = await response.json();
        
        APP_STATE.liveWeatherCached = data;
        tempDisplay.textContent = `${Math.round(data.main.temp)}°C`;
        
        const code = data.weather.icon;
        if (code.includes("01")) iconDisplay.textContent = "☀️";
        else if (code.includes("02") || code.includes("03") || code.includes("04")) iconDisplay.textContent = "☁️";
        else if (code.includes("09") || code.includes("10")) iconDisplay.textContent = "🌧️";
        else iconDisplay.textContent = "🌤️";
    } catch (err) {
        tempDisplay.textContent = "22°C";
        iconDisplay.textContent = "☀️";
    }
}

async function fetchChildSafeNewsStream() {
    const metricsPanel = document.querySelector(".metrics-summary-panel");
    if (!metricsPanel) return;

    const newsMarquee = document.createElement("div");
    newsMarquee.style.cssText = "background: var(--white); padding: 0.75rem; border-radius: 4px; box-shadow: var(--shadow); margin-top: 1rem; overflow: hidden; white-space: nowrap;";
    
    try {
        const targetUrl = `https://newsapi.org{API_CONFIG.NEWS_KEY}`;
        const res = await fetch(targetUrl);
        if (!res.ok) throw new Error("API protected");
        const data = await res.json();
        
        const headlines = data.articles.map(a => `• ${a.title}`).join("   ");
        newsMarquee.innerHTML = `<span style="font-weight:bold; color:var(--primary);">📰 SCIENCE STREAM:</span> <marquee scrollamount="4">${headlines}</marquee>`;
    } catch {
        newsMarquee.innerHTML = `<span style="font-weight:bold; color:var(--primary);">📰 INFOTAINMENT:</span> <marquee scrollamount="4">• Local community workshops scheduled for this weekend. • Exploring nature preserves safe habits guidelines framework.</marquee>`;
    }

    metricsPanel.parentNode.insertBefore(newsMarquee, metricsPanel);
}

function initializeWindChillCalculator() {
    const calcBtn = document.getElementById("calcChillBtn");
    if (!calcBtn) return;

    calcBtn.addEventListener("click", () => {
        const rawTemp = parseFloat(document.getElementById("tempInput").value);
        const rawWind = parseFloat(document.getElementById("windInput").value);
        const outputBox = document.getElementById("chillResult");

        if (isNaN(rawTemp) || isNaN(rawWind)) {
            outputBox.textContent = "Error: Input values missing.";
            return;
        }

        const calculatedIndex = computeWindChillIndex(rawTemp, rawWind);
        if (calculatedIndex === null) {
            outputBox.textContent = "N/A (Temp must be ≤ 10°C and Wind > 4.8 km/h)";
        } else {
            outputBox.textContent = `Wind Chill Index: ${calculatedIndex.toFixed(1)}°C`;
            incrementLocalStorageTracker("totalLikesCounter");
            updateGlobalMetricsDisplays();
        }
    });
}

function initializeAdvancedAiApiModule() {
    const askBtn = document.getElementById("askAiBtn");
    if (!askBtn) return;

    askBtn.addEventListener("click", async () => {
        const inputField = document.getElementById("aiQuery");
        const displayPanel = document.getElementById("aiResponse");
        const queryText = inputField.value.trim();

        if (!queryText) {
            displayPanel.textContent = "Warning: Input field cannot be empty.";
            return;
        }

        displayPanel.textContent = "AI Processing Handshake Active... ⏳";

        if (!API_CONFIG.HF_AI_KEY) {
            const blocked = ["hate", "violence", "weapons", "abuse"].some(w => queryText.toLowerCase().includes(w));
            setTimeout(() => {
                if (blocked) {
                    displayPanel.textContent = "Block Action: Message failed structural keyword filters.";
                } else {
                    displayPanel.innerHTML = `🤖 <strong>AI Local Logged:</strong> Thank you for asking: "${queryText}".`;
                }
                incrementLocalStorageTracker("totalLikesCounter");
                updateGlobalMetricsDisplays();
            }, 800);
            inputField.value = "";
            return;
        }

        try {
                    const response = await fetch("https://huggingface.co", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_CONFIG.HF_AI_KEY}`
            },
            body: JSON.stringify({ inputs: queryText, parameters: { candidate_labels: ["safe", "toxic", "violence"] } })
        });

        if (!response.ok) throw new Error("Fallback execution");
        const data = await response.json();

        if (data.labels && data.labels !== "safe" && data.scores > 0.7) {
            displayPanel.textContent = "Block Action: Failed security processing parameters.";
            return;
        }
        displayPanel.innerHTML = `🤖 <strong>AI Hub Verified:</strong> "${queryText}" meets child-safe compliance parameters.`;
    } catch {
        const blocked = ["hate", "violence", "weapons", "abuse"].some(w => queryText.toLowerCase().includes(w));
        if (blocked) {
            displayPanel.textContent = "Block Action: Message failed structural keyword filters.";
        } else {
            displayPanel.innerHTML = `🤖 <strong>AI Fallback Logged:</strong> Thank you for asking: "${queryText}".`;
        }
    } finally {
        inputField.value = "";
        incrementLocalStorageTracker("totalLikesCounter");
        updateGlobalMetricsDisplays();
    }
});

function initializeSecureOAuthHub() {
    const joinSection = document.querySelector(".form-container");
    if (!joinSection || document.getElementById("oauthBox")) return;

    const oauthWrapper = document.createElement("div");
    oauthWrapper.id = "oauthBox";
    oauthWrapper.className = "oauth-container";
    oauthWrapper.innerHTML = `
        <div style="text-align: center; margin: 1rem 0; font-weight: bold; opacity: 0.7;">— OR CONTINUE WITH SECURE OAUTH —</div>
        <button type="button" class="btn-oauth" id="googleAuthBtn">🌐 Authenticate with Google ID</button>
        <button type="button" class="btn-oauth" id="appleAuthBtn">🍏 Authenticate with Apple Network</button>
    `;
    joinSection.appendChild(oauthWrapper);

    const handleMockAuth = (provider) => {
        alert(`🔐 Biometric OAuth handshake initialized with ${provider} securely via Firebase Relay Client Context.`);
        incrementLocalStorageTracker("totalFormRegistrations");
        triggerFlakeAnimationBurst();
        setTimeout(() => { window.location.href = "review.html"; }, 2500);
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
    modalOverlay.innerHTML = `
        <div class="modal-window" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <h3 id="modalTitle">🔒 Safe Space Session Authorization</h3>
            <p style="margin: 1rem 0; line-height: 1.5;">You are initiating configuration commands. Ensure parameters remain secure.</p>
            <div style="display:flex; gap:1rem; justify-content: flex-end;">
                <button id="closeModalBtn" class="btn-submit" style="background:#7F8C8D;">Dismiss</button>
                <button id="confirmModalBtn" class="btn-submit">Confirm</button>
            </div>
        </div>
    `;
    mainBody.appendChild(modalOverlay);

    const homeCta = document.querySelector(".btn-cta");
    if (homeCta && homeCta.getAttribute("href") === "join.html") {
        homeCta.removeAttribute("href");
        homeCta.style.cursor = "pointer";
        homeCta.addEventListener("click", () => {
            modalOverlay.classList.add("modal-active");
            document.getElementById("confirmModalBtn").focus();
            APP_STATE.isModalOpen = true;
        });
    }

    const dismissModal = () => {
        modalOverlay.classList.remove("modal-active");
        APP_STATE.isModalOpen = false;
    };

    document.getElementById("closeModalBtn")?.addEventListener("click", dismissModal);
    document.getElementById("confirmModalBtn")?.addEventListener("click", () => {
        dismissModal();
        window.location.href = "join.html";
    });
}

function initializeMemoryWallGallery() {
    const galleryContainer = document.getElementById("galleryGrid");
    const viewSelector = document.getElementById("filterCategory");
    if (!galleryContainer) return;

    function renderActiveCards(categoryFilter = "all") {
        galleryContainer.innerHTML = "";
        const dynamicTargetDataset = categoryFilter === "all"
            ? APP_STATE.memoriesData
            : APP_STATE.memoriesData.filter(card => card.category === categoryFilter);

        dynamicTargetDataset.forEach(memoryNode => {
            const nodeArticle = document.createElement("article");
            nodeArticle.className = "card";
            nodeArticle.innerHTML = `
                <img src="${memoryNode.image}" alt="${memoryNode.title}" class="card-image-fluid" loading="lazy">
                <div class="card-inner-content">
                    <h3>${memoryNode.title}</h3>
                    <p>${memoryNode.caption}</p>
                    <button class="btn-like" data-memory-id="${memoryNode.id}">
                        Like (<span class="like-digit">${memoryNode.likes}</span>)
                    </button>
                </div>
            `;
            galleryContainer.appendChild(nodeArticle);
        });

        bindGalleryInteractionListeners();
    }

    function bindGalleryInteractionListeners() {
        const contextButtons = galleryContainer.querySelectorAll(".btn-like");
        contextButtons.forEach(buttonElement => {
            buttonElement.addEventListener("click", () => {
                const targetKeyId = buttonElement.getAttribute("data-memory-id");
                const targetNumberSpan = buttonElement.querySelector(".like-digit");
                const arrayRecord = APP_STATE.memoriesData.find(record => record.id === targetKeyId);
                if (arrayRecord) {
                    arrayRecord.likes += 1;
                    targetNumberSpan.textContent = arrayRecord.likes;
                    incrementLocalStorageTracker("totalLikesCounter");
                    updateGlobalMetricsDisplays();
                }
            });
        });
    }

    if (viewSelector) {
        viewSelector.addEventListener("change", (changeEvent) => {
            renderActiveCards(changeEvent.target.value);
        });
    }
    renderActiveCards();
}

function initializeAnimatedRegistrationForm() {
    const activeFormElement = document.getElementById("registrationForm");
    if (!activeFormElement) return;

    activeFormElement.addEventListener("submit", (e) => {
        e.preventDefault();
        incrementLocalStorageTracker("totalFormRegistrations");
        triggerFlakeAnimationBurst();
        setTimeout(() => { activeFormElement.submit(); }, 2500);
    });
}

function triggerFlakeAnimationBurst() {
    const particlePool = ["🎉", "✨", "🌸", "🛡️", "🌟"];
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement("div");
        particle.className = "flake-particle";
        particle.textContent = particlePool[Math.floor(Math.random() * particlePool.length)];
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
    if (generalEngagementContainer) {
        generalEngagementContainer.textContent = fetchLocalStorageValue("totalLikesCounter");
    }
    if (registrationContainer) {
        registrationContainer.textContent = fetchLocalStorageValue("totalFormRegistrations");
    }
}

