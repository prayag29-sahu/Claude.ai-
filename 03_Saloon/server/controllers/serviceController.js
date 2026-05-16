const Service = require('../models/Service');

exports.getServices = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    const services = await Service.find(filter);
    res.json({ success: true, services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
