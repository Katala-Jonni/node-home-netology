const { Router } = require('express');
const router = Router();
const Books = require('../models/Book');

router.get('/', async (req, res) => {
    const books = await Books.find().select('-__v');
    res.render('index', {
        title: 'Главная',
        books
    });
});

module.exports = router;
