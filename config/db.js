const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Kết nối MongoDB thành công!');
    } catch (error) {
        console.error('Kết nối MongoDB thất bại:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
