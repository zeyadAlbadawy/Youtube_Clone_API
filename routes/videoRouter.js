const express = require('express');
const videoRouter = express.Router();
const videoController = require('../controllers/videoController.js');
const authController = require('../controllers/authController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

videoRouter
  .route('/trending-videos')
  .get(authMiddleware.protectTokenUser, videoController.getVideoTrending);
videoRouter
  .route('/get-user-videos')
  .get(authMiddleware.protectTokenUser, videoController.getUserVideos);

// ONLY authenticated users can view all videos
videoRouter
  .route('/get-all-videos')
  .get(authMiddleware.protectTokenUser, videoController.getAllVideos);

// Only autherticated users can upload video
videoRouter
  .route('/upload-video')
  .post(
    authMiddleware.protectTokenUser,
    videoController.multerSetDestination,
    videoController.uploadVideo
  );
videoRouter.route('/:videoId').get(videoController.getOneVideo);
module.exports = videoRouter;
