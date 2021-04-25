const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/counter', indexRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port - ${PORT}`);
});
