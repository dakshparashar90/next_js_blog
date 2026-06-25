import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import Post from '@/models/Post';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        
        // 🚨 FIX: Params ko await karke unwrap kiya
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