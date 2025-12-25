import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { listenForWinnerEvent } from './events/winnerListener';
import { listenForOrchestratorNotifyWinner } from './events/orchestratorListener';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.get('/', (_req, res) => res.send('Notification Service Running'));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Client should emit 'register' with their userId after connecting
  socket.on('register', (userId: string) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Pass io to event listener so it can emit notifications
listenForWinnerEvent(io);
listenForOrchestratorNotifyWinner(io);

const PORT = process.env.PORT || 3004;
server.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});