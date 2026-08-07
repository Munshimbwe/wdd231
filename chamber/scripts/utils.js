export function getFormattedDateString() {
    const fileTimestamp = new Date(document.lastModified);
    return fileTimestamp.toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}

export function initializeGlobalVisitTracker() {
    const trackingFeedbackBox = document.getElementById("visitTrackingMessage");
    if (!trackingFeedbackBox) return;

    const currentTimestamp = Date.now();
    const rawLastVisitedValue = localStorage.getItem("chamberPlatformLastVisitToken");

    if (!rawLastVisitedValue) {
        trackingFeedbackBox.textContent = "Welcome! Let us know if you have any questions.";
        localStorage.setItem("chamberPlatformLastVisitToken", currentTimestamp);
        return;
    }

    const lastVisitedTimestamp = parseInt(rawLastVisitedValue, 10);
    const timeDifferenceMs = currentTimestamp - lastVisitedTimestamp;
    
    const msInOneDay = 1000 * 60 * 60 * 24;
    const computedWholeDays = Math.floor(timeDifferenceMs / msInOneDay);

    if (timeDifferenceMs < msInOneDay) {
        trackingFeedbackBox.textContent = "Back so soon! AWESOME!";
    } else if (computedWholeDays === 1) {
        trackingFeedbackBox.textContent = "You last visited 1 day ago.";
    } else {
        trackingFeedbackBox.textContent = `You last visited ${computedWholeDays} days ago.`;
    }

    localStorage.setItem("chamberPlatformLastVisitToken", currentTimestamp);
}

export function initializeGlobalThemeAndNav() {
    const themeBtn = document.getElementById("dark-toggle");
    const menuBtn = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const yearSpan = document.getElementById("currentyear");
    const modSpan = document.getElementById("lastModified");

    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    if (modSpan) modSpan.textContent = `Last Modified: ${getFormattedDateString()}`;

    if (themeBtn) {
        if (localStorage.getItem("chamberTheme") === "dark") {
            document.body.classList.add("dark-theme");
        }
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");
            const isDark = document.body.classList.contains("dark-theme");
            localStorage.setItem("chamberTheme", isDark ? "dark" : "light");
        });
    }

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("open-drawer");
        });
    }
}
