module.exports = exports = function(req, res, next) {
  try {
    var authHeader = req.headers.authorization;
    var namePassword = authHeader.split(' ')[1];
    var namePassBuf = new Buffer(namePassword, 'base64');
    var namePassPlainText = namePassBuf.toString();
    namePassBuf.fill();
    var namePassArr = namePassPlainText.split(':');
    req.auth = {
      username: namePassArr[0],
      password: namePassArr[1]
    };
    if (req.auth.username.length < 1 || req.auth.password.length < 1) {
      throw new Error('no username or password');
    }
  } catch (e) {
    console.log(e);
    return res.status(418).json({ msg: 'all your auths are belong to us' });
  }
  next();
};
