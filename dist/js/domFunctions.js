// JavaScript media Query apply after reload of the page because of that Changes happen when function call.
export const setPlaceholderText = () => {
  const input = document.getElementById("searchBar__text");
  window.innerWidth < 400
    ? (input.placeholder = "City, State, Country")
    : (input.placeholder = "City, State, Country or Zip Code");
};

export const addspinner = (element) => {
  animateButton(element);
  setTimeout(animateButton, 1000, element);
};

const animateButton = (element) => {
  element.classList.toggle("none");
  element.nextElementSibling.classList.toggle("block");
  element.nextElementSibling.classList.toggle("none");
};

export const displayError = (headerMsg, srMsg) => {
  updateWeatherLocationHeader(headerMsg);
  updateScreenReaderConfirmation(srMsg);
};

export const displayApiError = (statusCode) => {
  const properMsg = toProperCase(statusCode.message);
  updateWeatherLocationHeader(properMsg);
  updateScreenReaderConfirmation(`${properMsg}. Please try again.`);
};

const toProperCase = (text) => {
  const words = text.split(" ");
  const properWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return properWords.join(" ");
};

const updateWeatherLocationHeader = (message) => {
  const h1 = document.getElementById("currentForecast__location");
  if (message.indexOf("Lat:") !== -1 && message.indexOf("Long:") !== -1) {
    const msgArray = message.split(" ");
    const mapArray = msgArray.map((msg) => {
      return msg.replace(":", ": ");
    });
    const lat =
      mapArray[0].indexOf("-") === -1
        ? mapArray[0].slice(0, 10)
        : mapArray[0].slice(0, 11);
    const lon =
      mapArray[1].indexOf("-") === -1
        ? mapArray[1].slice(0, 11)
        : mapArray[1].slice(0, 12);
    h1.textContent = `${lat} • ${lon}`;
  } else {
    h1.textContent = message;
  }
};

export const updateScreenReaderConfirmation = (message) => {
  const p = document.getElementById("confirmation");
  p.textContent = message;
};

export const updateDisplay = (weatherJson, locationObj) => {
  fadeDisplay();
  clearDisplay();
  const weatherClass = getWeatherClass(weatherJson.list[0].weather[0].icon);
  setBGImage(weatherClass);
  const screenReaderWeather = buildScreenReaderWeather(
    weatherJson,
    locationObj
  );
  updateScreenReaderConfirmation(screenReaderWeather);
  updateWeatherLocationHeader(locationObj.getName());
  // current conditions
  const ccArray = createCurrentConditionsDivs(
    weatherJson,
    locationObj.getUnit()
  );
  displayCurrentConditions(ccArray);
  // six day forecast according to Project
  // But here we Display Weather Data of after 3 hours, 6 hours, 9 hours, etc.
  displaySixDayForecast(weatherJson, locationObj.getUnit());
  setFocusOnSearch();
  fadeDisplay();
};

const fadeDisplay = () => {
  const cc = document.getElementById("currentForecast");
  cc.classList.toggle("zero-vis");
  cc.classList.toggle("fade-in");
  const sixDay = document.getElementById("dailyForecast");
  sixDay.classList.toggle("zero-vis");
  sixDay.classList.toggle("fade-in");
};

const clearDisplay = () => {
  const currentCondition = document.getElementById(
    "currentForecast__conditions"
  );
  deleteContents(currentCondition);
  const sixDayForecast = document.getElementById("dailyForecast__contents");
  deleteContents(sixDayForecast);
};

const deleteContents = (parentElement) => {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};

const getWeatherClass = (icon) => {
  const firstTwoChars = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  const weatherLookup = {
    "09": "snow",
    10: "rain",
    11: "rain",
    13: "snow",
    50: "fog",
  };
  let weatherClass;
  if (weatherLookup[firstTwoChars]) {
    weatherClass = weatherLookup[firstTwoChars];
  } else if (lastChar === "d") {
    weatherClass = "clouds";
  } else {
    weatherClass = "night";
  }
  return weatherClass;
};

const setBGImage = (weatherClass) => {
  document.documentElement.classList.add(weatherClass);
  document.documentElement.classList.forEach((img) => {
    if (img !== weatherClass) document.documentElement.classList.remove(img);
  });
};

