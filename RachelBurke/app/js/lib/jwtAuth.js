const User = require(__dirname + '/../../nodecellar/models/user.js');
const jwt = require('jsonwebtoken');

module.exports = exports = function(req, res, next) {
  jwt.verify(req.headers.token, process.env.APP_SECRET, function(err, decoded) {
    if (err) return res.status(403).json({ msg: 'Invalid token' });

    User.findOne({ findHash: decoded.idd }, function(err, data) {
      if (err) return res.status(500).json({ msg: 'Database error' });
      if (!data) return res.status(403).json({ msg: 'User not found' });
      req.user = data;
      next();
    });
  });
};
