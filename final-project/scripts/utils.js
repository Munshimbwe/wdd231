export const API_CONFIG = {
    WEATHER_KEY: "cc520e6f7c509875bf7a6906c2185f46",
    NEWS_KEY: "d3bc47b9c97b44aa99ba7947ea875ff4", // Aligned unified central tracking parameter
    HF_AI_KEY: "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" 
};

export function getFormattedDateString() {
    const fileTimestamp = new Date(document.lastModified);
    return fileTimestamp.toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}

export function computeWindChillIndex(celsiusTemp, kmhWind) {
    // Correct constraint check based on official environment thresholds (Formula bounds)
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
    localStorage.setItem(storageKeyName, currentStoredValue.toString());
    return currentStoredValue;
}

export function fetchLocalStorageValue(storageKeyName) {
    const value = localStorage.getItem(storageKeyName);
    // Fixed: Return a string character value "0" to maintain strict DOM textContent compliance
    return value ? value : "0";
}
