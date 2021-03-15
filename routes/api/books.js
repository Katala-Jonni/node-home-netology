const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { Book } = require('../../models');
const { Router } = require('express');
const fileMiddleware = require('../../middleware/file');
const { createLog } = require('../../utils');
const router = Router();

const store = {
    books: []
};
// mock
const ids = [
    {
        id: 'b602c125-665c-5350-1302-0c970b5402e3',
        fileBook: path.join('public', 'img', 'b602c125-665c-5350-1302-0c970b5402e3.png')
    },
    {
        id: '93bc0d2a-1c50-586c-cdd5-edcd2e28ea8e',
        fileBook: path.join('public', 'img', '93bc0d2a-1c50-586c-cdd5-edcd2e28ea8e.png')
    },
    {
        id: '93bc0d2a-1c50-586c-cdd5-edcd2e28ea8d',
        fileBook: path.join('public', 'img', '93bc0d2a-1c50-586c-cdd5-edcd2e28ea8d.png')
    }
];

// init store
const initStore = () => {
    [1, 2, 3].forEach(item => {
        const book = new Book(
            {
                title: `title ${item}`,
                description: `description ${item}`,
                authors: `authors ${item}`,
                favorite: `favorite ${item}`,
                fileCover: `fileCover ${item}`,
                fileName: `fileName ${item}`,
                fileBook: ids[item - 1].fileBook,
                id: ids[item - 1].id
            }
        );
        store.books.push(book);
    });
};

initStore();

const createNewBook = item => {
    return new Book(
        {
            title: item.title,
            description: item.description,
            authors: item.authors,
            favorite: item.favorite,
            fileCover: item.fileCover,
            fileName: item.fileName
        }
    );
};

const deleteFile = async filePath => await fs.unlink(filePath);

// routes
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

router.post('/', fileMiddleware.single('fileBook'), (req, res) => {
    const { books } = store;
    const newBook = createNewBook(req.body);
    if (req.file) {
        const { path } = req.file;
        newBook.fileBook = path;
    }
    store.books = [...books, newBook];
    res.status(201);
    res.json(newBook);
});

router.put('/:id', fileMiddleware.single('fileBook'), async (req, res) => {
    const { id } = req.params;
    const { books } = store;
    const idx = books.findIndex(el => el.id === id);
    let fileBook = '';
    if (idx === -1) {
        res.status(404);
        return res.json('book | not found');
    }

    if (req.file) {
        const { path } = req.file;
        fileBook = path;
        // Удаление прошлой картинки
        if (store.books[idx].fileBook) {
            await deleteFile(store.books[idx].fileBook);
        }
        // Удаление прошлой картинки, если изменили и удалили вообще картинку
        // но прошлая картинка есть на сервере
    } else if (!req.body.fileBook && store.books[idx].fileBook) {
        await deleteFile(store.books[idx].fileBook);
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
        fileName,
        fileBook
    };
    return res.json(store.books);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    let { books } = store;
    const idx = books.findIndex(el => el.id === id);
    if (idx === -1) {
        res.status(404);
        return res.json('book | not found');
    }
    // Удаление картинки
    if (store.books[idx].fileBook) {
        try {
            await deleteFile(store.books[idx].fileBook);
        } catch (e) {
            console.log(e);
        }
    }
    store.books = books.filter(book => book.id !== id);
    return res.json('ok');
});

router.get('/:id/download-img', async (req, res) => {
    const { id } = req.params;
    const { books } = store;
    const idx = books.findIndex(el => el.id === id);
    if (idx === -1 || !books[idx].fileBook) {
        return res
            .status(404)
            .json('book | not found');
    }

    res.download(
        path.join(process.cwd(), books[idx].fileBook),
        books[idx].title || books[idx].fileBook,
        async err => {
            if (err) {
                try {
                    const data = `${createLog(req)}${os.EOL}${err}`;
                    await fs.appendFile(path.join(process.cwd(), 'server.log'), data + os.EOL);
                } catch (e) {
                    console.log(e);
                }

                return res
                    .status(404)
                    .json('book | not found');
            }
        });
});

module.exports = router;
