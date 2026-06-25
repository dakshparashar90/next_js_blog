'use client'
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link';

export default function Signup(){

    const [form,setForm] = useState({username:'',email:'',password:''});
    const [error,setError] = useState("");
    const [loading,setLoading]=useState(false);
    const router = useRouter();

    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setForm({...form,[e.target.name]:e.target.value})
    }

    const handleSubmit=async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setLoading(true);
        setError('');

        try{
            const res=await fetch('/api/auth/register',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(form)
            })

            const data= await res.json();
            if(!res.ok){
                    throw new Error(data.message || 'Registration failed');
            }
            localStorage.setItem('blogUser',JSON.stringify(data));
            window.dispatchEvent(new Event('storage'));
            router.push('/');
        }
        catch(err:any){
            setError(err.message);
        }finally{
                setLoading(false);
        }
    }

    return(

        <div style={{ padding: '40px', maxWidth: '400px', margin: '100px auto', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign Up</h1>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder="username"
                    name='username'
                    onChange={handleChange}
                    style={{padding:"10px" ,color:'#000',borderRadius:'4px',border:'1px solid #ccc'}}
                    required
                />
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email Address" 
                    onChange={handleChange} 
                    style={{ padding: '10px', color: '#000', borderRadius: '4px', border: '1px solid #ccc' }} 
                    required 
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password (Min 6 chars)" 
                    onChange={handleChange} 
                    style={{ padding: '10px', color: '#000', borderRadius: '4px', border: '1px solid #ccc' }} 
                    required 
                />

                <button
                    type='submit'
                    disabled={loading}
                    style={{padding:'10px', background:'#0070f3',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer'}}
                >{loading ? 'Registering...':'Register'}</button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center' }}>Already have an account?<Link href="/login" style={{color:'#0070f3'}}>Login</Link></p>
        </div>
    )
}