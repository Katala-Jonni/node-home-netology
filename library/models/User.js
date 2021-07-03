const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    vkId: {
        type: Number
    }
});

module.exports = model('User', userSchema);
