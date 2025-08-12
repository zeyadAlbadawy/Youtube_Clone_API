module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'Like',
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      VideoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['UserId', 'VideoId'],
        },
      ],
    }
  );

  // 1) like belongs to one video
  // 2) Like belongs to one User

  Like.associate = (models) => {
    Like.belongsTo(models.Video);
    Like.belongsTo(models.User);
  };

  return Like;
};
