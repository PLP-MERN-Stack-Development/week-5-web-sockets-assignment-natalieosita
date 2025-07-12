import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.json({ token });
};