import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'


const fetchPostDetails =(postId)=>{
        return axios.get(`http://localhost:3000/posts/${postId}`) 
}

const PostDetailsRQ = () => {

    // to access the current id clicked we use useParams:
   const {postId} = useParams();
   console.log(postId,"postId");

  const {data , isLoading , isFetching ,  isError , error} = useQuery({
    queryKey : ["posts",postId],
    queryFn : ()=>fetchPostDetails(postId),
    

    
  })

  
  if (isLoading)
    return <div>Loading .....</div>
  if(isError)
    return <div>{error.message}</div>

  const {title , body } = data?.data || 0;




  return (
    <div className='post-details-container'>
        <div className="post-details-title">{title}</div>
        <div className="post-details-body">{body}</div>
      Post Details RQ page
    </div>
  )
}

export default PostDetailsRQ
