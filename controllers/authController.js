const express = require('express');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const jwtCreation = require('../utils/jwtToken.js');
const AppError = require('../utils/appError.js');
const sendMailOTP = require('../utils/sendMail.js');
const crypto = require('crypto');
const { Op } = require('sequelize');
const otpHandler = require('../utils/otpHandle.js');

const validateOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return next(new AppError(`Enter the mail and otp recieved`, 400));

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const foundUser = await User.findOne({
      where: { email, otp: hashedOtp, otpExpires: { [Op.gt]: new Date() } },
    });
    if (!foundUser)
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    foundUser.otp = null;
    foundUser.otpExpires = null;
    await foundUser.save({ validate: false });

    req.user = foundUser; // pass to next middleware
    // This mean that there is a use with this credentials, So create JWT cookie and send it via json and cookie-parser
    const token = jwtCreation.createJWT(foundUser.id);
    const refreshedToken = jwtCreation.refreshToken(foundUser.id);
    await User.update({ refreshedToken }, { where: { id: foundUser.id } });

    // For Rendering
    res.cookie('refreshJWTtoken', refreshedToken, {
      httpOnly: true,
      sameSite: 'Strict', // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // This is used for building the api inside postman forexample
    res.status(200).json({
      staus: 'Success',
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};

const handleRefreshToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.refreshJWTtoken) {
      return next(new AppError('Refresh token not found in cookies', 401));
    }

    const refreshToken = cookies.refreshJWTtoken;
    // 1) Find user with that refresh token
    const user = await User.findOne({
      where: { refreshedToken: refreshToken },
    });
    if (!user) {
      return next(new AppError('User not found for this refresh token', 403));
    }

    // 2) Verify the token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return next(new AppError('Invalid or expired refresh token', 403));
    }

    // 3) Ensure token belongs to the user
    if (decoded.id !== user.id) {
      return next(new AppError('Refresh token user mismatch', 403));
    }

    // 4) Create and send new access token
    const newAccessToken = jwtCreation.createJWT(user.id);

    res.status(200).json({
      status: 'success',
      data: { token: newAccessToken },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    // 1) Check if refresh token cookie exists
    if (!cookies?.refreshJWTtoken) {
      res
        .status(204)
        .json({ status: 'No Content', message: 'No cookie found' });
      return;
    }

    const refreshToken = cookies.refreshJWTtoken;

    // 2) Find user by refresh token
    const user = await User.findOne({
      where: { refreshedToken: refreshToken },
    });

    if (!user) {
      // 3) Clear the cookie even if user not found
      res.clearCookie('refreshJWTtoken', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
      });
      return res
        .status(204)
        .json({ status: 'No Content', message: 'User not found' });
    }

    // 4) Remove refresh token from user
    user.refreshedToken = null;
    await user.save();

    // 5) Clear the cookie
    res.clearCookie('refreshJWTtoken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    res
      .status(204)
      .json({ status: 'Success', message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    // 1) check the existence of mail and password
    // 2) check if user exist with the same email and grab its password
    // 3) compare between the typing password and the one who saved to the DB
    const { email, password } = req.body;
    if (!email || !password)
      return next(
        new AppError(`Please provide both the email and password`, 400)
      );

    // Find the user with this credentials then select only the properties you will need
    const foundUser = await User.scope(null).findOne({
      where: { email: req.body.email },
      attributes: ['password', 'email', 'id'],
    });
    if (!foundUser || !(await foundUser.correctPassword(password)))
      return next(
        new AppError(`There is no user with the provided credintials!`, 404)
      );

    // Create the OTP
    await otpHandler.createSendOtp(email);
    res.status(200).json({
      status: 'Success',
      message:
        'OTP SENT TO MAIL TRY /POST/ AT validate-otp with your mail and otp sent',
    });
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    // Check if there is a user with the same credintials
    const foundUser = await User.findOne({ where: { email: req.body.email } });
    if (foundUser)
      return next(
        new AppError(`there is a user with this mail ${req.body.email}`, 400)
      );

    // get The data from the body
    await User.create(req.body);
    res.status(201).json({
      status: 'Success',
      message: 'User created Succesfully ',
    });
  } catch (err) {
    next(err);
  }
};
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      status: 'Sucess',
      length: users.length,
      data: { users },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  login,
  logout,
  handleRefreshToken,
  validateOtp,
};
