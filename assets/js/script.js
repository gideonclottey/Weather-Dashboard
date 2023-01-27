// Assign variable to form #search-form
const searchForm = $("#search-form")

// Assign variable to input field #search-input
const searchInput = $("#search-input")

// Assign variables to target Bootstrap modal title & content
const popUp = $("#messageModal")
const popUpTitle = $("#messageModalLabel")
const popUpContent = $(".modal-body")

// Apply jQuery event on form submission
searchForm.submit(function (event) {

    // assign variable to user input
    const userInput = searchInput.val().trim()

    // Prevent default form functionality 
    event.preventDefault()
    
    // Check if user has entered a city if not show bootstrap modal 
    if (userInput == '') {
        // Set modal title
        popUpTitle.text("Error")
        // Set modal description
        popUpContent.text("Please enter a city")
        // trigger popup to appear
        popUp.modal("show")
    }

    console.log(searchInput.val().trim())
})