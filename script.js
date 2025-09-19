//Smooth animation when the page is loaded for the first time
document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('.main');
  
  setTimeout(() => {
    main.classList.add('loaded');
  }, 500);
});

//----------------------------------------------------------------------------------------------------------

/*
Section - Calling the api when the button is clicked
*/
const button = document.querySelector("button")
button.addEventListener("click", requestApi)
const apiKey = "66a4c42205fdfa5c11844c686808f0af"
let city = "katmandu"

//Function to make the api request
async function requestApi(){
    const input = document.querySelector("input")
    try{
        const response = await 
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${input.value.trim()||city}&appid=${apiKey}&units=metric`)
        const data = await response.json()
        if (!response.ok) {
            alert("Sorry!! No data about that place")
            return
        }
        
        city = input.value
        console.log(data)
        weatherNow(data)
        showHighlights(data)
        futureForecast(data)
    }catch(e){
        console.log(e)
    }
    input.value = ""
}

//----------------------------------------------------------------------------------------------------------

/*
Section - Changing the information about current weather
*/
const mainImage = document.querySelector("img")
const address = document.getElementById("location")
const currentTemp = document.getElementById("current-temp")
const dayName = document.getElementById("current-day")
const mainTitle = document.getElementById("main")
const description = document.getElementById("description")

//Function to extract the data and change the content in current weather details
function weatherNow(objData){
    const location = objData["city"]
    const currentWeatherObj = objData["list"]["0"]

    mainImage.src = pickImage(currentWeatherObj)
    address.textContent = `${location["name"]}, ${location["country"]}`
    currentTemp.textContent = `${currentWeatherObj["main"]["temp"]}°C`
    dayName.textContent = getDayName(currentWeatherObj.dt_txt)
    mainTitle.textContent = currentWeatherObj["weather"]["0"]["main"]
    description.textContent = currentWeatherObj["weather"]["0"]["description"]
}

//Function to converr the dt_txt the day in word or weekday
function getDayName(val){
    const num = new Date(val)
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[num.getDay()]
}

//----------------------------------------------------------------------------------------------------------

/*
Section - Changing the today's highlights
*/
const feelsLike = document.querySelector(".feels-like")
const windStatus = document.querySelector(".wind-status")
const sunriseAndSet = document.querySelector(".sunriseAndSet")
const humidity = document.querySelector(".humidity")
const visibility = document.querySelector(".visibility")
const cloudiness = document.querySelector(".cloudiness")

//Function to show extra highlights
function showHighlights(objData){
    const containerList = [feelsLike, windStatus, sunriseAndSet, humidity, visibility, cloudiness]
    containerList.forEach(container => {
        renderHighlights(container, objData)
    })
}

//Helper function to change the content of the highlights
function renderHighlights(div, obj){
    const data = obj["list"]["0"]
    let value, val1, val2;
    switch (div){
        case feelsLike:
            value = data.main.feels_like
            val1 = `${value}°C`
            val2 = feelsLikeThreshold(value)
            addParagraphElement(feelsLike, val1, val2)
            break
        case windStatus:
            value = (data.wind.speed * 3.6).toFixed(1)
            val1 = `${value} km/h`
            val2 = windStatusThreshold(value)
            addParagraphElement(windStatus, val1, val2)
            break
        case sunriseAndSet:
            const rise = obj.city.sunrise
            const set = obj.city.sunset
            const [value1, value2] = convertToTime(rise, set)
            val1 = `Sunrise: ${value1}`
            val2 = `Sunset: ${value2}`
            addParagraphElement(sunriseAndSet, val1, val2)
            break
        case humidity:
            value = data.main.humidity
            val1 = `${value}%`
            val2 = humidityThreshold(value)
            addParagraphElement(humidity, val1, val2)
            break
        case visibility:
            value = (data.visibility / 1000)
            val1 = `${value} km`
            val2 = visibilityThreshold(value)
            addParagraphElement(visibility, val1, val2)
            break
        case cloudiness:
            value = data.clouds.all
            val1 = `${value}%`
            val2 = cloudinessThreshold(value)
            addParagraphElement(cloudiness, val1, val2)
    }
}

//Helper function that adds up the new content when the API request is made
function addParagraphElement(container, v1, v2){
    const allP = container.querySelectorAll("p")
    allP.forEach(p => p.remove())

    const p1 = document.createElement("p")
    const p2 = document.createElement("p")
    p1.textContent = v1
    p2.textContent = v2

    container.append(p1)
    container.append(p2)
}

//Helper function to find the time of sunrise and sunset
function convertToTime(sunriseTimestamp, sunsetTimestamp){
    const sunriseDate = new Date(sunriseTimestamp * 1000);
    const sunsetDate = new Date(sunsetTimestamp * 1000);

    const formatter = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kathmandu' // Specify the correct IANA timezone identifier
    });

    const sunriseTime = formatter.format(sunriseDate);
    const sunsetTime = formatter.format(sunsetDate);

    return [sunriseTime, sunsetTime]
}

//Function to give specific message for Feels like
function feelsLikeThreshold(val){
    if (val < 10){
        return "Cold"
    }else if (val < 25){
        return "Comfortable"
    }else{
        return "Hot"
    }
}

//Function to give specific message for Wind status
function windStatusThreshold(val){
    if (val < 10){
        return "Calm"
    }else if (val < 30){
        return "Breezy"
    }else{
        return "Windy"
    }
}

//Function to give specific message for Humidity
function humidityThreshold(val){
    if (val < 30){
        return "Dry"
    }else if (val < 60){
        return "Normal"
    }else{
        return "Humid"
    }
}

//Function to give specific message for Visibility
function visibilityThreshold(val){
    if (val < 5){
        return "Poor"
    }else if(val < 10){
        return "Average"
    }else{
        return "Clear"
    }
}

//Function to give specific message for Cloudiness
function cloudinessThreshold(val){
    if (val < 20){
        return "Clear"
    }else if (val < 60){
        return "Partly Cloudy"
    }else{
        return "Overcast"
    }
}

//----------------------------------------------------------------------------------------------------------

/*
Section - Future forecast upto 5 days
*/
const day1 = document.querySelector(".day1")
const day2 = document.querySelector(".day2")
const day3 = document.querySelector(".day3")
const day4 = document.querySelector(".day4")
const day5 = document.querySelector(".day5")

//Function to change the content of future forecast
function futureForecast(dataObj){
    const days = [day1, day2, day3, day4, day5]
    const indexes = [9, 17, 24, 31, 39]
    const data = dataObj["list"]
    let i = 0

    days.forEach(day => {
        const p = day.querySelectorAll("p")
        const image = day.querySelector("img")
        p.forEach(e => e.remove())
        image.remove()

        const dayName = getDayName(data[indexes[i]].dt_txt)
        const temperature = data[indexes[i]].main.temp

        const p1 = document.createElement("p")
        const img = document.createElement("img")
        const p2 = document.createElement("p")

        p1.textContent = dayName
        img.src = pickImage(data[i])
        p2.textContent = `${temperature}°C`

        day.append(p1)
        day.append(img)
        day.append(p2)

        i++
    })
}

//Helper function to render the relevant image by description
function pickImage(dataObj){
    const description = dataObj.weather[0].description
    if (dataObj.sys.pod === "d" && description === "clear sky"){
        return "Photos/clear-day.png"

    }else if(dataObj.sys.pod === "n" && description === "clear sky"){
        return "Photos/clear-night.jpg"

    }else if (dataObj.sys.pod === "d" && 
        (description === "few clouds" || description === "scattered clouds")){
        return "Photos/partly-cloudy-day.png"

    }else if (dataObj.sys.pod === "n" && 
        (description === "few clouds" || description === "scattered clouds")){
        return "Photos/partly-cloudy-night.jpg"

    }else if (description === "broken clouds" || description === "overcast clouds"){
        return "Photos/overcast.jpg"

    }else if (description === "light rain" || description === "light intensity drizzle"){
        return "Photos/light-rain.png"

    }else if (description === "moderate rain" || description === "heavy rain"){
        return "Photos/heavy-rain.png"

    }else if (description === "thunderstorm"){
        return "Photos/thunderstorm.png"

    }else if (description === "light snow"){
        return "Photos/light-snow.png"

    }else if (description === "snow" || description === "heavy snow"){
        return "Photos/heavy-snow.jpg"

    }else if (description === "mist" || description === "fog" || description === "haze"){
        return "Photos/fog.png"
    
    }else if (description === "tornado" || description === "squall"){
        return "Photos/windy.png"

    }else{
        return "Photos/sunny.jpg"
    }
}

//Default call to kathmandu when the webpage is loaded for the first time
requestApi()