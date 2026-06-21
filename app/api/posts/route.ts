import {NextRequest,NextResponse} from 'next/server'
import {connectDB} from '@/app/lib/db'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {DecodedToken} from '@/app/types/index'

const PostSchema =new mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String,required:true},
    summary:{type:String,maxLength:300},
    author:{type:String,required:true},
    status:{type:String,defualt:'published',enum:['draft','published']}

},{timestamps:true});

const Post=mongoose.models.Post || mongoose.model('Post',PostSchema);

export async function GET(req:Request){
    try{
        await connectDB();
        const {searchParams} = new URL(req.url);
        const search=searchParams.get('search')||'';
        let query:any={status:'published'};
        
        if(search){
            query.title={$regex:search,$option:'i'};
        }

        const posts=await Post.find(query).sort({createdAt:-1});
        return NextResponse.json({ posts });
    }
    catch(err:any){
        return NextResponse.json({mess:err.message},{status:500});
    }
}

export async function POST(req:NextRequest){
    try{
        await connectDB();
        const authHeader =req.headers.get('authorization');
        if(!authHeader|| !authHeader.startsWith('Bearer')){
            return NextResponse.json({message:'Unauthorized'},{status:401})
        }

        const token = authHeader.split(' ')[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET as string) as DecodedToken;
        const body = await req.json();
        const post = await Post.create({ ...body, author: decoded.id });
    }catch(err:any){
            return NextResponse.json({ message: err.message }, { status: 400 });
    }
}