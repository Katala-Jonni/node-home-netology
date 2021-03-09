const express = require('express');
const cors = require('cors');
const formData = require('express-form-data');

const userRouter = require('./routes/user');
const booksRouter = require('./routes/books');

const app = express();

app.use(cors());
app.use(formData.parse());

app.use('/api/user', userRouter);
app.use('/api/books', booksRouter);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Server running on port - ${PORT}`);
});
