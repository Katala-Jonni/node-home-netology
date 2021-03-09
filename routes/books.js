const { Book } = require('../models');
const { Router } = require('express');
const router = Router();

const store = {
    books: []
};

[1, 2, 3].forEach(item => {
    const book = new Book(
        `title ${item}`,
        `description ${item}`,
        `authors ${item}`,
        `favorite ${item}`,
        `fileCover ${item}`,
        `fileName ${item}`
    );
    store.books.push(book);
});

const createNewBook = item => {
    return new Book(
        item.title,
        item.description,
        item.authors,
        item.favorite,
        item.fileCover,
        item.fileName
    );
};

router.get('/', (req, res) => {
    const { books } = store;
    res.json(books);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const { books } = store;
    const idx = books.findIndex(el => el.id === id);
    if (idx === -1) {
        res.status(404);
        return res.json('book | not found');
    }
    res.json(books[idx]);
});

router.post('/', (req, res) => {
    const { books } = store;
    const newBook = createNewBook(req.body);
    store.books = [...books, newBook];
    res.status(201);
    res.json(newBook);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { books } = store;
    const idx = books.findIndex(el => el.id === id);
    if (idx === -1) {
        res.status(404);
        return res.json('book | not found');
    }
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    } = req.body;
    store.books[idx] = {
        ...store.books[idx],
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    };
    res.json(store.books);
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    let { books } = store;
    const idx = books.findIndex(el => el.id === id);
    if (idx === -1) {
        res.status(404);
        return res.json('book | not found');
    }
    store.books = books.filter(book => book.id !== id);
    res.json('ok');
});

module.exports = router;
