const { Comment, User, Like, Video } = require('../models');

const createComment = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const createdComment = await Comment.create({
      UserId: userId,
      VideoId: videoId,
      content,
    });
    if (!createdComment)
      return res.status(400).json({
        status: 'Fail',
        message:
          'There is something wrong while creating the comment, try again',
      });
    res
      .status(201)
      .json({ status: 'Success', message: { data: createdComment } });
  } catch (err) {
    next(err);
  }
};

// Any Authenticated User Can view the comments on the vidoe
const getVideoCommets = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const foundVideosComments = await Comment.findAll({
      where: { VideoId: videoId },
      include: [
        {
          model: Video,
          attributes: ['id', 'title', 'videoUrl'],
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'Success',
      length: foundVideosComments.length,
      message: { data: foundVideosComments },
    });
  } catch (err) {
    next(err);
  }
};

// For One User, he can view all comments he made and on any Video
// It must be authenticated
const getUserComments = async (req, res, next) => {
  try {
    const userId = req.user.id; // From Auth Middleware
    const userComments = await Comment.findAll({
      where: { UserId: userId },
      include: [
        {
          model: Video,
          attributes: ['id', 'title', 'videoUrl'],
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'Succcess',
      length: userComments.length,
      message: { data: userComments },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getVideoCommets, createComment, getUserComments };
