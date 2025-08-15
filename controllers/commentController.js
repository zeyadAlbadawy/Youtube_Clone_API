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

// Only the user who create the comment can delete it
// 1) the user must be authenticated
// 2) compare the id of authenticated user with the id of the user
const deleteComment = async (req, res, next) => {
  try {
    // The comment can be deleted by the user who create it
    const userId = req.user.id;
    const { commentId } = req.params;
    const delComment = await Comment.findOne({
      where: { id: commentId },
      include: [{ model: Video, attributes: ['id', 'UserId', 'title'] }],
    });

    if (!delComment)
      return res.status(404).json({
        status: 'fail',
        message: 'Comment not found',
      });

    const isCommentAuthor = userId === delComment.UserId;
    const isVideoAuthor = userId === delComment.Video.UserId; // paginate until reach

    if (!isCommentAuthor && !isVideoAuthor)
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to delete this comment',
      });

    await delComment.destroy();
    res.status(200).json({
      status: 'Success',
      message: 'Comment deleted Successfully!',
    });
  } catch (err) {
    next(err);
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      include: [
        {
          model: Video,
          attributes: ['id', 'videoUrl'],
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'email'],
        },
      ],
    });
    res.status(200).json({
      status: 'Success',
      message: {
        date: comments,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllComments,
  getVideoCommets,
  createComment,
  getUserComments,
  deleteComment,
};
