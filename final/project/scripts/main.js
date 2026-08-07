import { 
    memoriesArray, 
    getFormattedDateString, 
    computeWindChillIndex, 
    incrementLocalStorageTracker, 
    fetchLocalStorageValue, 
    incrementAiInquiryTracker 
} from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
    initializeGlobalTheme();
    initializeGlobalNavigation();
    initializeFooterMetadata();
    initializeWindChillCalculator();
    initializeAiAssistantModule();
    initializeMemoryWallGallery();
    initializeFormSubmissionCounter();
    updateGlobalMetricsDisplays();
});

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
            outputBox.textContent = `Wind Chill Index: ${typeof calculatedIndex === 'number' ? calculatedIndex.toFixed(1) : calculatedIndex}°C`;
            incrementLocalStorageTracker("totalEngagementCounter");
            updateGlobalMetricsDisplays();
        }
    });
}

function initializeAiAssistantModule() {
    const askBtn = document.getElementById("askAiBtn");
    if (!askBtn) return;

    const blockedWordsList = ["hate", "violence", "weapons", "abuse"];

    const knowledgeBase = {
        "why is the sky blue": "The sky is blue because gases in Earth's atmosphere scatter sunlight in all directions. Blue light is scattered more than other colours because it travels as shorter, smaller waves (Rayleigh scattering).",
        "why is sky blue": "The sky is blue because gases in Earth's atmosphere scatter sunlight in all directions. Blue light is scattered more than other colours because it travels as shorter, smaller waves (Rayleigh scattering).",
        "what is the solar system": "The Solar System consists of our star, the Sun, and everything bound to it by gravity—the planets Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune; dwarf planets; and millions of asteroids and comets.",
        "how do plants grow": "Plants grow by absorbing sunlight, water, and carbon dioxide to create their own food in a process called photosynthesis. They also absorb vital nutrients from the soil through their roots.",
        "why does it rain": "Rain happens when liquid water evaporates from the Earth into water vapour, rises into the sky, cools down, and condenses into clouds. When the water droplets inside clouds get too heavy, gravity pulls them back down as rain.",
        "what is gravity": "Gravity is an invisible force that pulls objects toward each other. It is what keeps your feet on the ground and what keeps the Earth and other planets orbiting around the Sun."
    };

    askBtn.addEventListener("click", () => {
        const inputField = document.getElementById("aiQuery");
        const displayPanel = document.getElementById("aiResponse");
        const queryText = inputField.value.trim();

        if (!queryText) {
            displayPanel.textContent = "Warning: Input field cannot be empty.";
            return;
        }

        const lowercaseQuery = queryText.toLowerCase();

        const flaggedMatch = blockedWordsList.some(keyword => lowercaseQuery.includes(keyword));
        if (flaggedMatch) {
            displayPanel.textContent = "Block Action: Message failed security analysis filters.";
            return;
        }

        const cleanQuery = lowercaseQuery.replace(/[?.,!]/g, "").trim();

        let responseMessage = "";
        if (knowledgeBase[cleanQuery]) {
            responseMessage = `<strong>AI Response:</strong> ${knowledgeBase[cleanQuery]}`;
        } else {
            responseMessage = `Response Logged:<br>Thank you for inquiring: "${queryText}". I don't have that specific factual lesson programmed yet, but exploring educational questions helps safe growth!`;
        }

        displayPanel.innerHTML = responseMessage;
        inputField.value = "";
        incrementAiInquiryTracker();
        incrementLocalStorageTracker("totalEngagementCounter");
        updateGlobalMetricsDisplays();
    });
}

function initializeMemoryWallGallery() {
    const galleryContainer = document.getElementById("dynamicMemoryGrid");
    const viewSelector = document.getElementById("filterCategoryMenu");
    if (!galleryContainer) return;

    function renderActiveCards(categoryFilter = "all") {
        galleryContainer.innerHTML = "";

        const dynamicTargetDataset = categoryFilter === "all"
            ? memoriesArray
            : memoriesArray.filter(card => card.category === categoryFilter);

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
    }

    galleryContainer.addEventListener("click", (event) => {
        const buttonElement = event.target.closest(".btn-like");
        if (!buttonElement) return;

        const targetKeyId = buttonElement.getAttribute("data-memory-id");
        const targetNumberSpan = buttonElement.querySelector(".like-digit");

        const arrayRecord = memoriesArray.find(record => record.id === targetKeyId);
        if (arrayRecord) {
            arrayRecord.likes += 1;
            targetNumberSpan.textContent = arrayRecord.likes;
            incrementLocalStorageTracker("totalEngagementCounter");
            updateGlobalMetricsDisplays();
        }
    });

    if (viewSelector) {
        viewSelector.addEventListener("change", (changeEvent) => {
            renderActiveCards(changeEvent.target.value);
        });
    }

    renderActiveCards();
}

function initializeFormSubmissionCounter() {
    const activeFormElement = document.getElementById("registrationForm");
    if (!activeFormElement) return;

    activeFormElement.addEventListener("submit", (event) => {
        event.preventDefault();
        incrementLocalStorageTracker("totalFormRegistrations");
        const destinationUrl = activeFormElement.getAttribute("action") || "review.html";
        window.location.href = destinationUrl;
    });
}

function updateGlobalMetricsDisplays() {
    const generalEngagementContainer = document.getElementById("totalEngagementDisplay");
    const registrationContainer = document.getElementById("totalRegistrationsDisplay");

    if (generalEngagementContainer) {
        generalEngagementContainer.textContent = fetchLocalStorageValue("totalEngagementCounter");
    }
    if (registrationContainer) {
        registrationContainer.textContent = fetchLocalStorageValue("totalFormRegistrations");
    }
}
