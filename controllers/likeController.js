const { Like } = require('../models');
const AppError = require('../utils/appError');
const likeVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;
    const [like, created] = await Like.findOrCreate({
      where: { UserId: userId, VideoId: videoId },
    });
    console.log(like, created);
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
module.exports = { likeVideo, dislikeVideo };
