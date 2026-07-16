const spotlightContainer = document.querySelector('#spotlight-container');
const dataUrl = 'data/directory.json';

async function loadSpotlights() {
    try {
        const response = await fetch(dataUrl);
        if (!response.ok) throw new Error();
        const data = await response.json();
        
        const premiumMembers = data.filter(m => m.tier === 'Gold' || m.tier === 'Silver' || m.completed === true);
        const shuffled = premiumMembers.sort(() => 0.5 - Math.random());
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

document.addEventListener('DOMContentLoaded', loadSpotlights);
