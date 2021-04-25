const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const counters = [];

// Set some defaults
db.defaults({ counters })
    .write();

module.exports = db;
