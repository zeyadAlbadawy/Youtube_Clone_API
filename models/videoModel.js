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
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    dislikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  });

  // One Video Belongs to ONE users
  // 1) Video HAS a field Called "userId" => foreign key which links to user (id)
  // 2) Video HAS MANY LIKES
  Video.associate = (models) => {
    Video.belongsTo(models.User);
    Video.hasMany(models.Like, { onDelete: 'CASCADE' });
    Video.hasMany(models.Dislike, { onDelete: 'CASCADE' });
    Video.hasMany(models.Comment, { onDelete: 'CASCADE' });
  };

  // Video Has Many likes
  return Video;
};
