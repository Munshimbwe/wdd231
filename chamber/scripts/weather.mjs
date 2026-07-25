export async function weatherApiFetch(url, tempEl, condEl, iconEl, forecastEl) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error();
        const data = await response.json();
        
        displayCurrentWeather(data, tempEl, condEl, iconEl);
        if (forecastEl) {
            displayForecast(data, forecastEl);
        }
    } catch (error) {
        if (tempEl) tempEl.textContent = 'N/A';
        if (condEl) condEl.textContent = 'Unable to load weather';
        if (forecastEl) forecastEl.innerHTML = '<p>Forecast unavailable</p>';
    }
}

function displayCurrentWeather(data, tempEl, condEl, iconEl) {
    const current = data.list[0];
    tempEl.innerHTML = `${Math.round(current.main.temp)}&deg;C`;
    
    const description = current.weather[0].description;
    condEl.textContent = description.charAt(0).toUpperCase() + description.slice(1);
    
    const iconCode = current.weather[0].icon;
    iconEl.setAttribute('src', `https://openweathermap.org/img/wn/${iconCode}@2x.png`);
    iconEl.setAttribute('alt', description);
}

function displayForecast(data, forecastEl) {
    forecastEl.innerHTML = '';
    
    const dailyData = {};
    
    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyData[date]) {
            dailyData[date] = [];
        }
        dailyData[date].push(item);
    });

    const dates = Object.keys(dailyData).slice(1, 4);

    dates.forEach(date => {
        const dayEntries = dailyData[date];
        let dayTempSum = 0;
        
        dayEntries.forEach(entry => {
            dayTempSum += entry.main.temp;
        });

        const avgTemp = Math.round(dayTempSum / dayEntries.length);
        const dayIcon = dayEntries[Math.floor(dayEntries.length / 2)].weather[0].icon;
        const dayDesc = dayEntries[Math.floor(dayEntries.length / 2)].weather[0].description;

        const dateObj = new Date(date + 'T00:00:00');
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-day');
        forecastItem.innerHTML = `
            <p class="forecast-date"><strong>${dayName}</strong></p>
            <img src="https://openweathermap.org/img/wn/${dayIcon}.png" alt="${dayDesc}" width="40" height="40">
            <p class="forecast-temp">${avgTemp}&deg;C</p>
        `;

        forecastEl.appendChild(forecastItem);
    });
}