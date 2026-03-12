const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
    try {
        // Check if seeding already exists
        const adminExists = await User.findOne({ email: 'admin1@test.com' });
        if (adminExists) {
            console.log('Data already seeded. Exiting...');
            process.exit();
        }

        // 1. Create Users
        const users = [];
        const userDataList = [
            { name: 'Admin1', email: 'admin1@test.com', password: 'password123', role: 'Admin' },
            { name: 'Admin2', email: 'admin2@test.com', password: 'password123', role: 'Admin' },
            { name: 'User1', email: 'user1@test.com', password: 'password123', role: 'User' },
            { name: 'User2', email: 'user2@test.com', password: 'password123', role: 'User' },
            { name: 'User3', email: 'user3@test.com', password: 'password123', role: 'User' },
            { name: 'User4', email: 'user4@test.com', password: 'password123', role: 'User' }
        ];

        for (const data of userDataList) {
            const user = await User.create(data); // This triggers the password hashing!
            users.push(user);
        }

        // 2. Create Projects
        const projects = await Project.insertMany([
            { name: 'Admin Project 1', description: 'Admin 1 work', createdBy: users[0]._id },
            { name: 'Admin Project 2', description: 'Admin 2 work', createdBy: users[1]._id },
            { name: 'User1 Project 1', description: 'User 1 work', createdBy: users[2]._id },
            { name: 'User2 Project 1', description: 'User 2 work', createdBy: users[3]._id }
        ]);

        // 3. Create Tasks
        const tasks = [];
        projects.forEach((proj) => {
            for (let i = 1; i <= 3; i++) {
                tasks.push({
                    title: `Task ${i} for ${proj.name}`,
                    projectId: proj._id,
                    assignedTo: users[2]._id, // Default assign to User1
                    status: i === 3 ? 'Completed' : 'Pending'
                });
            }
        });

        await Task.insertMany(tasks);
        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();