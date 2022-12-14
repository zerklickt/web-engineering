function performSearch(){
    var city_name = document.getElementById('city-query').value;
    document.getElementById('popup-headline').innerHTML = "Wetter in " + city_name;
    document.getElementById('popup-forecasts').innerHTML = "";
    showPopup();
    fetchData(encodeURIComponent(city_name));
}

function showPopup(){
    document.getElementById('popup').style.display = 'flex';
}

function closePopup(){
    document.getElementById('popup').style.display = 'none';
    document.getElementById('loader').style.display = 'inline-block';
    document.getElementById('popup-current-data').style.display = 'none';
    document.getElementById('popup-forecasts').style.display = 'none';
    document.getElementById('loader').innerHTML = "Loading...";
}

async function fetchData(city){
    // retrieve coordinates of city in order to perform data requests
    let query_coords = await performHTTPRequest(urlViaApiProxy("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&service=weather"));
    //window.debugURL = "http://localhost:6001/api-proxy/?http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&service=weather";
    let success = await checkResponse(query_coords);
    if(!success)
        return;
    let json_coords_obj = JSON.parse(query_coords);
    let lat = json_coords_obj[0].lat;
    let lon = json_coords_obj[0].lon;

    // query current weather
    let weather_result = await performHTTPRequest(urlViaApiProxy("https://api.openweathermap.org/data/2.5/weather?lang=de&units=metric&lat=" + lat + "&lon=" + lon));
    if(!checkResponse(weather_result))
        return;
    await displayCurrentWeather(weather_result);
    
    // query forecast for next five days
    let forecast_result = await performHTTPRequest(urlViaApiProxy("https://api.openweathermap.org/data/2.5/forecast?lang=de&units=metric&lat=" + lat + "&lon=" + lon));
    if(!checkResponse(forecast_result))
        return;
    await displayForecast(forecast_result);
    finalizeLoading();
}

//checks if query was successful
async function checkResponse(raw_text){
    try {
        let json_obj = JSON.parse(raw_text);
        window.debugObj = json_obj;
        if(json_obj.error != null && json_obj.error.code == "ENOTFOUND"){
            document.getElementById('loader').innerHTML = "Fehler bei der Abfrage!<br>Besteht eine Internetverbindung?";
            return false;
        }
        if(Array.isArray(json_obj) && json_obj.length == 0){
            document.getElementById('loader').innerHTML = "Fehler bei der Abfrage!<br>Die gesuchte Stadt konnte vermutlich nicht gefunden werden!";
            return false;
        }
        if(json_obj.cod != 200){
            if(json_obj[0] != null)
                return true;
            document.getElementById('loader').innerHTML = "Fehler bei der Abfrage!";
            return false;
        }
        return true;
    } catch(e){
        document.getElementById('loader').innerHTML = "Fehler bei der Abfrage!";
        return false;
    }
    
}

// updates UI from loading screen to display data
async function finalizeLoading(){
    document.getElementById('loader').style.display = 'none';
    document.getElementById('popup-current-data').style.display = 'grid';
    document.getElementById('popup-forecasts').style.display = 'flex';
}

// loads current weather into top section of popup
async function displayCurrentWeather(raw_text){
    window.debug_queryCurrent = raw_text;
    let json_obj = JSON.parse(raw_text);
    document.getElementById('data-temp').innerHTML = Math.round(json_obj.main.temp) + "??C/";
    document.getElementById('data-weather').innerHTML = json_obj.weather[0].description;
    document.getElementById('data-minmax-temp').innerHTML = '<span class="span-data"><img src="/images/svg/weather_icons/day-sunny.svg" width="15px" height="15px"></span>Min. ' + Math.round(json_obj.main.temp_min) + '??C / Max. ' + Math.round(json_obj.main.temp_max)  + '??C';
    document.getElementById('data-downfall').innerHTML = '<span class="span-data"><img src="/images/svg/weather_icons/rain-drop.svg" width="15px" height="15px"></span>' + Math.round(json_obj.main.temp_min) + '%';
    

    //Set dark sytle based on the time in the place the user searched for
    let time = new Date();
    time.setTime((json_obj.dt + json_obj.timezone - time.getTimezoneOffset()*60) * 1000);
    window.debug_time = time;
    if(time.getHours() > 20 || time.getHours() < 6){
        document.getElementById('weather-container').style.backgroundImage = 'linear-gradient(110deg, #2f3942, #0f1315)';
        document.getElementById('weather-icon').src = findIconURL(json_obj.weather[0].id, false);
    } else {
        document.getElementById('weather-icon').src = findIconURL(json_obj.weather[0].id, true);
        document.getElementById('weather-container').style.backgroundImage = 'linear-gradient(110deg, #cde7fd, #0289ff)';
    }

    
}

