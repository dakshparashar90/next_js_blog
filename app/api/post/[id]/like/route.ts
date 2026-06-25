import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import Post from '@/models/Post';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '@/app/types';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        
        // 🚨 FIX: Params ko await karke unwrap kiya
        const { id } = await params;
        
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        const userId = decoded.id;

        const post = await Post.findById(id);
        if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

        const index = post.likes.indexOf(userId);
        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();
        return NextResponse.json({ likes: post.likes.length });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 400 });
    }
}