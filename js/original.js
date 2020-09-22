document.addEventListener("DOMContentLoaded", function() {
    baseURL = 'http://localhost:3000/books/'
    myUserInfo = {"id":1, "username":"pouros"}
    
    const fetchBooks = (url) => {
        
        fetch(url)
        .then(response => response.json())
        .then(books => renderBooks(books))
    }

    const renderBooks = books => {
        for(const book of books){
            renderBook(book)
        }
    }

    const renderBook = book => {
        const ul = document.querySelector('#list')
        const li = document.createElement('li')
        li.dataset.id = book.id
        li.className = "title"
        li.textContent = book.title
        ul.append(li)

        createBookDiv(book)
    }

    const createBookDiv = book => {
        const div = document.createElement('div')
        div.dataset.id = book.id
        div.className = 'hide'
        const ul = document.createElement('ul')
        
        div.innerHTML = `
            <img src=${book.img_url}>
            <h1>${book.title}</h1>
            <h2>${book.subtitle}</h2>
            <h2>${book.author}</h2>
            <p>${book.description}</p>
            <button data-book-id=${book.id} class="like">Like</button>
        `
        for(const user of book.users){
            const li = document.createElement('li')
            li.dataset.userId = user.id
            li.textContent = user.username
            ul.append(li)
        }

        const button = div.querySelector('button')
        button.insertAdjacentElement("beforebegin", ul)
        div.style.display = "none"
        const showDiv = document.querySelector('#show-panel')
        showDiv.append(div)
    }

    const clickHandler = () => {
        document.addEventListener("click", e => {
            if(e.target.matches('.title')){
                displayBook(e.target)
            }else if(e.target.matches('.like')){
                saveLike(e.target)
            }else if(e.target.matches('.unlike')){
                saveLike(e.target)
            }
        })
    }

    const saveLike = target => {
        const bookId = target.dataset.bookId
        const div = target.parentElement
        const li = div.querySelector('ul').lastChild
        const lastUser = li.textContent
        
        if(lastUser !== "pouros"){
            bookUsers(bookId, target)
        }else {
            // alert("🚨you already liked this book!")
            unlikeBook(target)
            
        }
    }

    const unlikeBook = target => {
        const id = target.dataset.bookId
        bookUsers(id, target)
    }

    const bookUsers = (currentId, target) => {
        fetch(baseURL)
        .then(response => response.json())
        .then(books => findUsers(books, currentId, target))
    }

    const findUsers = (books, currentId, target) => {
        for(const book of books){
            if(parseInt(currentId) === parseInt(book.id)){
                if(target.className === "like"){
                    const allUsers = book.users
                    allUsers.push(myUserInfo)
                    saveUsers(allUsers, currentId,target)
                }else if(target.className === "unlike") {
                    const updatedUsers = book.users
                    updatedUsers.pop()
                    saveUsers(updatedUsers, currentId,target)
                }
                
            }
        }
    }

    const saveUsers = (userArray, currentId, target) => {
        // userArray.push(myUserInfo)

        options = {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({
                users: userArray
            })
        }

        fetch(baseURL+currentId, options)
        .then(response => response.json())
        .then(data => renderUser(data, target))
    }

    const renderUser = (data, target) => {

        if(target.className === "like"){
            const length = data.users.length-1
            const user = data.users[length]
            const userLi = document.createElement('li')
            userLi.textContent = user.username
            userLi.dataset.userId = user.id
        

            const div = document.querySelector('#show-panel')
            const bookDiv = div.querySelector(`[data-id="${data.id}"]`)
            const ul = bookDiv.querySelector('ul')

            const button = bookDiv.querySelector('.like')
            button.textContent = "unlike"
            button.className = "unlike"
    
            ul.append(userLi)
        }else if(target.className === "unlike"){
            const div = document.querySelector('#show-panel')
            const bookDiv = div.querySelector(`[data-id="${data.id}"]`)
            const ul = bookDiv.querySelector('ul')
            const li = ul.lastElementChild 
            li.remove()

            const button = bookDiv.querySelector('.unlike')
            button.textContent = "like"
            button.className = "like"
        }
    }

    const displayBook = target => {
        const button = target
        const bookId = target.dataset.id

        if(document.querySelector('.show')){
            const visibleBook = document.querySelector('.show')
            visibleBook.className = 'hide'
            visibleBook.style.display = 'none'
        }
        
        const showDiv = document.querySelector('#show-panel')
        const bookDiv = showDiv.querySelector(`[data-id="${bookId}"]`)
        bookDiv.className = "show"
        bookDiv.style.display = "block"
        
    }

    clickHandler()
    fetchBooks(baseURL)

});




// - Get a list of books & render them
//   `http://localhost:3000/books`

//1. get request for all books
//2. render all books as lis
//3. render and hide books as div tags with all details including the users they liked

// - Be able to click on a book, you should see the book's thumbnail and description and a list of users who have liked the book.
//1. click handler for clicking book
//2. once clicked render that book


//1. click listner for like button
//2. send patch request once clicked
//3. display yourself on page and change like button text

// - You can like a book by clicking on a button. You are user 1 `{"id":1, "username":"pouros"}`, so to like a book send a `PATCH` request to `http://localhost:3000/books/:id` with an array of users who like the book. This array should be equal to the existing array of users that like the book, plus your user. For example, if the previous array was `"[{"id":2, "username":"auer"}, {"id":8, "username":"maverick"}]`, you should send as the body of your PATCH request:

// ```javascript
// {
//   "users": [
//     {"id":2, "username":"auer"},
//     {"id":8, "username":"maverick"},
//     {"id":1, "username":"pouros"}
//   ]
// }
// ```
