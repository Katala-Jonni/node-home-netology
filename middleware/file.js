const path = require('path');
const multer = require('multer');

const pathStatic = 'public/img';

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, pathStatic);
    },
    filename(req, file, cb) {
        console.log(req.params.id, '----');
        const ext = path.extname(file.originalname);
        cb(null, `${+Date.now()}${ext}`);
    }
});

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

module.exports = multer({
    storage, fileFilter
});
