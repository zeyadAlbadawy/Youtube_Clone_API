module.exports = (sequelize, DataTypes) => {
  const ChannelSubscribe = sequelize.define(
    'ChannelSubscribe',
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ChannelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['UserId', 'ChannelId'],
        },
      ],
    }
  );

  ChannelSubscribe.associate = (models) => {
    ChannelSubscribe.belongsTo(models.User, {
      foreignKey: 'UserId',
      onDelete: 'CASCADE',
    });
    ChannelSubscribe.belongsTo(models.Channel, {
      foreignKey: 'ChannelId',
      onDelete: 'CASCADE',
    });
  };

  return ChannelSubscribe;
};
