const Router = require('express').Router;
const Cheese = require(__dirname + '/../models/cheese_model.js');
const bodyParser = require('body-parser').json();
const errorHandler = require(__dirname + '/../error_handler.js');
const jwtAuth = require(__dirname + '/../../../js/lib/jwtAuth.js');
var cheeseRouter = module.exports = Router();

cheeseRouter.get('/cheese', jwtAuth, (req, res) => {
  Cheese.find({ cheeseID: req.user._id }, (err, data) => {
    if (err) return errorHandler(err, res);
    res.status(200).json(data);
  });
});

cheeseRouter.post('/cheese', jwtAuth, bodyParser, (req, res) => {
  var newCheese = new Cheese(req.body);
  newCheese.cheeseID = req.user._id;
  newCheese.save((err, data) => {
    if (err) return errorHandler(err, res);
    res.status(200).json(data);
  });
});

cheeseRouter.put('/cheese/:id', jwtAuth, bodyParser, (req, res) => {
  var cheeseData = req.body;
  delete cheeseData._id;
  Cheese.update({ _id: req.params.id }, cheeseData, (err) => {
    if (err) errorHandler(err, res);
    res.status(200).json({ msg: 'Updated cheese' });
  });
});

cheeseRouter.delete('/cheese/:id', jwtAuth, bodyParser, (req, res) => {
  Cheese.remove({ _id: req.params.id }, (err) => {
    if (err) return errorHandler(err, res);
    res.status(200).json({ msg: 'Cheese is all gone' });
  });
});
