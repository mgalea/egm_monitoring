var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: false
  },
  username: {
    type: String,
    required: true
  },
  hash: String,
  salt: String,
  org_name: {
    type: String,
    required: false
  },
  org_id: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.verifyToken = function (roles) {
  return function (req, res, next) {
    if (typeof roles === 'string') {
      roles = [roles];
    }
    var token = req.headers['x-access-token'];
    
    if (!token)
      return res.status(403).send({ auth: false, message: 'No token provided.' });

    // verifies secret and checks exp
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (err)
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      // if everything is good, save to request for use in other routes
      mongoose.model('User').findById(decoded._id, function (err, user) { if (!user) return res.status(500).send({ auth: false, message: 'Token user has been deleted' }); })
      req.userId = decoded;
      if (roles.length && !roles.includes(req.userId.role)) return res.status(500).send({ auth: false, message: 'Unauthorized' });
      else
        next();
    });

  }
};

userSchema.methods.signToken = function () {
  const expiry = new Date();
  expiry.setTime(expiry.getTime() + (process.env.JWT_EXPIRY_TIME||3600)*1000);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    role: this.role,
    org: this.org_name,
    org_id: this.org_id,
    exp: parseInt(expiry.getTime() / 1000)
  }, process.env.SECRET_KEY);
};

var user = mongoose.model('User', userSchema);

module.exports = user// mongoose.model('User');