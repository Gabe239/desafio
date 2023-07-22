import express from 'express';
import session from 'express-session';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { configureSocket } from './socket.js';
import { connectToDatabase } from './database.js';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './passport-config.js';

const mongoUrl = 'mongodb+srv://gurbinaia:yZKkn43U153UYvPw@ecommerce.uguwr0z.mongodb.net/ecommerce';

const app = express();
connectToDatabase();
import productsRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
import messagesRouter from './routes/messages.router.js'
import sessionsRouter from './routes/sessions.router.js'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');
app.use(
    session({
        secret: 'CoderSecretSHHHHH',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: mongoUrl,
            ttl: 3600,
            mongoOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        }),
    })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);


const server = app.listen(8080, () => console.log('Servidor Express escuchando en el puerto 8080'));

export const io = configureSocket(server);


