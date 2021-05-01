const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = model('User', userSchema);