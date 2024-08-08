const express = require('express');
const session = require('express-session');
const path = require('path');
const connectDB = require('./config/database');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.render('welcome');
});

// Error handling for 404 - Not Found
app.use((req, res, next) => {
  res.status(404).send('404 - Not Found');
});

// Error handling for other errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('500 - Server Error');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
