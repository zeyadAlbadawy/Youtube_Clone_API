const { Channel, Video } = require('../models');
const createChannel = async (req, res, next) => {
  try {
    const channel = {
      name: req.body.name,
    };

    if (req.body.description) channel.description = req.body.description;
    if (req.body.avatarUrl) channel.avatarUrl = req.body.avatarUrl;
    if (req.body.bannerUrl) channel.bannerUrl = req.body.bannerUrl;

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

module.exports = { createChannel, allChannelVideos };
