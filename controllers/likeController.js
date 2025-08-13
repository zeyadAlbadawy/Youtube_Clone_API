const { Like, Video, User } = require('../models');
const AppError = require('../utils/appError');

// Logged IN user can like video
const likeVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;
    const [like, created] = await Like.findOrCreate({
      where: { UserId: userId, VideoId: videoId },
    });
    if (!created)
      return res.status(400).json({
        status: 'fail',
        msg: 'You already liked this video!',
      });

    res.status(201).json({
      status: 'Success',
      msg: 'Liked Succesfully',
    });
  } catch (err) {
    next(err);
  }
};

// LoggedIn user CAN Dislike Video

const dislikeVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;
    const foundedLike = await Like.findOne({
      where: { UserId: userId, VideoId: videoId },
    });
    if (!foundedLike)
      res.status(400).json({
        status: 'Fail',
        message: `please like the video to be able to unlike it`,
      });
    await foundedLike.destroy();
    res.status(201).json({
      status: 'Sucess',
      message: 'You unliked the video successfully',
    });
  } catch (err) {
    next(err);
  }
};

// As Admin Can View All The likes on the app
// USER 1 likes video 2 AND SO ON

const getAllLikes = async (req, res, next) => {
  try {
    const likes = await Like.findAll({
      include: [
        {
          model: Video,
          attributes: ['id', 'title'],
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'email'],
        },
      ],
    });
    res.status(200).json({
      status: 'Success',
      message: { data: likes },
    });
  } catch (err) {
    next(err);
  }
};

// Get the user who logged in all likes he made
const getUserLikes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const likes = await Like.findAll({
      where: { UserId: userId },
      include: [
        {
          model: Video,
          attributes: ['id', 'title'],
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'email'],
        },
      ],
    });
    res.status(200).json({
      status: 'Success',
      message: { data: likes },
    });
  } catch (err) {
    next(err);
  }
};

// For One Video get which likes comes from and the noOFLikes // (
const getNoVideoLikes = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const videoLikes = await Like.count({
      where: { VideoId: videoId },
    });
    if (!videoLikes)
      return next(
        new AppError(
          `Something went wrong while retriving likes for this video`,
          400
        )
      );
    res.status(200).json({
      status: 'Success',
      noOfLikes: videoLikes,
      // message: { data: videoLikes },
    });
  } catch (err) {
    next(err);
  }
};

const getVideoLikesDetails = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const likes = await Like.findAll({
      where: { VideoId: videoId },
      include: {
        model: User,
        attributes: ['id', 'firstName', 'email'],
      },
    });
    res.status(200).json({
      status: 'Success',
      noOfLikes: likes.length,
      users: likes.map((like) => like.User),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  likeVideo,
  getVideoLikesDetails,
  dislikeVideo,
  getAllLikes,
  getUserLikes,
  getNoVideoLikes,
};
