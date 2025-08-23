const multer = require('multer');
const AppError = require('../utils/appError');
const path = require('path');
const { Video, User, Like, Channel } = require('../models');
const searchFunc = require('../utils/search.js');
const { Op } = require('sequelize');
const uploadVideoImg = require('../utils/videoImageUpload.js');
const cloudinary = require('cloudinary').v2;
const randomGenerated = () => Math.floor(Math.random() * 100000) + 1;

const whitelistForImg = ['image/png', 'image/jpeg', 'image/jpg']; // Allowed Image Format
const whiteListForVideo = ['video/mp4']; // Allowed Video Format

const multerStorageMixed = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, 'public/videos');
    } else if (file.fieldname === 'image') {
      cb(null, 'public/imgs');
    } else {
      cb(new AppError('Invalid file field', 400), false);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomNum = randomGenerated();
    const timestamp = Date.now();
    cb(null, `${randomNum}-${timestamp}${ext}`); //TODO
  },
});

const multerFilterMixed = (req, file, cb) => {
  console.log('File received:', {
    fieldname: file.fieldname,
    mimetype: file.mimetype,
    originalname: file.originalname,
  });

  if (
    file.fieldname === 'video' &&
    file.mimetype.startsWith('video') &&
    whiteListForVideo.includes(file.mimetype) // Check for the extension of the video (MP4)
  ) {
    cb(null, true);
  } else if (
    file.fieldname === 'image' &&
    whitelistForImg.includes(file.mimetype) // Check for image extension
  ) {
    cb(null, true);
  } else {
    cb(new AppError(`Invalid file type for ${file.fieldname}`, 400), false);
  }
};

const multerSetDestination = multer({
  storage: multerStorageMixed,
  fileFilter: multerFilterMixed,
  limits: {
    fileSize: process.env.VIDEO_FILE_SIZE * 1024 * 1024, // you could make this dynamic per type if needed
  },
}).fields([
  { name: 'video', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]);

// Controller

// Expects a channelId which is the id for the channel it will be uploaded for
// The User who created this channel only able to upload to it
const uploadVideo = async (req, res, next) => {
  try {
    // Need To check if this channel belongs to this user
    // if so add the channelId to that ?
    const { channelId } = req.params;
    if (!req.files || !req.files.video)
      return next(new AppError(`Please Upload The video`, 400));

    // The id of the channel is for the user who create it
    const channelBelongs = await Channel.findOne({
      where: { id: channelId, UserId: req.user.id },
    });

    if (!channelBelongs)
      return next(
        new AppError(
          'This channel does not exist or this user does not have permissions for it',
          400
        )
      );

    const newVideo = {
      title: req.body.title,
      videoUrl: `videos/${req.files.video[0].filename}`,
      UserId: req.user.id, // from auth middleware
      ChannelId: channelId,
    };
    // Check for thumbnail existence
    if (req.files.image && req.files.image[0])
      newVideo.thumbnailUrl = `imgs/${req.files.image[0].filename}`;
    // Check For Description as it is opt
    if (req.body.description) newVideo.description = req.body.description;
    // Create The Video
    const finalVideoCreated = await Video.create(newVideo);

    if (!finalVideoCreated)
      return next(
        new AppError(`There is an Error while uploading the video `, 400)
      );
    // Link  the video with the channel
    // finalVideoCreated.ChannelId = channelId;
    // finalVideoCreated.save();

    await uploadVideoImg.uploadVideoWithThumbnail(
      req,
      res,
      next,
      finalVideoCreated
    );

    res.status(201).json({
      status: 'Success',
      data: { finalVideoCreated },
    });
  } catch (err) {
    next(err);
  }
};

const getAllVideos = async (req, res, next) => {
  try {
    const videos = await Video.findAll({
      include: [
        {
          model: Channel,
          attributes: ['name'],
        },
      ],
    });
    if (!videos)
      return next(
        new AppError(
          `There something wrong while retrieving the videos, Try again later`
        )
      );
    res.status(200).json({
      status: 'Success',
      length: videos.length,
      data: { videos },
    });
  } catch (err) {
    next(err);
  }
};

const getOneVideo = async (req, res, next) => {
  try {
    const video = await Video.findOne({
      where: { id: req.params.videoId },
      include: [
        {
          model: Channel,
          attributes: ['name'],
        },
      ],
    });
    video.views += 1;
    video.save();
    res.status(200).json({
      status: 'Sucess',
      data: { video },
    });
  } catch (err) {
    next(err);
  }
};

// NEED TO BE IMPLEMENTED AFTER
const getUserVideos = async (req, res, next) => {
  try {
    const userVideos = await Video.findAll({
      where: { UserId: req.user.id },

      include: [
        {
          model: User,
          attributes: ['firstName', 'email'],
        },
        {
          model: Channel,
          attributes: ['name'],
        },
      ],
    });

    if (!userVideos)
      return next(
        new AppError(
          `Something went wrong while retrieving the associated videos, Try again`,
          400
        )
      );
    res.status(200).json({
      status: 'Success',
      length: userVideos.length,
      data: { userVideos },
    });
    console.log(req.user.id);
  } catch (err) {
    next(err);
  }
};

// Any authenticated user can view the trending one
const getVideoTrending = async (req, res, next) => {
  try {
    const reqSorted = ['likes', 'views'];
    const { sort } = req.query; // likes OR views
    if (!reqSorted.includes(sort))
      return next(
        new AppError(`invalid, the sort must by by likes OR views`, 400)
      );

    let videos;
    // Apply sorting depends on what you need
    if (sort === 'likes')
      videos = await Video.findAll({
        order: [['likes', 'DESC']],
      });
    else if (sort === 'views')
      videos = await Video.findAll({
        order: [['views', 'DESC']],
      });
    res.status(200).json({
      status: 'success',
      data: { videos },
    });
  } catch (err) {
    next(err);
  }
};
// Authenticated user can delete the video
// The video must belongs to him!

const deleteVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;
    const foundedVideo = await Video.findOne({
      where: {
        UserId: userId,
        id: videoId,
      },
    });
    // If there is no video with this id OR the video does not belong to this user
    if (!foundedVideo)
      return next(
        new AppError(
          'Video not found or you do not have permission to delete it',
          400
        )
      );

    await foundedVideo.destroy();
    res.status(204).json({
      status: 'success',
      message: 'video deleted Successfully',
    });
  } catch (err) {
    next(err);
  }
};

const searchVideoByTitle = async (req, res, next) => {
  try {
    const value = req.query.title;
    await searchFunc.searchedRes(req, res, next, Video, 'title', value);
  } catch (err) {
    next(err);
  }
};
module.exports = {
  searchVideoByTitle,
  getAllVideos,
  deleteVideo,
  getVideoTrending,
  uploadVideo,
  getUserVideos,
  getOneVideo,
  multerSetDestination,
};
