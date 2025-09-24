const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

// Forgot & Reset Password
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

//Update user password
router.patch("/updateMyPassword", authController.protect, authController.updatePassword);

//Update user
router.patch('/updateMe', authController.protect, userController.updateMe);

//DeActive user
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.route("/").get(authController.protect, authController.restrictTo("admin"), userController.getAllUsers);
router
  .route("/:id")
  .get(authController.protect, userController.getUser)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userController.deleteUser
  );

module.exports = router;
