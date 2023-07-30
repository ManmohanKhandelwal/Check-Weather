// Get references to the DOM elements
const urlWeather = "https://weather-by-api-ninjas.p.rapidapi.com/v1/weather";
const urlAirQuality =
  "https://air-quality-by-api-ninjas.p.rapidapi.com/v1/airquality";
const apiKey = "caf026c331msh5deae6840e07d40p1ff099jsnef64fda92639";
const body = document.body;
const navbar = document.querySelector(".navbar");
const loaderContainer = document.querySelector(".loader-container");
const searchForm = document.querySelector("form");
const inputSearch = document.querySelector('input[type="search"]');
const defaultCity = "Kolkata"; // Set your default city here
const myButton = document.getElementById("locsearch");
const modeBtn = document.getElementById("modeBtn");
const navBar = document.getElementById("navBar");
const city_name = document.getElementById("city_name");
const goUpButton = document.getElementById("goUp");
let currentTheme = "light"; // Set the initial theme (dark or light)

// Hide the loader after 2 seconds (simulated delay)

setTimeout(function () {
  loaderContainer.style.display = "none";
}, 2000);

function changeMode() {
  if (currentTheme === "dark") {
    htmlElement.setAttribute("data-bs-theme", "light");
    currentTheme = "light";
    myButton.className = "btn btn-outline-success";
    modeBtn.innerHTML = "Dark Mode";
    navBar.className =
      "navbar navbar-expand-lg navbar-light bg-secondary-subtle";
    body.style.backgroundImage =
      "url('https://source.unsplash.com/FNWc_Dqsw2g/100vwx100vh/')";
    console.log(currentTheme);
  } else {
    htmlElement.setAttribute("data-bs-theme", "dark");
    currentTheme = "dark";
    console.log(currentTheme);
    myButton.className = "btn btn-outline-secondary";
    modeBtn.innerHTML = "Light Mode";
    navBar.className = "navbar navbar-expand-lg navbar-light bg-dark-subtle";
    body.style.backgroundColor = "";
    body.style.fontFamily = "";
    body.style.backgroundImage =
      "url('https://source.unsplash.com/bmVs4mDwI3k/100vwx100vh/')";
  }
}

// Call the changeTheme function when the button is clicked
myButton.addEventListener("click", changeMode);

// Event listener for form submission
function handleFormSubmission(e) {
  e.preventDefault();
  const city = inputSearch.value.trim();

  if (city === "") {
    alert("Please enter a city name");
    return;
  }

  loaderContainer.style.display = "flex";

  // Fetch weather data and air quality data simultaneously with Promise.all
  Promise.all([fetchWeatherData(city), fetchAirQualityData(city)])
    .then(([weatherResponse, airQualityResponse]) => {
      console.log(city);
      city_name.innerHTML = "Weather of " + city.toUpperCase();
      console.log(weatherResponse);
      console.log(airQualityResponse);
      // Do not update the theme here
    })
    .catch((err) => {
      console.error(err);
      // Show an error message and prompt for a correct location
      showError();
    })
    .finally(() => {
      loaderContainer.style.display = "none";
    });

  inputSearch.value = "";
}

// Event listener for form submission
searchForm.addEventListener("submit", handleFormSubmission);

// Load weather data for default city upon opening the website
window.addEventListener("load", function () {
  loaderContainer.style.display = "flex";
  // Fetch weather data and air quality data simultaneously with Promise.all
  Promise.all([fetchWeatherData(defaultCity), fetchAirQualityData(defaultCity)])
    .then(([weatherResponse, airQualityResponse]) => {
      console.log(defaultCity);
      city_name.innerHTML = "Weather of " + defaultCity.toUpperCase();
      inputSearch.value = defaultCity;
      console.log(weatherResponse);
      console.log(airQualityResponse);
      // Update the UI with the weather and air quality data
      updateWeatherData(weatherResponse);
      updateAirQualityData(airQualityResponse);
    })
    .catch((err) => {
      console.error(err);
      // Show an error message and prompt for a correct location
      showError();
    })
    .finally(() => {
      loaderContainer.style.display = "none";
    });
});

// Function to fetch weather data from the API with increment
function fetchWeatherData(city) {
  const options = {
    headers: {
      "x-rapidapi-host": "weather-by-api-ninjas.p.rapidapi.com",
      "x-rapidapi-key": "caf026c331msh5deae6840e07d40p1ff099jsnef64fda92639",
    },
  };

  // Simulate a delay before resolving the Promise
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return delay(1000).then(() => {
    return fetch(
      `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${city}`,
      options
    ).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      return response.json();
    });
  });
}

// Function to fetch air quality data from the API with increment
function fetchAirQualityData(city) {
  const options = {
    headers: {
      "x-rapidapi-host": "air-quality-by-api-ninjas.p.rapidapi.com",
      "x-rapidapi-key": apiKey,
    },
  };

  // Simulate a delay before resolving the Promise
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return delay(1000).then(() => {
    return fetch(`${urlAirQuality}?city=${city}`, options).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch air quality data");
      }
      return response.json();
    });
  });
}

