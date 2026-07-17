const spotlightContainer = document.querySelector('#spotlight-container');
const dataUrl = 'data/directory.json';

async function loadSpotlights() {
    if (!spotlightContainer) return;

    spotlightContainer.innerHTML = '<div style="text-align:center; font-weight:bold; color:var(--wayfinding-orange);">Loading...</div>';

    try {
        const response = await fetch(dataUrl);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        
        if (!Array.isArray(data) || data.length === 0) {
            spotlightContainer.innerHTML = '<p>Error: JSON data is empty or not an array.</p>';
            return;
        }

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
        spotlightContainer.innerHTML = `<p>Unable to load featured spotlights. Error details: ${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadSpotlights);
