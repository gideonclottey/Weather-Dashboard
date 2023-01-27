// Assign variable to form
const searchForm = $("#search-form")
searchForm.submit(function(event){

    event.preventDefault()
    console.log("submitted")
    
})