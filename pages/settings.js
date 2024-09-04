import Layout from "@/components/layout";
import Spinner from "@/components/spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

export default function SettingsPage(){
    const [products,setProducts]=useState('');
    const[productsLoading,setProductsLoading]=useState(false);
    const [featuredLoading,setFetauredLoading]=useState(false)
    const[featuredProductId,setFeaturedProductId]=useState(null);
    useEffect(()=>{
        setProductsLoading(true);
        axios.get('/api/products').then(res=>{
            setProducts(res.data);
            setProductsLoading(false);
        })
        setFetauredLoading(true);
        axios.get('/api/settings?name=featuredProductId').then(res=>{
            setFeaturedProductId(res.data.value);
            setFetauredLoading(false);
        })
    
    },[])

    async function saveSettings(){
        await axios.put('/api/settings',{
            name: 'featuredProductId',
            value:featuredProductId,
        })
    }
        
    return(
        <Layout>
            <h1>Settings</h1>
            {(productsLoading || featuredLoading) &&(
                <Spinner></Spinner>
            )}
            {(!productsLoading || !featuredLoading) &&(
                <>
                    <label className="text-l">Featured product</label>
                    <select 
                        value={featuredProductId} 
                        onChange={ev => setFeaturedProductId(ev.target.value)} 
                        className="text-l p-2" 
                    >
                        {products.length > 0 && products.map(product => (
                            <option key={product._id} value={product._id}>{product.title}</option>
                        ))}
                    </select>
                    <div>
                        <button onClick={()=>{
                            saveSettings();
                            Swal.fire({ 
                                title: 'Success!',
                                text: 'New featured product set!',
                                icon: 'success',
                                confirmButtonText: 'OK',
                                confirmButtonColor: 'black',
                            });
                        
                        }} className="btn-primary">Save</button>
                    </div>
                </>
            )}
        </Layout>
    )
}