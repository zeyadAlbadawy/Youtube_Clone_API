module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'please, provide your Channel name!' },
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    avatarUrl: {
      type: DataTypes.STRING,
    },
    bannerUrl: {
      type: DataTypes.STRING,
    },
    subscribersCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  Channel.associate = (models) => {
    Channel.belongsToMany(models.User, {
      through: models.ChannelSubscribe,
      foreignKey: 'ChannelId',
      as: 'Subscribers',
    });

    Channel.hasMany(models.Video, { onDelete: 'CASCADE' });
    Channel.belongsTo(models.User, { onDelete: 'CASCADE' });
  };
  return Channel;
};
