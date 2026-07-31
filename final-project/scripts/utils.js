export const API_CONFIG = {
    WEATHER_KEY: "4a4146bb6c483a9183df5a6e27926b48",
    NEWS_KEY: "d3bc47b9c97b44aa99ba7947ea875ff4",
    HF_AI_KEY: "" 
};

export function getFormattedDateString() {
    const fileTimestamp = new Date(document.lastModified);
    return fileTimestamp.toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}

export function computeWindChillIndex(celsiusTemp, kmhWind) {
    if (celsiusTemp > 10 || kmhWind <= 4.8) {
        return null;
    }
    return 13.12 + (0.6215 * celsiusTemp) - (11.37 * Math.pow(kmhWind, 0.16)) + (0.3965 * celsiusTemp * Math.pow(kmhWind, 0.16));
}

export function incrementLocalStorageTracker(storageKeyName) {
    let currentStoredValue = parseInt(localStorage.getItem(storageKeyName));
    if (isNaN(currentStoredValue)) {
        currentStoredValue = 0;
    }
    currentStoredValue += 1;
    localStorage.setItem(storageKeyName, currentStoredValue);
    return currentStoredValue;
}

export function fetchLocalStorageValue(storageKeyName) {
    const value = localStorage.getItem(storageKeyName);
    return value ? value : 0;
}
