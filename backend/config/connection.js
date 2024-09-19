const {MongoClient}=require('mongodb')
const dotenv=require('dotenv')
dotenv.config({})

const url=process.env.MONGODB_URL
const client=new MongoClient(url)
const dbName="cart"

const connectMongoClient=async()=>{
    try {
        await client.connect();
        console.log("Database connected successfully");
        
    } catch (error) {
        console.log("Error in connecting database",error);
        
    }
}

const getDb=()=>{
    return client.db(dbName)
}

module.exports={
    connectMongoClient,
    getDb
}