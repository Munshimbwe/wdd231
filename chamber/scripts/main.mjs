import { getSpotlightCards } from "./chamber.mjs";
import { weatherApiFetch } from "./weather.mjs";

document.addEventListener("DOMContentLoaded", () => {
    initializeFooter();
    initializeNavigation();
    initializeDarkMode();

    const spotlightContainer = document.querySelector('#spotlight-container');
    if (spotlightContainer) {
        getSpotlightCards(spotlightContainer);
    }

    const tempDisplay = document.querySelector('.weather-card .temp');
    const condDisplay = document.querySelector('.weather-card .condition');
    const iconDisplay = document.querySelector('.weather-card .weather-icon');
    const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=-14.454726155497054&lon=28.472300942498496&units=metric&appid=cc520e6f7c509875bf7a6906c2185f46';
    if (tempDisplay && condDisplay && iconDisplay) {
        weatherApiFetch(weatherUrl, tempDisplay, condDisplay, iconDisplay);
    }
});

function initializeFooter() {
    const lastModEl = document.getElementById("lastModified");
    const currentYearEl = document.getElementById("currentyear");
    
    if (lastModEl) lastModEl.innerHTML = `Last Modification: ${document.lastModified}`;
    if (currentYearEl) currentYearEl.innerHTML = new Date().getFullYear();
}

function initializeNavigation() {
    const navButton = document.querySelector('#menu-toggle'); 
    const navLinks = document.querySelector('#nav-menu');    

    if (navButton && navLinks) {
        navButton.addEventListener('click', () => {
            navButton.classList.toggle('show');
            navLinks.classList.toggle('show');
        });
    }
}

function initializeDarkMode() {
    const darkButton = document.querySelector('#dark-toggle');
    if (darkButton) {
        darkButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }
}
 
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    