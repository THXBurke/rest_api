const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const mongoose = require('mongoose');

const port = process.env.PORT = 1234;

var server = require(__dirname + '/../../_server.js');
var User = require(__dirname + '/../models/user.js');
process.env.APP_SECRET = 'computerworld';


describe('authentication works', () => {
  before((done) => {
    server.listen(port, 'mongodb://localhost/test_db', done);
  });

  before((done) => {
    var user = new User({ username: 'rachel', password: 'kraftwerk' });
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

  it('should sign up properly', (done) => {
    request('localhost:' + port)
    .post('/api/signup')
    .send({ username: 'test', password: 'test' })
    .end((err, res) => {
      expect(typeof res.body.token === 'string').to.eql(true);
      expect(err).to.eql(null);
      done();
    });
  });

  it('should sign in properly', (done) => {
    request('localhost:' + port)
    .post('/api/signin')
    .send({ username: 'rachel', password: 'kraftwerk' })
    .end((err, res) => {
      console.log('computer ' + typeof res.body.token);
      expect(typeof res.body.token === 'string').to.eql(true);
      expect(err).to.eql(null);
      done();
    });
  });
});
