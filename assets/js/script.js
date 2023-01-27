// Assign variable to form #search-form
const searchForm = $("#search-form")

// Assign variable to input field #search-input
const searchInput = $("#search-input")

// Assign variable to div .history
const historyBox = $("#history")

// Assign variables to target Bootstrap modal title & content
const popUp = $("#messageModal")
const popUpTitle = $("#messageModalLabel")
const popUpContent = $(".modal-body")

// Assign variable to store openweathermap.org to store API key
const apiKey = "f08da3f97e0c524e1f401f44d632c947"

// Assign variable for search history (retrieve existing history or create new empty array[] if history is empty)
const searchHistory = JSON.parse(localStorage.getItem('history')) || [];

// Apply jQuery event on form submission
searchForm.submit(function (event) {

    // assign variable to user input
    const userInput = searchInput.val().trim()

    // Prevent default form functionality 
    event.preventDefault()
    
    // Check if user has entered a city if not show bootstrap modal 
    if (userInput == '') {
        
        // call the popup
        showPopup("Please enter a city")

    } else {

        // showWeather() function
        showWeather(userInput)
    }
    
    console.log(userInput)
})


// Function that will display the weather results (takes user input)
function showWeather(userInput){
    
    const queryString = 'http://api.openweathermap.org/geo/1.0/direct?q=' + userInput + '&limit=5&appid=' + apiKey;
    history(userInput)

    const button = $("<button>").addClass("btn").text(userInput)
    historyBox.prepend(button)
    console.log(queryString)
}


// Function for showing/saving search history
function history(userInput){
    // Add the history to local storage
    searchHistory.push(userInput);

    localStorage.setItem('history', JSON.stringify(searchHistory));
}

// function to trigger popup with dynamic messages
function showPopup(message){
    // Set modal title
    popUpTitle.text("Error")
    // Set modal description
    popUpContent.text(message)
    // trigger popup to appear
    popUp.modal("show")
}