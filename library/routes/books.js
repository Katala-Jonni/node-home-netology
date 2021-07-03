const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const axios = require('axios');
const { Router } = require('express');
const fileMiddleware = require('../middleware/file');
const { createLog } = require('../utils');
const router = Router();
const Book = require('../models/Book');

const createNewBook = item => {
    return {
        title: item.title,
        description: item.description,
        authors: item.authors,
        favorite: item.favorite,
        fileCover: item.fileCover,
        fileName: item.fileName
    };
};

const deleteFile = async filePath => await fs.unlink(filePath);

router.get('/create', (req, res) => {
    res.render('books/create', {
        title: 'Создать книгу',
        book: {}
    });
});

router.get('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res
                .status(404)
                .redirect('/404');
        }
        res.render('books/update', {
            title: book.title || 'Библиотека',
            book
        });
    } catch (e) {
        console.log(e.message);
    }

});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res
                .status(404)
                .redirect('/404');
        }
        await axios({
            method: 'post',
            url: `${process.env.COUNTER_API_URL}/counter/${id}/incr`
        });
        const request = await axios(`${process.env.COUNTER_API_URL}/counter/${id}`);
        const counterBook = request.data.counter;
        res.render('books/view', {
            title: book.title || 'Библиотеки',
            book,
            counter: counterBook.counter
        });
    } catch (e) {
        console.log(e.message);
    }
});

router.get('/:id/download-img', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book || !book.fileBook) {
            return res
                .status(404)
                .redirect('/404');
        }
        res.download(
            path.join(process.cwd(), book.fileBook),
            book.title || book.fileBook,
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
    } catch (e) {
        console.log(e.message);
    }
});

router.post('/create', fileMiddleware.single('fileBook'), async (req, res) => {
    try {
        const newBook = createNewBook(req.body);
        if (req.file) {
            const { path: pathFile } = req.file;
            newBook.fileBook = pathFile;
        }
        const book = new Book(newBook);
        await book.save();
        res.status(201);
        res.redirect('/');
    } catch (e) {
        console.log(e.message);
    }
});

router.post('/update/:id', fileMiddleware.single('fileBook'), async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res
                .status(404)
                .redirect('/404');
        }
        if (req.file) {
            const { path: pathFile } = req.file;
            req.body.fileBook = pathFile;
            // Удаление прошлой картинки
            if (book.fileBook) {
                await deleteFile(book.fileBook);
            }
            // Удаление прошлой картинки, если изменили и удалили вообще картинку
            // но прошлая картинка есть на сервере
        } else if (!req.body.fileBook && book.fileBook) {
            await deleteFile(book.fileBook);
        }
        const {
            title,
            description,
            authors,
            fileBook
        } = req.body;
        const updateBook = {
            title,
            description,
            authors,
            fileBook
        };
        await Book.findByIdAndUpdate(id, updateBook);
        res.redirect('/');
    } catch (e) {
        console.log(e.message);
    }
});

router.post('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res
                .status(404)
                .redirect('/404');
        }
        // Удаление картинки
        if (book.fileBook) {
            try {
                await deleteFile(book.fileBook);
            } catch (e) {
                console.log(e);
            }
        }
        await Book.deleteOne({ _id: id });
        res.redirect('/');
    } catch (e) {
        console.log(e.message);
    }
});

module.exports = router;
