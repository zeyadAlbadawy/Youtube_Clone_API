const express = require('express');
const commentController = require('../controllers/commentController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const commentRouter = express.Router();

commentRouter
  .route('/all-comments')
  .get(
    authMiddleware.protectTokenUser,
    authMiddleware.checkAdmin,
    commentController.getAllComments
  );
commentRouter
  .route('/user-comments')
  .get(authMiddleware.protectTokenUser, commentController.getUserComments);

commentRouter
  .route('/update-comment/:commentId')
  .patch(authMiddleware.protectTokenUser, commentController.updateComment);
commentRouter
  .route('/delete-comment/:commentId')
  .delete(authMiddleware.protectTokenUser, commentController.deleteComment);
commentRouter
  .route('/comments-video/:videoId')
  .get(authMiddleware.protectTokenUser, commentController.getVideoCommets);

commentRouter
  .route('/create-video-comment/:videoId')
  .post(authMiddleware.protectTokenUser, commentController.createComment);
module.exports = commentRouter;
