const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const loggerMiddleware = require('./middleware/logger');
const notFoundMiddleware = require('./middleware/404');

const userRouter = require('./routes/user');
const booksRouter = require('./routes/books');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(loggerMiddleware);

app.use('/public', express.static(path.join(__dirname, '/public')));

app.use('/api/user', userRouter);
app.use('/api/books', booksRouter);
app.use(notFoundMiddleware);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Server running on port - ${PORT}`);
});
