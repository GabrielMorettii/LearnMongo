const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  return res.status(500).json({
    status: 'error',
    message: `Internal Server Error: ${err.message}`,
    error: err,
    stack: err.stack
  });
};

const handleCastErrorDB = err => {
  return new AppError(`Invalid ${err.path}: ${err.value}`);
};

const handleDuplicateFieldsDB = err => {
  return new AppError(
    `Duplicate field value: ${err.keyValue.name}. Please use another value!`
  );
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message);
};

const handleUncaughtException = err => {
  return new AppError(err.message, 500);
};

const sendErrorProd = (err, res) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message
    });
  }

  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: `Something went very wrong!`
  });
};

module.exports = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message
    });
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    let error = { ...err };

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err instanceof Error) error = handleUncaughtException(err);

    sendErrorProd(error, res);
  }
};
