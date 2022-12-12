const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const { notFoundErrorCode } = require('./utils/errorConstans');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  req.user = {
    _id: '6395dab45275f3ce644902a1',
  };
  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res
    .status(notFoundErrorCode)
    .send({ message: 'указанного пути не существует' });
});

app.listen(PORT);
