const Movie = require('../models/movieModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all movies
exports.getAllMovies = catchAsync(async (req, res, next) => {
  const movies = await Movie.find();

  res.status(200).json({
    status: 'success',
    results: movies.length,
    data: movies
  });
});

// Create a new movie
exports.createMovie = catchAsync(async (req, res, next) => {
  const newMovie = await Movie.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newMovie
  });
});

// Get a single movie
exports.getMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return next(new AppError('No movie found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: movie
  });
});

// Update a movie
exports.updateMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!movie) {
    return next(new AppError('No movie found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: movie
  });
});

// Delete a movie
exports.deleteMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) {
    return next(new AppError('No movie found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
