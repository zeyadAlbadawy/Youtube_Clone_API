const cloudinary = require('cloudinary').v2;
const uploadThumnails = async (req, res, next, createdChannel) => {
  // Upload Channel Thumbnail
  let avatarUrlCloudainary, bannerUrlCloudainary;
  // Upload The avatar
  if (req.files.avatarUrl && req.files.avatarUrl[0]) {
    const avatarUploadRes = await cloudinary.uploader.upload(
      req.files.avatarUrl[0].path,
      {
        folder: 'youtube-clone/avatars',
      }
    );
    avatarUrlCloudainary = avatarUploadRes.secure_url;
    createdChannel.avatarUrl = avatarUrlCloudainary;
    await createdChannel.save();
  }

  // Upload The Banners
  if (req.files.bannerUrl && req.files.bannerUrl[0]) {
    const bannerResult = await cloudinary.uploader.upload(
      req.files.bannerUrl[0].path,
      { folder: 'youtube-clone/banners' }
    );
    bannerUrlCloudainary = bannerResult.secure_url;
    // Update channel with Cloudinary URL
    createdChannel.bannerUrl = bannerUrlCloudainary;
    await createdChannel.save();
    // fs.unlinkSync(req.files.bannerUrl[0].path); // if i wanna delete them local
  }
};

module.exports = { uploadThumnails };
