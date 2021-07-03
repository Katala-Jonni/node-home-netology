const { model, Schema } = require('mongoose');

const BookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    authors: {
        type: String
    },
    favorite: {
        type: String
    },
    fileCover: {
        type: String
    },
    fileName: {
        type: String
    },
    fileBook: {
        type: String
    },
    comments: [
        {
            text: {
                type: String,
                trim: true
            }
        }
    ]
});

module.exports = model('Book', BookSchema);
