module.exports = (sequelize, DataTypes) => {
  const ChannelSubscribe = sequelize.define(
    'ChannelSubscribe',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      UserId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      ChannelId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
