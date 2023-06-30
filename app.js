import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { getMessages, addMessage } from './dao/managers/messageManagerDb.js';

const app = express();

import productsRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
import messagesRouter from './routes/messages.router.js'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use('/api/productos', productsRouter);
app.use('/api/carrito', cartRouter);
app.use('/api/messages', messagesRouter);
app.use('/', viewsRouter);


const server = app.listen(8080, () => console.log('Servidor Express escuchando en el puerto 8080'));
export const io = new Server(server);

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

mongoose.connect('mongodb+srv://gurbinaia:yZKkn43U153UYvPw@ecommerce.uguwr0z.mongodb.net/ecommerce', (error) => {
  if (error) {
    console.log('Cannot connect to database: ' + error);
    process.exit();
  }
});
