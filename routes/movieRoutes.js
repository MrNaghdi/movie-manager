const express = require('express');
const movieController = require('../controllers/movieController');
const router = express.Router();

// GET, POST, UPDATE, DELETE movie
router
  .route('/')
  .get(movieController.getAllMovies)
  .post(movieController.createMovie);

router
  .route('/:id')
  .get(movieController.getMovie)
  .put(movieController.updateMovie)
  .delete(movieController.deleteMovie);

module.exports = router;
