import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectString = process.env.MONGO_URI;

class DataBase {
    constructor() {
        this.connect();
    }

    async connect( type = 'mongodb') {
        try {
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true});

            await mongoose.connect(connectString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            console.log('MongoDB connected successfully!');
        }

        catch (error) {
            console.error('MongoDB connection error:', error.message);
        }
    } 

    static getInstance() {
        if( !DataBase.instance) {
            DataBase.instance = new DataBase();
        }
        return DataBase.instance;
    }
}

const db = DataBase.getInstance();
export default db;