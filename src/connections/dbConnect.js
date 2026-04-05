import mongoose from "mongoose";
import ENV from "#env";
import { Logger } from "#utils";

const connectDB = async () => {
  console.log("mongo urI: ", ENV.DB.MONGODB_URI);
  try {
    const connectionInstance = await mongoose.connect(
      `${ENV.DB.MONGODB_URI}/${ENV.DB.DB_NAME}`,
    );
    console.log(
      `\n MongoDB connected || DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    Logger.databaseLogger.logError(error);
    // console.error("Error while connecting database: ", error);
    // process.exit(1);
  }
};

export default connectDB;