const buildScreenReaderWeather = (weatherJson, locationObj) => {
  const location = locationObj.getName();
  const unit = locationObj.getUnit();
  const tempUnit = unit === "imperial" ? "fahernheit" : "celsius";
  // return `${weatherJson.list[0].weather[0].description} and ${Math.round((Number(weatherJson.list[0].main.temp) - 273) * 1.8 + 32)}°${tempUnit} in ${location}`;
  return tempUnit === "fahernheit" ? `${weatherJson.list[0].weather[0].description} and ${Math.round(
    (Number(weatherJson.list[0].main.temp) - 273) * 1.8 + 32)}
  °${tempUnit} in ${location}` 
  : `${weatherJson.list[0].weather[0].description} and ${Math.round(
    (Number(weatherJson.list[0].main.temp) - 273))}
  °${tempUnit} in ${location}` ;
};

const setFocusOnSearch = () => {
  document.getElementById("searchBar__text").focus();
};

const createCurrentConditionsDivs = (weatherObj, unit) => {
  const tempUnit = unit === "imperial" ? "F" : "C";
  const windUnit = unit === "imperial" ? "mph" : "m/s";
  const icon = createMainImgDiv(
    weatherObj.list[0].weather[0].icon,
    weatherObj.list[0].weather[0].description
  );

  const currentTemp = tempUnit === "F" ? 
    `${Math.round((Number(weatherObj.list[0].main.temp) - 273) * 1.8 + 32)}°`
    : `${Math.round(Number(weatherObj.list[0].main.temp) - 273)}°`;
  const currentFeels = tempUnit === "F" ?
    `feels like ${Math.round((Number(weatherObj.list[0].main.feels_like) - 273) * 1.8 + 32)}°`
    : `feels like ${Math.round(Number(weatherObj.list[0].main.feels_like) - 273)}°`;
  const currentMax = tempUnit === "F" ?
    `High ${Math.round((Number(weatherObj.list[0].main.temp_max) - 273) * 1.8 + 32)}°`
    : `High ${Math.round(Number(weatherObj.list[0].main.temp_max) - 273)}°`;
  const currentMin = tempUnit === "F" ?
    `Low ${Math.round((Number(weatherObj.list[0].main.temp_min) - 273) * 1.8 + 32)}°`
    : `Low ${Math.round(Number(weatherObj.list[0].main.temp_min) - 273)}°`;

  // We got Temp/feels/maxTemp/minTemp/ in Kelvin. So, we converted into Fahernheit & celsius.
  const temp = createElem(
    "div",
    "temp",
    currentTemp,
    tempUnit
    // `${Math.round((Number(weatherObj.list[0].main.temp) - 273) * 1.8 + 32)}°`, tempUnit
  );
  const properDesc = toProperCase(weatherObj.list[0].weather[0].description);
  const desc = createElem("div", "desc", properDesc);
  const feels = createElem(
    "div",
    "feels",
    currentFeels
    // `feels like ${Math.round(
    //   (Number(weatherObj.list[0].main.feels_like) - 273) * 1.8 + 32
    // )}°`
  );
  const maxTemp = createElem(
    "div",
    "maxtemp",
    currentMax
    // `High ${Math.round(
    //   (Number(weatherObj.list[0].main.temp_max) - 273) * 1.8 + 32
    // )}°`
  );
  const minTemp = createElem(
    "div",
    "mintemp",
    currentMin
    // `Low ${Math.round(
    //   (Number(weatherObj.list[0].main.temp_min) - 273) * 1.8 + 32
    // )}°`
  );
  const humidity = createElem(
    "div",
    "humidity",
    `Humidity ${Math.round(Number(weatherObj.list[0].main.humidity))}%`
  );
  const wind = createElem(
    "div",
    "wind",
    `wind ${Math.round(Number(weatherObj.list[0].wind.speed))} ${windUnit}`
  );
  return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind];
};

const createMainImgDiv = (icon, altText) => {
  const iconDiv = createElem("div", "icon");
  iconDiv.id = "icon";
  const faIcon = translateIconToFontAwesome(icon);
  faIcon.ariaHidden = true;
  faIcon.title = altText;
  iconDiv.appendChild(faIcon);
  return iconDiv;
};

