const { Op } = require('sequelize');
const AppError = require('../utils/appError');
const { Channel, Video } = require('../models');

const searchedRes = async (req, res, next, Model, name, value) => {
  const result = await Model.findAll({
    where: {
      [name]: {
        [Op.iLike]: `%${value}%`,
      },
    },
  });

  if (!result)
    return next(
      new AppError(`There is something went wrong while searching`, 400)
    );

  if (!result.length)
    return res.status(200).json({
      status: 'Success',
      message:
        'No res found with this field, try searching with different words!',
    });

  res.status(200).json({
    status: 'Success',
    message: { data: result },
  });
};

module.exports = { searchedRes };
