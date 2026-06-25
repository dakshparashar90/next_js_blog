'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

interface FormState{
    title:string;
    content:string;
    summary:string;
}

export default function CreatePost(){
    const [form,setForm]=useState<FormState>({title: '',content: '', summary: ''});
    const [error,setError]=useState<string>('');
    const router=useRouter();

    const handleChange=(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        setForm({...form,[e.target.name]:e.target.value});
    };

    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const user =JSON.parse(localStorage.getItem('blogUser')|| "{}");

        try{
            const res= await fetch('/api/posts',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${user.token} || ''}`

                },
                body:JSON.stringify({...form,authorName:user.username || 'Anonymous'})
            });

            if(!res.ok) throw new Error('Failed to create post');
            router.push('/');
        }catch(err:any){
            setError(err.message);
        }

    }

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Create New Post</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <input name="title" placeholder="Title" onChange={handleChange} style={{ padding: '10px', color: '#000' }} required />
                <input name="summary" placeholder="Summary" onChange={handleChange} style={{ padding: '10px', color: '#000' }} />
                <textarea name="content" placeholder="Content" onChange={handleChange} rows={8} style={{ padding: '10px', color: '#000' }} required />
                <button type="submit" style={{ padding: '10px', background: '#000', color: '#fff', cursor: 'pointer' }}>Publish</button>
            </form>
        </div>
    )
}