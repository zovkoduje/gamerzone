import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

export default function DeleteProductPage(){
    const router=useRouter();
    const[productInfo,setProductInfo]=useState();
    const{id}=router.query;
    useEffect(()=> {
        if(!id){
            return;
        }
        axios.get('/api/products?id='+id).then(response =>{
            setProductInfo(response.data);
        })
    }, [id]);
    function goBack(){
        router.push('/products');
    }
    async function deleteProduct(){
        await axios.delete('/api/products?id='+id);
        goBack();
    }

    return(
        <Layout>
            <h1 className="text-center">Do you really want to delete &nbsp;{productInfo?.title}?</h1>
            <div className="flex gap-2 justify-center">
                <button className='btn-primary flex' onClick={deleteProduct}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Yes</button>
                <button className='btn-primary flex' onClick={goBack}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                No</button>
            </div>
            </Layout>
    )
}