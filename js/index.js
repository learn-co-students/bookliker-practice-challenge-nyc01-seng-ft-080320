const renderBooks = (books) => {
  const bookUl = document.querySelector('#list');
  for (book of books) {
    const newLi = document.createElement('li');
    newLi.id = book.id;
    newLi.textContent = book.title;
    bookUl.append(newLi);
  }
}

const clickHandler = () => {
  document.addEventListener('click', e => {
    if (e.target.matches('li')){
      getBook(e.target.id);
    } else if (e.target.matches('button')) {
      findBook(e.target.parentNode.dataset.bookId);
    }
  });
};

const getBook = (bookId) => {
  fetch(`http://localhost:3000/books/${bookId}`)
    .then(resp => resp.json())
    .then(json => showBook(json));
};

const findBook = (bookId) => {
  fetch(`http://localhost:3000/books/${bookId}`)
    .then(resp => resp.json())
    .then(json => toggleLike(json));
}

const showBook = (book) => {
  const showPanel = document.querySelector('#show-panel');

  showPanel.dataset.bookId = '';

  while (showPanel.firstChild) {
    showPanel.firstChild.remove();
  }

  showPanel.dataset.bookId = book.id;

  const newImg = document.createElement('img');
  newImg.src = book['img_url'];
  showPanel.append(newImg);

  const newTitle = document.createElement('h3');
  newTitle.textContent = book.title;
  showPanel.append(newTitle);

  const newSubTitle = document.createElement('h3');
  newSubTitle.textContent = book.subtitle;
  showPanel.append(newSubTitle);

  const newAuthor = document.createElement('h3');
  newAuthor.textContent = book.author;
  showPanel.append(newAuthor);

  const newDesc = document.createElement('p');
  newDesc.textContent = book.description;
  showPanel.append(newDesc);

  const newUl = document.createElement('ul');

  for (user of book.users) {
    const newLi = document.createElement('li');
    newLi.textContent = user.username;
    newUl.append(newLi);
  }

  showPanel.append(newUl);

  const likeButton = document.createElement('button');
  if (book.users.find(u => u.id == 1)) {
    likeButton.textContent = "UNLIKE";
  } else {
    likeButton.textContent = "LIKE";
  }
  showPanel.append(likeButton);
};

const toggleLike = (book) => {
  const showPanel = document.querySelector('#show-panel');
  const button = showPanel.querySelector('button');
  if (button.textContent == "LIKE") {
    book.users.push({
      "id": 1,
      "username": "pouros" 
    });
    fetch(`http://localhost:3000/books/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        users: book.users
      })
    })
    .then(resp => resp.json())
    .then(json => showBook(book));
  } 
  else {
    book.users.pop();
    fetch(`http://localhost:3000/books/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        users: book.users
      })
    })
    .then(resp => resp.json())
    .then(json => showBook(book));
  }
};

document.addEventListener("DOMContentLoaded", function() {
  fetch('http://localhost:3000/books')
    .then(resp => resp.json())
    .then(json => renderBooks(json));

  clickHandler();
});
