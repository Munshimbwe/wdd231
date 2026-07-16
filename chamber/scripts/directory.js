const container = document.querySelector('#member-container');
const gridBtn = document.querySelector('#grid-view-btn');
const listBtn = document.querySelector('#list-view-btn');
const dataUrl = 'data/directory.json';

async function getMembers() {
    try {
        const response = await fetch(dataUrl);
        if (!response.ok) {
            throw new Error(`HTTP network error encountered: ${response.status}`);
        }
        const data = await response.json();
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        renderDirectory(sortedData);
    } catch (error) {
        container.innerHTML = `<p class="error-msg">Unable to process directory data list at this time.</p>`;
    }
}

function renderDirectory(memberArray) {
    container.innerHTML = '';
    memberArray.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('directory-card');
        
        card.innerHTML = `
            <div class="card-logo-container">
                <img src="${member.image}" alt="${member.name} Logo" loading="lazy">
            </div>
            <h3 class="member-name" style="margin: 0 0 10px 0; font-size: 1.2rem; color: var(--text-dark); text-align: center;">${member.name}</h3>
            <p class="address-line">${member.address || member.tagline}</p>
            <p class="phone-line">${member.phone}</p>
            <a href="${member.url}" target="_blank" rel="noopener noreferrer" class="member-link">${member.url}</a>
        `;
        container.appendChild(card);
    });
}

gridBtn.addEventListener('click', () => {
    container.classList.remove('list-layout');
    container.classList.add('grid-layout');
    gridBtn.classList.add('active-filter');
    listBtn.classList.remove('active-filter');
});

listBtn.addEventListener('click', () => {
    container.classList.remove('grid-layout');
    container.classList.add('list-layout');
    listBtn.classList.add('active-filter');
    gridBtn.classList.remove('active-filter');
});

document.addEventListener('DOMContentLoaded', () => {
    getMembers();
});
