'use client';

import {useState,useEffect} from 'react';
import Link from 'next/link';
import {IPost} from '@/app/types'


export default function Home(){
  const [posts,setPosts]=useState<IPost[]>([]);
  const [search,setSearch]=useState<string>('');
  const [loading,setLoading]=useState<boolean>(true);

  useEffect(()=>{
    const fetchPost=async()=>{
        try{
          const data=await fetch(`/api/posts?search=${search}`);
          const res=await data.json();
          setPosts(res.posts || []);
        }catch(err){
          console.log(err);
        }
        finally{
          setLoading(false);
        }
    };
    const timer=setTimeout(fetchPost,400);

    return ()=> clearTimeout(timer);
  },[search])

  return (
      <main style={{padding:'40px' , maxWidth:'800px' , margin:'0 auto'}}>

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h1>Latest Blog</h1>
              <Link href="/create" style={{background:'#0070f3',color:'#fff',padding:'8px 16px',borderRadius:'5px',textDecoration:'none'}}>
                  Write Post
               </Link>
          </div>

        <input 
            type='text'
            placeholder="Search posts..."
            value={search}
            onChange={(e:React.ChangeEvent<HTMLInputElement>)=>
              setSearch(e.target.value)
            }
            style={{padding:'10px',width:'100%',margin:'20px', borderRadius:'5px',border:'1px solid #ccc',color:'#000'}}
        />


        {loading ? <p>Loading...</p>:(
          <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
              {posts.map((post)=>(
                <div key={post._id} style={{border:'1px solid #eaeaea' ,padding:'20px',borderRadius:'8px'}}>

                    <h2>
                      <Link href={`/post/${post._id}`} style={{textDecoration:'none',color:'#0070f3'}}>
                        {post.title}
                      </Link>
                    </h2>
                    <p style={{color:'#666'}}>{post.summary}</p>

                  <div style={{display:'flex',gap:'15px',fontSize:'14px',color:'#888',marginTop:'10px'}}>
                      <span>👤Author ID:{post.authorName}</span>
                      <span>❤️ Likes: {post.likes?.length || 0}</span>
                       <span>👁️ Views: {post.views || 0}</span>
                  </div>

                </div>
              ))}
          </div>
        )}

      </main>
  )

}