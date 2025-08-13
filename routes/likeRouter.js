const express = require('express');
const likeRouter = express.Router();
const likeController = require('../controllers/likeController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const authController = require('../controllers/authController.js');

// Admin Can View Which User Makes Likes AND TO What VIDEO
likeRouter
  .route('/get-all-likes')
  .get(
    authMiddleware.protectTokenUser,
    authMiddleware.checkAdmin,
    likeController.getAllLikes
  );

// GET VIDEO LIKES
// ALL the likes ASSOCIATED TO ONE VIDEO

likeRouter
  .route('/get-no-video-likes/:videoId')
  .get(authMiddleware.protectTokenUser, likeController.getNoVideoLikes);

likeRouter
  .route('/view-liked-by/:videoId')
  .get(authMiddleware.protectTokenUser, likeController.getVideoLikesDetails);
likeRouter
  .route('/get-user-likes')
  .get(authMiddleware.protectTokenUser, likeController.getUserLikes);

likeRouter
  .route('/make-like/:videoId')
  .post(authMiddleware.protectTokenUser, likeController.likeVideo);
likeRouter
  .route('/remove-like/:videoId')
  .post(authMiddleware.protectTokenUser, likeController.dislikeVideo);
module.exports = likeRouter;
