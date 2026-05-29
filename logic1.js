const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weaIcon = document.querySelector(".weather-icon");
const weatherDetails=document.querySelector(".weather-details");

const defaultIcon=document.querySelector(".default-icon");

//T030rr0#

function defaultImg() {
    defaultIcon.style.display="block";
    document.querySelector(".weather").style.display="block";//holds image
    document.querySelector(".error").style.display="none";
   
}

defaultImg();


async function checkWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        if (response.status == 404) {
            document.querySelector(".weather").style.display = "none"; //hidden
            document.querySelector(".error").style.display = "block";

            defaultIcon.style.display="none";
            return;
        }
        data = await response.json();
        console.log(data);
        
        defaultIcon.style.display="none";
        document.querySelector(".error").style.display = "none"; //hides
        document.querySelector(".weather").style.display = "block";
        // Fetch data only if response is successful

        weatherDetails.style.display="block";

        defaultIcon.style.display="none";
    }
    catch (error) {
        console.log("Error fetching weather data: ", error);

        // more specific error handling and network issues 
        document.querySelector(".error").innerHTML = "Network Error or API Down";
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";

        defaultIcon.style.display="none";
    }


    document.querySelector(".temperature").innerHTML = Math.round(data.main.temp) + "&#8451";
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

    //1. -----time and date logic 
    const timeSeconds = data.dt;

    const timezoneOffsetSeconds = data.timezone;

    const localTimeSeconds = timeSeconds + timezoneOffsetSeconds;

    const localTimeMs = localTimeSeconds * 1000;

    const localDate = new Date(localTimeMs);

    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC' 
    };

    const dateOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC' 
    };

    const formattedTime = localDate.toLocaleTimeString('en-US', timeOptions);
    const formattedDate = localDate.toLocaleDateString('en-US', dateOptions);


    document.querySelector(".local-time").innerHTML = `${formattedDate} | ${formattedTime}`; //time and date

   
    // ------end of time and date logic

    const maindata = data.weather[0].main;
    const desc = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    //2.-------to change background color based on "d" or "n"    

    const timeOfDay = iconCode.slice(-1); // Gets the last character ('d' or 'n')

    const bodyElement = document.body;

    bodyElement.classList.remove("day", "night");

    if (timeOfDay === 'n') {
        bodyElement.classList.add("night");
    } else {
        bodyElement.classList.add("day");
    }

    //---------end of background color change logic

    document.querySelector(".Weather-main").innerHTML = maindata;
    document.querySelector(".description").innerHTML = `(${desc})`;

    //3.------ Default URL: This handles ALL OpenWeatherMap icons dynamically.
    let imageUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;


    if (iconCode === "04n" || iconCode === "04d") { //only for local image store
        imageUrl = `images/${iconCode}.png`;
    }

    weaIcon.src = imageUrl;
}

//4.------Enter key
searchBox.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {
        event.preventDefault();
        checkWeather(searchBox.value);
    }
});


//5.------search button
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});
