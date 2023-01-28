// Assign variable to form #search-form
const searchForm = $("#search-form")

// Assign variable to input field #search-input
const searchInput = $("#search-input")

// Assign variable to div .history
const historyBox = $("#history")

// Assign variable to div #today
const forecastToday = $("#today")

// Assign variable to div #forecast
const forecast5Days = $("#forecast")

// Assign variables to target Bootstrap modal title & content
const popUp = $("#messageModal")
const popUpTitle = $("#messageModalLabel")
const popUpContent = $(".modal-body")

// Assign variable to store openweathermap.org to store API key
const apiKey = "f08da3f97e0c524e1f401f44d632c947"

// Assign variable for search history (retrieve existing history or create new empty array[] if history is empty)
const searchHistory = JSON.parse(localStorage.getItem('history')) || []

loadHistory()

// Apply jQuery event on form submission
$(document).on('click', '.button', function (event) {

    // Prevent default form functionality 
    event.preventDefault()

    // store which button was clicked in a variable
    const button = $(this)

    // If the button has a data-city attribute, show it's weather
    if (button.attr("data-city")) {

        // show weather based on history button clicked
        showWeather(button.attr("data-city"))

        // If the button clicked doesn't have data-city attribute, fall back search value
    } else {

        // assign variable to user input
        const userInput = searchInput.val().trim()

        // Check if user has entered a city if not show bootstrap modal 
        if (userInput == '') {

            // call the popup
            showPopup("Please enter a city")

        } else {

            // If the search is new, then add it to the history
            updateHistory(userInput)

            // showWeather() function
            showWeather(userInput)

        }
    }

})

// Function that will display the weather results (takes user input)
function showWeather(userInput) {

    // Call clear function to clear existing html
    clear()

    // Show the bootstrap loader
    $(".container-fluid.loader").show()

    // Create a query string for the "Geocoding API" to determine the Longitude and Latitude of the city
    // this is needed to fetch accurate search results from the "5 Day / 3 Hour Forecast" API
    // API endpoint: https://openweathermap.org/api/geocoding-api
    const queryString = 'http://api.openweathermap.org/geo/1.0/direct?q=' + userInput + '&limit=5&appid=' + apiKey

    // Begin jQuery ajax request
    $.ajax({
        url: queryString,
        method: "GET"
    }).then(function (response) {

        // Hide the bootstrap loader
        $(".container-fluid.loader").hide()
        // Check if the response is not empty, if it is, show an error message to the user
        if (response.length !== 0) {

            // Longitude of returned city
            const longitude = response[0].lon
            // Latitude of returned city
            const latitude = response[0].lat

            renderToday(latitude, longitude)
            processForecast(latitude, longitude)

        } else {

            // Show error message to user if City not found
            showPopup(`${userInput} not found. Please try again`)
        }
    })

}

// Function for showing/saving search history
function updateHistory(userInput) {

    // Add current search into searchHistory array[]
    searchHistory.push(userInput)

    // Update the localStorage item 'history' with the latest history
    localStorage.setItem('history', JSON.stringify(searchHistory))

    // Refresh the history results
    loadHistory()

}

// function to load the history
function loadHistory() {

    // Clear the historyBox contents before we reload the data
    historyBox.empty()

    if (JSON.parse(localStorage.getItem('history'))) {
        // Loop through each history item, create a button and append to the historyBox element
        JSON.parse(localStorage.getItem('history')).forEach(function (element) {
            const button = $("<button>").addClass("btn mt-2 button").text(element).attr("data-city", element)
            historyBox.prepend(button)
        })
    }
}

// function to trigger popup with dynamic messages
function showPopup(message) {
    // Set modal title
    popUpTitle.text("Error")
    // Set modal description
    popUpContent.text(message)
    // trigger popup to appear
    popUp.modal("show")
}

// A function to clear html elements
function clear() {

    forecastToday.empty()
    $("#forecast .container").remove()

}

