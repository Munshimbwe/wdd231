const members = [
  { name: "Summit Tech Solutions", tier: "Gold", phone: "801-555-0143", url: "https://example.com" },
  { name: "Wasatch Brew & Bakery", tier: "Silver", "phone": "801-555-0211", url: "https://example.com" },
  { name: "Deseret Web Designs", tier: "Gold", "phone": "801-555-0399", url: "https://example.com" },
  { name: "Pioneer Law Group", tier: "Bronze", "phone": "801-555-0454", url: "https://example.com" },
  { name: "Beehive Fitness Center", tier: "Silver", "phone": "801-555-0588", url: "https://example.com" },
  { name: "Great Basin Logistics", tier: "Bronze", "phone": "801-555-0612", url: "https://example.com" },
  { name: "Intermountain Retailers", tier: "Gold", "phone": "801-555-0741", url: "https://example.com" },
  { name: "Sundance Digital Media", tier: "Silver", "phone": "801-555-0833", url: "https://example.com" },
  { name: "Copper Rim Financial", tier: "Gold", "phone": "801-555-0922", url: "https://example.com" },
  { name: "Timpanogos Auto Care", tier: "Bronze", "phone": "801-555-1077", url: "https://example.com" },
  { name: "Red Rock Creative Agency", tier: "Silver", "phone": "801-555-1150", url: "https://example.com" },
  { name: "Zion Coffee Roasters", tier: "Bronze", "phone": "801-555-1266", url: "https://example.com" },
  { name: "Alta Insurance Group", tier: "Silver", "phone": "801-555-1391", url: "https://example.com" },
  { name: "Sagebrush Property Management", tier: "Gold", "phone": "801-555-1411", url: "https://example.com" },
  { name: "Uinta Outdoor Gear", tier: "Bronze", "phone": "801-555-1522", url: "https://example.com" }
];

const container = document.querySelector('#member-container');
const gridBtn = document.querySelector('#grid-view-btn');
const listBtn = document.querySelector('#list-view-btn');

function renderDirectory() {
    container.innerHTML = '';
    members.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('course-card');
        if (member.tier === 'Gold' || member.tier === 'Silver') {
            card.classList.add('completed');
        }
        
        card.innerHTML = `
            <h3>${member.name}</h3>
            <p>${member.tier} Tier Member</p>
            <p>${member.phone}</p>
            <a href="${member.url}" target="_blank" rel="noopener noreferrer">Visit Website</a>
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

container.classList.add('grid-layout');
renderDirectory();
