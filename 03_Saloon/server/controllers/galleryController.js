const Gallery = require('../models/Gallery');

exports.getGallery = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const images = await Gallery.find(filter).sort({ uploadedAt: -1 });
    res.json({ success: true, images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addImage = async (req, res) => {
  try {
    const image = await Gallery.create(req.body);
    res.status(201).json({ success: true, image });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
