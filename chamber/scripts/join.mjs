export function initializeJoinPage() {
    const timestampField = document.querySelector('#timestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    const infoButtons = document.querySelectorAll('.info-btn');
    infoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.showModal();
            }
        });
    });

    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('dialog');
            if (modal) {
                modal.close();
            }
        });
    });

    const modals = document.querySelectorAll('dialog');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            const dialogDimensions = modal.getBoundingClientRect();
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                modal.close();
            }
        });
    });
}
function initializeFooter() {
    const lastModEl = document.getElementById("lastModified");
    const currentYearEl = document.getElementById("currentyear");
    
    if (lastModEl) lastModEl.innerHTML = `Last Modification: ${document.lastModified}`;
    if (currentYearEl) currentYearEl.innerHTML = new Date().getFullYear();
}

function initializeNavigation() {
    const navButton = document.querySelector('#menu-toggle'); 
    const navMenu = document.querySelector('#nav-menu');    

    if (!navButton || !navMenu) return;

    navButton.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('show');
        navButton.classList.toggle('show');
        
        navButton.textContent = isOpen ? '✕' : '☰';
        navButton.setAttribute('aria-expanded', isOpen);
    });
}
