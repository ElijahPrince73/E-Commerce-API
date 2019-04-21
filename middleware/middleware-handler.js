const adminMiddleware = require('./admin-user-auth');
const shopMiddleware = require('./shop-user-auth');

module.exports = (req, res, next) => {
  const { access } = req.query;

  if (access === 'admin') {
    return adminMiddleware(req, res, next);
  }
  return shopMiddleware(req, res, next);
};
