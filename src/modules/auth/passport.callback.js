module.exports = (req, res, next, id, callback) => error => {
  if (error) {
    next(error);
  } else {
    callback(req, res, next, id);
  }
};
