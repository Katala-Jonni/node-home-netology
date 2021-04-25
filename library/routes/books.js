const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const axios = require('axios');
const { Router } = require('express');
const fileMiddleware = require('../middleware/file');
const db = require('../store/index');
const { Book } = require('../models');
const { createLog } = require('../utils');
const router = Router();

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

router.get('/create', (req, res) => {
    res.render('books/create', {
        title: 'Создать книгу',
        book: {}
    });
});

router.get('/update/:id', (req, res) => {
    const { id } = req.params;
    const book = db
        .get('books')
        .find({ id })
        .value();
    if (!book) {
        return res
            .status(404)
            .redirect('/404');
    }
    res.render('books/update', {
        title: book.title || 'Библиотека',
        book
    });
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const book = db
        .get('books')
        .find({ id })
        .value();
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
    const counter = request.data.counter;
    console.log(counter);
    res.render('books/view', {
        title: book.title || 'Библиотеки',
        book,
        counter
    });
});

router.get('/:id/download-img', (req, res) => {
    const { id } = req.params;
    const book = db
        .get('books')
        .find({ id })
        .value();
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
});

router.post('/create', fileMiddleware.single('fileBook'), (req, res) => {
    const newBook = createNewBook(req.body);
    if (req.file) {
        const { path: pathFile } = req.file;
        newBook.fileBook = pathFile;
    }
    db
        .get('books')
        .push(newBook)
        .write();
    res.status(201);
    res.redirect('/');
});

router.post('/update/:id', fileMiddleware.single('fileBook'), async (req, res) => {
    const { id } = req.params;
    const book = db
        .get('books')
        .find({ id })
        .value();
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
    db
        .get('books')
        .find({ id })
        .assign({
            title,
            description,
            authors,
            fileBook
        })
        .write();
    res.redirect('/');
});

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const book = db
        .get('books')
        .find({ id })
        .value();
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

    db
        .get('books')
        .remove({ id })
        .write();
    res.redirect('/');
});

module.exports = router;
