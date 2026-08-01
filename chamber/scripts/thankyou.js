document.addEventListener("DOMContentLoaded", () => {
    renderSubmittedFormData();
});

function renderSubmittedFormData() {
    const displayCardContainer = document.getElementById("submission-display");
    if (!displayCardContainer) return;

    const URLParameterString = window.location.search;
    const formFieldsExtractor = new URLSearchParams(URLParameterString);

    if (!formFieldsExtractor.has("firstname") && !formFieldsExtractor.has("email")) {
        displayCardContainer.innerHTML = "<p>No active submission records detected in current session context.</p>";
        return;
    }

    const rawTimestamp = formFieldsExtractor.get("timestamp");
    let humanReadableDate = "N/A";
    if (rawTimestamp) {
        const parsedDateInt = parseInt(rawTimestamp, 10);
        if (!isNaN(parsedDateInt)) {
            humanReadableDate = new Date(parsedDateInt).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short"
            });
        }
    }

    const formDataMap = {
        "First Name": formFieldsExtractor.get("firstname") || "N/A",
        "Last Name": formFieldsExtractor.get("lastname") || "N/A",
        "Organizational Title": formFieldsExtractor.get("title") || "N/A",
        "Email Address": formFieldsExtractor.get("email") || "N/A",
        "Mobile Phone": formFieldsExtractor.get("phone") || "N/A",
        "Organization Name": formFieldsExtractor.get("organization") || "N/A",
        "Membership Tier": formFieldsExtractor.get("tier") || "N/A",
        "Business Description": formFieldsExtractor.get("description") || "N/A",
        "Submission Timestamp": humanReadableDate
    };

    const recordsGridList = document.createElement("dl");
    recordsGridList.className = "records-data-list";

    for (const [keyLabel, valueString] of Object.entries(formDataMap)) {
        const dtTerm = document.createElement("dt");
        dtTerm.className = "record-term-title";
        dtTerm.textContent = keyLabel;

        const ddDesc = document.createElement("dd");
        ddDesc.className = "record-desc-value";
        ddDesc.textContent = valueString;

        recordsGridList.appendChild(dtTerm);
        recordsGridList.appendChild(ddDesc);
    }

    displayCardContainer.appendChild(recordsGridList);
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);

    const formFields = [
        "firstname",
        "lastname",
        "title",
        "email",
        "phone",
        "organization",
        "tier",
        "description"
    ];

    formFields.forEach(field => {
        const outputElement = document.getElementById(`display-${field}`);
        if (outputElement) {
            const rawValue = urlParams.get(field);
            outputElement.textContent = rawValue ? decodeURIComponent(rawValue) : "Not Provided";
        }
    });

    const timestampElement = document.getElementById("display-timestamp");
    if (timestampElement) {
        const rawTimestamp = urlParams.get("timestamp");
        if (rawTimestamp) {
            const dateNumber = parseInt(rawTimestamp, 10);
            if (!isNaN(dateNumber)) {
                timestampElement.textContent = new Date(dateNumber).toLocaleString();
            } else {
                timestampElement.textContent = decodeURIComponent(rawTimestamp);
            }
        } else {
            timestampElement.textContent = new Date().toLocaleString();
        }
    }
});
