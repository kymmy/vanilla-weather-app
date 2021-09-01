//Format day for current weather
function formatDate(timestamp) {
  //calculate date
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

//Format day for forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  return days[day];
}

// Integrat forecast API call
function getForecast(coordinates) {
  let apiKey = "078db4e136e212a8147d77a8cd2054b4";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiURL).then(displayForecast);
}

//Display current temperature
function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let windElement = document.querySelector("#wind");
  let cityElement = document.querySelector("#city");
  let humidityElement = document.querySelector("#humidity");
  let descriptionElement = document.querySelector("#description");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  //Attribute reponse to global variable
  celsiusTemperature = response.data.main.temp;

  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  cityElement.innerHTML = response.data.name;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  // Send coordinates to make forecast API call
  getForecast(response.data.coord);
}

//Current temperature API Call using user input
function search(city) {
  let apiKey = "078db4e136e212a8147d77a8cd2054b4";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

// Display forecast weather
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2">
     <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="36"
        />
        <div class="weather-forecast-temperature">
          <span class="weather-forecast-min">${Math.round(
            forecastDay.temp.min
          )}°</span>
          <span class="weather-forecast-max">${Math.round(
            forecastDay.temp.max
          )}°</span>
        </div>
    </div> 
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// Use coordinates to make API call
function searchLocation(position) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(displayTemperature);
}

//Get current location from navigator
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

//Handle user city input
function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

//Change fahrenheit link style & convert & round temp
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  //Remove acive class celsius link & add to fehrenheit
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

//Change celsius link style & round temp
function displayCelsiusTemperature(event) {
  event.preventDefault();
  //Add acive class celsius link & remove to fehrenheit
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

//Global variable accessible all functions, used to store temperature value
let celsiusTemperature = null;

//Default city to show if no user input received
search("New York");

// Retrieve & send user input
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

// Handle current position search
let position = document.querySelector("#my-position");
position.addEventListener("click", getCurrentLocation);

//Handle changes from fahrenheit to celcius for current weather
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);
