const path = require('path');
const { Router } = require('express');
const db = require('../store/index');
const router = Router();
const Books = require('../models/Books');

const books2 = [
    {
        // id: 'b602c125-665c-5350-1302-0c970b5402e3',
        title: 'title 1',
        description: 'description 1',
        authors: 'authors 1',
        favorite: 'favorite 1',
        fileCover: 'fileCover 1',
        fileName: 'fileName 1',
        fileBook: path.join('public', 'img', 'b602c125-665c-5350-1302-0c970b5402e3.png')
        // targetCounter: 0
    },
    {
        // id: '93bc0d2a-1c50-586c-cdd5-edcd2e28ea8e',
        title: 'title 2',
        description: 'description 2',
        authors: 'authors 2',
        favorite: 'favorite 2',
        fileCover: 'fileCover 2',
        fileName: 'fileName 2',
        fileBook: path.join('public', 'img', '93bc0d2a-1c50-586c-cdd5-edcd2e28ea8e.png')
        // targetCounter: 0
    }
];


router.get('/', async (req, res) => {
    // const books = db.get('books').value();
    try {
        // const newBooks = await Books.insertMany(books);
        // await newBooks.save();
    } catch (e) {
        console.log(e.message, '-----------e.message');
    }
    const books = await Books.find().select('-__v');
    // const newBooks = new Books({
    //     title: 'item.title',
    //     description: 'item.description',
    //     authors: 'item.authors',
    //     favorite: 'item.favorite',
    //     fileCover: 'item.fileCover',
    //     fileName: 'item.fileName'
    // });
    // await newBooks.save();
    // const newBooksFind = await Books.find();
    // console.log(newBooksFind, '-------------newBooksFind');
    res.render('index', {
        title: 'Главная',
        books
    });
});

module.exports = router;
