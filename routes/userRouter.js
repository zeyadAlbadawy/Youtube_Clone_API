const express = require('express');
const userRouter = express.Router();
const authController = require('../controllers/authController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
userRouter
  .route('/')
  .get(
    authMiddleware.protectTokenUser,
    authMiddleware.checkAdmin,
    authController.getAllUsers
  );

userRouter.post('/forgetPassword', authController.forgetPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);
userRouter
  .route('/update-me')
  .patch(authMiddleware.protectTokenUser, authController.updateMe);
userRouter.route('/validate-otp').post(authController.validateOtp);
userRouter.route('/refresh').get(authController.handleRefreshToken);
userRouter.route('/signup').post(authController.createUser);
userRouter.route('/login').post(authController.login);
userRouter.route('/logout').post(authController.logout);
module.exports = userRouter;
