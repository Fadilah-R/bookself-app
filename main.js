// Do your work here...
const STORAGE_KEY = 'BOOKSHELF_APP';
let books = [];

function isStorageExist() {
    return typeof Storage !== 'undefined';
}

function saveData() {
    if (isStorageExist()) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
}

function loadData() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
        books = JSON.parse(storedData);
    }
    renderBooks();
}

function addBook(title, author, year, isComplete) {
    const book = {
        id: +new Date(),
        title,
        author,
        year: Number(year),
        isComplete
    };
    books.push(book);
    saveData();
    renderBooks();
}

function toggleBookStatus(bookId) {
    const book = books.find(book => book.id === bookId);
    if (book) {
        book.isComplete = !book.isComplete;
        saveData();
        renderBooks();
    }
}

function deleteBook(bookId) {
    books = books.filter(book => book.id !== bookId);
    saveData();
    renderBooks();
}

function editBook(bookId, newTitle, newAuthor, newYear) {
    const book = books.find(book => book.id === bookId);
    if (book) {
        book.title = newTitle;
        book.author = newAuthor;
        book.year = Number(newYear);
        saveData();
        renderBooks();
    }
}

function searchBooks(query) {
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query.toLowerCase()));
    renderBooks(filteredBooks);
}

function renderBooks(filteredBooks = books) {
    const incompleteList = document.getElementById('incompleteBookList');
    const completeList = document.getElementById('completeBookList');
    incompleteList.innerHTML = '';
    completeList.innerHTML = '';
    
    filteredBooks.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book-item');
        bookElement.setAttribute('data-bookid', book.id);
        bookElement.innerHTML = `
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            <div>
                <button onclick="toggleBookStatus(${book.id})">${book.isComplete ? 'Belum selesai' : 'Selesai'}</button>
                <button onclick="deleteBook(${book.id})">Hapus</button>
                <button onclick="promptEditBook(${book.id})">Edit</button>
            </div>
        `;
        
        if (book.isComplete) {
            completeList.appendChild(bookElement);
        } else {
            incompleteList.appendChild(bookElement);
        }
    });
}

const bookForm = document.getElementById('bookForm');
bookForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = document.getElementById('bookFormYear').value;
    const isComplete = document.getElementById('bookFormIsComplete').checked;
    
    addBook(title, author, year, isComplete);
    bookForm.reset();
});

document.getElementById('searchBook').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('searchBookTitle').value;
    searchBooks(query);
});

document.addEventListener('DOMContentLoaded', loadData);

function promptEditBook(bookId) {
    const book = books.find(book => book.id === bookId);
    if (book) {
        const newTitle = prompt('Masukkan judul baru:', book.title);
        const newAuthor = prompt('Masukkan penulis baru:', book.author);
        const newYear = prompt('Masukkan tahun baru:', book.year);
        if (newTitle && newAuthor && newYear) {
            editBook(bookId, newTitle, newAuthor, newYear);
        }
    }
}

console.log('Hello, world!');
