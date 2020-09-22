document.addEventListener("DOMContentLoaded", function() {
    baseURL = 'http://localhost:3000/books/'
    myUserInfo = {"id":1, "username":"pouros"}
    
    const listBooks = url => {
        
        fetch(url)
        .then(response => response.json())
        .then(books => renderBooks(books))
    }

    const renderBooks = books => {
        const listPanel = document.querySelector('#list')
        
        for(const book of books){
            const li = document.createElement('li')
            li.dataset.bookId = book.id
            li.textContent = book.title
            listPanel.append(li)
        }
    }

    const clickHandler = () => {
        document.addEventListener('click', e => {
            if(e.target.matches('li')){
                const bookId = e.target.dataset.bookId
                findBook(e.target, bookId)
            }if(e.target.textContent === "Like"){
                likeBook(e.target)
            }
        })
    }

    const likeBook = target => {
        const id = target.dataset.id

        fetch(baseURL)
        .then(response => response.json())
        .then( books => {
            for(const book of books){
                if(book.id === parseInt(id)){
                    save(book.users, id) 
                }
            }
        })
    }

    const save = (users, id) => {
        users.push(myUserInfo)
    
        options = {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accept": "application/json" 
            },
            body: JSON.stringify({
                users: users
            })
        }

        fetch(baseURL+id, options)
        .then(response => response.json())
        .then(book => renderUpdatedBook(book))
    }

    const findBook = (target, bookId) => {
        fetch(baseURL)
        .then(response => response.json())
        .then(books => {
            for(const book of books){
                if(book.id === parseInt(bookId)){
                    renderBookBio(book)
                }
            }
        })
    }

    const renderUpdatedBook = book => {
        const showPanel = document.querySelector('#show-panel')
        showPanel.querySelector('div').remove()

        const bookDiv = document.createElement('div')
        bookDiv.dataset.id = book.id
        showPanel.append(bookDiv)

        const userUl = getUsers(book)

        bookDiv.innerHTML = `
            <img src=${book.img_url}>
            <h1>${book.title}</h1>
            <h2>${book.subtitle}</h2>
            <h2>${book.author}</h2>
            <p>${book.description}</p>
            <button data-id=${book.id}>Like</button>
        `
        const button = bookDiv.querySelector('button')
        button.insertAdjacentElement('beforebegin', userUl)
        button.textContent = "Unlike"
    }

    const renderBookBio = book => {
        
        const showPanel = document.querySelector('#show-panel')

        if(showPanel.firstElementChild){
            showPanel.firstElementChild.remove()
            
        }

        // if(showPanel.childElementCount === 0){
            const bookDiv = document.createElement('div')
            bookDiv.dataset.id = book.id
            showPanel.append(bookDiv)

            const userUl = getUsers(book)

            bookDiv.innerHTML = `
                <img src=${book.img_url}>
                <h1>${book.title}</h1>
                <h2>${book.subtitle}</h2>
                <h2>${book.author}</h2>
                <p>${book.description}</p>
                <button data-id=${book.id}>Like</button>
            `
            const button = bookDiv.querySelector('button')
            button.insertAdjacentElement('beforebegin', userUl)
        // }else{
        //     showPanel.querySelector('div').remove()

        //     const bookDiv = document.createElement('div')
        //     bookDiv.dataset.id = book.id
        //     showPanel.append(bookDiv)

        //     const userUl = getUsers(book)

        //     bookDiv.innerHTML = `
        //         <img src=${book.img_url}>
        //         <h1>${book.title}</h1>
        //         <h2>${book.subtitle}</h2>
        //         <h2>${book.author}</h2>
        //         <p>${book.description}</p>
        //         <button data-id=${book.id}>Like</button>
        //     `
        //     const button = bookDiv.querySelector('button')
        //     button.insertAdjacentElement('beforebegin', userUl)

        // }
    }

    const getUsers = book => {
        const users = book.users
        const ul = document.createElement('ul')
        users.forEach(user => {
            const li = document.createElement('li')
            li.dataset.userId = user.id
            li.textContent = user.username

            return ul.append(li)
        })
        return ul
    }

    clickHandler()
    listBooks(baseURL)
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
