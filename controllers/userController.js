const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require('../utils/APIFeatures');
const AppError = require("../utils/appError");

//GET All Users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  res.status(200).json({
    status: "success",
    results: users.length,
    data: users,
  });
});

//GET User
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("user is not found", 404));
  }
  if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
    return next(
      new AppError("You do not have permission to view this user", 403)
    );
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

//UPDATE User
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("user is not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});

//DELETE User
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("user is not found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

//Update me for user
exports.updateMe = catchAsync(async (req, res, next) => {
  // Not update password
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError("This route is not for password updates!", 400));
  }

  // just set name and email
  const filteredBody = {
    name: req.body.name,
    email: req.body.email,
  };
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
});

// DeActive user
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
