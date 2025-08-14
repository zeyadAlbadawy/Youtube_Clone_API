const { Channel, ChannelSubscribe } = require('../models');

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
module.exports = { subscribeToChannel, unSubscribeToChannel };
