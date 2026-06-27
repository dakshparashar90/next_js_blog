'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PostDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [commentInput, setCommentInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        if (!id) return;

        const fetchPostDetails = async () => {
            try {
                // Fetch Post data
                const postRes = await fetch(`/api/post/${id}`);
                if (!postRes.ok) throw new Error('Post not found');
                const postData = await postRes.json();
                setPost(postData);
                setLikeCount(postData.likes?.length || 0);

                // Fetch Comments data
                const commentRes = await fetch(`/api/comments/${id}`);
                const commentData = await commentRes.json();
                setComments(commentData || []);
            } catch (err) {
                console.error(err);
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [id]);

    const handleLike = async () => {
        const user = JSON.parse(localStorage.getItem('blogUser') || '{}');
        if (!user.token) return alert('Please login to like this post!');

        try {
            const res = await fetch(`/api/post/${id}/like`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            setLikeCount(data.likes);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentInput.trim()) return;

        const user = JSON.parse(localStorage.getItem('blogUser') || '{}');
        if (!user.token) return alert('Please login to comment!');

        try {
            const res = await fetch(`/api/comments/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ content: commentInput })
            });

            if (res.ok) {
                const newComment = await res.json();
                setComments([newComment, ...comments]);
                setCommentInput('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p style={{ padding: '40px', textAlign: 'center' }}>Loading Blog Profile...</p>;
    if (!post) return <p style={{ padding: '40px', textAlign: 'center' }}>Post not found.</p>;

    return (
        <div style={{ padding: '40px', maxWidth: '700px', margin: '0 auto', backgroundColor: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', marginTop: '30px' }}>
            <button onClick={() => router.push('/')} style={{ marginBottom: '20px', cursor: 'pointer', background: '#f0f0f0', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>
                ← Back to Feed
            </button>
            
            <h1>{post.title}</h1>
            
            <div style={{ display: 'flex', gap: '20px', color: '#666', fontSize: '14px', margin: '15px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <span>👤 Posted By User: <strong>{post.author?.username || 'Anonymous'}</strong></span>
                <span>👁️ Views: {post.views}</span>
            </div>

            <p style={{ lineHeight: '1.6', fontSize: '18px', whiteSpace: 'pre-wrap', color: '#222' }}>{post.content}</p>

            {/* Like Trigger Button Section */}
            <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={handleLike} style={{ padding: '10px 20px', background: '#ff4757', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
                    ❤️ Like ({likeCount})
                </button>
            </div>

            {/* Comments Section Container */}
            <div style={{ marginTop: '40px', borderTop: '2px solid #f0f0f0', paddingTop: '20px' }}>
                <h3>Comments ({comments.length})</h3>
                
                <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
                    <input 
                        type="text" 
                        placeholder="Write a comment..." 
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: '#000' }}
                    />
                    <button type="submit" style={{ padding: '10px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Post
                    </button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {comments.map((c: any) => (
                        <div key={c._id} style={{ background: '#f9f9f9', padding: '12px', borderRadius: '6px', border: '1px solid #eee' }}>
                            <p style={{ margin: 0, fontSize: '14px', color: '#000' }}>{c.content}</p>
                            <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
                                By User: {c.author?.username || c.author}
                            </small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}