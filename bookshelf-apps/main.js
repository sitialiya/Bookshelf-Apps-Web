const books = [];
const RENDER_EVENT = 'render-book';

function generateId(){
    return +new Date;
}

function generateBookObject (id, title, author, year, isComplete){
    return {
        id, 
        title,
        author,
        year,
        isComplete
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });

    if (isStorageExist()){
        loadDataFromStorage();
    }
});

function addBook(){
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookComplete = document.getElementById('inputBookIsComplete').checked;
    
    generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    document.getElementById('inputBookTitle').value = "";
    document.getElementById('inputBookAuthor').value = "";
    document.getElementById('inputBookYear').value = "";
}

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBook = document.getElementById('incompleteBookshelfList');
    incompleteBook.innerHTML = '';
    
    const completeBook = document.getElementById('completeBookshelfList');
    completeBook.innerHTML = '';
    
    for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete){
        incompleteBook.append(bookElement);
    } else {
        completeBook.append(bookElement);
    }
    }
});

function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;
    
    const textAuthor = document.createElement('p');
    textAuthor.innerText = 'Penulis: ' + bookObject.author;
    
    const textYear = document.createElement('p');
    textYear.innerText = 'Tahun: ' + bookObject.year;

    const buttonGreenComplete = document.createElement('button');
    buttonGreenComplete.innerText = 'Selesai dibaca';
    buttonGreenComplete.classList.add('green');

    const buttonGreenNotComplete = document.createElement('button');
    buttonGreenNotComplete.innerText = 'Selesai dibaca';
    buttonGreenNotComplete.classList.add('green');

    const buttonRedRemove = document.createElement('button');
    buttonRedRemove.innerText = 'Hapus Buku';
    buttonRedRemove.classList.add('red');
    
    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTitle, textAuthor, textYear, buttonGreenNotComplete, buttonRedRemove);
    container.setAttribute('id', `book-${bookObject.id}`);
    
    const bookComplete = document.getElementById('inputBookIsComplete');
    isComplete = bookComplete.checked;
    
    if (bookObject.isComplete){
        const buttonGreenComplete = buttonGreenNotComplete;
        buttonGreenComplete.innerText = 'Belum Selesai dibaca';

        buttonGreenComplete.addEventListener('click', function(){
            undoBookFromCompleted(bookObject.id);
        });

        buttonRedRemove.addEventListener('click', function(){
            const confirmed = confirm('Anda yakin akan menghapus buku ' + bookObject.title + '?');
            if(confirmed){
                removeBookFromCompleted(bookObject.id);
                alert('Buku ' + bookObject.title + ' berhasil dihapus!')
            }else{
                alert('Buku ' + bookObject.title + ' tidak jadi dihapus!');
            }
        });

        container.append(buttonGreenComplete, buttonRedRemove)
    } else {
        buttonGreenNotComplete.addEventListener('click', function(){
            addBookToCompleted(bookObject.id);
        });

        buttonRedRemove.addEventListener('click', function(){
            const confirmed = confirm('Anda yakin akan menghapus buku ' + bookObject.title + '?');
            if(confirmed){
                removeBookFromCompleted(bookObject.id);
                alert('Buku ' + bookObject.title + ' berhasil dihapus!')
            }else{
                alert('Buku ' + bookObject.title + ' tidak jadi dihapus!');
            }
        });

        container.append(buttonGreenNotComplete, buttonRedRemove)
    }

    return container;
}

function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
        return index;
        }
    }
    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
        books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}


const searchSubmit = document.getElementById('searchBook');
searchSubmit.addEventListener('submit', function(event){
    event.preventDefault();
    searchTitle();
});

function searchTitle(){
    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    let bookList = document.querySelectorAll('.book_item');

    bookList.forEach(function(item){
        const book = item.firstChild.textContent.toLowerCase();
        if(book.indexOf(searchBook) != -1){
            item.setAttribute("style", "display" );
            document.getElementById('searchBookTitle').value = "";
        }else{
            item.setAttribute("style", "display : none" );
            document.getElementById('searchBookTitle').value = "";
            
        }
    });
}