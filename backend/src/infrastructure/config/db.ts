import mongoose from 'mongoose';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/messages';
import dotenv from 'dotenv';


dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error(ERROR_MESSAGES.DATABASE_CONNECTION_ERROR);
    }


    const conn = await mongoose.connect(mongoUri);
    console.log(SUCCESS_MESSAGES.DATABASE_CONNECTED || "Database Connected");

  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
