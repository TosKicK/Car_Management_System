const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// User login
router.get('/login', (req, res) => {
  res.render('user/login', { title: 'Assignment for Quadiro Technologies' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, role: 'user' });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    req.session.role = user.role;
    res.redirect('/user/dashboard');  // Ensure you have a user dashboard or change this route
  } else {
    res.redirect('/user/login');
  }
});

// User registration
router.get('/register', (req, res) => {
  res.render('user/register', { title: 'Register User' });
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashedPassword, role: 'user' });
  res.redirect('/user/login');
});

// User dashboard
router.get('/dashboard', (req, res) => {
  if (req.session.role !== 'user') {
    return res.redirect('/user/login');
  }

  res.send('User Dashboard'); // Replace with actual dashboard rendering
});

module.exports = router;