function renderToday(latitude, longitude) {
    // Create a query string for the "Current weather data" to determine the Longitude and Latitude of the city
    // API endpoint: https://openweathermap.org/current
    const currentWeatherQueryUrl = 'http://api.openweathermap.org/data/2.5/weather?units=metric&lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey

    // Begin jQuery ajax request
    $.ajax({ url: currentWeatherQueryUrl })
        .then(function (weatherResponse) {

            // Format unix date stamp 
            const date = moment.unix(weatherResponse.dt).format("DD/MM/YYYY")

            const div = $("<div>").addClass("p-3")
            // format icon html
            const iconUrl = `<img src="http://openweathermap.org/img/wn/${weatherResponse.weather[0].icon}.png" alt="${weatherResponse.weather[0].description}">`

            // create title
            const title = $("<h2>").text(`${weatherResponse.name} (${date})`)

            // append iconUrl to title
            title.append(iconUrl)

            // create todays details
            const text = $("<p>").html(`
                    Temp: ${weatherResponse.main.temp} °C<br>
                    Wind: ${weatherResponse.wind.speed} KPH<br>
                    Humidity: ${weatherResponse.main.humidity}%
                    `)

             div.append(title).append(text)
            //append title to forecastToday element
            forecastToday.append(div)

        })
}

function processForecast(latitude, longitude) {
    //Create a query string for the "5 Day / 3 Hour Forecast" to determine the Longitude and Latitude of the city
    //API endpoint: https://openweathermap.org/forecast5
    const weatherQueryUrl = 'http://api.openweathermap.org/data/2.5/forecast?units=metric&lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey;


    // Begin jQuery ajax request
    $.ajax({ url: weatherQueryUrl })
        .then(function (forecastResponse) {

            /* 
            Create an object to store unique date values (forecast API returns 3 hourly forecast for 5 days)
             however we only want to display unique days, not all the 3 hourly forecasts
             this comes with a caveat the last 3 hourly forecast is used as the daily forecast
             this is because the api required is not free.
             the array keys will be unique based on the "DD/MM/YYYY" format
            */
            const uniqueForecastArray = {}

            // creates an array based on the returned value in the api list{} object
            const forecastList = forecastResponse.list;

            // Get todays date
            const todaysDate = moment()

            // Loop through each forecast 
            for (let i = 1; i < forecastList.length; i++) {

                // Assign current forecast to variable
                const forecast = forecastList[i];

                // Create a moment object with a formatted date based on the forecast{}.dt property
                const date = moment.unix(forecast.dt).format("DD/MM/YYYY")

                // If the current forecast IS NOT the same as today, push it into the uniqueForecastArray{} object
                if (!todaysDate.isSame(moment.unix(forecast.dt), "day")) {

                    // the key becomes unique since it's being assigned a date string "DD/MM/YYYY"
                    uniqueForecastArray[date] = forecast
                }

            }

            // We need to sort the uniqueForeCastArray since  
            renderForecast(sortDateArray(Object.entries(uniqueForecastArray)))

        });
}

function renderForecast(forecast){

    const container = $("<div>").addClass("container")
    const row = $("<div>").addClass("row")

    forecast.forEach(function(element){


        // Create a bootstrap col
        const col = $("<div>").addClass("col")

        const div = $("<div>").addClass("p-2")

        // Assign date to variable
        const date = element[0]

        // format icon html
        const icon = `<img src="http://openweathermap.org/img/wn/${element[1].weather[0].icon}.png" alt="${element[1].weather[0].description}">`

        // create title
        const title = $("<h3>").text(`${date}`)

        // create todays details
        const todayWeather = $("<p>").html(`
                Temp: ${element[1].main.temp} °C<br>
                Wind: ${element[1].wind.speed} KPH<br>
                Humidity: ${element[1].main.humidity}%
                `)
        //append title to div 
        div.append(title).append(icon).append(todayWeather)
        
        //append div to col
        col.append(div)
        //append col to row
        row.append(col)                        

    })
    // append row to container
    container.append(row)
    // add title to container
    container.prepend("<h2>5 Day Forecast:</h2>")
    // append container to forecast section
    forecast5Days.append(container)      
}

// A function to sort the array that will be used for the 5-day forecast
function sortDateArray(uniqueForecastArray) {
    const newArray = uniqueForecastArray.sort(function (value1, value2) {
        return value1[1].dt - value2[1].dt
    })
    return newArray
}