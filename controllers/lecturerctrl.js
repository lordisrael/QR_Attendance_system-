const Lecturer = require('../model/lecturer')
const asyncHandler = require("express-async-handler");
const { createJWT } = require("../config/jwt");
const { createRefreshJWT } = require("../config/refreshjwt");
const { StatusCodes } = require("http-status-codes");
const {
  ConflictError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");

const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  const existingUser = await Lecturer.findOne({ email });
  if (existingUser) {
    throw new ConflictError("User already Exists");
  } else {
    const user = new Lecturer(req.body); // Create a new user instance
    await user.save(); // Save the user with the generated OTP
    const token = createJWT(user.id, user.name);
    res
      .status(StatusCodes.CREATED)
      .json({ status: "Success", data: user, token: token });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await Lecturer.findOne({ email });
  if (user && (await user.comparePassword(password))) {
    const refreshToken = await createRefreshJWT(user._id);
    /* const updateUser =*/ await Lecturer.findByIdAndUpdate(
      user._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(StatusCodes.OK).json({
      status: "Success",
      _id: user._id,
      full_name: user.full_name,
      department: user.department,
      email: user.email,
      token: createJWT(user._id, user.full_name),
    });
  } else {
    throw new UnauthenticatedError("Invalid credentials");
  }
});

module.exports = {
    createUser,
    login
}