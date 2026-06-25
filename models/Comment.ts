import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript Interface for Comment
export interface IComment extends Document {
    post: string;
    author: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

// Mongoose Schema Definition
const CommentSchema: Schema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Auth user ID store karne ke liye
    content: { type: String, required: true, maxLength: 1000 }
}, { timestamps: true });

// Export Model with Next.js Caching
const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;