import { Admin } from './src/models/admin.model.js';
import dbConnect from './src/db/index.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  await dbConnect();

  const existingAdmin = await Admin.findOne({ email: 'arbinbabuthapamagar2002@gmail.com' });
  if (existingAdmin) {
    console.log('Admin already exists');
    process.exit(0);
  }

  let admin;
  try {
    admin = await Admin.create({
      name: 'Arbeen',
      email: 'arbinbabuthapamagar2002@gmail.com',
      password: 'Arbeen@1',
      phoneNumber: '9818856764',
      role: 'admin',
    });
  } catch (err) {
    console.error('Failed to create admin, nothing was saved:', err.message);
    process.exit(1);
  }

  console.log('Admin seeded — EMAIL: ', admin.email);
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
