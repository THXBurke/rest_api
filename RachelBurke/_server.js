const express = require('express');
const app = express();
const winesRouter = require(__dirname + '/nodecellar/routes/winesrouter.js');
const cheeseRouter = require(__dirname + '/nodecellar/routes/cheeserouter.js');
const pairingRouter = require(__dirname + '/nodecellar/routes/party.js');
const authRouter = require(__dirname + '/nodecellar/routes/authRouter.js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use(bodyParser.json());
app.use('/api', winesRouter);
app.use('/api', cheeseRouter);
app.use('/api', pairingRouter);
app.use('/api', authRouter);


module.exports = exports = {
  server: { close: function() {throw new Error('server not started');} },
  listen: function(port, mongoString, cb) {
    mongoose.connect(mongoString);
    return this.server = app.listen(port, cb);
  },
  close: function(cb) {
    this.server.close();
    if (cb) cb();
  }
};
