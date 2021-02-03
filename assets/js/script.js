var submitBtn = document.querySelector('.btn-submit');
var cityInput = document.querySelector('input');
var cityName;
var todaysDate;
var formattedDate;
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

        // loads last city searched and displays when page is reloaded
        var lastCityEntered = storedCities[storedCities.length-1];
        getLatLongs(lastCityEntered);
    }
}

// using the city name, this function outputs a lat and long that will be used to get weather data
function getLatLongs(city){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=9c005e62d72b836ee4b52b06d168a428&units=imperial";

    fetch(apiUrl).then(function(response) {
        if (response.ok){
            response.json().then(function (data){
                console.log("current weather", data);
                console.log("lat", data.coord.lat);
                console.log("long", data.coord.lon);
                cityName = city;
                todaysDate = data.dt;
                // using the fetched data, get current and 5-day weather using lat and longs as inputted parameters
                getCurrentWeather(data.coord.lat, data.coord.lon);
                getFiveDayWeather(data.coord.lat, data.coord.lon);
            })
        } else{
            fiveDayEl.innerHTML = "";
            alert("Error: " + response.status);
            return;
        }
    })
}

// using the lat and longs, current weather info can be fetched
function getCurrentWeather(lat, long){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly,daily,alerts&appid=9c005e62d72b836ee4b52b06d168a428&units=imperial";
    
    fetch(apiUrl).then(function(response) {
        if (response.ok){
            response.json().then(function (data){
                currentWeatherEl.innerHTML = "";
                currentWeather(data);
            })
        } else{
            alert("Error: " + response.status);
        }
    })

}

// the current weather is displayed
function currentWeather(data){
    var cityCurrentWeather = {
        cityName: cityName,
        currentIcon: data.current.weather[0],
        currentTemp: data.current.temp,
        currentHumidity: data.current.humidity,
        currentWindSpeed: data.current.wind_speed,
        currentUvIndex: data.current.uvi
    }

    currentWeatherEl.setAttribute("class", "col");

    var cityNameEl = document.createElement("h1");
    cityNameEl.textContent = cityName;
    currentWeatherEl.append(cityNameEl);

    var todaysDateEl = document.createElement("h1");
    formatDate(todaysDate);
    todaysDateEl.textContent = formattedDate;
    currentWeatherEl.append(todaysDateEl);

    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + cityCurrentWeather.currentIcon.icon + "@2x.png");
    currentWeatherEl.append(iconEl);

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
    uvIndexEl.setAttribute("class", "col-2");
    uvIndexEl.textContent = "UV Index: " + cityCurrentWeather.currentUvIndex;
    colorUV(uvIndexEl, cityCurrentWeather.currentUvIndex);
    currentWeatherEl.append(uvIndexEl);

}

// the fetched date is in UNIX, and this function formats it into a usable date
function formatDate(date){
    var miliseconds = (date * 1000);
    var dateObject = new Date(miliseconds);
    var humanDateFormat = dateObject.toLocaleString();
    var formatMonth = dateObject.getMonth() + 1;
    var formatDay = dateObject.getDate();
    var formatYear = dateObject.getFullYear();
    formattedDate = formatMonth + "/" + formatDay + "/" + formatYear;
}

// this colors the UV Element based on its value
function colorUV(element, value){
    if (value < 5){
        element.setAttribute("style", "background-color:yellow");
    } else if (value < 7) {
        element.setAttribute("style", "background-color:orange");
    } else if (value < 10){
        element.setAttribute("style", "background-color:red");
    } else {
        element.setAttribute("style", "background-color:purple");
    }
}

// using the lat and longs, 5 day weather info can be fetched
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
            alert("Error: " + response.status);
        }
    })
}

// 5 day weather is displayed
function fiveDayWeather(data){
    for (var i = 1; i < 6; i++){
        var dailyDateEl = document.createElement("div");
        dailyDateEl.setAttribute("class", "col card");
        formatDate(data.daily[i].dt);
        dailyDateEl.textContent = formattedDate;
        fiveDayEl.append(dailyDateEl);

        var iconEl = document.createElement("img");
        iconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
        dailyDateEl.append(iconEl);

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

// runs init function every time the page is reloaded
init();