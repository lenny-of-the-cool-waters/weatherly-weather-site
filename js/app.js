// DOM Elements
let mobileNavigation = document.querySelector(".mobile-navigation");
let menu = document.querySelector(".main-navigation .menu");
let menuToggle = document.querySelector(".menu-toggle");
let findLocation = document.querySelector(".find-location");
let locationInput =  document.querySelector(".location-input");
let dayFields = document.querySelectorAll(".day");
let forecastContents = document.querySelectorAll(".forecast-content");
let map = document.querySelector(".map");
// Global Variables
let APIKey = "1464344ec7e8bcead0de0c3ecd76093b";
let city = "Nairobi";
const currentDate = new Date();

/* Classes */
// Class for UI manipulation
class UI {
    // Function to clone menu functionality into mobile displays
    static createMenus() {
        mobileNavigation.appendChild(menu.cloneNode(true));
        menuToggle.addEventListener("click", () => {
            $(".mobile-navigation").slideToggle();
        })
    }

	static async updateWeather() {
		let weatherData = await Weather.getWeather();
		let forecasts = Array.from(forecastContents);
		forecasts.forEach(item => {
			let temp = Math.round(weatherData[forecasts.indexOf(item)].temp.day);
			item.querySelector(".degree").innerHTML = `${temp}<sup>o</sup>C`;	
			console.log("done");	
		})
	}

    // Calls all functions to be rendered when site loaded
    static updateUI() {
        UI.createMenus();
		UI.updateWeather();
        Initialize.setDate();
        /* Weather.getWeather(); */
        document.querySelector(".location").innerText = city;
    }
}

// Class to initialize all information on the site
class Initialize {
    // Function to set date fields
    static setDate() {
        let dayFieldsArray = Array.from(dayFields);
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        dayFieldsArray.forEach(item => item.innerText = days[(currentDate.getDay()+dayFieldsArray.indexOf(item))%7]);
        document.querySelector(".date-0").innerText = `${currentDate.getDate()} ${months[currentDate.getMonth()]}`;	
    }
}

class FormHandler {
    // Function to set city from input form
    static setCity(e) {
        e.preventDefault();
        city = locationInput.value;
        document.querySelector(".location").innerText = city;
        UI.updateWeather();
    }
}

// Class to deal with openweather API
class Weather {
    // Function to city's longitude and latitude
    static async getGeoData() {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`);
            const data = await response.json();
            console.log(data.coord)
            return (data.coord);
        } catch(err) {
            alert(err);
        }
    }

    // Function to fetch weather data
    static async getWeather() {
        try {
            let pos = await Weather.getGeoData();
            const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${pos.lat}&lon=${pos.lon}&exclude=hourly,minutely,alerts&units=metric&appid=${APIKey}`);
            const data = await response.json();
            console.log(data.daily);
			let result = data.daily.slice(0,8)
			return result;
        } catch(err) {
            console.log(err);
        }
    }
}



/* Events */
document.addEventListener("DOMContentLoaded", UI.updateUI);
findLocation.addEventListener("submit", FormHandler.setCity);