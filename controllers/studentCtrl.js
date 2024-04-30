const Student = require('../model/student')
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
  const { matric_no } = req.body;
  const existingUser = await Student.findOne({ matric_no });
  if (existingUser) {
    throw new ConflictError("User already Exists");
  } else {
    const user = new Student(req.body); // Create a new user instance
    await user.save();
    const token = createJWT(user.id, user.full_name);
    res
      .status(StatusCodes.CREATED)
      .json({ status: "Success", data: user, token: token });
  }
});

const login = asyncHandler(async (req, res) => {
  const { matric_no, password } = req.body;
  const user = await Student.findOne({ matric_no });
  if (user && (await user.comparePassword(password))) {
    const refreshToken = await createRefreshJWT(user._id);
    /* const updateUser =*/ await Student.findByIdAndUpdate(
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
  login,
};
