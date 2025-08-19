module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'Like',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      UserId: {
        type: DataTypes.UUID, //TODO uuid
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      VideoId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,

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