// loads five day forecast in lower section of popup
// weather data being displayed is between 11 am and 1 pm
async function displayForecast(raw_text){
    window.debug_queryForecast = raw_text;
    let json_obj = JSON.parse(raw_text);
    for(var i = 0; i < json_obj.list.length; i++){
        let time = new Date();
        time.setTime(json_obj.list[i].dt * 1000);
        if(!(time.getHours() >= 11 && time.getHours() <= 13))
            continue;

        let t = document.createElement('div');
        t.classList.add('forecast-item');
        
        let span = document.createElement('span');
        span.innerHTML = time.toLocaleDateString('de-DE', { month: 'numeric', day: 'numeric' });
        t.appendChild(span);

        let img = document.createElement('img');
        img.classList.add('weather-icon-small');
        img.src = findIconURL(json_obj.list[i].weather[0].id, true);
        t.appendChild(img);

        let temp = document.createElement('p');
        temp.classList.add('p-forecast');
        let span_temp = document.createElement('span');
        span_temp.classList.add('span-data');
        span_temp.innerHTML = '<img src="/images/svg/weather_icons/day-sunny.svg" width="15px" height="15px">';
        temp.appendChild(span_temp);
        temp.innerHTML += Math.round(json_obj.list[i].main.temp_min) + "??C / " + Math.round(json_obj.list[i].main.temp_max) + "??C";
        t.appendChild(temp);

        let pop = document.createElement('p');
        pop.classList.add('p-forecast');
        let span_pop = document.createElement('span');
        span_pop.classList.add('span-data');
        span_pop.innerHTML = '<img src="/images/svg/weather_icons/rain-drop.svg" width="15px" height="15px">';
        pop.appendChild(span_pop);
        pop.innerHTML += Math.round(json_obj.list[i].pop * 100) + "%";
        t.appendChild(pop);

        document.getElementById('popup-forecasts').appendChild(t);
    }
}

//finds the right weather icon to display, based on the weather code returned from the API
function findIconURL(code, isDay){
    let path = "/images/svg/weather_icons/";
    if(isDay){
        // Switch case from stackoverflow.com
        switch(true){
            case (code >= 200 && code <= 232):
                return path + "day-cloud-lightning.svg";
            case (code >= 500 && code <= 531):
                return path + "day-cloud-rain.svg";
            case (code >= 600 && code <= 622):
                return path + "day-cloud-snow.svg";
            case (code >= 801 && code <= 804):
                return path + "cloudy.svg";
            case (code = 800):
                return path + "day-sunny.svg";
            default:
                return path + "day-sunny.svg";
        }
    } else {
        // Switch case from stackoverflow.com
        switch(true){
            case (code >= 200 && code <= 232):
                return path + "night-cloud-lightning.svg";
            case (code >= 500 && code <= 531):
                return path + "night-cloud-rain.svg";
            case (code >= 600 && code <= 622):
                return path + "night-cloud-snow.svg";
            case (code >= 801 && code <= 804):
                return path + "cloudy.svg";
            case (code = 800):
                return path + "moon-line.svg";
            default:
                return path + "moon-line.svg";
        }
    }
}