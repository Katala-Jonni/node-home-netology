const { model, Schema } = require('mongoose');

const counterSchema = new Schema({
    counter: {
        type: Number
    },
    counterId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    }
});

module.exports = model('Counter', counterSchema);
