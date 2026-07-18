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
