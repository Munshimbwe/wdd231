document.addEventListener("DOMContentLoaded", () => {
    parseFormPayload();
});

function parseFormPayload() {
    const outputPanel = document.getElementById("query-output-panel");
    if (!outputPanel) return;

    const currentUrlParams = new URLSearchParams(window.location.search);
    if ([...currentUrlParams].length === 0) {
        outputPanel.innerHTML = `<p class="error-text">No incoming configuration data parameter sets were detected directly in the URL query pipeline string.</p>`;
        return;
    }

    const nameParam = currentUrlParams.get("fullName") || "Not Specified";
    const handleParam = currentUrlParams.get("userHandle") || "Not Specified";
    const emailParam = currentUrlParams.get("userEmail") || "Not Specified";
    const clanParam = currentUrlParams.get("primaryClan") || "Not Specified";
    const bioParam = currentUrlParams.get("userBio") || "None provided";
    const digestParam = currentUrlParams.get("marketingOpt") === "yes" ? "Opted In" : "Opted Out";

    outputPanel.innerHTML = `
        <dl class="data-results-list">
            <dt><strong>User Identity:</strong></dt>
            <dd>${escapeHtmlInput(nameParam)}</dd>
            
            <dt><strong>Network Handle:</strong></dt>
            <dd>@${escapeHtmlInput(handleParam)}</dd>
            
            <dt><strong>Email Point:</strong></dt>
            <dd>${escapeHtmlInput(emailParam)}</dd>
            
            <dt><strong>Target Assigned Clan:</strong></dt>
            <dd>${escapeHtmlInput(clanParam.toUpperCase())}</dd>
            
            <dt><strong>Biography Ledger:</strong></dt>
            <dd><em>"${escapeHtmlInput(bioParam)}"</em></dd>
            
            <dt><strong>Subscription Flag:</strong></dt>
            <dd>${digestParam}</dd>
        </dl>
    `;
}

function escapeHtmlInput(valueString) {
    return valueString
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
