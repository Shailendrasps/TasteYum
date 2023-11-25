import React from 'react'
import { useCart, useDispatchCart } from '../components/ContextReducer'

export default function Cart() {
    let data = useCart();
    let dispatch = useDispatchCart();
    const handleCheckout = async() => {
        let userEmail = localStorage.getItem("userEmail");
        let response = await fetch('http://localhost:5000/api/orderData',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({
                order_data: data,
                email: userEmail,
                Order_date: new Date().toDateString()
            })
        })
        console.log(response);
        if(response.status === 200){
            dispatch({type:'DROP'});
        }
    }
    if(data.length === 0){
        return(
            <div>
            <div className='m-5 w-100 text-center fs-3'>The Cart is Empty!</div>
            </div>
        );
    }
    let totalPrice = data.reduce((total, food) => total + food.price, 0)
  return (
    <div>
        <div className='container m-auto mt-5 table-responsive  table-responsive-sm table-responsive-md'>
            <table className='table'>
                <thead className='text-success fs-4'>
                <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>Name</th>
                    <th scope='col'>Quantity</th>
                    <th scope='col'>Option</th>
                    <th scope='col'>Amount</th>
                    <th scope='col'></th>
                </tr>
                </thead>
                <tbody className='text-light fs-5'>
                    
                    {data.map((food,index) => {
                     return(<tr>
                              <th scope='row'>{index+1}</th>
                              <td>{food.name}</td>
                              <td>{food.qty}</td>
                              <td>{food.size}</td>
                              <td>{food.price}</td>
                              <td><button type="button" className="btn p-0"><svg  onClick={() => { dispatch({ type: "REMOVE", index: index }) }} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button> </td>
                            </tr>)
                    })}
                </tbody>
            </table>
            <div><h1 style={{color:'white'}} className='fs-2 text-light'>Total Price: {totalPrice}/-</h1></div>
            <div><button className='btn bg-success mt-5' onClick={handleCheckout}>Check Out</button></div>
        </div>
    </div>
  )
}
