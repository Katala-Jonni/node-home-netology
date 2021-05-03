const path = require('path');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { VkontakteStrategy, LStrategy } = require('./auth');
const User = require('./models/User');
const socketConnection = require('./socket');

const http = require('http');
const socketIO = require('socket.io');

const loggerMiddleware = require('./middleware/logger');
const notFoundMiddleware = require('./middleware/404');

const indexRouter = require('./routes/index');
const bookRouter = require('./routes/books');
const usersRouter = require('./routes/user');
const userRouter = require('./routes/api/user');
const booksRouter = require('./routes/api/books');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

io.on('connection', socketConnection);

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, '/public')));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('express-session')({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(async function (id, cb) {
    try {
        const user = await User.findById(id);
        if (!user) {
            return cb(new Error('User ' + id + ' does not exist'));
        }
        return cb(null, user);
    } catch (e) {
        return cb(e);
    }
});

//  Добавление локальной стратегии
passport.use('local', LStrategy);
//  Добавление vkontakte стратегии
passport.use('vkontakte', VkontakteStrategy);

app.use(loggerMiddleware);

app.use('/', indexRouter);
app.use('/books', bookRouter);
app.use('/user', usersRouter);
app.use('/api/user', userRouter);
app.use('/api/books', booksRouter);
app.use(notFoundMiddleware);

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_HOST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        server.listen(PORT, () => {
            console.log(`Server running on port - ${PORT}`);
        });
    } catch (e) {
        throw new Error(`Server is not running, reason ${e}`);
    }
};

start();
