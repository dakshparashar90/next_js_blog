import mongoose from 'mongoose'
const MONGO_URL=process.env.MONGO_URL as string;

if(!MONGO_URL){
    throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

interface MongooseCache{
    conn:typeof mongoose|null;
    promise:Promise<typeof mongoose>|null;
}

declare global{
    var mongoose:MongooseCache
}

let cached=global.mongoose;

if(!cached){
    cached=global.mongoose={conn:null,promise:null};
}

export async function connectDB():Promise<typeof mongoose>{
    if(cached.conn) return cached.conn;

    if(!cached.promise){
        const opts ={bufferCommands:false};
        cached.promise =mongoose.connect(MONGO_URL,opts).then((mongoose)=>mongoose)
    }

    try{
            cached.conn = await cached.promise;
    }catch(e){
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}
