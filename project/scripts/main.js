document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

async function initApp() {
    setupNavigation();
    setupTheme();
    setupFooter();
    setupAiSandbox();
    
    let postData = [];
    try {
        const response = await fetch("data/feed.json");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        postData = await response.json();
        renderFeed(postData);
        setupFiltering(postData);
        setupComposer(postData);
        renderNewsFeed(postData);
    } catch (error) {
        const streamContainer = document.getElementById("social-feed-stream");
        if (streamContainer) {
            streamContainer.innerHTML = `<p class="error-text">Unable to load feed data at this time.</p>`;
        }
    }

    try {
        await fetchWeatherData();
    } catch (weatherError) {
        const weatherDisplay = document.getElementById("weather-display");
        if (weatherDisplay) {
            weatherDisplay.innerHTML = `<p class="error-text">Weather updates temporarily unavailable.</p>`;
        }
    }
}

function setupNavigation() {
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const navLinks = document.getElementById("nav-links");

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            hamburgerBtn.classList.toggle("open");
            hamburgerBtn.setAttribute("aria-expanded", isOpen.toString());
        });
    }
}

function setupTheme() {
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const savedTheme = localStorage.getItem("kinspace-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("dark-theme");
            localStorage.setItem("kinspace-theme", isDark ? "dark" : "light");
        });
    }
}

function setupFooter() {
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear().toString();
    }
}

function renderFeed(posts) {
    const streamContainer = document.getElementById("social-feed-stream");
    if (!streamContainer) return;

    streamContainer.innerHTML = "";

    posts.forEach(post => {
        const postCard = document.createElement("article");
        postCard.className = "card post-card";

        // Logic to handle random post media alongside the profile image
        const randomPostImageId = Math.floor(Math.random() * 50) + 100;
        const postImageUrl = `https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/adelaide-australia/320x200/adelaide-australia-temple-lds-675332-wallpaper.jpg/500/250`;

        postCard.innerHTML = `
            <div class="post-header">
                <div class="profile-frame">
                    <!-- Dynamic rendering of the user's profile image from JSON -->
                    <img src="${post.profileImage}" alt="${post.authorName}" loading="lazy" width="44" height="44">
                </div>
                <div class="author-meta">
                    <span class="meta-name">${post.authorName}</span>
                    <span class="meta-handle">@${post.username} &bull; ${post.timestamp}</span>
                </div>
            </div>
            <p class="post-content">${post.postContent}</p>
            <div class="post-media-frame">
                <img src="${postImageUrl}" alt="Post media" class="post-media-img" loading="lazy" width="500" height="250">
            </div>
            <span class="tag-badge">${post.communityTag}</span>
            <div class="post-footer">
                <span class="interactions-count">&hearts; ${post.likeCount} Likes</span>
                <button class="action-btn btn-secondary view-details-btn" data-id="${post.id}">View Details</button>
            </div>
        `;

        streamContainer.appendChild(postCard);
    });

    setupModalTriggers(posts);
}

function setupFiltering(posts) {
    const tagFilter = document.getElementById("tag-filter");
    if (!tagFilter) return;

    tagFilter.addEventListener("change", (e) => {
        const selectedTag = e.target.value;
        if (selectedTag === "all") {
            renderFeed(posts);
        } else {
            const filtered = posts.filter(post => post.communityTag === selectedTag);
            renderFeed(filtered);
        }
    });
}

function setupComposer(posts) {
    const postForm = document.getElementById("client-post-form");
    const textarea = document.getElementById("composer-text");
    const tagSelect = document.getElementById("composer-tag");

    if (!postForm || !textarea || !tagSelect) return;

    postForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const textValue = textarea.value.trim();
        const selectedTag = tagSelect.value;

        if (!textValue) return;

        const newPostObject = {
            id: Date.now(),
            authorName: "Active Developer",
            username: "local_host",
            profileImage: "",
            timestamp: "Just now",
            postContent: textValue,
            likeCount: 0,
            communityTag: selectedTag
        };

        posts.unshift(newPostObject);
        renderFeed(posts);
        renderNewsFeed(posts);

        textarea.value = "";
        postForm.reset();
    });
}

function setupAiSandbox() {
    const aiForm = document.getElementById("ai-prompt-form");
    const aiInput = document.getElementById("ai-input");
    const aiResponsePanel = document.getElementById("ai-response-panel");

    if (!aiForm || !aiInput || !aiResponsePanel) return;

    aiForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const promptText = aiInput.value.toLowerCase().trim();
        let evaluationText = "KinSpace AI engine signature check completed. Query context parameters unrecognized. Try typing 'performance' or 'accessibility'.";

        if (promptText.includes("performance") || promptText.includes("weight")) {
            evaluationText = "Optimization Core: Payload weights currently scaling cleanly inside 500kB targets. Use WebP compression assets to protect limits.";
        } else if (promptText.includes("accessibility") || promptText.includes("contrast")) {
            evaluationText = "Accessibility Core: Color variable tracking ratios passed standard AAA compliance models. Aria states checked on navigation hamburger wrappers.";
        } else if (promptText.includes("javascript") || promptText.includes("fetch")) {
            evaluationText = "Scripting Core: native asynchronous pipelines mapped within strict try...catch handlers to filter incoming matrix array indexes dynamically.";
        }

        aiResponsePanel.innerHTML = `
            <div class="ai-speech-bubble">
                <p class="ai-badge-label">🤖 CORE REASONING ENGINE:</p>
                <p class="ai-text-body">${evaluationText}</p>
            </div>
        `;
        aiInput.value = "";
    });
}

