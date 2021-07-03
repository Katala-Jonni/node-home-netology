const { Router } = require('express');
const db = require('../store/index');
const router = Router();

router.get('/', (req, res) => {
    const books = db.get('books').value();
    res.render('index', {
        title: 'Главная',
        books
    });
});

module.exports = router;
