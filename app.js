const express = require('express');
const movieRouter = require('./routes/movieRoutes');

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/api/v1/movies', movieRouter);

module.exports = app;
