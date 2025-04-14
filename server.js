const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const socketHandler = require('./controllers/sockets');


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});

// Gắn SocketIO vào
socketHandler(io);

// Khởi động server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
