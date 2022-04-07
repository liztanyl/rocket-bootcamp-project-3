import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';

import bindRoutes from './routes.mjs';

const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('dist'));

bindRoutes(app);

// Set Express to listen on the given port
const PORT = process.env.PORT || 3004;
const io = new Server(server);
io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('join-room', (gameId, callbackfn) => {
    socket.join(`room${gameId}`);
    console.log(`${socket.id} joined room${gameId}`);
    callbackfn({
      data: `joined room${gameId}`,
    });
  });
  socket.on('empty-deck', (gameId) => {
    io.in(`room${gameId}`).emit('round-over');
  });
  socket.on('end-turn', (gameId) => {
    io.in(`room${gameId}`).emit('next-team-turn');
  });
  socket.on('disconnect', () => console.log('Client disconnected'));
});

server.listen(PORT);
