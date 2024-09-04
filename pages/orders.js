import Layout from "@/components/layout";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

export default function OrdersPage(){
    const [orders,setOrders]=useState([]);
    useEffect(()=>{
        axios.get('/api/orders').then(response=>{
            setOrders(response.data);
        });
    },[]);
    return(
        <Layout>
            <h1>Orders</h1>
            <div className="mt-4">
                {orders.length > 0 && orders.map(order => (
                    <div key={order._id} className="bg-white p-4 rounded-lg shadow mb-4 flex items-start justify-between">
                        <div className="w-1/3">
                            <h3 className="font-bold">Date</h3>
                            <p>{(new Date(order.createdAt)).toLocaleString()}</p>
                        </div>
                        <div className="w-1/3">
                            <h3 className="font-bold">Recipient</h3>
                            <p>{order.name}</p>
                            <p>{order.email}</p>
                            <p>{order.city}, {order.postalCode}, {order.country}</p>
                            <p>{order.address}</p>
                            <p>{order.phone}</p>
                        </div>
                        <div className="w-1/3">
                            <h3 className="font-bold">Products</h3>
                            {order.line_items.map((l, index) => (
                                <p key={index}>
                                    {l.price_data?.product_data.name} x{l.quantity}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    )
}