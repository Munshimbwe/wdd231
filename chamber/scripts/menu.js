const menuButton = document.querySelector('#menu-toggle');
const navMenu = document.querySelector('#nav-menu');
const darkToggle = document.querySelector('#dark-toggle');

menuButton.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    if (navMenu.classList.contains('open')) {
        menuButton.textContent = 'X';
    } else {
        menuButton.textContent = '☰';
    }
});

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (darkToggle) darkToggle.textContent = '☀️';
}

if (darkToggle) {
    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            darkToggle.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            darkToggle.textContent = '🌓';
        }
    });
}

document.querySelector('#currentyear').textContent = new Date().getFullYear();
document.querySelector('#lastModified').textContent = `Last Modification: ${document.lastModified}`;
