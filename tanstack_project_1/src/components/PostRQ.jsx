import React from 'react'
import { useQuery ,useMutation,useQueryClient  } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react';
//queryclient lets you interact with  the cache data 
import { QueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom'

//GET request
const fetchPosts=()=>{
    return  axios.get(`http://localhost:3000/posts`);
} 

//POST request ===> useMutation 
const addPosts=(post)=>{
    return axios.post(`http://localhost:3000/posts`,post);
}

const PostRQ = () => {
    // /posts ["posts"]
    // /posts/1 ["posts",1(post.id)]
    // /posts/2/comments ["posts",post.id , "comments"]
    //every single query       must have unique query id
    //takes 2 prop : key & function == callback that returns a promise --> we will write a function to fetch the posts (api calling code)

    const queryClient = useQueryClient();
    // this useQuery will return an object (here result) which contains all the information about the query for eg in trad : we needed posts , loading and/or error 
    const {data , isLoading , isError, isFetching,error ,refetch} = useQuery({
        queryKey : ["posts"], 
        queryFn : fetchPosts,
        
       // refetchInterval : 1000 //after every 1 sec the query will be refetched eg like groww or zerotha(trading websites) this is called polling --> and it continues as long as current tab is active
       //if you want to switch the tab and want the polling to be continued , we use :
      //  refetchIntervalInBackground: true
       
       //staleTime:3000 // for how long the data will remain fresh and a new request will not be


       //when we want that the useQuery should not fetch data (whenever the component mounts , every time tab is switched a new query request is made) , we do the enabled : false , which automatically disables the refetching of data when component mounts, because now we want that the user should see the data on user interaction for eg. button click
    //    enabled: false 
     })

     //similar to useQuer , useMutation aslo accepts an object - containing a mutation function (which returns a promise (agaimn))
     // this mutate object has to be passed wherever the post has to be made , add ,del , update
     // if there are multiple mutations we have to add alias like addMutation , updateMutation , etc

     //now how to automatically post without clicking the post button 
     const {mutate:addPostMutation } = useMutation({
        mutationFn: addPosts,
      //  onSuccess:(newData)=>{
      //   //     // queryClient.invalidateQueries(["posts"]);
      //   //     //whenever we add a new object , the entire postlist is refetched and updated item is shown , so we want that only the request for newly updated must be made i.e only post request will be made and not get request, so we use this setQueriesData
      //   //     //this method is udes to update the cache data- accepts 2 parameter : querykey & function 
        
         
      //       queryClient.setQueriesData(["posts"],(oldQueryData)=>{
      //          return { ...oldQueryData,
              
      //           data: [...oldQueryData.data, newData.data] 
      //       }
      //       })
      //   }
        //to optimise the updates(comment out onSuccess ) : i.e to update the state before mutation occurs
         //there are 3 steps : we need 3 call backs :
         //this onMutate is called before the mutation call back is fired and it recieves the same objects as the mutation function gets (here addPosts recieves post as a payload )
          onMutate: async(newPost)=>{
            await queryClient.cancelQueries(["posts"]);
            //we need to get the hold of current query data before we make any updates, this helps us roll back if any update fails
            const prevPostData = queryClient.getQueryData(["posts"]);

                       queryClient.setQueriesData(["posts"],(oldQueryData)=>{
                return { ...oldQueryData,
              
                 data: [...oldQueryData.data, {...newPost,id: String(oldQueryData?.data.length+1)}] 
             }
             })
             return {
prevPostData
             }


          },

          //this callback gets 3 callbacks , 1->error object , 2->payload passed to the mutate function , 3-> context object : gives access to the prevPost data that we returned from on mUtate callback
          onError:(_error,_post,context)=>{
            queryClient.setQueryData(["posts"],context.prevPostData);
          },

          //this is triggered when the mutation  is successs or some error, in side this we need to fetch all the posts so server data is in sync with client data
          onSettled:()=>{
              queryClient.invalidateQueries(["posts"]);
          }

     })



    console.log({isLoading,isFetching});
    
    const [formdata,setformdata]=useState({
        title:'',
        body:''
    })


    if (isLoading)
        return <div>Loading .....</div>
    if(isError)
        return <div>{error.message}</div>
    console.log('heyy',data);
    
    const handleChange=(e)=>{
        
        setformdata({
            ...formdata,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        const post = {title:formdata.title,body:formdata.body};
        addPostMutation(post);
        console.log(formdata.title,formdata.body);
        setformdata({title:"",body:""});

    }

  return (
    <div className='container'>
        <form onSubmit={handleSubmit}>
            
            <input name='title'  value={formdata.title} placeholder='Enter a title' onChange={handleChange}/>
            <input name='body' value={formdata.body} placeholder='Enter body text' onChange={handleChange}/>
            <button type='submit'>Post</button>
        </form>
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