/* TODO: Convert to vanilla js */
/* TODO: Fetch data from openweather api */
/* TODO: Inject weather info into appropriate elements */

/* Variables */
// DOM Elements
let mobileNavigation = document.querySelector(".mobile-navigation");
let menu = document.querySelector(".main-navigation .menu");
let menuToggle = document.querySelector(".menu-toggle");
let findLocation = document.querySelector(".find-location");
let locationInput =  document.querySelector(".location-input");
let map = document.querySelector(".map");
// Global Variables
let APIKey = "1464344ec7e8bcead0de0c3ecd76093b";
let city = "Nairobi";

/* Functions */
// Function to clone menu functionality into mobile displays
function createMenus() {
	mobileNavigation.appendChild(menu.cloneNode(true));
	menuToggle.addEventListener("click", () => {
		$(".mobile-navigation").slideToggle();
	})
}

// Function to set city from input form
function setCity(e) {
	e.preventDefault();
	city = locationInput.value;
	document.querySelector(".location").innerText = city;
	getWeather();
}

// Function to city's longitude and latitude
async function getGeoData() {
	/* fetch(`https://api.openweathermap.org/data/2.5/onecall?q=${city}&appid=1464344ec7e8bcead0de0c3ecd76093b`) */
	/* fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1464344ec7e8bcead0de0c3ecd76093b`) */
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
async function getWeather() {
	try {
		let pos = await getGeoData();
		const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${pos.lat}&lon=${pos.lon}&exclude=hourly&appid=${APIKey}`);
		const data = response.json();
		console.log(data);
	} catch(err) {
		console.log(err);
	}
}

// Calls all functions to be rendered when site loaded
function startUp() {
	createMenus();
	getWeather();
	document.querySelector(".location").innerText = city;
}

/* Events */
document.addEventListener("DOMContentLoaded", startUp);
findLocation.addEventListener("submit", setCity);
