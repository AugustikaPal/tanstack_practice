import React, { useEffect, useState } from 'react';
import axios from 'axios';


const PostTrad = () => {
    const [posts,setposts]=useState([]);
    const [loading,setloading]=useState(true);
    const api = `http://localhost:3000/posts`;

    const fetchPosts = async()=>{
     try{   
            const res = await axios.get(api);
            setposts(res.data);
     }
        catch(error){
            alert(`failed to load`,error);
        }
        finally{
            setloading(false);
        }

    }

    useEffect(()=>{
        fetchPosts();
    },[]);


  return (    
      <div className='container'>
        {
            loading ? (<p>Loading ....</p> ): 
          (  posts.map((post)=>(
                <div className='post-list' key={post.id}>
                    <h3 className='post-title'>{post.title}</h3>
                    <p className='post-item'>{post.body}</p>
                </div>
            )))
        }
      </div>
    
  )
}

export default PostTrad
