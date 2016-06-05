const express = require('express');
const app = express();
const wineRouter = require(__dirname + '/routes/winerouter.js');
const cheeseRouter = require(__dirname + '/routes/cheeserouter.js');
const pairingRouter = require(__dirname + '/routes/party.js');
const authRouter = require(__dirname + '/routes/authRouter.js');
const mongoose = require('mongoose');

app.use('/api', wineRouter);
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
