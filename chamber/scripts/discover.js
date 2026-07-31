import { processVisitTrackingMetrics } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
    initializeGlobalVisitTracker();
    initializeAccessibilityModal();
});

function initializeGlobalVisitTracker() {
    processVisitTrackingMetrics("chamberPlatformLastVisitToken");
}

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
                modalOverlay.setAttribute("aria-hidden", "false");
                closeBtn.focus();
            }
        });
    });

    const dismissModalWindow = () => {
        modalOverlay.classList.remove("modal-active");
        modalOverlay.setAttribute("aria-hidden", "true");
        if (activeTriggerElement) {
            activeTriggerElement.focus();
        }
    };

    closeBtn.addEventListener("click", dismissModalWindow);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) dismissModalWindow();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalOverlay.classList.contains("modal-active")) {
            dismissModalWindow();
        }
    });
}




document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.querySelector('#currentyear');
    const modifiedEl = document.querySelector('#lastModified');
    
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (modifiedEl) modifiedEl.textContent = `Last Modification: ${document.lastModified}`;
});

const modalContentRegistry = {
    history: {
        title: "Kabwe Historical Timeline",
        text: "Kabwe was formerly named Broken Hill when rich zinc and lead deposits were discovered in 1902. It stands as one of the oldest industrial mining centers in Zambia, shaping the mechanical engineering infrastructure of the nation."
    },
    demographics: {
        title: "Community Growth Metrics",
        text: "Current tracking logs confirm an active expansion across information technology and small business development sectors. The region pairs a young, technical student cohort with deep industrial field expertise."
    },
    events: {
        title: "Chamber Networking Matrix",
        text: "The upcoming Gala coordinates with national tech panels. Attendees gain access to private project showcases, B2B matchmaking interfaces, and policy roundtables organized by regional directors."
    }
};

document.addEventListener("DOMContentLoaded", () => {
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
                modalOverlay.setAttribute("aria-hidden", "false");
                closeBtn.focus();
            }
        });
    });

    const dismissModalWindow = () => {
        modalOverlay.classList.remove("modal-active");
        modalOverlay.setAttribute("aria-hidden", "true");
        if (activeTriggerElement) {
            activeTriggerElement.focus();
        }
    };

    closeBtn.addEventListener("click", dismissModalWindow);
    
    // Close modal if user clicks on background overlay blur area
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            dismissModalWindow();
        }
    });

    // Close modal if user presses Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalOverlay.classList.contains("modal-active")) {
            dismissModalWindow();
        }
    });
}

