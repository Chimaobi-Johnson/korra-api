const jsonwebtoken = require('jsonwebtoken');

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
function issueJWT(user) {
  const keys = require('../config/keys');

  const _id = user._id;
  const expiresIn = '1d';
  
  const payload = {
    sub: _id,
    iat: Date.now()
  };

  const signedToken = jsonwebtoken.sign(payload, keys.cookieKey, { expiresIn: expiresIn, algorithm: 'HS256' });
  
  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}

module.exports = { issueJWT }