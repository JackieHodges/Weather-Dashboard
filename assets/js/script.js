var submitBtn = document.querySelector('.btn-submit');
var cityInput = document.querySelector('input');
var cityName;
var pastCityNames= [];
var pastCityColumnEl = document.querySelector(".past-city");
var currentWeatherEl = document.querySelector(".current-weather");
var fiveDayEl = document.querySelector(".five-day-weather");


function addPastCity(){
    // previous searches button creation
    for(var i = 0; i < pastCityNames.length; i++){
        var pastCityEl = document.createElement("button");
        var lineBreak = document.createElement("br");
        pastCityEl.setAttribute("class", "btn btn-outline-primary btn-city");
        pastCityEl.textContent = pastCityNames[i];
        pastCityColumnEl.append(pastCityEl);
        pastCityColumnEl.append(lineBreak);
    }
    storeCities();

    // add event listener to each city button that was created
    var cityBtn = document.querySelectorAll('.btn-city');
    cityBtn.forEach(function(cityBtn){
        cityBtn.addEventListener("click", function(){
            var clickedCity = this.textContent;
            console.log(clickedCity);
            // clears previous city weather listed
            currentWeatherEl.innerHTML= "";
            getLatLongs(clickedCity);
        })
    })
}

// store cities that have been entered
function storeCities(){
    localStorage.setItem("storedCityNames", JSON.stringify(pastCityNames));
}

// run this every time the page is restored
function init(){
    var storedCities = JSON.parse(localStorage.getItem("storedCityNames"));
    if (storedCities != null){
        pastCityNames = storedCities;
        pastCityColumnEl.innerHTML= "";
        addPastCity();
    }
}

function getLatLongs(city){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=9c005e62d72b836ee4b52b06d168a428&units=imperial";

    fetch(apiUrl).then(function(response) {
        if (response.ok){
            response.json().then(function (data){
                console.log("current weather", data);
                console.log("lat", data.coord.lat);
                console.log("long", data.coord.lon);
                cityName = city;
                getCurrentWeather(data.coord.lat, data.coord.lon);
                getFiveDayWeather(data.coord.lat, data.coord.lon);
            })
        } else{
            fiveDayEl.innerHTML = "";
            alert("Error: City cannot be read.", response.statusText);
            return;
        }
    })
}

function getCurrentWeather(lat, long){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly,daily,alerts&appid=9c005e62d72b836ee4b52b06d168a428&units=imperial";
    
    fetch(apiUrl).then(function(response) {
        if (response.ok){
            response.json().then(function (data){
                console.log("current weather", data);
                currentWeatherEl.innerHTML = "";
                currentWeather(data);
            })
        } else{
            alert("Error: ", response.statusText);
        }
    })

}

function currentWeather(data){
    var cityCurrentWeather = {
        cityName: cityName,
        // currentIcon: data.weather[0],
        currentTemp: data.current.temp,
        currentHumidity: data.current.humidity,
        currentWindSpeed: data.current.wind_speed,
        currentUvIndex: data.current.uvi
    }

    var cityNameEl = document.createElement("h1");
    var iconEl = document.createElement("i");
    // iconEl.setAttribute("class", cityCurrentWeather.currentIcon);
    cityNameEl.textContent = cityName;
    currentWeatherEl.append(cityNameEl);
    // currentWeatherEl.append(iconEl);

    var temperatureEl = document.createElement("p");
    temperatureEl.textContent = "Temperature: " + cityCurrentWeather.currentTemp + " ℉";
    currentWeatherEl.append(temperatureEl);

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + cityCurrentWeather.currentHumidity + "%";
    currentWeatherEl.append(humidityEl);

    var windSpeedEl = document.createElement("p");
    windSpeedEl.textContent = "Wind Speed: " + cityCurrentWeather.currentWindSpeed + " MPH";
    currentWeatherEl.append(windSpeedEl);

    var uvIndexEl = document.createElement("p");
    uvIndexEl.textContent = "UV Index: " + cityCurrentWeather.currentUvIndex;
    currentWeatherEl.append(uvIndexEl);

}

function getFiveDayWeather(lat, long){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=current,minutely,hourly,alerts&appid=9c005e62d72b836ee4b52b06d168a428&units=imperial";
    fetch(apiUrl).then(function(response) {
        if (response.ok){
            response.json().then(function (data){
                console.log("5 day weather", data);
                fiveDayEl.innerHTML = "";
                fiveDayWeather(data);
            })
        } else{
            alert("Error: ", response.statusText);
        }
    })
}

function fiveDayWeather(data){
    for (var i = 0; i < 5; i++){
        var dailyDateEl = document.createElement("div");
        dailyDateEl.setAttribute("class", "col card");
        dailyDateEl.textContent = data.daily[i].dt;
        fiveDayEl.append(dailyDateEl);

        // var iconEl = document.createElement("i");
        // iconEl.setAttribute("id", data.daily[i].weather[0].id);
        // iconEl.textContent = test;
        // dailyDateEl.append(iconEl);

        var temperatureEl = document.createElement("p");
        temperatureEl.textContent = "Temp: " + data.daily[i].temp.day + " ℉";
        dailyDateEl.append(temperatureEl);

        var humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";
        dailyDateEl.append(humidityEl);

    }
}

// listener on submit button 
submitBtn.addEventListener("click", function(){

    cityName = cityInput.value;

    if (cityName != ""){
        // clears previous searches list
        pastCityColumnEl.innerHTML= "";
        // clears previous city weather listed
        currentWeatherEl.innerHTML= "";

        pastCityNames.push(cityName);
        console.log("inputed city is", cityName)
        console.log(pastCityNames);
        addPastCity();
        getLatLongs(cityName);;
    } else{
        alert("Please enter a city name");
    }
});


init();