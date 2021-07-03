const productSocket = require('./productSocket');

const socketConnection = (socket) => {
    const { id } = socket;
    productSocket(socket);
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${id}`);
    });
};

module.exports = socketConnection;
