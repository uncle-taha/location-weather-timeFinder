const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".cards");
const apiKey = "51f6af5f5db3bcabe944d3b34ca356a1";
const googleMapsApi = "AIzaSyBTfgd7hdxnqzI50PwdFop8t4I6_V5svOk";
let previousCity = "";

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value;

  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      displayWeatherInfo(weatherData);
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  } else {
    displayError("Please Enter a city!");
  }
});

async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(
      "Could not fetch weather data! Please type proper city name"
    );
  }
  return await response.json();
}
// google api

function displayWeatherInfo(data) {
  const {
    coord: { lat, lon },
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data;

  let latD = lat;
  let lonD = lon;
  let cityN = city;

  card.textContent = "";
  card.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  const digitalClock = document.createElement("div");
  const row1 = document.createElement("div");
  const row2 = document.createElement("div");
  const row3 = document.createElement("div");
  const lastline1 = document.createElement("div");
  const lastline2 = document.createElement("div");
  const map1 = document.createElement("div");
  const clockDiv = document.createElement("div");

  cityDisplay.textContent = city;
  cityDisplay.classList.add("cityDisplay");
  row1.classList.add("row1");
  row2.classList.add("row2");
  row3.classList.add("row3");
  map1.classList.add("map");
  map1.style.height = "350px";
  map1.style.width = "100%";
  map1.id = "map";

  lastline1.classList.add("lastline1");
  lastline2.classList.add("lastline2");

  tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
  tempDisplay.classList.add("tempDisplay");

  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  humidityDisplay.classList.add("humidityDisplay");

  descDisplay.textContent = description;
  descDisplay.classList.add("descDisplay");

  lastline1.append(weatherEmoji);
  lastline2.append(descDisplay, tempDisplay, humidityDisplay);

  const weatherIcon = getWeatherEmoji(id);
  lastline1.appendChild(weatherIcon);
  weatherEmoji.classList.add("weatherEmoji");

  weatherIcon.textContent = weatherEmoji;
  lastline1.appendChild(weatherEmoji);
  row3.append(lastline1, lastline2);
  row1.append(cityDisplay, clockDiv); // add here
  row2.appendChild(map1);
  card.append(row1, row2, row3);

  function initMap() {
    // Example initialization; update with actual data if needed
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: lat, lng: lon }, // Example coordinates
      zoom: 13,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: false,
      scaleControl: false,
      disableDefaultUI: true,
    });
    new google.maps.Marker({
      position: { lat: latD, lng: lonD },
      map: map,
      label: `${cityN}`,
      title: `${cityN}`,
      animation: google.maps.Animation.DROP,
    });
  }

  initMap(latD, lonD);

  //   soat

  let timeZoneId, timeZoneName, dstOffset, rawOffset;

  async function getLocationData(latt, lonn, googleMapsApi) {
    const timestamp = Math.floor(Date.now() / 1000);
    const Googleurl = `https://maps.googleapis.com/maps/api/timezone/json?location=${latt},${lonn}&timestamp=${timestamp}&key=${googleMapsApi}`;
    console.log(`url: ${Googleurl}`);

    try {
      const response = await fetch(Googleurl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const timeData = await response.json();
      if (typeof timeData === "object" && timeData.timeZoneId) {
        ({ timeZoneId, timeZoneName, dstOffset, rawOffset } = timeData);

        console.log(`Time Zone ID: ${timeZoneId}`);
        console.log(`Time Zone Name: ${timeZoneName}`);
        console.log(`DST Offset: ${dstOffset}`);
        console.log(`Raw Offset: ${rawOffset}`);

        // Return the data directly or as a new object if needed
        return timeData;
      } else {
        throw new Error("Unexpected data structure from time zone API");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  //   clock
  clockDiv.innerHTML = `
<div class="clock-card">
  <div class="clock-dial">
    <div class="classicclock">
      <div class="point"></div>
      <!-- Hours -->
      <div class="hour hour-1">1</div>
      <div class="hour hour-2">2</div>
      <div class="hour hour-3">3</div>
      <div class="hour hour-4">4</div>
      <div class="hour hour-5">5</div>
      <div class="hour hour-6">6</div>
      <div class="hour hour-7">7</div>
      <div class="hour hour-8">8</div>
      <div class="hour hour-9">9</div>
      <div class="hour hour-10">10</div>
      <div class="hour hour-11">11</div>
      <div class="hour hour-12">12</div>
      <div class="city-name">${cityN || "Unknown City"}</div>
      <!-- Clock Hands -->
      <div class="minute-hand-wrapper" id="place-minute-hand">
        <div class="minute-hand" style="transform: rotate(deg);">
          <div class="hand"></div>
          <div class="arrow">v</div>
        </div>
      </div>
      <div class="hour-hand-wrapper" id="place-hour-hand">
        <div class="hour-hand" style="transform: rotate(deg);">
          <div class="hand"></div>
          <div class="arrow">v</div>
        </div>
      </div>
      <div class="second-hand-wrapper" id="place-second-hand">
        <div class="second-hand" style="transform: rotate(deg);">
          <div class="hand"></div>
        </div>
      </div>
    </div>
    <!-- below clock -->
    <div id="belowclock">
              <div id="placedigitalclock">00:00:00</div>
            </div>

  </div>
</div>
`;

  function placesClock(hour, minute, second, cityPrefix) {
    const secondDegree = second * 6; // 360 / 60
    const minuteDegree = minute * 6; // 360 / 60
    const hourDegree = (hour % 12) * 30 + Math.round(minute / 2); // 360 / 12 + 30 degree for each hour

    document.getElementById(cityPrefix + "-second-hand").style.transform =
      "rotate(" + secondDegree + "deg)";
    document.getElementById(cityPrefix + "-minute-hand").style.transform =
      "rotate(" + minuteDegree + "deg)";
    document.getElementById(cityPrefix + "-hour-hand").style.transform =
      "rotate(" + hourDegree + "deg)";
  }

  function updatesClock() {
    if (city) {
      if (city !== previousCity) {
        console.log(previousCity);
        clearInterval(updatesClock);
      }
    }
    const placeTime = new Date().toLocaleString("en-US", {
      timeZone: `${timeZoneId}`,
      hour12: false,
    });
    const placeDate = new Date(placeTime);
    document.getElementById("placedigitalclock").textContent =
      placeDate.toLocaleTimeString("en-US", { hour12: false });
    placesClock(
      placeDate.getHours(),
      placeDate.getMinutes(),
      placeDate.getSeconds(),
      "place"
    );
  }
  getLocationData(latD, lonD, googleMapsApi).then(() => {
    setInterval(updatesClock, 1000);
  }); //end clock
} //end function

function getWeatherEmoji(weatherId) {
  const weatherIcon = document.createElement("img");
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      weatherIcon.src = "./images/thunderstorms.svg";
      break;
    case weatherId >= 300 && weatherId < 400:
      weatherIcon.src = "./images/dizzle.svg";
      break;
    case weatherId >= 500 && weatherId < 600:
      weatherIcon.src = "./images/rain.svg";
      break;
    case weatherId >= 600 && weatherId < 700:
      weatherIcon.src = "./images/snow.svg";
      break;
    case weatherId >= 700 && weatherId < 800:
      weatherIcon.src = "./images/fog.svg";
      break;
    case weatherId === 800:
      weatherIcon.src = "./images/sunny.svg";
      break;
    case weatherId >= 801 && weatherId < 810:
      weatherIcon.src = "./images/cloudy.svg";
      break;
    default:
      img.src = "path_to_default_image.png";
  }
  return weatherIcon;
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}

function analogClock(hour, minute, second, cityPrefix) {
  const secondDegree = second * 6; // 360 / 60
  const minuteDegree = minute * 6; // 360 / 60
  const hourDegree = (hour % 12) * 30 + Math.round(minute / 2); // 360 / 12 + 30 degree for each hour

  document.getElementById(cityPrefix + "-second-hand").style.transform =
    "rotate(" + secondDegree + "deg)";
  document.getElementById(cityPrefix + "-minute-hand").style.transform =
    "rotate(" + minuteDegree + "deg)";
  document.getElementById(cityPrefix + "-hour-hand").style.transform =
    "rotate(" + hourDegree + "deg)";
}

function updateClock() {
  // Seoul time
  const seoulTime = new Date().toLocaleString("en-US", {
    timeZone: `Asia/Seoul`,
    hour12: false,
  });
  const seoulDate = new Date(seoulTime);
  document.getElementById("digitalclockSeoul").textContent =
    seoulDate.toLocaleTimeString("en-US", { hour12: false });
  analogClock(
    seoulDate.getHours(),
    seoulDate.getMinutes(),
    seoulDate.getSeconds(),
    "seoul"
  );

  // New York time
  const nyTime = new Date().toLocaleString("en-US", {
    timeZone: `America/New_York`,
    hour12: false,
  });
  const nyDate = new Date(nyTime);
  document.getElementById("digitalclockNewYork").textContent =
    nyDate.toLocaleTimeString("en-US", { hour12: false });
  analogClock(
    nyDate.getHours(),
    nyDate.getMinutes(),
    nyDate.getSeconds(),
    "newyork"
  );

  // London time
  const londonTime = new Date().toLocaleString("en-US", {
    timeZone: `Europe/London`,
    hour12: false,
  });
  const londonDate = new Date(londonTime);
  document.getElementById("digitalclockLondon").textContent =
    londonDate.toLocaleTimeString("en-US", { hour12: false });
  analogClock(
    londonDate.getHours(),
    londonDate.getMinutes(),
    londonDate.getSeconds(),
    "london"
  );

  // Tashkent time
  const tashkentTime = new Date().toLocaleString("en-US", {
    timeZone: `Asia/Tashkent`,
    hour12: false,
  });
  const tashkentDate = new Date(tashkentTime);
  document.getElementById("digitalclockTashkent").textContent =
    tashkentDate.toLocaleTimeString("en-US", { hour12: false });
  analogClock(
    tashkentDate.getHours(),
    tashkentDate.getMinutes(),
    tashkentDate.getSeconds(),
    "tashkent"
  );
}

setInterval(updateClock, 1000);
