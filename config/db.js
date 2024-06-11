import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://lovehome:LoveHomepass@cluster0.kqttv8s.mongodb.net/lovehome?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export { connectDB };
