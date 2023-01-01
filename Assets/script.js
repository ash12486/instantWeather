//assign a var to the search button
var searchBtn = document.querySelector(".searchBtn");
var cityInput = document.querySelector(".city");
var currentWeatherEl = document.querySelector("#current");
var forecastEl = document.querySelector("#forecast");
//assign a var to the api key
var apiKey = "f12388b4d44a60e741acaf49aca0988d";
var lat;
var lon;
var searchedCities = document.querySelector(".searchedCities");

//display current date
var today = dayjs().format("M/D/YYYY");
$("#todays-date").text(today);

//fetch current weather
function getCurrentWeather() {
  var history;
  if (localStorage.getItem("History")) {
    history = JSON.parse(localStorage.getItem("History"));
  } else {
    history = [];
  }
  history.push(cityInput.value);
  localStorage.setItem("History", JSON.stringify(history));
  let histBtn = document.createElement("button");
  histBtn.innerHTML = cityInput.value;
  histBtn.addEventListener("click", function () {
    cityInput.value = this.innerHTML;
    getCurrentWeather();
  });
  searchedCities.appendChild(histBtn);
  currentWeatherEl.innerHTML = "";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey}&units=imperial`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      let titleDiv = document.createElement("div");
      titleDiv.innerHTML = data.name + " (" + today + ")";

      let titleIcon = document.createElement("img");
      titleIcon.src =
        "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";

      let tempDiv = document.createElement("div");
      tempDiv.innerHTML = "Temperature : " + data.main.temp + "°";

      let windDiv = document.createElement("div");
      windDiv.innerHTML = "Wind Speed : " + data.wind.speed + "mph";

      let humidDiv = document.createElement("div");
      humidDiv.innerHTML = "Humidity : " + data.main.humidity + "%";

      currentWeatherEl.append(titleDiv, titleIcon, tempDiv, windDiv, humidDiv);

      forecastData();
    });
}

function forecastData() {
  let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput.value}&appid=${apiKey}&units=imperial`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let forecastList = data.list;
      let parentDiv = document.createElement("div");

      parentDiv.style.display = "flex";
      parentDiv.style.border = "1px solid black";
      for (let i = 0; i < forecastList.length; i = i + 8) {
        let forecastDiv = document.createElement("div");
        forecastDiv.style.border = "1px solid black";

        let titleDate = new Date(forecastList[i].dt * 1000);

        let titleIcon = document.createElement("img");
        titleIcon.src =
          "http://openweathermap.org/img/wn/" +
          forecastList[i].weather[0].icon +
          "@2x.png";

        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = "Temp : " + forecastList[i].main.temp + "°";

        let windDiv = document.createElement("div");
        windDiv.innerHTML =
          "Wind Speed : " + forecastList[i].wind.speed + "mph";

        let humidDiv = document.createElement("div");
        humidDiv.innerHTML =
          "Humidity : " + forecastList[i].main.humidity + "%";

        forecastDiv.append(titleDate, titleIcon, tempDiv, windDiv, humidDiv);
        parentDiv.append(forecastDiv);
        console.log(titleDate);
      }
      forecastEl.innerHTML = "";
      forecastEl.append(parentDiv);
    });
}

searchBtn.addEventListener("click", getCurrentWeather);
