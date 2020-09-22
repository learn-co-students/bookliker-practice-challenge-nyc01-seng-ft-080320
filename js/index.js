document.addEventListener("DOMContentLoaded", function() {

    const BOOKS_URL = "http://localhost:3000/books"

    const getBooks = () => {
        fetch(BOOKS_URL)
        .then(response => response.json())
        .then(books => renderBookList(books))
    }

    const renderBookList = books => {
        books.map(renderBookListItem);
    }

    const renderBookListItem = book => {
        const bookUl = document.querySelector("#list");
        const bookLi = document.createElement("li");
        bookLi.textContent = `${book.title}`;
        bookLi.classList.add("book-list-item");
        bookLi.dataset.book_id = `${book.id}`
        bookUl.append(bookLi);
    }

    const clickHandler = () => {
        document.addEventListener("click", (e) => {
            if(e.target.matches(".book-list-item")) {
                    const book_id = e.target.dataset.book_id
                    const book_url = BOOKS_URL + "/" + book_id
                    fetch(book_url)
                    .then(response => response.json())
                    .then(book => renderBookShow(book))
            }
            if (e.target.matches("#like-button")) {
                getLikers(e.target);
            } else if (e.target.matches("#unlike-button")){
                getUnlikers(e.target)
            }

        })
    }

    const unlikeBook = (book) => {
        const book_id = document.querySelector("#show-panel").dataset.id
        const book_url = BOOKS_URL + "/" + book_id

        likerObj = {"users": []}

        for (const user of book.users) {
            if(user.id != 1) {
                let userObj = {"id":`${user.id}`, "username":`${user.username}`};
                likerObj["users"].push(userObj);
            }
        }

        fetchOptions = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(likerObj)
        }

        fetch(book_url, fetchOptions)
        .then(response => response.json())
        .then(book => {
            console.log(book)
            renderBookShow(book)
        })

    }

    const getUnlikers = (el) => {
        const book_id = el.parentElement.dataset.id
        const book_url = BOOKS_URL + "/" + book_id
        fetch(book_url)
        .then(response => response.json())
        .then(book => unlikeBook(book))
    }

    const getLikers = (el) => {
        const book_id = el.parentElement.dataset.id
        const book_url = BOOKS_URL + "/" + book_id
        fetch(book_url)
        .then(response => response.json())
        .then(book => likeBook(book))
    }

    const likeBook = (book) => {
        const book_id = document.querySelector("#show-panel").dataset.id
        const book_url = BOOKS_URL + "/" + book_id

        likerObj = {"users": []}

        for (const user of book.users) {
            let userObj = {"id":`${user.id}`, "username":`${user.username}`};
            likerObj["users"].push(userObj);
        }

        if (likerObj["users"].slice(-1)[0].id != 1 ) {
            userLikeObj = {"id":"1", "username":"pouros"}
            likerObj["users"].push(userLikeObj)
        }

        likeOptions = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(likerObj)
        }

        fetch(book_url, likeOptions)
        .then(response => response.json())
        .then(book => {
            console.log(book)
            renderBookShow(book);
        })
    }

    const renderBookShow = book => {
        const book_panel = document.querySelector("#show-panel")
        book_panel.dataset.id = `${book.id}`
        book_panel.innerHTML = `
        <img src="${book.img_url}">
        <h4>${book.title}</h4>
        <h4>${book.subtitle}</h4>
        <h4>${book.author}</h4>
        <p>${book.description}</p>
        `
        const userUl = document.createElement("ul")
        book.users.map(user => {
            addUserToList(user, userUl)
        })

        let check = book.users.find(function(user) {
            return user.id === "1"
        })

        const button = document.createElement("button")
        if (!!check) {
            button.id = "unlike-button"
            button.innerText = "Unlike"
        } else {
            button.id = "like-button"
            button.innerText = "Like"
        }

        book_panel.append(button, userUl)
    }

    const addUserToList = (user, user_list) => {
        const userLi = document.createElement("li")
        userLi.textContent = `${user.username}`
        userLi.dataset.user_id = `${user.id}`
        user_list.append(userLi)
    }

    clickHandler();
    getBooks();
});
