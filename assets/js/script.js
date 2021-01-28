var submitBtn = document.querySelector('.btn-submit');
var cityInput = document.querySelector('input');
var cityName = cityInput.value;
var pastCityNames= [];
var pastCityColumnEl = document.querySelector(".past-city");
var cityButton = document.querySelector('.btn-city');

function addPastCity(){
    for(var i = 0; i < pastCityNames.length; i++){
        var pastCityEl = document.createElement("button");
        var lineBreak = document.createElement("br");
        pastCityEl.setAttribute("class", "btn btn-outline-primary btn-city");
        pastCityEl.textContent = pastCityNames[i];
        pastCityColumnEl.append(pastCityEl);
        pastCityColumnEl.append(lineBreak);
    }
    storeCities();
}

function storeCities(){
    localStorage.setItem("storedCityNames", JSON.stringify(pastCityNames));
}

function init(){
    var storedCities = JSON.parse(localStorage.getItem("storedCityNames"));
    if (storedCities != null){
        pastCityNames = storedCities;
        pastCityColumnEl.innerHTML= "";
        addPastCity();
    }
}

submitBtn.addEventListener("click", function(){
    cityName = cityInput.value;
    pastCityColumnEl.innerHTML= "";
    pastCityNames.push(cityName);
    console.log("inputed city is", cityName)
    console.log(pastCityNames);
    addPastCity();
});

init();