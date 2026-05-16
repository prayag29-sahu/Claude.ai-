import { Admin, User, Orders } from '../models/Schema.js';

export const fetchBanner = async (req, res) => {
  try {
    const admin = await Admin.findOne();
    res.json(admin ? admin.banner : '');
  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
};

export const updateBanner = async (req, res) => {
  const { banner } = req.body;
  try {
    if (req.user.usertype !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    const data = await Admin.find();
    if (data.length === 0) {
      const newData = new Admin({ banner, categories: [] });
      await newData.save();
    } else {
      const admin = await Admin.findOne();
      admin.banner = banner;
      await admin.save();
    }
    res.json({ message: 'Banner updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
};

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // password hide

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find();

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders",
    });
  }
};


