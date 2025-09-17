const mongoose = require("mongoose");

//defind movie model
const movieSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["movie", "series"],
    required: [true, "a movie between movie and series"],
  },
  name: {
    type: String,
    required: [true, "a movie has a name."],
    unique: [true, "a movie has a unique name."],
    index: true
  },
  description: {
    type: String,
    required: [true, "a movie has a description."]
  },
  genres: {
    type: [String],
    required: [true, "a movie must have at least one genre."]
  },
  releaseYear: {
    type: Number,
    required: [true, "a movie has a release year."]
  },
  runtime : {
    type: Number,
    required: [true, "a movie has a run time."]
  },
  actors : {
    type : [String],
    required: [true, "please write actors of movie."]
  },
  crew: {
    type: [
      {
        name: {
          type: String,
          required: [true, "crew member must have a name."],
        },
        role: {
          type: String,
          required: [true, "crew member must have a role."],
        },
      },
    ],
    required: [true, "a movie must have at least one crew member."],
    validate: {
      validator: function (array) {
        return array.length > 0; 
      },
      message: "a movie must have at least one crew member.",
    },
  },
  posterUrl: String,
  trailerUrl: String,
  ratingsAverage: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  ratingsCount: Number
});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;