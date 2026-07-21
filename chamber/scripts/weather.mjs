export async function weatherApiFetch(url, tempEl, condEl, iconEl) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            displayWeatherResults(data, tempEl, condEl, iconEl);
        } else {
            throw new Error(`Weather API Error: ${response.statusText}`);
        }
    } catch (error) {
        console.error(error);
        tempEl.textContent = "N/A";
        condEl.textContent = "Offline";
    }
}

function displayWeatherResults(data, tempEl, condEl, iconEl) {
    tempEl.innerHTML = `${Math.round(data.main.temp)}&deg;C`;
    
    const desc = data.weather[0].description;
    condEl.textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
    
    iconEl.setAttribute('src', `https://openweathermap.org/img/w/${data.weather[0].icon}.png`);
    iconEl.setAttribute('alt', desc);
    iconEl.style.display = "block";
}
