import { initializeGlobalThemeAndNav } from 'utils.js';

document.addEventListener("DOMContentLoaded", async () => {
    initializeGlobalThemeAndNav();
    await loadChamberDirectoryDatabase();
    initializeLayoutViewToggles();
});

async function loadChamberDirectoryDatabase() {
    const displayContainer = document.getElementById("member-container");
    if (!displayContainer) return;

    try {
        const response = await fetch("data/directory.json");
        if (!response.ok) throw new Error("JSON Directory Error");
        const membersDataArray = await response.json();
        renderDirectoryCards(membersDataArray, displayContainer);
    } catch (error) {
        displayContainer.innerHTML = `<p class="visitor-alert-banner">Error parsing directory listings database. Offline fallback running.</p>`;
    }
}

function renderDirectoryCards(dataset, containerNode) {
    containerNode.innerHTML = "";
    
    dataset.forEach(business => {
        const cardArticle = document.createElement("article");
        cardArticle.className = `directory-card tier-${business.tier}`;
        
        cardArticle.innerHTML = `
            <div class="card-logo-container">
                <img src="${business.icon}" alt="${business.name} branding" loading="lazy" width="180" height="70">
            </div>
            <h3>${business.name}</h3>
            <p>${business.address}</p>
            <p>${business.phone}</p>
            <span class="membership-badge">${business.tier.toUpperCase()} MEMBER</span>
            <a href="${business.website}" target="_blank" rel="noopener noreferrer" class="member-link">Visit Website</a>
        `;
        containerNode.appendChild(cardArticle);
    });
}

function initializeLayoutViewToggles() {
    const gridBtn = document.getElementById("grid-view-btn");
    const listBtn = document.getElementById("list-view-btn");
    const targetContainer = document.getElementById("member-container");

    if (!gridBtn || !listBtn || !targetContainer) return;

    gridBtn.addEventListener("click", () => {
        targetContainer.className = "grid-layout";
        gridBtn.classList.add("active-filter");
        listBtn.classList.remove("active-filter");
    });

    listBtn.addEventListener("click", () => {
        targetContainer.className = "list-layout";
        listBtn.classList.add("active-filter");
        gridBtn.classList.remove("active-filter");
    });
}
