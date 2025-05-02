require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const axios = require('axios');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Chat endpoint using Gemini API
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  let products = req.body.products || [];
  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Limit products to top 5 to avoid large prompt
  // products = products.slice(0, 5);

  // Prepare product info string
  const productInfo = products.length > 0
    ? 'Use the following product information to answer the user:\n' + products.map(p => `- ${p.name}: ${p.description} (Price: ${p.price})`).join('\n')
    : 'No product information available.';

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are a helpful AI product expert with a friendly and hospitable tone. Based on this user message, provide concise and relevant product suggestions or information:\n"${userMessage}"\n\n${productInfo}`
              },
            ],
          },
        ],
      }
    );

    const aiReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
    res.json({ response: aiReply });
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
