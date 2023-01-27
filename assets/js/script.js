// Assign variable to form #search-form
const searchForm = $("#search-form")

// Assign variable to input field #search-input
const searchInput = $("#search-input")

// Assign variables to target Bootstrap modal title & content
const popUp = $("#messageModal")
const popUpTitle = $("#messageModalLabel")
const popUpContent = $(".modal-body")

searchForm.submit(function(event){

    event.preventDefault()

    if(searchInput.val().trim() ==''){
        popUpTitle.text("Error")
        popUpContent.text("Please enter a city")
        popUp.modal("show")
    }
    console.log(searchInput.val().trim())

})