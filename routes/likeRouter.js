const express = require('express');
const likeRouter = express.Router();
const likeController = require('../controllers/likeController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
likeRouter
  .route('/make-like/:videoId')
  .post(authMiddleware.protectTokenUser, likeController.likeVideo);
likeRouter
  .route('/remove-like/:videoId')
  .post(authMiddleware.protectTokenUser, likeController.dislikeVideo);
module.exports = likeRouter;
