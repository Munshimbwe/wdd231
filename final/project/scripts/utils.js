export const memoriesArray = [
    {
        id: "mem-001",
        title: "Family Picnic at the Park",
        category: "outdoor",
        likes: 12,
        caption: "A wonderful sunny afternoon sharing snacks and playing games outdoors.",
        image: "images/familypicnic.webp"
    },
    {
        id: "mem-002",
        title: "Baking Cookies with Grandma",
        category: "indoor",
        likes: 24,
        caption: "Learning secret recipes and enjoying homemade chocolate chip treats.",
        image: "images/baking-with-granny.webp"
    },
    {
        id: "mem-003",
        title: "Weekend Bike Trail Ride",
        category: "outdoor",
        likes: 18,
        caption: "Exploring the new regional paths together as a team.",
        image: "images/family-biking.webp"
    },
    {
        id: "mem-004",
        title: "Board Game Marathon Night",
        category: "indoor",
        likes: 15,
        caption: "Unplugged family fun with friendly strategies and rolling dice.",
        image: "images/family-board-games.webp"
    }
];

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
    const index = 13.12 + (0.6215 * celsiusTemp) - (11.37 * Math.pow(kmhWind, 0.16)) + (0.3965 * celsiusTemp * Math.pow(kmhWind, 0.16));
    return parseFloat(index.toFixed(1));
}

export function incrementLocalStorageTracker(storageKeyName) {
    let currentStoredValue = parseInt(localStorage.getItem(storageKeyName), 10);
    if (isNaN(currentStoredValue)) {
        currentStoredValue = 0;
    }
    currentStoredValue += 1;
    localStorage.setItem(storageKeyName, currentStoredValue.toString());
    return currentStoredValue;
}

export function fetchLocalStorageValue(storageKeyName) {
    const value = localStorage.getItem(storageKeyName);
    return value ? parseInt(value, 10) : 0;
}

export function incrementAiInquiryTracker() {
    return incrementLocalStorageTracker("aiInquiryCounter");
}
