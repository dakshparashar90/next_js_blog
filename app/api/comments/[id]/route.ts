import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '@/app/types/index';

// Comment Schema registration safely
const CommentSchema = new mongoose.models.Comment?.schema || new mongoose.Schema({
    postId: { type: String, required: true },
    content: { type: String, required: true },
    author: {
        id: { type: String, required: true },
        username: { type: String, required: true }
    }
}, { timestamps: true });

const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

// ✅ GET Handler: Fully dynamic with explicit any constraint for Next.js 15
export async function GET(req: NextRequest, { params }: any) {
    try {
        await connectDB();
        
        // Next.js 15 safe parameter resolution
        const resolvedParams = await params;
        const id = resolvedParams?.id; 

        if (!id) {
            return NextResponse.json({ message: 'Post ID missing' }, { status: 400 });
        }

        const comments = await Comment.find({ postId: id }).sort({ createdAt: -1 });
        return NextResponse.json(comments);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

// ✅ POST Handler: Fully dynamic with explicit any constraint for Next.js 15
export async function POST(req: NextRequest, { params }: any) {
    try {
        await connectDB();
        
        const resolvedParams = await params;
        const id = resolvedParams?.id; 

        if (!id) {
            return NextResponse.json({ message: 'Post ID missing' }, { status: 400 });
        }

        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized: Missing Token' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

        const body = await req.json();
        
        if (!body.content || !body.content.trim()) {
            return NextResponse.json({ message: 'Comment content cannot be empty' }, { status: 400 });
        }

        const newComment = await Comment.create({
            postId: id,
            content: body.content,
            author: {
                id: decoded.id,
                username: (decoded as any).username || 'Anonymous'
            }
        });

        return NextResponse.json(newComment, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 400 });
    }
}