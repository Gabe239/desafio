import { Server } from 'socket.io';
import { getMessages, addMessage } from './dao/managers/messageManagerDb.js';



export function configureSocket(server) {
    const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Socket connected');

    socket.on('message', async (data) => {
      try {
        const newMessage = await addMessage(data.user, data.message);
        io.emit('messageLogs', await getMessages());
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('authenticated', (data) => {
      socket.broadcast.emit('newUserConnected', data);
    });
  });

  return io;
}