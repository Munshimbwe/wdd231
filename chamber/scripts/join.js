document.addEventListener('DOMContentLoaded', () => {
    const timestampField = document.querySelector('#form-timestamp');
    if (timestampField) {
        timestampField.value = Date.now();
    }

    const yearEl = document.querySelector('#currentyear');
    const modifiedEl = document.querySelector('#lastModified');
    
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (modifiedEl) modifiedEl.textContent = `Last Modification: ${document.lastModified}`;
});
