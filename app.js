const express = require("express");
const movieRouter = require("./routes/movieRoutes");
const AppError = require('./utils/appError');
const globalErrorHandler = require('./middlewares/errorController');
const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/v1/movies", movieRouter);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);


module.exports = app;
