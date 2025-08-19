const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Auto-generate UUID v4
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: 'Email address already in use!',
        },
        validate: {
          isEmail: {
            args: true,
            msg: 'Try using email in the mail format',
          },
        },
      },
      refreshedToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'please, provide your password!' },
        },
        allowNull: false,
      },
      passwordConfirm: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Please Confirm your password!' },
        },
        matchesPassword(value) {
          if (value !== this.password) {
            throw new Error('Passwords do not match');
          }
        },
      },
      passwordExpiredResetToken: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      otp: DataTypes.STRING,
      otpExpires: DataTypes.DATE,
    },
    {
      defaultScope: {
        attributes: { exclude: ['password', 'passwordConfirm'] },
      },
    }
  );

  // RELATIONS
  // 1- One User has many videos and one video belongs to many users

  User.associate = (models) => {
    User.belongsToMany(models.Channel, {
      through: models.ChannelSubscribe,
      foreignKey: 'UserId',
      as: 'SubscribedChannels',
    });

    User.hasMany(models.Video, {
      onDelete: 'CASCADE',
    });
    User.hasMany(models.Like, { onDelete: 'CASCADE' });
    User.hasMany(models.Dislike, { onDelete: 'CASCADE' });
    User.hasMany(models.Comment, { onDelete: 'CASCADE' });
    User.hasMany(models.Channel, { onDelete: 'CASCADE' });
  };

  // HOCKS
  User.beforeCreate(async (user, options) => {
    user.password = await bcrypt.hash(user.password, 10);
    // user.passwordConfirm = await bcrypt.hash(user.passwordConfirm, 10);
  });

  User.beforeSave(async (user, options) => {
    if (user.changed('password'))
      user.password = await bcrypt.hash(user.password, 10);
  });

  // Remove password and passwordConfirm from the JSON format
  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    delete values.passwordConfirm;
    return values;
  };

  // Check Passwords
  User.prototype.correctPassword = async function (candidatePassword) {
    // The unhashed passwords vs the hashed one from DB
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.generatedOtp = async function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = crypto.createHash('sha256').update(otp).digest('hex');
    this.otpExpires = Date.now() + 10 * 60 * 1000;
    await this.save({ validate: false });
    // Return the original otp which is not hashed!
    return otp;
  };

  // Password RESET
  User.prototype.generateRandomToken = async function () {
    // Create random token un hashed!
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Hash the created token and store it hashed in the database
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // This token is valid for 10 min
    this.passwordExpiredResetToken = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
  };

  return User;
};
