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

  Comment.associate = (models) => {
    Comment.belongsTo(models.Video, { onDelete: 'CASCADE' });
    Comment.belongsTo(models.User, { onDelete: 'CASCADE' });
  };
  return Comment;
};
