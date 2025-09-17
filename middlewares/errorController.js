const AppError = require('../utils/appError');

// ===== MongoDB Error Handlers =====


// Handle invalid MongoDB IDs (CastError)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};


// Handle duplicate key errors (e.g., unique fields like email)
const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : 'duplicate value';
  const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
  const message = `Duplicate ${field}: "${value}". Please use another value!`;
  return new AppError(message, 400);
};


// Handle validation errors from Mongoose schema
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};


// ===== JWT Error Handlers =====

// Handle invalid JWT tokens
const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

// Handle expired JWT tokens
const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);


// ===== Development vs Production Response =====

// Send full error details in development for debugging
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message || 'Something went wrong',
    error: err,
    stack: err.stack
  });
};


// Send only operational error messages in production
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Trusted, operational errors: send message to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Programming or unknown errors -> hide details
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

// ===== Global Error Middleware =====
module.exports = (err, req, res, next) => {
  // Set default values if not set
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  // Development
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  } else {
    // Production
    let error = { ...err, message: err.message };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    res.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
  }
};
