const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).send({
        message: 'Auth failed: No token provided',
        success: false,
      });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'medicare_secret_jwt_key_2026_super_secure', (err, decode) => {
      if (err) {
        return res.status(401).send({
          message: 'Auth failed: Invalid or expired token',
          success: false,
        });
      } else {
        req.body = req.body || {};
        req.body.userId = decode.id;
        req.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    return res.status(401).send({
      message: 'Auth failed: ' + error.message,
      success: false,
    });
  }
};
