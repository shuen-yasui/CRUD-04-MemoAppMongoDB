var express = require("express");
var app = express();
var port = 3000;
var mongoose = require("mongoose");

var memoSchema = new mongoose.Schema({
  memoBody: String,
});

var Memo = mongoose.model("Memo", memoSchema);

app.listen(port, () => {
  console.log("Server listening on port " + port);
});

app.use("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
