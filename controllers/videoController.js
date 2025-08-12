const multer = require('multer');
const AppError = require('../utils/appError');
const path = require('path');
const { Video } = require('../models');
const randomGenerated = () => Math.floor(Math.random() * 100000) + 1;

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
    cb(null, `${randomNum}-${timestamp}${ext}`);
  },
});

const multerFilterMixed = (req, file, cb) => {
  if (file.fieldname === 'video' && file.mimetype.startsWith('video')) {
    cb(null, true);
  } else if (file.fieldname === 'image' && file.mimetype.startsWith('image')) {
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
const uploadVideo = async (req, res, next) => {
  try {
    if (!req.files || !req.files.video)
      return next(new AppError(`Please Upload The video`, 400));

    const newVideo = {
      title: req.body.title,
      videoUrl: `videos/${req.files.video[0].filename}`,
      UserId: req.user.id, // from auth middleware
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
    const videos = await Video.findAll();
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
    const video = await Video.findByPk(req.params.videoId);
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
    const userVideos = await Video.findAll(
      { where: { UserId: req.user.id } },
      {
        include: [{ model: 'Video', as: 'videos' }],
      }
    );

    if (!userVideos)
      return next(
        new AppError(
          `Something went wrong while retrieving the associated videos, Try again`,
          400
        )
      );
    res.status(200).json({
      status: 'Success',
      data: { userVideos },
    });
    console.log(req.user.id);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllVideos,
  uploadVideo,
  getUserVideos,
  getOneVideo,
  multerSetDestination,
};
