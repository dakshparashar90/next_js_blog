import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import Comment from '@/models/Comment';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '@/app/types';

// Enforce target check model registration safely for population helper references
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true }
}));

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = await params;
        
        // 🚨 FIX: '.populate' ka use karke author string ID ki jagah User document se 'username' uthaya
        const comments = await Comment.find({ post: id })
            .populate({ path: 'author', model: User, select: 'username' })
            .sort({ createdAt: -1 });
        
        return NextResponse.json(comments);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = await params;

        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        const userId = decoded.id;

        const { content } = await req.json();
        if (!content || !content.trim()) {
            return NextResponse.json({ message: 'Comment content empty' }, { status: 400 });
        }

        // Naya comment create kiya
        let newComment = await Comment.create({
            post: id,
            author: userId,
            content: content.trim()
        });

        // 🚨 FIX: Naye bane comment ko bhi instantly populate kiya takki return object me name ho
        newComment = await newComment.populate({ path: 'author', model: User, select: 'username' });

        return NextResponse.json(newComment, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 400 });
    }
}