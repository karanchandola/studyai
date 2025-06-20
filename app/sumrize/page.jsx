'use client'
import React, { useState } from 'react'
import { ArrowUpIcon } from "lucide-react";
import { Button } from '@/components/ui/button';
const sumrize = () => {
    const [isres, setisres] = useState(false);
    const[response, setresponse] = useState(null);

    const res = (e)=> {
        e.preventDefault();
      setisres(!isres);
      setresponse("message is from server")
      console.log(response);
    }
    

  return (
    <div>
      <div>summarize : </div>
      <div>
        <form onSubmit={res}>
            <label htmlFor="txt">Enter text u want to sumarize : </label>
            <input type="text" name="txt" id="txt" />
            <div><Button variant="destructive" ><ArrowUpIcon/></Button></div>    
        </form>
        
      </div>
      <div>
        summarize (response) : 
        {
            isres? response:" I don't get it....."
        } 
      </div>
    </div>
  )
}

export default sumrize

