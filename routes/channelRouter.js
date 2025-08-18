const express = require('express');
const channelRouter = express.Router();
const channelController = require('../controllers/channelController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const ChannelSubscribe = require('../controllers/channelSubscriber.js');
// const

channelRouter
  .route('/my-subscribers')
  .get(authMiddleware.protectTokenUser, ChannelSubscribe.getUserSubscription);

channelRouter
  .route('/search-channel')
  .get(authMiddleware.protectTokenUser, channelController.searchChannelByName);
channelRouter
  .route('/all-channels')
  .get(channelController.allAvailableChannels);
channelRouter
  .route('/subscribe/:channelId')
  .post(authMiddleware.protectTokenUser, ChannelSubscribe.subscribeToChannel);

channelRouter
  .route('/un-subscribe/:channelId')
  .post(authMiddleware.protectTokenUser, ChannelSubscribe.unSubscribeToChannel);

channelRouter
  .route('/all-channel-videos/:channelId')
  .get(channelController.allChannelVideos);

channelRouter
  .route('/create-channel')
  .post(
    authMiddleware.protectTokenUser,
    channelController.uploadChannelMedia,
    channelController.createChannel
  );
module.exports = channelRouter;
