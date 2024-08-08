const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Car = require('../models/Car');

// Admin login
router.get('/login', (req, res) => {
  res.render('admin/login', { title: 'Assignment for Quadiro Technologies' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, role: 'admin' });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    req.session.role = user.role;
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin/login');
  }
});

// Admin registration
router.get('/register', (req, res) => {
  res.render('admin/register', { title: 'Register Admin' });
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashedPassword, role: 'admin' });
  res.redirect('/admin/login');
});

// Admin dashboard
router.get('/dashboard', async (req, res) => {
  if (req.session.role !== 'admin') {
    return res.redirect('/admin/login');
  }

  const cars = await Car.find();
  const totalCars = cars.length;

  res.render('admin/dashboard', { cars, totalCars });
});

// Create car
router.post('/car', async (req, res) => {
  const { carName, manufacturingYear, price } = req.body;
  await Car.create({ carName, manufacturingYear, price });
  res.redirect('/admin/dashboard');
});

// Display form to add a new car
router.get('/car/add', (req, res) => {
  if (req.session.role !== 'admin') {
    return res.redirect('/admin/login');
  }

  res.render('admin/addCar'); // Ensure the view exists
});

// Update car
router.post('/car/:id/update', async (req, res) => {
  const { id } = req.params;
  const { carName, manufacturingYear, price } = req.body;
  await Car.findByIdAndUpdate(id, { carName, manufacturingYear, price });
  res.redirect('/admin/dashboard');
});

// Delete car
router.post('/car/:id/delete', async (req, res) => {
  const { id } = req.params;
  await Car.findByIdAndDelete(id);
  res.redirect('/admin/dashboard');
});

module.exports = router;
