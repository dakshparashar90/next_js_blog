// import mongoose from 'mongoose'
// const MONGO_URL=process.env.MONGO_URL as string;

// if(!MONGO_URL){
//     throw new Error('Please define the MONGO_URI environment variable inside .env.local');
// }

// interface MongooseCache{
//     conn:typeof mongoose|null;
//     promise:Promise<typeof mongoose>|null;
// }

// declare global{
//     var mongoose:MongooseCache
// }

// let cached=global.mongoose;

// if(!cached){
//     cached=global.mongoose={conn:null,promise:null};
// }

// export async function connectDB():Promise<typeof mongoose>{
//     if(cached.conn) return cached.conn;

//     if(!cached.promise){
//         const opts ={bufferCommands:false};
//         cached.promise =mongoose.connect(MONGO_URL,opts).then((mongoose)=>mongoose)
//     }

//     try{
//             cached.conn = await cached.promise;
//     }catch(e){
//         cached.promise = null;
//         throw e;
//     }

//     return cached.conn;
// }

import mongooseModule from 'mongoose';

const MONGO_URL = process.env.MONGO_URL as string;

if (!MONGO_URL) {
    throw new Error('Please define the MONGO_URL environment variable inside Vercel or .env.local');
}

interface MongooseCache {
    conn: typeof mongooseModule | null;
    promise: Promise<typeof mongooseModule> | null;
}

// Global interface ko secure kiya taaki module clash na ho
declare global {
    var mongooseCache: MongooseCache;
}

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongooseModule> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const opts = { bufferCommands: false };
        
        // Yahan real installed module package se connect kar rahe hain strictly
        cached.promise = mongooseModule.connect(MONGO_URL, opts).then((m) => m);
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}