require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

async function seedUsers() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for seeding users');

    const users = [
      { username: 'Alice', email: 'alice@example.com', password: 'password123' },
      { username: 'Bob', email: 'bob@example.com', password: 'password123' },
      { username: 'Charlie', email: 'charlie@example.com', password: 'password123' },
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = new User({
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
        });
        await user.save();
        console.log(`User ${userData.username} created`);
      } else {
        console.log(`User ${userData.username} already exists`);
      }
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB after seeding');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

seedUsers();
