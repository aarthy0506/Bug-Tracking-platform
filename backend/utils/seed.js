const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const bcrypt   = require('bcryptjs');

dotenv.config();

const User    = require('../models/User');
const Project = require('../models/Project');
const Bug     = require('../models/Bug');
const Counter = require('../models/Counter');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Bug.deleteMany();
    await Counter.deleteMany();
    console.log('Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'Admin User', email: 'admin@bugtracker.com',
      password: 'password123', role: 'admin',
    });

    const tester = await User.create({
      name: 'Alice Tester', email: 'alice@bugtracker.com',
      password: 'password123', role: 'tester',
    });

    const developer = await User.create({
      name: 'Bob Developer', email: 'bob@bugtracker.com',
      password: 'password123', role: 'developer',
    });

    console.log('Users created');

    // Create project
    const project = await Project.create({
      name: 'Demo App',
      description: 'A sample project to showcase the bug tracker',
      createdBy: admin._id,
      members: [
        { user: admin._id,     role: 'admin' },
        { user: tester._id,    role: 'tester' },
        { user: developer._id, role: 'developer' },
      ],
    });

    console.log('Project created');

    // Create bugs
    await Bug.create([
      {
        title: 'Login button unresponsive on mobile',
        description: 'When tapping the login button on iOS Safari, nothing happens.',
        status: 'open', priority: 'high',
        project: project._id, reportedBy: tester._id,
        stepsToReproduce: '1. Open on iPhone\n2. Enter credentials\n3. Tap login',
      },
      {
        title: 'Dashboard chart not loading',
        description: 'The pie chart on the dashboard throws a JS error on first load.',
        status: 'in_progress', priority: 'medium',
        project: project._id, reportedBy: tester._id, assignedTo: developer._id,
      },
      {
        title: 'Email notifications not sent',
        description: 'Users do not receive email alerts when a bug is assigned to them.',
        status: 'resolved', priority: 'critical',
        project: project._id, reportedBy: tester._id, assignedTo: developer._id,
      },
    ]);

    console.log('Bugs created');
    console.log('\n✅ Seed complete!');
    console.log('   admin@bugtracker.com   / password123');
    console.log('   alice@bugtracker.com   / password123  (tester)');
    console.log('   bob@bugtracker.com     / password123  (developer)');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
