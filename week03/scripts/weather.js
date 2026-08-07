const myTown = document.querySelector('#town');
const myDescription = document.querySelector('#description');
const myTemperature = document.querySelector('#temperature');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

const myKey= "338f3796580e881d1cd7bf5cb118394d"
const lat = "-14.43012253275626"
const lon = "28.44790480831491"

const myURL = '//api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${myKey}&units=imperial';


async function apiFetch() {
  try {
    const response = await fetch(myURL);
    if (response.ok) {
      const data = await response.json();
      console.log(data); // testing only
      // displayResults(data); // uncomment when ready
    } else {
        throw Error(await response.text());
    }
  } catch (error) {
      console.log(error);
  }
}

apiFetch();

//display the results of the weather data
function displayResults(data) {
    console.log('hello')
    myTown.textContent = data.name;
    myDescription.textContent = data.weather[0].description;
    myTemperature.textContent = `${data.main.temp.toFixed(0)}°F`;

    //start the process of displaying the results of the weather data
    currentTemp.innerHTML = `${Math.round(data.main.temp)}&deg;F`;
    const iconsrc = `https://openweathermap.org{data.weather.icon}@2x.png`;
    let desc = data.weather.description;
    weatherIcon.setAttribute('src', iconsrc);
    weatherIcon.setAttribute('alt', desc);
    captionDesc.textContent = `${desc}`;
}

apiFetch();











function renderFeed(posts) {
    const streamContainer = document.getElementById("social-feed-stream");
    if (!streamContainer) return;

    streamContainer.innerHTML = "";

    // Step 1: Create a manual list of your available local images
    const myLocalImages = [
        "images/profiles/vacation.webp",
        "images/profiles/familybiking.webp",
        "images/profiles/pizza.webp",
        "images/profiles/arts.webp",
        "images/profiles/fireplace.webp",
        "images/profiles/enjoyingbeach.webp",
        "images/profiles/castles.webp",
        "images/profiles/beachwalking.webp",
        "images/profiles/familygames.webp",
        "images/profiles/familypicnic.webp",
        "images/profiles/baking.webp",
        "images/profiles/gardening.webp",
        "images/profiles/music.webp",
        "images/profiles/soccer.webp",
        "images/profiles/stargaze.webp",
        "images/profiles/baking.webp",
        
    ];

    posts.forEach(post => {
        const postCard = document.createElement("article");
        postCard.className = "card post-card";

        // Step 2: Generate a random index based on your image array's length
        const randomIdx = Math.floor(Math.random() * myLocalImages.length);
        const postImageUrl = myLocalImages[randomIdx];

        postCard.innerHTML = `
            <div class="post-header">
                <div class="profile-frame">
                    <img src="images/profiles/${post.username}.webp" alt="${post.authorName}" loading="lazy" width="44" height="44">
                </div>
                <div class="author-meta">
                    <span class="meta-name">${post.authorName}</span>
                    <span class="meta-handle">@${post.username} &bull; ${post.timestamp}</span>
                </div>
            </div>
            <p class="post-content">${post.postContent}</p>
            <div class="post-media-frame">
                <img src="${postImageUrl}" alt="Community workspace image" class="post-media-img" loading="lazy" width="500" height="250">
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
