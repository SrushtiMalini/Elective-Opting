const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: 'admin@elective.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin already exists');
    } else {
      // Create new admin
      const admin = await Admin.create({
        name: 'Super Admin',
        email: 'admin@elective.com',
        password: 'admin123'
      });
      console.log('✅ Admin created:', admin.email);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();