// Function to update the weather data on the page with increment
function updateWeatherData(response) {
  const cloud_pct = document.getElementById("cloud_pct");
  const temp = document.getElementById("temp");
  const feels_like = document.getElementById("feels_like");
  const humidity = document.getElementById("humidity");
  const min_temp = document.getElementById("min_temp");
  const max_temp = document.getElementById("max_temp");
  const wind_speed = document.getElementById("wind_speed");
  const wind_degrees = document.getElementById("wind_degrees");
  const sunrise = document.getElementById("sunrise");
  const sunset = document.getElementById("sunset");

  // Function to update the elements with increment
  function updateWithIncrement(
    initialValue,
    finalValue,
    element,
    unit,
    duration = 2500
  ) {
    const totalSteps = 50; // Adjust this number to set the number of steps for incrementation
    const stepValue = (finalValue - initialValue) / totalSteps;
    const stepDuration = duration / totalSteps;

    function formatTime(timestamp) {
      const date = new Date(timestamp * 1000);
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // Convert to 12-hour format
      minutes = minutes.toString().padStart(2, "0"); // Add leading zero for minutes < 10
      return `${hours}:${minutes} ${ampm}`;
    }

    function updateStep(currentStep) {
      const valueToShow = initialValue + stepValue * currentStep;

      let displayValue;
      if (
        unit === "" &&
        (element.id === "sunrise" || element.id === "sunset")
      ) {
        // For sunrise and sunset, format the time
        displayValue = formatTime(valueToShow);
      } else if (isNaN(valueToShow)) {
        // If valueToShow is not a number, directly set the element's content without using toFixed
        displayValue = valueToShow;
      } else {
        // For other numeric values, use toFixed to display it with a fixed number of decimal places
        displayValue = valueToShow.toFixed(2);
      }

      element.innerHTML = displayValue + unit;

      if (currentStep < totalSteps) {
        setTimeout(() => {
          updateStep(currentStep + 1);
        }, stepDuration);
      }
    }

    // Start the incrementation process
    updateStep(0);
  }

  // Slowly update the weather data with increment
  updateWithIncrement(0, response.cloud_pct, cloud_pct, "%");
  updateWithIncrement(0, response.temp, temp, "°C");
  updateWithIncrement(0, response.feels_like, feels_like, "°C");
  updateWithIncrement(0, response.humidity, humidity, "%");
  updateWithIncrement(0, response.min_temp, min_temp, "°C");
  updateWithIncrement(0, response.max_temp, max_temp, "°C");
  updateWithIncrement(0, response.wind_speed, wind_speed, " kmph");
  updateWithIncrement(0, response.wind_degrees, wind_degrees, "°");
  updateWithIncrement(0, response.sunrise, sunrise, "", 1, 500); // Use a longer delay for timestamps
  updateWithIncrement(0, response.sunset, sunset, "", 1, 500); // Use a longer delay for timestamps
}

// Function to update the air quality data on the page with increment
function updateAirQualityData(response) {
  const coConcentration = document.getElementById("co_concentration");
  const coAqi = document.getElementById("co_aqi");
  const no2Concentration = document.getElementById("no2_concentration");
  const no2Aqi = document.getElementById("no2_aqi");
  const o3Concentration = document.getElementById("o3_concentration");
  const o3Aqi = document.getElementById("o3_aqi");
  const so2Concentration = document.getElementById("so2_concentration");
  const so2Aqi = document.getElementById("so2_aqi");
  const pm25Concentration = document.getElementById("pm25_concentration");
  const pm10Concentration = document.getElementById("pm10_concentration");

  // Function to update the elements with increment
  function updateWithIncrement(
    initialValue,
    finalValue,
    element,
    unit,
    duration = 2500
  ) {
    const totalSteps = 50; // Adjust this number to set the number of steps for incrementation
    const stepValue = (finalValue - initialValue) / totalSteps;
    const stepDuration = duration / totalSteps;

    function updateStep(currentStep) {
      const valueToShow = initialValue + stepValue * currentStep;
      element.innerHTML = valueToShow.toFixed(2) + unit;

      if (currentStep < totalSteps) {
        setTimeout(() => {
          updateStep(currentStep + 1);
        }, stepDuration);
      }
    }

    updateStep(0);
  }

  // Slowly update the air quality data with increment
  updateWithIncrement(0, response.CO.concentration, coConcentration, " ppm");
  updateWithIncrement(0, response.CO.aqi, coAqi, "");
  updateWithIncrement(0, response.NO2.concentration, no2Concentration, " ppm");
  updateWithIncrement(0, response.NO2.aqi, no2Aqi, "");
  updateWithIncrement(0, response.O3.concentration, o3Concentration, " ppm");
  updateWithIncrement(0, response.O3.aqi, o3Aqi, "");
  updateWithIncrement(0, response.SO2.concentration, so2Concentration, " ppm");
  updateWithIncrement(0, response.SO2.aqi, so2Aqi, "");
  updateWithIncrement(
    0,
    response["PM2.5"].concentration,
    pm25Concentration,
    " ppm"
  );
  updateWithIncrement(
    0,
    response.PM10.concentration,
    pm10Concentration,
    " ppm"
  );
}

// Function to handle error
function showError() {
  const city = inputSearch.value.trim();
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.innerHTML =
    "😖 😖 Error Occurred, while Fetching Weather Data !";

  // Show the modal
  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
  setTimeout(function () {
    window.location.reload();
  }, 3000);
}

// Function to smoothly scroll to the top of the page with a slower scroll speed
function scrollToTop() {
  const scrollStep = -window.scrollY / 50; // Change this number to adjust the scroll speed

  const scrollInterval = setInterval(() => {
    if (window.scrollY !== 0) {
      window.scrollBy(0, scrollStep);

      // If we reach the top or bottom of the page, stop scrolling
      if (window.scrollY <= 0) clearInterval(scrollInterval);
    } else {
      clearInterval(scrollInterval);
    }
  }, 15); // Adjust this number to set the interval for smoothness
}

// Attach the click event listener to the "goUp" button
goUpButton.addEventListener("click", scrollToTop);
