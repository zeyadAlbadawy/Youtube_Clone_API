const { User } = require('../models');
const sendMailOTP = require('../utils/sendMail.js');

const createSendOtp = async (email) => {
  try {
    // 1 ) Check if  a user exists with this email
    const foundUser = await User.findOne({ where: { email } });
    if (!foundUser)
      return next(new AppError(`No User found with email ${email}`, 404));

    // 2 ) Create otp and send it to nodemailer
    const otp = await foundUser.generatedOtp();
    const mailOptions = {
      email,
      subject: `OTP VALIDATION`, // NEED TO BE CHANGED!
      message: `Your otp is ${otp} and it is valid for 10 min, Hurry Up`,
    };
    await sendMailOTP.sendEmail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createSendOtp };
