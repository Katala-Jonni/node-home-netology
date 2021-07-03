const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/counter', indexRouter);

const PORT = process.env.PORT || 3001;

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_HOST, {
            useNewUrlParser: true, useUnifiedTopology: true
        });
        app.listen(PORT, () => {
            console.log(`Server running on port - ${PORT}`);
        });
    } catch (e) {
        throw new Error(`Server is not running, reason ${e}`);
    }
};

start();
