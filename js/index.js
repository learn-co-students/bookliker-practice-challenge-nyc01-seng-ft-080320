

const BASE_URL = 'http://localhost:3000'
const BOOKS_URL = BASE_URL + '/books'

document.addEventListener("DOMContentLoaded", function() {
    const domList = document.getElementById("list")
    let domShowPanel = document.getElementById("show-panel")
    
    const fetchBooks = () => {
        fetch(BOOKS_URL)
        .then(response => response.json())
        .then(booksHash => {
            booksHash.forEach(bookData => {
                renderBooks(bookData)    
            });
        })
    }

    const fetchBook = (id) =>{
        fetch(BOOKS_URL+'/'+id)
        .then(response => response.json())
        .then(bookHash => {
            // console.log(bookHash)
            renderBook(bookHash)
        })
    }

    function renderBooks(book){
        const li = document.createElement('li')
        li.dataset.id = book.id
        li.innerHTML = ` ${book.title}
        `
        domList.append(li)
    }

    function renderBook(book){

        const renderLikes = (book, users) => {
            
            let bookUl = document.createElement("ul")
            for (let i = 0; i < users.length; i++) {
                let userLi = document.createElement("li")
                userLi.textContent = users[i].username
                bookUl.append(userLi)
            }
            return bookUl
        }
        
        const div = document.createElement('div')
        div.dataset.id = book.id
        div.innerHTML = ` 
            <img src = ${book.img_url} alt = ${book.title}>    
            <h1><p> ${book.title} </p></h1>
            <p> Author: ${book.author} </p>
            <p> Subtitle: ${book.subtitle} </p>
            <p> Description:  </p>
            ${book.description}
            <p><button type="button" data-like-id="${book.id}">Like</button></p>
        `
        
        div.append(renderLikes(book, book.users))


        while (domShowPanel.firstChild) {
            domShowPanel.removeChild(domShowPanel.firstChild);
        }
        
        domShowPanel.append(div)
    }
    

    const clickHandler = () => {
        domList.addEventListener('click', ()=>{
            const showSelectedBook = () => {
                const selectedBookId = event.target.dataset.id
                fetchBook(selectedBookId)
            }
            showSelectedBook()
        })

        domShowPanel.addEventListener('click', ()=>{
            const likeBtn = () => {
                // console.log(event.target)
                
                const bookId = event.target.dataset.likeId
                
                // send fetch request
                const updateLike = (bookId) => {
                    let data ={
                        name: 'Vincent'
                    }

                    const options = {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    }

                    fetch(BOOKS_URL+"/"+ bookId, options)
                    .then(response => response.json())
                    .then(data => console.log(data))
                }

                updateLike(bookId)
            }
            likeBtn()
            // debugger

        })

        

        
    }

    clickHandler()
    fetchBooks()
});
