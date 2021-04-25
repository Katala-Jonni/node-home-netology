const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const loggerMiddleware = require('./middleware/logger');
const notFoundMiddleware = require('./middleware/404');

const indexRouter = require('./routes/index');
const bookRouter = require('./routes/books');
const usersRouter = require('./routes/user');
const userRouter = require('./routes/api/user');
const booksRouter = require('./routes/api/books');

const app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, '/public')));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(loggerMiddleware);

app.use('/', indexRouter);
app.use('/books', bookRouter);
app.use('/user', usersRouter);
app.use('/api/user', userRouter);
app.use('/api/books', booksRouter);
app.use(notFoundMiddleware);

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server running on port - ${PORT}`);
});
