const { validationResult } = require('express-validator');
const Service = require('../models/Service');

// @desc    Get all services with filters
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, page = 1, limit = 12, sort = '-createdAt' } = req.query;

    const query = {};

    if (category && category !== 'All') query.category = category;
    if (req.query.available !== undefined) query.isAvailable = req.query.available === 'true';

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Service.countDocuments(query);
    const services = await Service.find(query).sort(sort).skip(skip).limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    res.status(200).json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

// @desc    Create service
// @route   POST /api/services
// @access  Admin
const createService = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const serviceData = { ...req.body };

    // Handle image upload if file provided
    if (req.file) {
      serviceData.image = req.file.path;
      serviceData.imagePublicId = req.file.filename;
    }

    // Parse features if sent as string
    if (typeof serviceData.features === 'string') {
      serviceData.features = serviceData.features.split(',').map((f) => f.trim());
    }

    const service = await Service.create(serviceData);
    res.status(201).json({ success: true, message: 'Service created successfully!', service });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Admin
const updateService = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    if (typeof updateData.features === 'string') {
      updateData.features = updateData.features.split(',').map((f) => f.trim());
    }

    const service = await Service.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    res.status(200).json({ success: true, message: 'Service updated!', service });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Admin
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    res.status(200).json({ success: true, message: 'Service deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get service categories
// @route   GET /api/services/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Service.distinct('category');
    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

module.exports = { getServices, getService, createService, updateService, deleteService, getCategories };
