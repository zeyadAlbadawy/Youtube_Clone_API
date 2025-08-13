module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    VideoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Comment;
};
