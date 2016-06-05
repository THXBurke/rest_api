const expect = require('chai').expect;
const User = require(__dirname + '/../models/user.js');
const mongoose = require('mongoose');

describe('Find hash', function() {
  before(function(done) {
    mongoose.connect('mongodb://localhost/hash_test');
    var newUser = new User({ username: 'test', password: 'test' });
    newUser.save((err, data) => {
      if (err) throw err;
      this.user = data;
      done();
    });
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.disconnect(done);
    });
  });

  it('should create a hash', function(done) {
    this.user.generateFindHash((err, hash) => {
      expect(err).to.eql(null);
      expect(hash.length).to.not.eql(0);
      expect(hash).to.eql(this.user.findHash);
      done();
    });
  });
});
