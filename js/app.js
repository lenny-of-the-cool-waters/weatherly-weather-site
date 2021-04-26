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

    // Function to update temperature
	static async updateTemp() {       
		let weatherData = await Weather.getWeather();
        document.querySelector(".wind-dir").innerHTML = `${weatherData[0].wind_deg} <sup>o</sup>`;
        document.querySelector(".wind-speed").innerText = `${weatherData[0].wind_speed} km/h`;
		let forecasts = Array.from(forecastContents);
		forecasts.forEach(item => {
			let temp = Math.round(weatherData[forecasts.indexOf(item)].temp.day);
			item.querySelector(".degree-num").innerText = `${temp}`;		
		})
	}

    // Function to update probability of precipitation
    static async updatePrecip() {
        let weatherData = await Weather.getWeather();
        let precip = Array.from(document.querySelectorAll(".precip"));
        precip.forEach(item => {
            let prob = ((weatherData[precip.indexOf(item)].pop) * 100).toFixed(1);
            item.innerText = `${prob}%`
        })
    }

    // Function to update icons
    static async updateIcons() {
        let weatherData = await Weather.getWeather();
        let icons = Array.from(document.querySelectorAll(".forecast-icon"));
        icons.forEach(icon => {
            let desc = weatherData[icons.indexOf(icon)].weather[0].id;
            switch(desc) {
                case 800:                    
                    icon.innerHTML = `<img src="images/icons/icon-2.svg" alt="Clear Sky" height=50>`;
                    break;
                case 801:                    
                    icon.innerHTML = `<img src="images/icons/icon-3.svg" alt="Few Clouds" height=50>`;
                    break;
                case 802:
                    icon.innerHTML = `<img src="images/icons/icon-5.svg" alt="Scattered Clouds Sky" height=50>`;
                    break;
                case 803:                    
                    icon.innerHTML = `<img src="images/icons/icon-6.svg" alt="broken clouds" height=50>`;
                    break;
                case 500: case 501: case 502: case 503: case 504:                     
                    icon.innerHTML = `<img src="images/icons/icon-9.svg" alt="shower rain" height=50>`;
                    break;
                case 520: case 521:case 522: case 531:                    
                    icon.innerHTML = `<img src="images/icons/icon-10.svg" alt="rain" height=50>`;
                    break;
                case 200: case 201: case 202: case 210: case 211: case 212: case 221:
                case 230: case 231: case 232:
                    icon.innerHTML = `<img src="images/icons/icon-12.svg" alt="thunderstorm" height=50>`;
                    break;
                case 600: case 601: case 602: case 611: case 612: case 613: case 615:
                case 616: case 620: case 621: case 622: case 511:                   
                    icon.innerHTML = `<img src="images/icons/icon-13.svg" alt="snow" height=50>`;
                    break;
                default:                    
                    icon.innerHTML = `<img src="images/icons/icon-3.svg" alt="mist" height=50>`;
                    break;
            }
        })
    }

    // Calls all functions to be rendered when site loaded
    static updateUI() {
		UI.updateTemp();
        UI.updatePrecip();
        UI.updateIcons();
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
        UI.updateUI();
    }
}

// Class to deal with openweather API
class Weather {
    // Function to city's longitude and latitude
    static async getGeoData() {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`);
            const data = await response.json();
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
			let result = data.daily.slice(0,8)
			return result;
        } catch(err) {
            console.log(err);
        }
    }
}



/* Events */
document.addEventListener("DOMContentLoaded", () => {
    UI.updateUI();
    UI.createMenus();
});
findLocation.addEventListener("submit", FormHandler.setCity);