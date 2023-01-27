// Assign variable to form #search-form
const searchForm = $("#search-form")

// Assign variable to input field #search-input
const searchInput = $("#search-input")

// Assign variable to div .history
const historyBox = $("#history")

// Assign variable to div #today
const forecastToday = $("#today")

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
$(document).on('click', '.btn', function (event) {

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

            // showWeather() function
            showWeather(userInput, true)
        }
    }

})

// Function that will display the weather results (takes user input)
function showWeather(userInput, isNewSearch) {

    // Create a query string for the "Geocoding API" to determine the Longitude and Latitude of the city
    // this is needed to fetch accurate search results from the "5 Day / 3 Hour Forecast" API
    // API endpoint: https://openweathermap.org/api/geocoding-api
    const queryString = 'http://api.openweathermap.org/geo/1.0/direct?q=' + userInput + '&limit=5&appid=' + apiKey

    // Begin jQuery ajax request
    $.ajax({
        url: queryString,
        method: "GET"
    }).then(function (response) {

        // Check if the response is not empty, if it is, show an error message to the user
        if (response.length !== 0) {

            // Longitude of returned city
            const longitude = response[0].lon
            // Latitude of returned city
            const latitude = response[0].lat

            // Create a query string for the "Current weather data" to determine the Longitude and Latitude of the city
            // API endpoint: https://openweathermap.org/current
            const currentWeatherQueryUrl = 'http://api.openweathermap.org/data/2.5/weather?units=metric&lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey

            // Begin jQuery ajax request
            $.ajax({ url: currentWeatherQueryUrl })
                .then(function (weatherResponse) {

                    console.log(weatherResponse)

                    // Format unix date stamp 
                    const date = moment.unix(weatherResponse.dt).format("DD/MM/YYYY")
                    
                    // format icon html
                    const iconUrl = `<img src="http://openweathermap.org/img/wn/${weatherResponse.weather[0].icon}.png" alt="${weatherResponse.weather[0].description}">`
                    
                    // create title
                    const title = $("<h2>").text(`${weatherResponse.name} (${date})`)

                    // append iconUrl to title
                    title.append(iconUrl)

                    // create todays details
                    const todayWeather = $("<p>").html(`
                    Temp: ${weatherResponse.main.temp} °C<br>
                    Wind: ${weatherResponse.wind.speed} KPH<br>
                    Humidity: ${weatherResponse.main.humidity}%
                    `)

                    //append title to forecastToday element
                    forecastToday.append(title).append(todayWeather)

                    console.log(weatherResponse)
                })

        } else {

            // Show error message to user if City not found
            showPopup(`${userInput} not found. Please try again`)
        }
    })

    // If the search is new, then add it to the history
    if (isNewSearch) {
        updateHistory(userInput)
    }

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
            const button = $("<button>").addClass("btn mt-2").text(element).attr("data-city", element)
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