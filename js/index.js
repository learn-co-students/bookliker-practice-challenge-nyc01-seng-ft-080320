document.addEventListener("DOMContentLoaded", function() {
  document.addEventListener('click', e => {
    if(e.target.tagName == 'LI'){
      getBook(e.target.id)
    }else if(e.target.id == 'like-button'){
      updateBook(e.target.dataset.id, true)
    }else if(e.target.id == 'dislike-button'){
      updateBook(e.target.dataset.id)
    }
  })

  function getBooks() {
    fetch('http://localhost:3000/books')
      .then(resp => resp.json())
      .then(data => {
        for (const book of data) {
          bookList(book)
        }
      })
  }

  function bookList(book) {
    const newLi = document.createElement('li')
    newLi.id = book.id
    newLi.innerText = book.title
    document.querySelector('#list').append(newLi)
  }

  function getBook(bookId) {
    fetch(`http://localhost:3000/books/${bookId}`)
      .then(resp => resp.json())
      .then(data => displayBook(data))
  }

  function displayBook(bookObj) {
    const showPanel = document.querySelector('#show-panel')
    showPanel.innerText = ''
    const newDiv = document.createElement('div')

    newDiv.innerHTML = `
    <img src="${bookObj.img_url}">
    <h3>${bookObj.title}</h3>
    <h4>${bookObj.subtitle}</h4>
    <h3>${bookObj.author}</h3>
    <p>${bookObj.description}</p>
    <ul></ul>
    `

    const ul = newDiv.querySelector('ul')

    for (const user of bookObj.users) {
      let newLi = document.createElement('li')
      newLi.innerText = user.username
      ul.append(newLi)    
    }

    showPanel.append(newDiv)

    const findId = el => el.id == 1
    const findResult = bookObj.users.find(findId)
    const newButton = document.createElement('button')
    newButton.dataset.id = bookObj.id
    if(findResult){
      newButton.id = "dislike-button"
      newButton.innerText = 'DISLIKE'
    }else{
      newButton.id = "like-button"
      newButton.innerText = 'LIKE'
    }
    showPanel.append(newButton)      
  }

  function updateBook(bookId, boolean) {    
    fetch(`http://localhost:3000/books/${bookId}`)
      .then(resp => resp.json())
      .then(data => {
        if(boolean){
          addLike(data)
        }else{
          removeLike(data)
        }
      })
  }

  function addLike(bookObj) {
    let temp = bookObj.users
    temp.push({"id":1, "username":"pouros"})

    const options = {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify({
        "users": temp
      })
    }

    fetch(`http://localhost:3000/books/${bookObj.id}`, options)
      .then(resp => resp.json())
      .then(data => displayBook(data))
  }

  function removeLike(bookObj) {
    let temp = bookObj.users

    const options = {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify({
        "users": temp.slice(0,-1)
      })
    }

    fetch(`http://localhost:3000/books/${bookObj.id}`, options)
      .then(resp => resp.json())
      .then(data => displayBook(data))
  }

  getBooks()
});
