export function processVisitTrackingMetrics(storageKeyName) {
    const trackingFeedbackBox = document.getElementById("visitTrackingMessage");
    if (!trackingFeedbackBox) return;

    const currentTimestamp = Date.now();
    const rawLastVisitedValue = localStorage.getItem(storageKeyName);

    if (!rawLastVisitedValue) {
        trackingFeedbackBox.textContent = "Welcome! Let us know if you have any questions.";
        localStorage.setItem(storageKeyName, currentTimestamp);
        return;
    }

    const lastVisitedTimestamp = parseInt(rawLastVisitedValue, 10);
    const timeDifferenceMs = currentTimestamp - lastVisitedTimestamp;
    
    const msInOneDay = 1000 * 60 * 60 * 24;
    const computedWholeDays = Math.floor(timeDifferenceMs / msInOneDay);

    if (computedWholeDays < 1) {
        trackingFeedbackBox.textContent = "Back so soon! AWESOME!";
    } else if (computedWholeDays === 1) {
        trackingFeedbackBox.textContent = "You last visited 1 day ago.";
    } else {
        trackingFeedbackBox.textContent = `You last visited ${computedWholeDays} days ago.`;
    }

    localStorage.setItem(storageKeyName, currentTimestamp);
}
