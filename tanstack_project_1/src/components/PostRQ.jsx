import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'

const PostRQ = () => {
    // /posts ["posts"]
    // /posts/1 ["posts",1(post.id)]
    // /posts/2/comments ["posts",post.id , "comments"]
    //every single query       must have unique query id
    //takes 2 prop : key & function == callback that returns a promise --> we will write a function to fetch the posts (api calling code)

    // this useQuery will return an object (here result) which contains all the information about the query for eg in trad : we needed posts , loading and/or error 
    const {data , isLoading , isError ,isFetching ,error ,refetch} = useQuery({
        queryKey : ["posts"], 
        queryFn : ()=>{
            return  axios.get(`http://localhost:3000/posts`)
        }
        , 
       // refetchInterval : 1000 //after every 1 sec the query will be refetched eg like groww or zerotha(trading websites) this is called polling --> and it continues as long as current tab is active
       //if you want to switch the tab and want the polling to be continued , we use :
      //  refetchIntervalInBackground: true
       
       //staleTime:3000 // for how long the data will remain fresh and a new request will not be


       //when we want that the useQuery should not fetch data (whenever the component mounts , every time tab is switched a new query request is made) , we do the enabled : false , which automatically disables the refetching of data when component mounts, because now we want that the user should see the data on user interaction for eg. button click
       enabled: false 
     })
    console.log({isLoading,isFetching});
    


    if (isLoading)
        return <div>Loading .....</div>
    if(isError)
        return <div>{error.message}</div>
    console.log('heyy',data);


  return (
    <div className='container'>
      <button onClick={refetch}>Fetch Posts</button> 
      {
        data?.data.map((post)=>(
          <Link to={`/rq-posts/${post.id}`}>
               <div className='post-item' key={post.id}>
                     <h3 className='post-title'>{post.title}</h3>
                     <p className='post-body'>{post.body}</p>
            </div>
          </Link>
           
        ))
      }
    </div>
  )
}

export default PostRQ 

//Query by ID - Fetching data by ID
// a user want to click on one post and get to a detailed post about that post

//create a RQ post detail page 
//configure route for this --(rq-post/{postId})
//wrapping each item withing anchor tag
