import {NextRequest,NextResponse} from 'next/server'
import {connectDB} from "@/app/lib/db"
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

const UserSchema =new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,default:'author'}
},{timestamps:true});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export async function POST(req:Request){
    try{
        await connectDB();
        const {username,email,password} =await req.json();
        const exists = await User.findOne({email});
        if(exists){
            return NextResponse.json({message:'Email already in use'},{status:400});
        }
        const hPass =await bcrypt.hash(password,10);
        const user = await User.create({ username, email, password: hPass });
        
        const token =jwt.sign({id:user._id},process.env.JWT_SECRET as string,{expiresIn:'7d'});
        return NextResponse.json({ _id: user._id, username: user.username, email: user.email, token }, { status: 201 });
    }catch(err:any){
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}