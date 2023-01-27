// Assign variable to form #search-form
const searchForm = $("#search-form")

// Assign variable to input field #search-input
const searchInput = $("#search-input")

// Assign variables to target Bootstrap modal title & content
const modalTitle = $("#messageModalLabel")
const modelContent = $(".modal-body")

searchForm.submit(function(event){

    event.preventDefault()
    console.log(searchInput.val().trim())
    
    modalTitle.text(searchInput.val().trim())
    modelContent.text(searchInput.val().trim())

})