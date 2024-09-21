import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.MONGODB_URL;
const client = new MongoClient(url);
const dbName = "cart";

export const connectMongoClient = async () => {
    try {
        await client.connect();
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Error in connecting database", error);
    }
};
export const getDb = () => {
    return client.db(dbName);
};
