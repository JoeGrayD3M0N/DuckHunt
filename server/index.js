import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { DuckHunt } from './duckhunt-bot.js';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const duckHunt = new DuckHunt();

const clients = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const { username, message } = JSON.parse(data);
    const response = duckHunt.handleCommand(username, message);
    clients.forEach((client) => client.send(JSON.stringify({ from: username, message })));
    if (response) {
      clients.forEach((client) => client.send(JSON.stringify({ from: 'DuckHunt', message: response })));
    }
  });

  clients.set(ws, ws);

  ws.on('close', () => {
    clients.delete(ws);
  });
});

server.listen(3001, () => console.log('DuckHunt backend running on port 3001'));