import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { useState } from 'react'


//paginate
//each page will display certain number of items 
//json
const fetchFruits = (pageId)=>{
   // return axios.get(`http://localhost:3000/fruits/?_limit=4&_page=${pageId}`);
   return axios.get(`http://localhost:3000/fruits/?_limit=4&_page=${pageId}`);
}
const PaginatedQueries = () => {


 const [page,setPage] = useState(1);


   
    const {data ,isLoading , isError , error }= useQuery({
        queryKey : ["fruits",page],
        queryFn: ()=>fetchFruits(page),
        keepPreviousData: true


    })

    
    if (isLoading)
        return <div>Loading .....</div>
    if(isError)
        return <div>{error.message}</div>
  


  return (
    <div className='container'>

        {
            data?.data.map((fruit)=>(
                <div className='fruit-label' key={fruit.id}>
                        {fruit.name}
                </div>
               
            ))
            
        }
         <button className='' onClick={()=>setPage(prev=>prev-1)} disabled = {page===0?true : false}>Previous page</button>
         <button className='' onClick={()=>setPage(prev=>prev+1)} disabled = {page===5 ? true : false}>Next page</button>
      
    </div>
  )
}

export default PaginatedQueries
