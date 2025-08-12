module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
    // Title, description, videoUrl, thumbnailUrl,  views, likes
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  // One Video Belongs to ONE users
  // Video HAS a field Called "userId" => foreign key which links to user (id)
  Video.associate = (models) => {
    Video.belongsTo(models.User);
  };
  return Video;
};
