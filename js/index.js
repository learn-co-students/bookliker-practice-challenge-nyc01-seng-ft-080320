// globoz
const baseURL = 'http://localhost:3000/'

// fnnies
const createNewUserArray = (button) => {
    let collection = button.parentElement.querySelectorAll('li');
    let arr = [];

    collection.forEach(li => {
        let user = {'id': `${li.dataset.userId}`, 'username': `${li.innerText}`}
        arr.push(user);
    });
    arr.push({"id":1, "username":"pouros"});
    return arr;
}
const likeBook = (e) => {
    let button = e.target;
    let newLikesArray = createNewUserArray(button);
    const config = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accepts': 'application/json'
        },
        body: JSON.stringify({'users': newLikesArray})
    }
    fetch(baseURL + 'books/' + 1, config).then(resp => resp.json()).then((data) => {
        console.log(data);
    });
}
const hideBooksPanel = () => {
    document.querySelectorAll('.showDiv').forEach(div => {
        div.style.display = 'none'
    })
};

// hides all books and then renders book based on click event
const revealBook = (e) => {
    hideBooksPanel();
    let showId = e.target.dataset.bookId
    document.querySelector(`div[data-book-id='${showId}']`).style.display = 'block';

};
// diss my click handler
const clickBoi = () => {
    document.addEventListener('click', e => {
        // matching by attr
        if (e.target.matches('[data-book-id]')) {
            revealBook(e);
        } else if (e.target.matches('button')) {
            likeBook(e);
        }
    });
};

// creates  likes UL from book using book.users
const createLikesList = (book) => {
    let ul = document.createElement('ul');
    let button = document.createElement('button')
    button.textContent = 'Like';

    for (let user of book.users) {
        let li = document.createElement('li');
        li.setAttribute('data-user-id', `${user.id}`);
        li.textContent = `${user.username}`;
        ul.appendChild(li);
    }
    ul.appendChild(button);
    return ul;
}


// appends book title as li to list and creates associated show div with display = 'none'
const renderBook = (book) => {
    // we want to append the elements on these nodes
    const booksUL = document.getElementById('list');
    const panel = document.getElementById('show-panel');

    // making the li and div
    let bookTitleLi = document.createElement('li');
    let bookBodyDiv = document.createElement('div');

    // filling out the new elements -- we can access data-book-id via .dataset.bookId
    bookTitleLi.innerText = book.title;
    bookTitleLi.setAttribute('data-book-id', book.id);

    // we will use this id to toggle on display
    bookBodyDiv.setAttribute('data-book-id', book.id)
    // were going to use this class to toggle off display
    bookBodyDiv.setAttribute('class', 'showDiv')

    //panel html without likes UL
    bookBodyDiv.innerHTML = `
        <p><img src = '${book.img_url}'</img></p>
        <p><b>${book.title}</b></p>
        <p><b>${book.author}</b></p>
        <p><b>${book.description}</b></p>
    `
    // we could of used a fn for the other html elements too... but lazy -- this will make likes UL
    let likesUL = createLikesList(book);
    //make the show panels hidden on init
    bookBodyDiv.style.display = 'none'

    // appending elements
    booksUL.appendChild(bookTitleLi);
    bookBodyDiv.appendChild(likesUL);
    panel.append(bookBodyDiv);
}

const renderBooks = (books) => {
    for (let book of books) {
        renderBook(book);
    }
};

const initBooksDom = () => {
    fetch(baseURL + 'books').then(resp => resp.json()).then(books => renderBooks(books));
};

document.addEventListener("DOMContentLoaded", function() {
    initBooksDom();
    clickBoi();

});
