const cloudinary = require('cloudinary').v2;

const uploadVideoWithThumbnail = async (req, res, next, finalVideoCreated) => {
  // Cloudainary Linking to upload Video, image

  let videoUrlCloudainary, thumbnailUrlCloudainary;
  // Upload The Video
  console.log(req.files.video[0].path);
  if (req.files.video && req.files.video[0]) {
    const videoUpload = await cloudinary.uploader.upload(
      req.files.video[0].path,
      {
        folder: 'youtube-clone/videos/Clips',
        resource_type: 'video',
        use_filename: true,
        unique_filename: false,
        resource_type: 'video',
        chunk_size: 6000000,
      }
    );
    videoUrlCloudainary = videoUpload.secure_url;
    finalVideoCreated.videoUrl = videoUrlCloudainary;
    await finalVideoCreated.save();
  }

  if (
    req.files.image &&
    req.files.image.length > 0 &&
    req.files.image[0].path
  ) {
    const thumbnailUpload = await cloudinary.uploader.upload(
      req.files.image[0].path,
      {
        folder: 'youtube-clone/videos/images',
        resource_type: 'image',
        use_filename: true,
      }
    );
    thumbnailUrlCloudainary = thumbnailUpload.secure_url;
    finalVideoCreated.thumbnailUrl = thumbnailUrlCloudainary;
    await finalVideoCreated.save();
  }
};

module.exports = { uploadVideoWithThumbnail };
