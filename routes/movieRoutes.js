const express = require("express");
const movieController = require("../controllers/movieController");
const authController = require("../controllers/authController");

const router = express.Router();

// Public routes (anyone can access)
router.route("/").get(movieController.getAllMovies);

router.route("/:id").get(movieController.getMovie);

// Protected routes (only logged in users)
router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    movieController.createMovie
  );

router
  .route("/:id")
  .put(
    authController.protect,
    authController.restrictTo("admin"),
    movieController.updateMovie
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    movieController.deleteMovie
  );

module.exports = router;
