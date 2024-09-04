import axios from "axios"
import { subHours } from "date-fns"
import { useEffect, useState } from "react"

export default function Stats(){
    const [orders,setOrders]=useState([])
    useEffect(()=>{
        axios.get('/api/orders').then(res=>{
            setOrders(res.data)
        })
    },[])
    function ordersTotal(orders){
        let sum= 0;
        orders.forEach(order=>{
            const{line_items}=order;
            line_items.forEach(li=>{
                const lineSum=li.quantity*li.price_data.unit_amount / 100;
                sum+=lineSum;
            });
        });
        return new Intl.NumberFormat('hr-HR').format(sum);
    }
    const ordersToday=orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24))
    const ordersWeek=orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24*7))
    const ordersMonth=orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24*30))
    return(
        <div className="">
            <h2 className="my-10 text-center font-bold text-4xl ">Orders</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-black shadow-xl p-2 text-center ">
                    <h3 className="uppercase text-gray-500 font-bold " >Today</h3>
                    <div className="text-3xl font-bold my-2">{ordersToday.length}</div>
                    <div className="text-center text-xs text-gray-500">{ordersToday.length} orders today</div>
                </div>
                <div className="border border-black shadow-xl p-2 text-center">
                    <h3 className="uppercase text-gray-500 font-bold ">This week</h3>
                    <div className="text-3xl font-bold  my-2">{ordersWeek.length}</div>
                    <div className="text-center text-xs text-gray-500">{ordersWeek.length} orders this week</div>
                </div>
                <div className="border border-black shadow-xl p-2 text-center">
                    <h3 className="uppercase text-gray-500 font-bold ">This month</h3>
                    <div className="text-3xl font-bold my-2">{ordersMonth.length}</div>
                    <div className="text-center text-xs text-gray-500">{ordersMonth.length} orders this month</div>
                </div>
            </div>
            <h2 className="my-10 text-center font-bold text-4xl">Revenue</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-black shadow-xl p-2 text-center ">
                    <h3 className="uppercase text-gray-500 font-bold " >Today</h3>
                    <div className="text-3xl font-bold my-2">{ordersTotal(ordersToday)} €</div>
                    <div className="text-center text-xs text-gray-500">{ordersToday.length} orders today</div>
                </div>
                <div className="border border-black shadow-xl p-2 text-center">
                    <h3 className="uppercase text-gray-500 font-bold ">This week</h3>
                    <div className="text-3xl font-bold  my-2">{ordersTotal(ordersWeek)} €</div>
                    <div className="text-center text-xs text-gray-500">{ordersWeek.length} orders this week</div>
                </div>
                <div className="border border-black shadow-xl p-2 text-center">
                    <h3 className="uppercase text-gray-500 font-bold ">This month</h3>
                    <div className="text-3xl font-bold my-2">{ordersTotal(ordersMonth)} €</div>
                    <div className="text-center text-xs text-gray-500">{ordersMonth.length} orders this month</div>
                </div>
            </div>
        </div>
    )
}