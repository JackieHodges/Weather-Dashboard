var submitBtn = document.querySelector('.btn-submit');
var cityInput = document.querySelector('input');
var cityName = cityInput.value;
var pastCityNames= [];
var pastCityColumnEl = document.querySelector(".past-city");


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

function getWeather(cityName){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=9c005e62d72b836ee4b52b06d168a428";
    
    fetch(apiUrl).then(function(response) {
        if (response.ok){
            response.json().then(function (data){
                console.log(data);
            })
        }
    })
}

// listener on submit button 
submitBtn.addEventListener("click", function(){
    cityName = cityInput.value;
    pastCityColumnEl.innerHTML= "";
    pastCityNames.push(cityName);
    console.log("inputed city is", cityName)
    console.log(pastCityNames);
    addPastCity();
    getWeather(cityName);
});


init();