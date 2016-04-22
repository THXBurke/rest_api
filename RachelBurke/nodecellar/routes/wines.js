var mongo = require('mongodb');

var Server = mongo.Server,
  Db = mongo.Db,
  JSON = mongo.JSONPure;

var server = new Server('localhost', 27017, { auto_reconnect: true });
Db = new Db('wineDb', server);


Db.open(function(err, Db) {
  if (!err) {
    console.log("Connected to 'winedb' database");
    db.collection('wines', { strict:true}, function(err, collection) {
      if (err) {
        console.log("The 'wines' collection doesn't exist. Creating it with sample data...");
        populateDB();
      }
    });
  }
});

exports.findById = function(req, res) {
  var id = req.params.id;
  console.log('Retrieving wine: ' + id);
  Db.collection('wines', function(err, collection) {
    collection.findOne({ '_id':new JSON.ObjectID(id)}, function(err, item) {
      res.send(item);
    });
  });
};

exports.findAll = function(req, res) {
  Db.collection('wines', function(err, collection) {
    collection.find().toArray(function(err, items) {
      res.send(items);
    });
  });
};

exports.addWine = function(req, res) {
  var wine = req.body;
  console.log('Adding wine: ' + JSON.stringify(wine));
  Db.collection('wines', function(err, collection) {
    collection.insert(wine, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        console.log('Success: ' + JSON.stringify(result[0]));
        res.send(result[0]);
      }
    });
  });


exports.updateWine = function(req, res) {
  var id = req.params.id;
  var wine = req.body;
  console.log('Updating wine: ' + id);
  console.log(JSON.stringify(wine));
  Db.collection('wines', function(err, collection) {
    collection.update({'_id':new JSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
      if (err) {
        console.log('Error updating wine: ' + err);
        res.send({'error':'An error has occurred'});
      } else {
        console.log('' + result + ' document(s) updated');
        res.send(wine);
      }
    });
  });
}

exports.deleteWine = function(req, res) {
  var id = req.params.id;
  console.log('Deleting (bad idea!) wine: ' + id);
  db.collection('wines', function(err, collection) {
    collection.remove({'_id':new JSON.ObjectID(id)}, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error': 'An error has occurred - ' + err});
      } else {
        console.log('' + result + ' document(s) deleted');
        res.send(req.body);
      }
    })
  })
}

var populateDB = function() {

  var wines = [
    {
      name: "Fancy French Vineyard",
      year: "1800",
      grapes: "Grenache / Syrah",
      country: "France",
      description: "Delicious"
    },
    {
      name: "Fancy Spanish Vineyard",
      year: "2006",
      grapes: "Tempranillo",
      country: "Spain",
      description: "Intoxicating"
  }];

  dB.collection('wines', function(err, collection) {
    collection.insert(wines, {safe:true}, function(err, result) {});
  });
};
