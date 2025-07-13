// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
require('dotenv').config();

// dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes 
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/bookmarks', require('./routes/bookmarkRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));


const PORT = process.env.PORT || 5000;

// ✅ Updated and clean
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
