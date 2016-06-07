const Router = require('express').Router;
const Wine = require(__dirname + '/../models/wines_model.js');
const bodyParser = require('body-parser').json();
const errorHandler = require(__dirname + '/../error_handler.js');
// const jwtAuth = require(__dirname + '/../../app/js/lib/jwtAuth.js');
var winesRouter = module.exports = Router();


winesRouter.get('/wine', /* jwtAuth,*/ (req, res) => {
  Wine.find(null, (err, data) => {
    if (err) return errorHandler(err, res);
    res.status(200).json(data);
  });
});

winesRouter.post('/wine', bodyParser, (req, res) => {
  var newWine = new Wine(req.body);
  newWine.save((err, data) => {
    if (err) errorHandler(err, res);
    res.status(200).json(data);
  });
});

winesRouter.put('/wine/:id', bodyParser, (req, res) => {
  var wineData = req.body;
  delete wineData._id;
  Wine.update({ _id: req.params.id }, wineData, (err) => {
    if (err) errorHandler(err, res);
    res.status(200).json({ msg: 'Updated a wine entry with put' });
  });
});

winesRouter.delete('/wine/:id', bodyParser, (req, res) => {
  Wine.findOneAndRemove({ _id: req.params.id }, (err) => {
    if (err) errorHandler(err, res);
    res.status(200).json({ message: 'Drank the wine' });
  });
});
