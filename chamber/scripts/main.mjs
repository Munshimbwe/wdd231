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
    initNavigation();
    setFooterDates();
    initializeDarkMode();

    const spotlightContainer = document.querySelector('#spotlight-container');
    if (spotlightContainer) {
        getSpotlightCards(spotlightContainer);
    }

    const memberGridContainer = document.querySelector('#member-container');
    if (memberGridContainer && typeof getMemberDataGrid === 'function') {
        getMemberDataGrid(memberGridContainer);
    }

    const openModalBtn = document.querySelector('.open-modal');
    if (openModalBtn) {
        initModals();
    }

    const timestampInput = document.querySelector('#timestamp');
    if (timestampInput) {
        setFormTimestamp();
    }

    const tempDisplay = document.querySelector('.weather-card .temp') || document.querySelector('.weather-now .temp');
    const condDisplay = document.querySelector('.weather-card .condition') || document.querySelector('.weather-now .condition');
    const iconDisplay = document.querySelector('.weather-card .weather-icon') || document.querySelector('.weather-now .weather-icon');
    const forecastDisplay = document.querySelector('.weather-card .forecast') || document.querySelector('.forecast-grid');

    if (tempDisplay && condDisplay) {
        const weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=-14.454726155497054&lon=28.472300942498496&units=metric&appid=cc520e6f7c509875bf7a6906c2185f46';
        weatherApiFetch(weatherUrl, tempDisplay, condDisplay, iconDisplay, forecastDisplay);
    }
});

function initializeDarkMode() {
    const darkButton = document.querySelector('#dark-toggle');
    if (darkButton) {
        darkButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }
}
document.addEventListener("DOMContentLoaded", () => {
    initializeFormTimestamp();
    initializeModalDialogs();
});

function initializeFormTimestamp() {
    const timestampField = document.getElementById("form-timestamp");
    if (timestampField) {
        timestampField.value = Date.now();
    }
}

function initializeModalDialogs() {
    const openButtons = document.querySelectorAll(".open-modal");
    const closeButtons = document.querySelectorAll(".close-modal");

    openButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modalId = button.getAttribute("data-modal");
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.showModal();
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest("dialog");
            if (modal) {
                modal.close();
            }
        });
    });
}
