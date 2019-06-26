const express = require("express");
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const memoSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
});
const Memo = mongoose.model('Registration', memoSchema);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
dotenv.config();

mongoose.connect(process.env.DATABASE, {useNewUrlParser:true});
mongoose.Promise = global.Promise;
mongoose.connection
  .on('connected', () => {
    console.log(`Mongoose connection open on ${process.env.DATABASE}`);
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });

app.listen(port, () => {
  console.log("Server listening on port " + port);
});

app.get('/', (req, res) => {
  Memo.find()
    .then((notes) => {
      console.log("notes", notes);
      res.render('index', { title: 'Listing registrations', notes });
    })
    .catch(() => { res.send('Sorry! Something went wrong.'); });
});
