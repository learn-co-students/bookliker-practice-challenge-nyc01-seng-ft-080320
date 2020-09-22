document.addEventListener("DOMContentLoaded", function() {
    const url = "http://localhost:3000/books/"

const getBooks = () => {
    fetch(url)
    .then(response => response.json())
    .then(books => {
        renderBooksBar(books)
        renderBooksPage(books)
    })

}

const renderBooksBar = books => {
    for(const book of books){
        renderBookBar(book)
    }

}

const renderBookBar = book => {
    const list = document.querySelector('#list')
    const bookTitleLi = document.createElement('li')
    bookTitleLi.dataset.id = book.id
    bookTitleLi.textContent = book.title 
    list.append(bookTitleLi)
    bookTitleLi.dataset.id = book.id
    bookTitleLi.classList.add('links')
}

const renderBooksPage = books => {
    for(const book of books){
        renderBookPage(book)
    }
}

const renderBookPage = book => {
    const showPanel = document.querySelector('#show-panel')
    const bookDiv = document.createElement('div')
    bookDiv.classList.add('book-page')
    bookDiv.style.display = "none"
    bookDiv.dataset.id = book.id
    bookDiv.innerHTML = `
        <img src='${book.img_url}'>
        <h3>${book.title}</h3>
        <h3>${book.subtitle}</h3>
        <h3>${book.author}</h3>
        <p>${book.description}</p>
        <button class="like-button">${buttonContent(book)}</button>

    `
    showPanel.append(bookDiv)
    const button = bookDiv.querySelector('button')
    if (button.innerText === "LIKE"){
        button.id = "unliked"
    } else if (button.innerText === "UNLIKE"){
        button.id = "liked"
    }
    bookDiv.insertBefore(addUsersWhoLike(book), button )
}

const addUsersWhoLike = book => {
    const ul = document.createElement('ul')
    ul.classList.add('book-ul')
    ul.dataset.id = book.id
    for(const user of book.users){
        const likeLi = document.createElement('li')
        likeLi.classList.add('likes')
        likeLi.textContent = user.username
        ul.append(likeLi)
    }
    return ul
}

const buttonContent = book => {
    for(const user of book.users){
        if(user.id === 1){
            return "UNLIKE"
        } 
    }
    return "LIKE"
}

const clickHandler = () => {
    document.addEventListener('click', e => {
        if(e.target.matches('.links')){
            showBookInfo(e.target)
        } else if (e.target.matches('.like-button')){
            if(e.target.innerText === "LIKE"){
            const bookId = e.target.parentElement.dataset.id

            getUsersFromBook(bookId)
            .then(users => {
                const newUser = {
                    id: 1,
                    username: 'pouros'
                }
                users.push(newUser)
                const bookUsers = {
                    users
                }
                const options = {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accepts": "appication/json"
                    },
                    body: JSON.stringify(bookUsers)
                }

                fetch(url+bookId, options)
                .then(response => response.json())
                .then(book => {
                    const bookPagesContainer = document.querySelector('#show-panel')
                    const matchingBookDiv = bookPagesContainer.querySelector(`[data-id ='${book.id}']`)
                    const bookUl = matchingBookDiv.querySelector('ul')
                    const likeLi = document.createElement('li')
                    const lastUser = book.users.pop()
                    likeLi.textContent = lastUser.username
                    bookUl.append(likeLi)
                    
                    const likeButton = matchingBookDiv.querySelector('button')
                    likeButton.innerText = "UNLIKE"
                })
            })
            } else if(e.target.innerText === "UNLIKE"){
                const bookId = e.target.parentElement.dataset.id
                getUsersFromBook(bookId)
                .then(users => {
                    
                    users.pop()
                    const bookUsers = {
                        users 
                    }
                    const options = {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Accepts": "appication/json"
                        },
                        body: JSON.stringify(bookUsers)
                    }
                    fetch(url+bookId, options)
                    .then(response => response.json())
                    .then(book => {
                        const bookPagesContainer = document.querySelector('#show-panel')
                    const matchingBookDiv = bookPagesContainer.querySelector(`[data-id ='${book.id}']`)
                    const bookUl = matchingBookDiv.querySelector('ul')
                    bookUl.querySelector('li:last-child').remove()

                    
                    const likeButton = matchingBookDiv.querySelector('button')
                    console.log(likeButton)
                    likeButton.innerText = "LIKE"


                    })

                })

                
            }
            
        }

    })
}

const showBookInfo = el => {
    const bookLink = el
    const bookId = bookLink.dataset.id
    const bookPagesContainer = document.querySelector('#show-panel')
    const booksDiv = document.querySelectorAll('.book-page')
    for(const book of booksDiv){
        book.style.display = 'none'
    }
    const matchingBookDiv = bookPagesContainer.querySelector(`[data-id ='${bookId}']`)
    matchingBookDiv.style.display = "block"
}
const getUsersFromBook = bookId => {
    return fetch(url+bookId)
    .then(response => response.json())
    .then(book => book.users)
}

getBooks()
clickHandler()
// buttonContent({
//     "id": 1,
//     "title": "Grapefruit",
//     "subtitle": "A book of Instruction and Drawings.",
//     "description": "Back in print for the first time in nearly thirty years, here is Yoko Ono's whimsical, delightful, subversive, startling book of instructions for art and for life. 'Burn this book after you've read it.' -- Yoko 'A dream you dream alone may be a dream, but a dream two people dream together is a reality. This is the greatest book I've ever burned.' -- John",
//     "author": "Yoko Ono",
//     img_url: "https://books.google.com/books/content?id=3S8Rwr-iBdoC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
//     users: [
//     {
//     id: 2,
//     username: "auer"
//     },
//     {
//     id: 1,
//     username: "maverick"
//     }
//     ]
//     })

});


//create all books then hide and re render based on click