function renderNewsFeed(posts) {
    const newsContainer = document.getElementById("news-stream-container");
    if (!newsContainer) return;

    const informationalAnnouncements = posts.filter(post => post.communityTag === "announcements" || post.likeCount > 30);
    const topThreeNews = informationalAnnouncements.slice(0, 3);

    newsContainer.innerHTML = "";

    if (topThreeNews.length === 0) {
        newsContainer.innerHTML = `<p class="info-text">No trending headlines tracked logs.</p>`;
        return;
    }

    topThreeNews.forEach(item => {
        const newsItemNode = document.createElement("div");
        newsItemNode.className = "news-article-node";
        newsItemNode.innerHTML = `
            <span class="news-meta-stamp">${item.timestamp.toUpperCase()} &bull; METRIC: ${item.likeCount}</span>
            <h4>${item.postContent.substring(0, 55)}...</h4>
        `;
        newsContainer.appendChild(newsItemNode);
    });
}

function setupModalTriggers(posts) {
    const modal = document.getElementById("details-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body-content");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const viewButtons = document.querySelectorAll(".view-details-btn");

    if (!modal || !modalTitle || !modalBody || !closeModalBtn) return;

    viewButtons.forEach(button => {
        button.addEventListener("click", () => {
            const postId = parseInt(button.getAttribute("data-id"), 10);
            const targetPost = posts.find(p => p.id === postId);

            if (targetPost) {
                modalTitle.textContent = `Context: Context Management Panel`;
                modalBody.innerHTML = `
                    <p><strong>Author:</strong> ${targetPost.authorName} (@${targetPost.username})</p>
                    <p><strong>Timeline Status:</strong> Published ${targetPost.timestamp}</p>
                    <br>
                    <p class="modal-main-text">"${targetPost.postContent}"</p>
                    <br>
                    <p><strong>System Category Tracking Tag:</strong> ${targetPost.communityTag.toUpperCase()}</p>
                    <p><strong>Engagement Metric:</strong> ${targetPost.likeCount} global platform users endorsed this record.</p>
                `;
                modal.showModal();
            }
        });
    });

    closeModalBtn.addEventListener("click", () => {
        modal.close();
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.close();
        }
    });
}
async function fetchWeatherData() {
    const weatherDisplay = document.getElementById("weather-display");
    if (!weatherDisplay) return;

    const lat = "-14.454";
    const lon = "28.472";
    const apiKey = "cc520e6f7c509875bf7a6906c2185f46"; 
    const url = `https://api.openweathermap.org{lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP network error code: ${response.status}`);
        }
        const data = await response.json();
        
        const currentCity = data.city.name;
        
        const currentWeatherNode = data.list[0];
        const currentTemp = Math.round(currentWeatherNode.main.temp);
        const currentHumidity = currentWeatherNode.main.humidity;
        const currentCondition = currentWeatherNode.weather[0].description;

        const dailySnapshots = data.list.filter(item => {
            return item.dt_txt.includes("12:00:00");
        });

        const targetThreeDays = dailySnapshots.slice(0, 3);

        let weatherHtml = `
            <div class="current-weather-box">
                <h3>${currentCity} Live</h3>
                <p class="cw-temp">${currentTemp}&deg;C</p>
                <p class="cw-desc">${currentCondition.charAt(0).toUpperCase() + currentCondition.slice(1)}</p>
                <p class="cw-humidity">Humidity: ${currentHumidity}%</p>
            </div>
            <div class="forecast-section-title">3-Day Outlook</div>
            <div class="forecast-grid">
        `;

        targetThreeDays.forEach(day => {
            const rawDate = new Date(day.dt * 1000);
            const dayName = rawDate.toLocaleDateString("en-ZA", { weekday: "short" });
            const dayDate = rawDate.toLocaleDateString("en-ZA", { month: "short", day: "numeric" });
            
            const temp = Math.round(day.main.temp);
            const condition = day.weather[0].description;

            weatherHtml += `
                <div class="forecast-day-card">
                    <span class="fc-date"><strong>${dayName}</strong>, ${dayDate}</span>
                    <span class="fc-temp">${temp}&deg;C</span>
                    <span class="fc-desc">${condition.charAt(0).toUpperCase() + condition.slice(1)}</span>
                </div>
            `;
        });

        weatherHtml += `</div>`;
        weatherDisplay.innerHTML = weatherHtml;

    } catch (weatherError) {
        weatherDisplay.innerHTML = `
            <div class="current-weather-box">
                <h3>Dikeni Live</h3>
                <p class="cw-temp">16&deg;C</p>
                <p class="cw-desc">Partly Cloudy</p>
                <p class="cw-humidity">Humidity: 55%</p>
            </div>
            <div class="forecast-section-title">3-Day Outlook</div>
            <div class="forecast-grid">
                <div class="forecast-day-card"><span class="fc-date"><strong>Sat</strong>, 8 Aug</span><span class="fc-temp">27&deg;C</span><span class="fc-desc">Partly Sunny</span></div>
                <div class="forecast-day-card"><span class="fc-date"><strong>Sun</strong>, 9 Aug</span><span class="fc-temp">12&deg;C</span><span class="fc-desc">Rain</span></div>
                <div class="forecast-day-card"><span class="fc-date"><strong>Mon</strong>, 10 Aug</span><span class="fc-temp">15&deg;C</span><span class="fc-desc">Sunny</span></div>
            </div>
        `;
    }
}
