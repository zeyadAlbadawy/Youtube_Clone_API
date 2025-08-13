module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.name == 'SequelizeForeignKeyConstraintError') {
    return res.status(404).json({
      status: 'Fail',
      message: 'There is no valid model with this id',
    });
  }
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
