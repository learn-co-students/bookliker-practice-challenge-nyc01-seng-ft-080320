document.addEventListener("DOMContentLoaded", function() {
    getBooks()
});

const BASE_URL = "http://localhost:3000/books/"

const getBooks = () => {
    fetch(BASE_URL)
    .then(resp => resp.json())
    .then(data => {
        renderBooks(data)
        clickHandler()
    })
}

const renderBooks = (bookCollection) => {
    for (const book of bookCollection){
        const bookLi = document.createElement('li')
        bookLi.textContent = book.title
        bookLi.dataset.bookId = book.id 

        const booksUl = document.querySelector('#list')
        booksUl.append(bookLi)
    }
}

const clickHandler = () => {
    document.addEventListener('click', e => {
        if (e.target.matches('li')){
            const bookId = e.target.dataset.bookId
            getBook(bookId)
        } else if (e.target.matches('button')){
            const bookDiv = e.target.parentElement
            likeBook(bookDiv)
        }
    })
}

const getBook = (id) => {
    fetch(BASE_URL + id)
    .then(resp => resp.json())
    .then(data => renderBook(data))
}

const renderBook = (bookObj) => {
    const showPanelDiv = document.querySelector('#show-panel')
    showPanelDiv.dataset.bookId = bookObj.id 
    showPanelDiv.innerHTML = `
        <img src=${bookObj.img_url} >
        <h3>${bookObj.title}</h3>
        <h3><em>${bookObj.subtitle ? bookObj.subtitle : ''}</em></h3>
        <p>By: <strong>${bookObj.author}</strong></p>
        <p>${bookObj.description}</p>
    `
    const userUl = document.createElement('ul')
    
    for(const user of bookObj.users) {
        const userLi = document.createElement('li')
        userLi.textContent = user.username
        userLi.dataset.id = user.id
        userUl.append(userLi)
    }

    showPanelDiv.append(userUl)

    const likeButton = document.createElement('button')
    likeButton.textContent = "LIKE"
    showPanelDiv.append(likeButton)
}

const likeBook = (bookDiv) => {
    const bookId = bookDiv.dataset.bookId
    const arrayOfUsers = getUsers(bookDiv)

    const currentUser = {"id":1, "username":"pouros"}
    arrayOfUsers.push(currentUser)

    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            users: arrayOfUsers
        })
    }
    console.log(options)
    fetch(BASE_URL + bookId, options)
    .then(resp => resp.json())
    .then(data => renderBook(data))
}

const getUsers = (bookDiv) => {
    const userElements = bookDiv.querySelector('ul').children
    const users = []
    for(const user of userElements){
        userObj = {
            id: parseInt(user.dataset.id),
            username: user.textContent
        }
        users.push(userObj)
    }
    return users
}