// controllers/socketController.js
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('offer', (data) => {
      socket.broadcast.emit('offer', data);
    });

    socket.on('answer', (data) => {
      socket.broadcast.emit('answer', data);
    });

    socket.on('candidate', (data) => {
      socket.broadcast.emit('candidate', data);
    });

    socket.on('chatMessage', (msg) => {
      io.emit('chatMessage', msg);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
