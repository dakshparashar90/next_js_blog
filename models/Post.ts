import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. TypeScript Interface taaki code me strict autocomplete mile
export interface IPost extends Document {
    title: string;
    content: string;
    summary?: string;
    author: string;
    status: 'draft' | 'published';
    likes: string[];
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

// 2. Main Mongoose Schema definition
const PostSchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String, maxLength: 300 },
    author: { type: String, required: true },
    status: { type: String, default: 'published', enum: ['draft', 'published'] },
    likes: [{ type: String, default: [] }], 
    views: { type: Number, default: 0 }
}, { timestamps: true });

// 3. Model Export logic (Next.js serverless caching ke sath)
const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;