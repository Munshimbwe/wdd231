import { initializeGlobalThemeAndNav, initializeGlobalVisitTracker } from './utils.js'
const modalContentRegistry = {
    history: {
        title: "Kabwe Historical Heritage",
        text: "Kabwe expanded into an active hub after rich zinc and lead mineral veins were surfaced in 1902. It traces its ancestry as a baseline engine for railway logistics and engineering trades across Central Africa."
    },
    demographics: {
        title: "Demographics & Urban Census",
        text: "Boasting over 150,000 residents, the corporate zone features an index of technical, trade-oriented, and small-scale web consulting platforms showing significant annual expansion indexes."
    },
    events: {
        title: "Economic Integration Gala",
        text: "Our signature economic summit builds local connection paths. Members collaborate on enterprise workflows, explore policy documents, and network with technology developers."
    },
    dam: {
        title: "Mulungushi Dam",
        text: "A must see gem located approx 60km from Kabwe town. The dam is great for fishermen and there's hidden falls and gorges."
    },
    mountain: {
        title: "Prayer Mountain",
        text: "Prayer Mountain comes from Christians in surrounding areas going there to pray. Due to its majestic scenery, climbing tracks, and historic geography outlook layers."
    },
    cruise: {
        title: "River Cruise",
        text: "Experience Kabwe's water networks with scheduled weekend commercial cruise outings, with beautiful natural sightseeing experiences."
    },
    riverfront: {
        title: "Riverfront",
        text: "A central municipal park node hosting river activities for all age groups."
    },
    nature: {
        title: "Kabwe Safari Lodge",
        text: "This environmental wildlife reserve provides high conservation protection parameters for local bird life and rare flora profiles."
    }
};


document.addEventListener("DOMContentLoaded", () => {
    initializeGlobalThemeAndNav();
    initializeGlobalVisitTracker();
    initializeAccessibilityModal();
});

function initializeAccessibilityModal() {
    const modalOverlay = document.getElementById("infoModalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    const closeBtn = document.getElementById("closeModalBtn");
    const triggerButtons = document.querySelectorAll(".btn-learn-more");
    
    let activeTriggerElement = null;
    if (!modalOverlay || !closeBtn) return;

    triggerButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const targetKey = e.currentTarget.getAttribute("data-modal-target");
            const content = modalContentRegistry[targetKey];
            if (content) {
                activeTriggerElement = e.currentTarget;
                modalTitle.textContent = content.title;
                modalBody.textContent = content.text;
                modalOverlay.classList.add("modal-active");
                closeBtn.focus();
            }
        });
    });

    const dismissModalWindow = () => {
        modalOverlay.classList.remove("modal-active");
        if (activeTriggerElement) activeTriggerElement.focus();
    };

    closeBtn.addEventListener("click", dismissModalWindow);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) dismissModalWindow();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalOverlay.classList.contains("modal-active")) dismissModalWindow();
    });
}
