const MEMBERS_API_URL = 'data/directory.json';

function createCard(member) {
    const card = document.createElement('section');
    const nameDiv = document.createElement('div');
    const businessName = document.createElement('h2');
    const tagline = document.createElement('p');
    const picture = document.createElement('img');
    const address = document.createElement('p');
    const phone = document.createElement('p');
    const url = document.createElement('a');
    const lowerDiv = document.createElement('div');
    const infoDiv = document.createElement('div');

    infoDiv.setAttribute('class', 'infoDiv');
    lowerDiv.setAttribute('class', 'lowerDiv');
    nameDiv.setAttribute('class', 'nameDiv');

    picture.setAttribute('src', member.image || 'images/placeholder.webp');
    picture.setAttribute('alt', `Image of ${member.name}`);
    picture.setAttribute('loading', 'lazy');
    picture.setAttribute('width', '340');
    picture.setAttribute('height', 'auto');

    url.setAttribute('href', member.url.startsWith('http') ? member.url : `https://${member.url}`);
    url.setAttribute('target', '_blank');
    url.setAttribute('rel', 'noopener noreferrer');

    businessName.textContent = member.name;
    tagline.innerHTML = `<i>${member.tagline || ''}</i>`;
    address.innerHTML = `<strong>Email:</strong> ${member.email || 'N/A'}`;
    phone.innerHTML = `<strong>Phone:</strong> ${member.phone || 'N/A'}`;
    url.textContent = "Website";
    
    nameDiv.appendChild(businessName);
    if (member.tagline) {
        nameDiv.appendChild(tagline);
    }

    card.appendChild(nameDiv);
    infoDiv.appendChild(address);
    infoDiv.appendChild(phone);
    infoDiv.appendChild(url);
    lowerDiv.appendChild(picture);
    lowerDiv.appendChild(infoDiv);
    card.appendChild(lowerDiv);
    
    return card;
}

export async function getSpotlightCards(spotlightContainer) {
    if (!spotlightContainer) return;
    spotlightContainer.innerHTML = '<div style="text-align:center; font-weight:bold; color:var(--wayfinding-orange);">Loading...</div>';
    try {
        const response = await fetch(MEMBERS_API_URL);
        if (!response.ok) throw new Error();
        const data = await response.json();
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
        spotlightContainer.innerHTML = '<p>Unable to load featured spotlights at this time.</p>';
    }
}

export async function getMemberDataGrid(cards) {
    if (!cards) return;
    try {
        const response = await fetch(MEMBERS_API_URL);
        const members = await response.json();
        
        cards.replaceChildren();
        cards.classList.remove('list'); 
        cards.classList.add('grid');
        members.forEach((member) => {
            const card = createCard(member);
            cards.appendChild(card);
        });
    } catch (error) {
        console.error(error);
    }
}

export async function getMemberDataList(cards) {
    if (!cards) return;
    try {
        const response = await fetch(MEMBERS_API_URL);
        const members = await response.json();
        
        cards.replaceChildren();
        cards.classList.remove('grid');
        cards.classList.add('list');
        
        members.forEach((member) => {
            const card = document.createElement('section');
            card.setAttribute('class', 'list-item');
            
            const businessName = document.createElement('p');
            const tagline = document.createElement('p');
            const phone = document.createElement('p');
            const url = document.createElement('a');

            url.setAttribute('href', member.url.startsWith('http') ? member.url : `https://${member.url}`);
            url.setAttribute('target', '_blank');
            url.setAttribute('rel', 'noopener noreferrer');

            businessName.innerHTML = `<strong>${member.name}</strong>`;
            tagline.textContent = member.tagline || '';
            phone.textContent = member.phone || 'N/A';
            url.textContent = "Website";

            card.appendChild(businessName);
            card.appendChild(tagline);
            card.appendChild(phone);
            card.appendChild(url);

            cards.appendChild(card);
        });
    } catch (error) {
        console.error(error);
    }
}
