document.addEventListener("DOMContentLoaded", function () {
    var LocationHeading = document.getElementsByClassName("LocationHeading")[0];
    // var WeatherInfo = document.getElementsByClassName("WeatherInfo")[0];  // For displaying weather details
    var Temperature=document.getElementById("Temperature");
    var Weather=document.getElementById("Weather");
    var Humidity=document.getElementById("Humidity");
    var Emoji=document.getElementById("Emoji");
    var WindSpeed=document.getElementById("WindSpeed");

    var latitude, longitude;
    getLocation();
    // Get weather by user's current location
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            LocationHeading.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosition(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        fetchWeatherDataByCoords(latitude, longitude);
    }

    // get emoji
    function getEmoji(weatherDescription)
    {
        if (weatherDescription == 'Thunderstorm') {
            emoji = String.fromCodePoint(0x26C8); // ⛈️
        } else if (weatherDescription == 'Drizzle') {
            emoji = String.fromCodePoint(0x1F326); // 🌦️
        } else if (weatherDescription == 'Rain') {
            emoji = String.fromCodePoint(0x1F327); // 🌧️
        } else if (weatherDescription == 'Snow') {
            emoji = String.fromCodePoint(0x1F328); // 🌨️
        } else if (weatherDescription == 'Atmosphere') {
            emoji = String.fromCodePoint(0x1F32B); // 🌫️
        } else if (weatherDescription == 'Clear') {
            emoji = String.fromCodePoint(0x2600); // ☀️
        } else if (weatherDescription == 'Clouds') {
            emoji = String.fromCodePoint(0x2601); // ☁️
        } else if (weatherDescription == 'Haze') {
            emoji = String.fromCodePoint(0x26C5); // ⛅
        }
        return emoji;
    }
    // Get weather data by city name
    function getWeatherByCity() {
        var city = document.getElementById("cityInput").value;
        if (city) {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f696c750e08773ac31456d68f41d67a0`)
                .then(response => response.json())
                .then(data => {
                    var weatherDescription = data.weather[0].main;
                    
                    var emoji=getEmoji(weatherDescription);

                    console.log(emoji);
                    var result = {
                        temp: Math.round(data.main.temp - 273.15),  // Convert from Kelvin to Celsius
                        humidity: data.main.humidity,
                        windSpeed: data.wind.speed,
                        weatherDescription: data.weather[0].description,
                        emoji: emoji
                    };
                    displayResult(result, data.name);

                })
                .catch(error => {
                    WeatherInfo.innerText = "Unable to retrieve weather information for the specified city.";
                    console.error("Error fetching weather data:", error);
                });
        } else {
            WeatherInfo.innerText = "Please enter a city name.";
        }
    }

    // Fetch weather data by coordinates
    function fetchWeatherDataByCoords(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f696c750e08773ac31456d68f41d67a0`)
            .then(response => response.json())
            .then(data => {

                var weatherDescription = data.weather[0].main;
                var emoji=getEmoji(weatherDescription);

                console.log(weatherDescription)
                    console.log(emoji);
                var result = {
                    temp: Math.round(data.main.temp - 273.15),  // Convert from Kelvin to Celsius
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    weatherDescription: data.weather[0].description,
                    emoji: emoji
                };
                displayResult(result, data.name);
            })
            .catch(error => {
                WeatherInfo.innerText = "Unable to retrieve weather information.";
                console.error("Error fetching weather data:", error);
            });
    }

    function displayResult(result, locationName) {

        LocationHeading.innerText = `Result for ${locationName}:`;
        Emoji.innerText=result.emoji;
        Temperature.innerText = result.temp + "°C";
        Weather.innerText="Weather: "+result.weatherDescription;
        Humidity.innerText="Humidity: "+ result.humidity + "%";
        WindSpeed.innerText="Wind Speed: "+ result.windSpeed + " km/h";
        // WeatherInfo.innerText = `Temperature: ${result.temp}°C, Humidity: ${result.humidity}%, Wind Speed: ${result.windSpeed} m/s, Weather: ${result.weatherDescription} ${result.emoji}`;
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                LocationHeading.innerText = "User denied the request for Geolocation.";
                break;
            case error.POSITION_UNAVAILABLE:
                LocationHeading.innerText = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                LocationHeading.innerText = "The request to get user location timed out.";
                break;
            case error.UNKNOWN_ERROR:
                LocationHeading.innerText = "An unknown error occurred.";
                break;
        }
    }

    // window.getLocation = getLocation;
    window.getWeatherByCity = getWeatherByCity;
});