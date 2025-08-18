const { Channel, ChannelSubscribe } = require('../models');
const AppError = require('../utils/appError');

const subscribeToChannel = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const foundChannel = await Channel.findOne({ where: { id: channelId } });
    if (!foundChannel)
      return res.status(404).json({
        status: 'fail',
        message: `There is No Channel With id ${channelId}`,
      });

    const foundSubscription = await ChannelSubscribe.findOne({
      where: { UserId: req.user.id, ChannelId: channelId },
    });

    if (foundSubscription)
      return res.status(400).json({
        status: 'fail',
        message: 'you already subscibed to this channel',
      });

    await ChannelSubscribe.create({
      UserId: req.user.id,
      ChannelId: channelId,
    });
    foundChannel.subscribersCount += 1;
    await foundChannel.save();

    res.status(201).json({
      status: 'Success',
      message: 'You subscribed to this channel',
    });
  } catch (err) {
    next(err);
  }
};

const unSubscribeToChannel = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const foundChannel = await Channel.findOne({ where: { id: channelId } });
    if (!foundChannel)
      return res.status(404).json({
        status: 'fail',
        message: `There is No Channel With id ${channelId}`,
      });

    const foundSubscription = await ChannelSubscribe.findOne({
      where: { UserId: req.user.id, ChannelId: channelId },
    });

    if (foundSubscription) {
      foundChannel.subscribersCount -= 1;
      await foundChannel.save();

      await foundSubscription.destroy();
      return res.status(200).json({
        status: 'Success',
        message: `You unsubscribed from channel ${channelId} Successfully!`,
      });
    }

    res.status(400).json({
      status: 'fail',
      message: 'You are not subscribed to channel to be able to unscubribe it!',
    });
  } catch (err) {
    next(err);
  }
};

// For one user, get w which chnanel is subsrcribed to
const getUserSubscription = async (req, res, next) => {
  try {
    const channels = await ChannelSubscribe.findAll({
      where: { UserId: req.user.id },
      include: [
        {
          model: Channel,
          attributes: ['name', 'subscribersCount'],
        },
      ],
    });

    if (!channels)
      return next(
        new AppError(
          `OPS! Something went wrong while retriving subscriptions`,
          404
        )
      );

    res.status(200).json({
      status: 'Success',
      message: { data: channels },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserSubscription,
  subscribeToChannel,
  unSubscribeToChannel,
};
