document.addEventListener("DOMContentLoaded", function() {

    const baseUrl = "http://localhost:3000/books/"
    
    
    const fetchBooks = () => {
        fetch(baseUrl)
        .then(response => response.json())
        .then(books => renderBooks(books))
    }

    const renderBooks = booksArray => {
        for (const book of booksArray) {
           renderSingleBook(book); 
        }
    }

    const renderSingleBook = book => {
        const bookLi = document.createElement('li');
        bookLi.dataset.id = book.id
        bookLi.className = "books";
        bookLi.textContent = book.title;
        
        const listPanel = document.querySelector("#list-panel");
        listPanel.append(bookLi);   
    }

    const fetchBookInfo = bookId => {
        fetch(baseUrl)
        .then(response => response.json())
        .then(books => {
            const bookObj = books[parseInt(bookId) - 1]
            renderBookInfo(bookObj)
            })
        }

    const renderBookInfo = bookObj => {
        const showPanel = document.querySelector("#show-panel")
        const bookDiv = document.createElement('div');
        const likeButton = document.createElement('button');
        likeButton.className = "like-button"
        likeButton.dataset.id = bookObj.id
    
        if (bookObj.users.find(({ id }) => id === "1")) {
            likeButton.textContent = "👎"} else {
                likeButton.textContent = "👍"
            }
    
        bookDiv.innerHTML = `
        <img src=${bookObj.img_url}>
        <h3>${bookObj.title}</h3>
        <h3>${bookObj.subtitle}</h3>
        <h3>${bookObj.author}</h3>
        <p>${bookObj.description}</p>
        `
        const userUl = createUserLi(bookObj.users);
        bookDiv.append(userUl);
        bookDiv.append(likeButton);
        showPanel.append(bookDiv);
    }

    const createUserLi = users => {
        const userUl = document.createElement('ul')
        userUl.className = "user-list";
        for(const user of users) {
            
            const userLi = document.createElement('li');
            userLi.dataset.id = user.id;
            userLi.textContent = user.username;

            userUl.append(userLi);
        }
        return userUl;
    }

    const removeBook = () => {
        const showPanel = document.querySelector("#show-panel")
        showPanel.innerHTML = "";
    }

    const userObj = userArray => {
    let previousUsers = []
        for(const user of userArray){
            const previousUser = {
                "id": user.dataset.id,
                "username": user.innerText
            }
            previousUsers.push(previousUser);
        }
        return previousUsers
    }
    

    const updateUsers = bookLikeButton => {
        const bookId = bookLikeButton.dataset.id
        const userList = document.querySelector(".user-list");
        const userLis = userList.children;
        let previousUserObjects = userObj(userLis);
        const myUser = {"id": "1", "username":"pouros"}
        // console.log(previousUserObjects)
        
        //  console.log(myUser)
        if(previousUserObjects.find(user => user.id === myUser.id)){
            previousUserObjects = previousUserObjects.filter(user => {return user.id !== myUser.id});
        } else {
            previousUserObjects.push(myUser);
        }

        const options = {
            method: "PATCH",
            headers: {
                "content-type":"application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({
                
                "users": previousUserObjects
                // users: newUserObjects
            })
        }

        fetch(baseUrl + bookId, options)
        .then(response => response.json())
        .then(data => {
            removeBook()
            renderBookInfo(data)
        })
    }



    const clickHandler = () => {
        document.addEventListener("click", e => {
            if(e.target.matches(".books")) {
                removeBook()
                fetchBookInfo(e.target.dataset.id)
            } else if(e.target.matches(".like-button")){
                console.log(e.target)
                updateUsers(e.target)
                
            }
                
            
        }

        )
    }

    fetchBooks();
    clickHandler();
});
