const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const books = [
    {
        id: 'b602c125-665c-5350-1302-0c970b5402e3',
        fileBook: path.join('public', 'img', 'b602c125-665c-5350-1302-0c970b5402e3.png'),
        title: 'title 1',
        description: 'description 1',
        authors: 'authors 1',
        favorite: 'favorite 1',
        fileCover: 'fileCover 1',
        fileName: 'fileName 1',
        targetCounter: 0
    },
    {
        id: '93bc0d2a-1c50-586c-cdd5-edcd2e28ea8e',
        title: 'title 2',
        description: 'description 2',
        authors: 'authors 2',
        favorite: 'favorite 2',
        fileCover: 'fileCover 2',
        fileName: 'fileName 2',
        fileBook: path.join('public', 'img', '93bc0d2a-1c50-586c-cdd5-edcd2e28ea8e.png'),
        targetCounter: 0
    }
];

const users = [
    { id: 1, email: 'test@mail.ru' }
];

// Set some defaults
db.defaults({ books, users })
    .write();

module.exports = db;
