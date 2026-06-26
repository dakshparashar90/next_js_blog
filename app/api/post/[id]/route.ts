import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import Post from '@/models/Post';

// ✅ 1. GET Handler: Frontend par jab post load hogi, tab yeh chalega
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        
        const { id } = await params;
        const post = await Post.findById(id);
        
        if (!post) {
            return NextResponse.json({ message: 'Post not found in DB' }, { status: 404 });
        }
        
        return NextResponse.json(post);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

// ✅ 2. POST Handler: Views badhane ke liye ya update ke liye yeh chalega
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        
        const { id } = await params;
        const post = await Post.findById(id);
        
        if (!post) {
            return NextResponse.json({ message: 'Post not found in DB' }, { status: 404 });
        }
        
        post.views = (post.views || 0) + 1;
        await post.save();
        
        return NextResponse.json(post);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}