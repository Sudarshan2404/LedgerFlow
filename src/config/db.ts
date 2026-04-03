import mongoose, { mongo } from "mongoose";

export const connectdb = async () => {
  try {
    const URI: string | undefined = process.env.DB_URI;
    if (!URI) {
      return new Error("URI NOT implemented in .env");
    }
    const conn = await mongoose.connect(URI);
  } catch (error) {
    console.error("Error Occured While connecting the db", error);
  }
};
