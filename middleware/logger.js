const fs = require('fs');
const path = require('path');
const os = require('os');
const { createLog } = require('../utils');

module.exports = (req, res, next) => {
    fs.appendFile(
        path.join(process.cwd(), 'server.log'),
        createLog(req) + os.EOL,
        err => {
            if (err) throw err;
        });
    next();
};
