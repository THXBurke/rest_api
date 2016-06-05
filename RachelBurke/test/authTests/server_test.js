const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const mongoose = require('mongoose');

const port = process.env.PORT = 1234;
process.env.MONGODB_URI = 'mongodb://localhost/test_db';

var server = require(__dirname + '/../_server.js');
var Wine = require(__dirname + '/../models/wine_model.js');
var Cheese = require(__dirname + '/../models/cheese_model.js');
var User = require(__dirname + '/../models/user.js');
process.env.APP_SECRET = 'computerworld';

describe('Total server', () => {
  before((done) => {
    server.listen(port, 'mongodb://localhost/test_db', done);
  });
  before((done) => {
    var user = new User({ username: 'test', password: 'test' });
    user.save((err, data) => {
      if (err) throw err;
      data.generateToken((err, token) => {
        if (err) throw err;
        this.token = token;
        done();
      });
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.disconnect(done);
      server.close();
    });
  });

  it('should create a new wine instance', (done) => {
    request('localhost:' + port)
    .post('/api/wine')
    .set('token', this.token)
    .send({ name: 'Merlot', year: '2000',
    country: 'France' })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.status).to.eql(200);
      expect(res.body.year).to.eql('2000');
      done();
    });
  });

// describe('GET method', () => {
  it('should get "/wine"', (done) => {
    request('localhost:' + port)
    .get('/api/wine')
    .set('token', this.token)
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.status).to.eql(200);
      done();
    });
  });

  describe('Wine routes that need content to work', () => {
    beforeEach((done) => {
      var newWine = new Wine({ name: 'Pinot', year: '2000', country: 'France' });
      newWine.save((err, data) => {
        if (err) {
          console.log(err);
        }
        this.wine = data;
        done();
      });
    });
    afterEach((done) => {
      this.wine.remove((err) => {
        console.log(err);
        done();
      });
    });

    it('should be able to PUT a wine', (done) => {
      request('localhost:' + port)
      .put('/api/wine/' + this.wine._id)
      .set('token', this.token)
      .send({ name: 'Boxed', year: '2015', country: 'usa' })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body.msg).to.eql('Updated a wine entry with put');
        done();
      });
    });

    it('should be able to DELETE a wine entry', (done) => {
      request('localhost:' + port)
      .delete('/api/wine/' + this.wine._id)
      .set('token', this.token)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body.msg).to.eql('Deleted a wine entry');
        done();
      });
    });

    it('should create a new cheese instance', (done) => {
      request('localhost:' + port)
      .post('/api/cheese')
      .set('token', this.token)
      .send({ name: 'Gruyere', country: 'Switzerland', origin: 'cow' })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body.yumFactor).to.eql(2);
        done();
      });
    });

    it('should get me some cheese', (done) => {
      request('localhost:' + port)
        .get('/api/cheese')
        .set('token', this.token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.status).to.eql(200);
          expect(res.body.length).to.eql(1);
          done();
        });
    });
  });
  describe('Cheese Routes that need content to work', () => {

    beforeEach((done) => {
      var newCheese = new Cheese({ name: 'TestCheese',
      country: 'usa', origin: 'goat' });
      newCheese.save((err, data) => {
        if (err) {
          console.log(err);
        }
        this.cheese = data;
        done();
      });
    });
    afterEach((done) => {
      this.cheese.remove((err) => {
        console.log(err);
        done();
      });
    });

    it('should be goat cheese from usa', (done) => {
      request('localhost:' + port)
      .get('/api/cheese/origin')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body.msg).to.eql('There is one cheese from a goat origin');
        done();
      });
    });

    it('should be able to PUT a cheese', (done) => {
      request('localhost:' + port)
      .put('/api/cheese/' + this.cheese._id)
      .set('token', this.token)
      .send({ name: 'Club', ingrediants: ['bacon', 'lettuce',
      'tomato', 'turkey', 'mayo'], yumFactor: 4 })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body.msg).to.eql('Updated cheese');
        done();
      });
    });

    it('should be able to DELETE (eat) cheese', (done) => {
      request('localhost:' + port)
      .delete('/api/cheese/' + this.cheese._id)
      .set('token', this.token)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body.msg).to.eql('Ate cheese');
        done();
      });
    });
  });

// Test for combinedRouter
  describe('Pairing of wine and cheese', () => {
    beforeEach((done) => {
    // add one cheese
      var newcheese = new Cheese({ name: 'Parmasan', country: 'Italy', origin: 'cow' });
      newcheese.save((err, data) => {
        if (err) {
          console.log(err);
        }
        this.cheese = data;
      });

    // two wines
      var newWine = new Wine({ name: 'Merlot', year: '2001', country: 'France' });
      newWine.save((err) => {
        if (err) {
          console.log(err);
        }
      });
      var newWine2 = new Wine({ name: 'Merlot2', year: '2001' });
      newWine2.save((err) => {
        if (err) {
          console.log(err);
        }
      });
      done();
    });

    it('should be a Merlot from 2001', (done) => {
      request('localhost:' + port)
        .get('/api/pairing')
        .end((err) => {
          expect(err).to.eql(null);
          done();
        });
    });
  });
});
