import { 
    getSpotlightCards, 
    initNavigation, 
    initModals, 
    setFooterDates, 
    setFormTimestamp, 
    getMemberDataGrid 
} from './chamber.mjs';
import { weatherApiFetch } from './weather.mjs';

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigationEngine();
    initializeChamberThemeToggle();
    initializeFormTimestamp();
    initializeModalDialogs();
    
    try { 
        if (typeof setFooterDates === 'function') setFooterDates(); 
    } catch(e) {}

    const spotlightContainer = document.querySelector('#spotlight-container');
    if (spotlightContainer) {
        getSpotlightCards(spotlightContainer);
    }

    const memberGridContainer = document.querySelector('#member-container');
    if (memberGridContainer && typeof getMemberDataGrid === 'function') {
        getMemberDataGrid(memberGridContainer);
    }

    const timestampInput = document.querySelector('#timestamp') || document.getElementById("form-timestamp");
    if (timestampInput && typeof setFormTimestamp === 'function') {
        setFormTimestamp();
    }

    const tempDisplay = document.querySelector('.weather-card .temp') || document.querySelector('.weather-now .temp') || document.querySelector('.temp');
    const condDisplay = document.querySelector('.weather-card .condition') || document.querySelector('.weather-now .condition') || document.querySelector('.condition');
    const iconDisplay = document.querySelector('.weather-card .weather-icon') || document.querySelector('.weather-now .weather-icon') || document.querySelector('.weather-icon');
    const forecastDisplay = document.querySelector('.weather-card .forecast') || document.querySelector('.forecast-grid') || document.querySelector('.forecast');

    if (tempDisplay || condDisplay) {
        const weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=-14.454726155497054&lon=28.472300942498496&units=metric&appid=cc520e6f7c509875bf7a6906c2185f46';
        weatherApiFetch(weatherUrl, tempDisplay, condDisplay, iconDisplay, forecastDisplay);
    }
});

function initializeNavigationEngine() {
    const menuBtn = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    try {
        if (typeof initNavigation === 'function') {
            initNavigation();
            return;
        }
    } catch (e) {}

    if (!menuBtn || !navMenu) return;

    menuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("show");
        navMenu.classList.toggle("open-drawer");
        menuBtn.classList.toggle("menu-active");
    });
}

function initializeChamberThemeToggle() {
    const darkButton = document.querySelector('#dark-toggle');
    if (!darkButton) return;

    if (localStorage.getItem('chamberTheme') === 'dark' || localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.add('dark-mode');
    }

    darkButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('dark-mode');
        
        const isDark = document.body.classList.contains('dark-theme') || document.body.classList.contains('dark-mode');
        localStorage.setItem('chamberTheme', isDark ? "dark" : "light");
        localStorage.setItem('theme', isDark ? "dark" : "light");
    });
}

function initializeFormTimestamp() {
    const timestampField = document.getElementById("form-timestamp") || document.getElementById("timestamp");
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }
}

function initializeModalDialogs() {
    try {
        if (typeof initModals === 'function') {
            initModals();
            return;
        }
    } catch(e) {}

    const openButtons = document.querySelectorAll(".open-modal");
    const closeButtons = document.querySelectorAll(".close-modal");

    openButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modalId = button.getAttribute("data-modal");
            const modal = document.getElementById(modalId);
            if (modal) modal.showModal();
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest("dialog");
            if (modal) modal.close();
        });
    });
}

