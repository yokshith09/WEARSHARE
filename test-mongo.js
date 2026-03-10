const mongoose = require('mongoose');

const uri = 'mongodb+srv://chowdaryk399_db_user:aWlR7oA06ccyZrEW@cluster0.mksip7m.mongodb.net/?appName=Cluster0';

async function test() {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Connection failed:', error.message);
        process.exit(1);
    }
}

test();
