const spotlightContainer = document.querySelector('#spotlight-container');
const tempDisplay = document.querySelector('.weather-now .temp');
const condDisplay = document.querySelector('.weather-now .condition');
const weatherNowIcon = document.querySelector('#weather-now-icon');
const forecastContainer = document.querySelector('.forecast-grid');

const lat = -14.45;
const lon = 28.45;
const apiKey = '338f3796580e881d1cd7bf5cb118394d';

const dataUrl = 'data/directory.json';


const weatherUrl = `//openweathermap.org{lat}&lon=${lon}&appid=${'338f3796580e881d1cd7bf5cb118394d'}&units=imperial`;
const forecastUrl = `//openweathermap.org{lat}&lon=${lon}&appid=${'338f3796580e881d1cd7bf5cb118394d'}&units=imperial`;

async function loadSpotlights() {
    if (!spotlightContainer) return;
    spotlightContainer.innerHTML = '<div style="text-align:center; font-weight:bold; color:var(--wayfinding-orange);">Loading...</div>';
    try {
        const response = await fetch(dataUrl);
        if (!response.ok) throw new Error();
        const data = await response.json();
        const premiumMembers = data.filter(m => {
            const tierLower = m.tier ? m.tier.toLowerCase() : '';
            return tierLower === 'gold' || tierLower === 'silver' || m.completed === true;
        });
        const listToUse = premiumMembers.length > 0 ? premiumMembers : data;
        const shuffled = listToUse.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 2);
        setTimeout(() => {
            spotlightContainer.innerHTML = '';
            selected.forEach(member => {
                const card = document.createElement('div');
                card.classList.add('directory-card');
                card.innerHTML = `
                    <div class="card-header">
                        <h3>${member.name}</h3>
                        <img src="${member.image}" alt="${member.name} Logo" loading="lazy">
                        <p class="tagline">${member.tagline || 'Local Premium Partner'}</p>
                    </div>
                    <p class="spotlight-phone">Phone: ${member.phone}</p>
                `;
                spotlightContainer.appendChild(card);
            });
        }, 50);
    } catch (error) {
        spotlightContainer.innerHTML = '<p>Unable to load featured spotlights at this time.</p>';
    }
}

async function loadWeatherData() {
    if (!tempDisplay || !condDisplay) return;
    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) throw new Error();
        const data = await response.json();
        tempDisplay.innerHTML = `${Math.round(data.main.temp)}&deg;C`;
        const descriptionText = data.weather[0].description.replace(/\b\w/g, c => c.toUpperCase());
        condDisplay.textContent = descriptionText;
        if (weatherNowIcon) {
            const iconCode = data.weather[0].icon;
            weatherNowIcon.setAttribute('src', `https://openweathermap.org{iconCode}@2x.png`);
            weatherNowIcon.setAttribute('alt', descriptionText);
        }
    } catch (error) {
        tempDisplay.textContent = 'no data';
        condDisplay.textContent = 'Weather sync service unavailable';
    }
}

async function loadForecastData() {
    if (!forecastContainer) return;
    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) throw new Error();
        const data = await response.json();
        forecastContainer.innerHTML = '';
        const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);
        dailyForecasts.forEach(item => {
            const dateObj = new Date(item.dt * 1000);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const dayCard = document.createElement('div');
            dayCard.classList.add('day');
            dayCard.innerHTML = `${dayName}: ${Math.round(item.main.temp)}&deg;C`;
            forecastContainer.appendChild(dayCard);
        });
    } catch (error) {
        forecastContainer.innerHTML = '<div class="day">Forecast mapping paused</div>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadSpotlights();
    loadWeatherData();
    loadForecastData();
});
