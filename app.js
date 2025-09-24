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

// Body parser
app.use(express.json());

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
});

// Data sanitization against XSS (just body , params)
app.use((req, res, next) => {
  if (req.body) req.body = xss(req.body);
  if (req.params) req.params = xss(req.params);
  next();
});

// Prevent parameter pollution
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
