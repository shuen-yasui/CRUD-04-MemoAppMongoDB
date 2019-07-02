const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const memoSchema = new mongoose.Schema({
  author: {
    type: String,
    trim: true,
  },
  memo: {
    type: String,
    trim: true,
  },
});
const Memo = mongoose.model('Memos', memoSchema);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
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
    .then((memos) => {
      res.render('index', { title: 'Listing registrations', memos });
    })
    .catch(() => { res.send('Sorry! Something went wrong.'); });
});

app.post('/add', (req, res) => {
  const memo = new Memo(req.body);
  memo.save()
  res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
  Memo.findById(req.params.id, (err, memo) => {
    res.render('edit', {
      memo:memo
    });
  });
});

app.post('/edit/:id', (req, res) => {
  let newMemo = {};
  newMemo.author = req.body.author;
  newMemo.memo = req.body.memo;
  let query = {_id:req.params.id};
  Memo.updateOne(query, newMemo, (err) => {
    if(err){
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.delete('/delete/:id', (req, res) => {
  let query = {_id:req.params.id};
  Memo.remove(query, (err) => {
    if(err){
      console.log(err);
    } else {
      res.send();
    }
  });
});
