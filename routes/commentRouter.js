const express = require('express');
const commentController = require('../controllers/commentController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const commentRouter = express.Router();

commentRouter
  .route('/user-comments')
  .get(authMiddleware.protectTokenUser, commentController.getUserComments);
commentRouter
  .route('/comments-video/:videoId')
  .get(authMiddleware.protectTokenUser, commentController.getVideoCommets);

commentRouter
  .route('/create-video-comment/:videoId')
  .post(authMiddleware.protectTokenUser, commentController.createComment);
module.exports = commentRouter;