const createElem = (elemType, divClassName, divText, unit) => {
  const div = document.createElement(elemType);
  div.className = divClassName;
  if (divText) {
    div.textContent = divText;
  }
  if (div.className === "temp") {
    const unitDiv = document.createElement("div");
    unitDiv.classList.add("unit");
    unitDiv.textContent = unit;
    div.appendChild(unitDiv);
  }
  return div;
};

const translateIconToFontAwesome = (icon) => {
  const i = document.createElement("i");
  const firstTwoChars = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  switch (firstTwoChars) {
    case "01":
      if (lastChar === "d") {
        i.classList.add("far", "fa-sun");
      } else {
        i.classList.add("far", "fa-moon");
      }
      break;
    case "02":
      if (lastChar === "d") {
        i.classList.add("fas", "fa-cloud-sun");
      } else {
        i.classList.add("fas", "fa-cloud-moon");
      }
      break;
    case "03":
      i.classList.add("fas", "fa-cloud");
      break;
    case "04":
      i.classList.add("fas", "fa-cloud-meatball");
      break;
    case "09":
      i.classList.add("fas", "fa-cloud-rain");
      break;
    case "10":
      if (lastChar === "d") {
        i.classList.add("fas", "fa-cloud-sun-rain");
      } else {
        i.classList.add("fas", "fa-cloud-moon-rain");
      }
      break;
    case "11":
      i.classList.add("fas", "fa-poo-storm");
      break;
    case "13":
      i.classList.add("far", "fa-snowflake");
      break;
    case "50":
      i.classList.add("fas", "fa-smog");
      break;
    default:
      i.classList.add("far", "fa-question-circle");
  }
  return i;
};

const displayCurrentConditions = (currentConditionsArray) => {
  const ccContainer = document.getElementById("currentForecast__conditions");
  currentConditionsArray.forEach((cc) => {
    ccContainer.appendChild(cc);
  });
};

const displaySixDayForecast = (weatherJson, unit) => {
  const tempUnit = unit === "imperial" ? "F" : "C";
  for (let i = 1; i <= 6; i++) {
    const dfArray = createDailyForecastDivs(weatherJson.list[i], tempUnit);
    displayDailyForecast(dfArray);
  }
};

const createDailyForecastDivs = (dayWeather, tempUnit) => {
  const dayAbbreviationText = getDayAbbreviation(dayWeather.dt);
  const dayAbbreviation = createElem(
    "p",
    "dayAbbreviation",
    dayAbbreviationText
  );
  const dayIcon = createDailyForecastIcon(
    dayWeather.weather[0].icon,
    dayWeather.weather[0].description
  );

  const dayHighTemp = tempUnit === "F" ?
  `${Math.round((Number(dayWeather.main.temp_max) - 273) * 1.8 + 32)}`
  : `${Math.round(Number(dayWeather.main.temp_max) - 273)}`;
  const dayHigh = createElem(
    "p",
    "dayHigh",
    dayHighTemp
    // `${Math.round((Number(dayWeather.main.temp_max) - 273) * 1.8 + 32)}°`
  );

  const dayLowTemp = tempUnit === "F" ?
  `${Math.round((Number(dayWeather.main.temp_min) - 273) * 1.8 + 32)}`
  : `${Math.round(Number(dayWeather.main.temp_min) - 273)}`;
  const dayLow = createElem(
    "p",
    "dayLow",
    dayLowTemp
    // `${Math.round((Number(dayWeather.main.temp_min) - 273) * 1.8 + 32)}°`
  );
  return [dayAbbreviation, dayIcon, dayHigh, dayLow];
};

const getDayAbbreviation = (data) => {
  const dateObj = new Date(data * 1000);
  const utcString = dateObj.toUTCString();
  return utcString.slice(0, 3).toUpperCase();
};

const createDailyForecastIcon = (icon, altText) => {
  const img = document.createElement("img");
  if (window.innerWidth < 768 || window.innerHeight < 1025) {
    img.src = `https://openweathermap.org/img/wn/${icon}.png`;
  } else {
    img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
  img.alt = altText;
  return img;
};

const displayDailyForecast = (dfArray) => {
  const dayDiv = createElem("div", "forecastDay");
  dfArray.forEach(e1 => {
    dayDiv.appendChild(e1);
  });
  const dailyForecastContainer = document.getElementById("dailyForecast__contents");
  dailyForecastContainer.appendChild(dayDiv);
};
