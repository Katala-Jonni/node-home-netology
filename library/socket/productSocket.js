const { Book } = require('../models');
const productSocket = async socket => {
    try {
        const { roomName } = socket.handshake.query;
        const product = await Book.findById(roomName);
        if (!product) return false;

        socket.join(roomName);
        socket.on('product-comment', async msg => {
            if (!msg.text.trim()) return;

            const data = {
                text: msg.text
            };

            const product = await Book.findByIdAndUpdate(roomName, { $push: { comments: data } }, { new: true });
            if (!product) return false;
            msg.comments = product.comments;
            socket.to(roomName).emit('product-comment', msg);
            socket.emit('product-comment', msg);
        });

        const data = {
            comments: product.comments
        };
        socket.to(roomName).emit('product-comment', data);
        socket.emit('product-comment', data);
    } catch (e) {
        console.log(e);
    }
};

module.exports = productSocket;
