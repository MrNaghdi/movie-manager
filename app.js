const express = require("express");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const movieRouter = require("./routes/movieRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require('./utils/appError');
const globalErrorHandler = require('./middlewares/errorController');
const app = express();

//Set security HTTP headers
app.use(helmet());

//Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp({
  whitelist: ['duration', 'price']
}));

// Routes
app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/users", userRouter);

// Handle unhandled routes
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
