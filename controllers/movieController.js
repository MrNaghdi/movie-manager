const Movie = require("../models/movieModel");

// get all movies
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({
      status: "Successful find movies",
      movies: movies
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

//create new movie
exports.createMovie = async (req, res) => {
  try {
    const newMovie = await Movie.create(req.body);
    res.status(201).json({
      status: "Successful create new movie",
      movie: newMovie
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

//get a movie
exports.getMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        status: "fail",
        message: "Movie not found",
      });
    }

    res.status(200).json({
      status: "Successful find movie",
      movie,   
    });
      } catch (err) {
        res.status(404).json({
          status: "fail",
          message: "not found movie",
        });
      }
};

//update a movie
exports.updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
          req.params.id,       
          req.body,          
          { new: true, runValidators: true }  
        );
    
        if (!movie) {   
          return res.status(404).json({
            status: "fail",
            message: "Movie not found",
          });
        }
    
        res.status(200).json({
          status: "Movie updated successfully",
          movie,
        });
      } catch (err) {
        res.status(500).json({
          status: "error",
          message: err.message,
        });
      }
};

//delete a movie
exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
    
        if (!movie) {
          return res.status(404).json({
            status: "fail",
            message: "Movie not found",
          });
        }
    
        res.status(204).json({
          status: "Movie deleted successfully",
          data: null, 
        });
      } catch (err) {
        res.status(500).json({
          status: "error",
          message: err.message,
        });
      }
    
};
