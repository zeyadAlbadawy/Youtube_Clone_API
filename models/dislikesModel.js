module.exports = (sequelize, DataTypes) => {
  const Dislike = sequelize.define(
    'Dislike',
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

  Dislike.associate = (models) => {
    Dislike.belongsTo(models.Video);
    Dislike.belongsTo(models.User);
  };

  return Dislike;
};
