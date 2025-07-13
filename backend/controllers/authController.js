const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: 'User registered',
      user: { id: user._id, name: user.name, email: user.email },
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ error: 'All fields are required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: 'Invalid email or password' });

    res.json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
