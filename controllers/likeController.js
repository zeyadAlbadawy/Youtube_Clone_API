const { Like, Dislike, Video, User } = require('../models');
const AppError = require('../utils/appError');

// Logged IN user can like video
const likeVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;

    // Check if there is any dislike remove it
    const existingDisLike = await Dislike.findOne({
      where: { UserId: userId, VideoId: videoId },
    });

    if (existingDisLike) {
      const video = await Video.findByPk(videoId, { attributes: ['dislikes'] });
      if (video.dislikes > 0) {
        await Video.increment('dislikes', { by: -1, where: { id: videoId } });
      }
      await existingDisLike.destroy();
    }

    // Then apply the likes if there is no like!
    const [like, created] = await Like.findOrCreate({
      where: { UserId: userId, VideoId: videoId },
    });
    if (!created)
      return res.status(400).json({
        status: 'fail',
        msg: 'You already liked this video!',
      });

    await Video.increment('likes', { by: 1, where: { id: videoId } });
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

    // If user has liked the video → remove the like first
    const existingLike = await Like.findOne({
      where: { UserId: userId, VideoId: videoId },
    });
    if (existingLike) {
      const video = await Video.findByPk(videoId, { attributes: ['likes'] });
      if (video.likes > 0) {
        await Video.increment('likes', { by: -1, where: { id: videoId } });
      }
      await existingLike.destroy();
    }

    // If already disliked → reject
    const existingDislike = await Dislike.findOne({
      where: { UserId: userId, VideoId: videoId },
    });
    if (existingDislike) {
      return res.status(400).json({
        status: 'Fail',
        message: `You already disliked this video`,
      });
    }

    // Add new dislike
    await Dislike.create({ UserId: userId, VideoId: videoId });
    await Video.increment('dislikes', { by: 1, where: { id: videoId } });

    res.status(201).json({
      status: 'Success',
      message: 'Disliked successfully',
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
