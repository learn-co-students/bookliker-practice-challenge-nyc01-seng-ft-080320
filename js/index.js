const BOOK_URL = "http://localhost:3000/books/"
document.addEventListener("DOMContentLoaded", function() {
    getBooks();
    clickHandler();

});

function getBooks(){
    fetch(BOOK_URL)
    .then(resp => resp.json())
    .then(books => renderList(books))
}

function renderList(books){
    const bookUl = document.getElementById("list")
    books.forEach(book=>{
        const bookLi = document.createElement("li")
        bookLi.dataset.id = book.id
        bookLi.textContent = book.title
        bookUl.append(bookLi)
    })

}

function clickHandler(){
    document.addEventListener("click", e => {
        if (e.target.dataset.id){
            getBook(e.target.dataset.id)
        }else if (e.target.classList.contains("like")){
            toLike(e.target)
        }
    })
}

function constructLikes(userLis){
    let bob = []
    for (const user of userLis){
        bob.push({id: parseInt(user.dataset.userId), username: user.textContent})
    }
    return bob
}


function toLike(like){
    let likes = constructLikes(like.previousSibling.children)
    
    if (like.classList.contains("hated")){
        likes.push({ "id": 1, "username": "pouros" })
        updateBook(like.dataset.likeId, likes)
    }else{
        const filtered = likes.filter(function(like){
            return like.id !== 1
        })
        updateBook(like.dataset.likeId ,filtered)
    }
}



function updateBook(bookId, likeObj){
    const obj = {
        method: "PATCH",
        headers: {"content-type": "application/json",
        "accept": "application/json"},
        body: JSON.stringify({users: likeObj})
    }
    
    
    fetch(BOOK_URL + bookId, obj)
    .then(resp => resp.json())
    .then(data=> {
        renderBook(data)
    })
}


function getBook(id){
    fetch(BOOK_URL + id)
    .then(resp => resp.json())
    .then(book => renderBook(book))
}
function renderBook(book){
    const main = document.getElementById("show-panel")
    
    let block = `<img src=${book.img_url}>
    <h3>${book.title}</h3>
    <h4>${book.author}</h4>
    <p>${book.description}</p>
    `
    main.innerHTML= block
    main.append(bookLikes(book.users))
    const likeButton = document.createElement("button")
    likeButton.textContent = "Like ME!!!!!!!"
    likeButton.classList.add("like")
    likeButton.classList.add(buttonStatus(book))
    likeButton.dataset.likeId= book.id
    main.append(likeButton)
    if (book.subtitle != ""){
        const subtitle = `<h5>${book.subtitle}</h5>`
        main.querySelector("h3").insertAdjacentHTML("afterend", subtitle)
    }
}

function buttonStatus(book){
    if (book.users.find(user => user.id === 1)) {
        return "liked"
    } else {
        return "hated"
    }
}

function bookLikes(users){
    
    const likeUl = document.createElement("ul")
    if (users.length > 0 ){
       for(user of users){
        const userLi = document.createElement("li")
        userLi.textContent = user.username
        userLi.dataset.userId = user.id
        likeUl.append(userLi)
    }
}
    return likeUl
}