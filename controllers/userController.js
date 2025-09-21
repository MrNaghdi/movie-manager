const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//GET All Users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
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
    return next(new AppError("You do not have permission to view this user", 403));
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
