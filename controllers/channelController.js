const { Channel, Video } = require('../models');
const multer = require('multer');
const path = require('path');
const AppError = require('../utils/appError');
const randomGenerated = () => Math.floor(Math.random() * 100000) + 1;

// Upload The channel thumbnails
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/channel');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomNum = randomGenerated();
    const timestamp = Date.now();
    cb(null, `${randomNum}-${timestamp}${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload images only.'), false);
  }
};

// 3. Create Multer instance
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadChannelMedia = upload.fields([
  { name: 'avatarUrl', maxCount: 1 },
  { name: 'bannerUrl', maxCount: 1 },
]);

const createChannel = async (req, res, next) => {
  try {
    const channel = {
      name: req.body.name,
    };
    console.log(req.files);

    if (req.body.description) channel.description = req.body.description;

    if (req.files.avatarUrl && req.files.avatarUrl[0])
      channel.avatarUrl = `channel/${req.files.avatarUrl[0].filename}`;
    if (req.files.bannerUrl && req.files.bannerUrl[0])
      channel.bannerUrl = `channel/${req.files.bannerUrl[0].filename}`;

    // Check if there is a channel with this credentials
    const existingChannel = await Channel.findOne({
      where: { name: channel.name, UserId: req.user.id },
    });
    if (existingChannel)
      return res.status(400).json({
        status: 'fail',
        message: 'there is a channel with the provided credintials',
      });

    const createdChannel = await Channel.create(channel);
    createdChannel.UserId = req.user.id;
    createdChannel.save();

    res.status(200).json({
      status: 'Success',
      message: `Channel with the name ${channel.name} create Successfully!`,
    });
  } catch (err) {
    next(err);
  }
};

// Videos That exists for one channel
const allChannelVideos = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const channelFound = await Channel.findByPk(channelId);

    if (!channelFound)
      return res.status(400).json({
        status: 'Fail',
        message:
          'The Channel Id Does not exist or there is something went wrong while retriving the videos',
      });

    const videos = await Video.findAll({ where: { ChannelId: channelId } });

    res.status(200).json({
      status: 'Success',
      length: videos.length,
      message: { data: videos },
    });
  } catch (err) {
    next(err);
  }
};

const allAvailableChannels = async (req, res, next) => {
  try {
    const channels = await Channel.findAll();
    res.status(200).json({
      status: 'Success',
      data: { channels },
    });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  allAvailableChannels,
  uploadChannelMedia,
  createChannel,
  allChannelVideos,
};
