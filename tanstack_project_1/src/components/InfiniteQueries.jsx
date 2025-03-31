import React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'


// for infinte scroll / query 
//step 1 = use useInfiniteQuery hook
//step 2 = the infi..hook includes a query function that recieves an object and inside that object we get pagePara, property = page number (1st page or 2ns or 3rd)
//step 3 == whenever the component mounts on the dom ,the first page that needs to be fetcghed that must start from initialPageParam (1 here)

//step 4 : getNextPageParam(main function is to get the next page number & if it doesnt exists , it returns undefined) : takes in 2 arg = lastPage (contains entire API response of the last ,most recent data fetch) , allPages (array of objects that contains API responses of all the data fetches)

const fetchFruits = ({pageParam}) =>{
        return axios.get(`http://localhost:3000/fruits/?_limit=4&_page=${pageParam}`)
}
const InfiniteQueries = () => {

    const {data,isLoading , error ,isError,fetchNextPage,hasNextPage} = useInfiniteQuery({
        queryKey:["fruits"],
        queryFn : fetchFruits,
        initialPageParam:1,
        getNextPageParam:(_lastPage,allPages)=>{
             //20 items
           //5pages
            if(allPages.length<5)
                return allPages.length+1;
            else
            return undefined
        }
       

    })
    console.log(data,"data");

    
    if (isLoading)
        return <div>Loading .....</div>
    if(isError)
        return <div>{error.message}</div>
    console.log('heyy',data);

    
  return (


    <div className='container'>
        {
            data?.pages?.map((page)=>{
                return page?.data.map(fruit=>(
                    <div className='fruit-item' key={fruit.id}>
                            {fruit.name}
                    </div>
                ))
            })
        }
        <button className='' disabled={!hasNextPage} onClick={fetchNextPage}>Load more..</button>
      
    </div>
  )
}

export default InfiniteQueries
