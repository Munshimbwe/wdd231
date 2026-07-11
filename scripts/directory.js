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
        renderDirectory(data);
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
            <div class="card-header">
                <h3>${member.name}</h3>
                <p class="tagline">${member.tagline}</p>
            </div>
            <div class="card-body">
                <div class="card-img-placeholder"></div>
                <div class="card-info">
                    <p><strong>EMAIL:</strong> ${member.email}</p>
                    <p><strong>PHONE:</strong> ${member.phone}</p>
                    <p><strong>URL:</strong> ${member.url}</p>
                </div>
            </div>
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
