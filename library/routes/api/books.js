const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const Book = require('../../models/Book');
const { Router } = require('express');
const fileMiddleware = require('../../middleware/file');
const { createLog } = require('../../utils');
const router = Router();

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

// routes
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().select('-__v');
        return res.json(books);
    } catch (e) {
        console.log(e.message);
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id).select('-__v');
        if (!book) {
            res.status(404);
            return res.json('book | not found');
        }
        return res.json(book);
    } catch (e) {
        console.log(e.message);
    }
});

router.post('/', fileMiddleware.single('fileBook'), async (req, res) => {
    const newBook = createNewBook(req.body);
    if (req.file) {
        const { path } = req.file;
        newBook.fileBook = path;
    }
    try {
        const modelBook = new Book(newBook);
        const book = await modelBook.save();
        res.status(201);
        return res.json(book);
    } catch (e) {
        console.log(e.message, '--------e.message');
    }

});

router.put('/:id', fileMiddleware.single('fileBook'), async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        let fileBook = '';
        if (!book) {
            res.status(404);
            return res.json('book | not found');
        }

        if (req.file) {
            const { path } = req.file;
            fileBook = path;
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
            favorite,
            fileCover,
            fileName
        } = req.body;

        const updateBook = {
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
            fileBook
        };
        const bookUpdate = await Book.findByIdAndUpdate({ _id: id }, updateBook);
        return res.json(bookUpdate);
    } catch (e) {
        console.log(e.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            res.status(404);
            return res.json('book | not found');
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
        return res.json('ok');
    } catch (e) {
        console.log(e.message);
    }
});

router.get('/:id/download-img', async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book || !book.fileBook) {
        return res
            .status(404)
            .json('book | not found');
    }

    res.download(
        path.join(process.cwd(), book.fileBook),
        book.title || book._id.fileBook,
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
