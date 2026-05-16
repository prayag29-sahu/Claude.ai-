const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

exports.uploadImage = async (file, folder = 'lightroom') => {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    resource_type: 'auto',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }]
  })
  return { url: result.secure_url, publicId: result.public_id }
}

exports.deleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId)
}

module.exports.cloudinary = cloudinary
