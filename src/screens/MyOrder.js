import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MyOrder() {
    const [orderData, setOrderData] = useState("");
    const fetchMyData = async () => {
        let userEmail = localStorage.getItem('userEmail');
        const myData = await fetch('http://localhost:5000/api/myorderData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userEmail
            })
        }).then(async (res) => {
            let response = await res.json();
            await setOrderData(response);
            console.log(response);
        })

    }

    useEffect(() => {
        fetchMyData();
    }, []);
    return (
        <>
            <div>
                <Navbar />
            </div>
            <div className='container'>
                <div className='row'>
                    {
                        orderData.orderData ?
                            orderData.orderData.map((data) => {
                                return (
                                    data ?
                                        data.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    {item.Order_date ? <div className='m-auto mt-5'>
                                                        {data = item.Order_date}
                                                        <hr />
                                                    </div> :
                                                    <div className='col-12 col-md-6 col-lg-3' >
                                                        <div key={item.id} className="card mt-3" style={{ "width": "18rem", "maxHeight": "380px" }}>
                                                            <img src={item.img} className="card-img-top" alt="..." style={{ height: "180px", objectFit: "fill" }} />
                                                            <div className="card-body">
                                                                <h5 className="card-title">{item.name}</h5>
                                                                <div className='container w-100'>
                                                                    <span className='m-1'>{item.qty}</span>
                                                                    <span className='m-1'>{item.size}</span>
                                                                    <span className='m-1'>{data}</span>
                                                                    <div className='d-inline h-100 fs-5 m-2'>
                                                                        ₹{item.price}/-
                                                                    </div>
                                                                </div>
                                                                <hr></hr>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    }
                                                </div>
                                            );
                                        }) : ""
                                );
                            })
                            :
                            ""
                    }
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </>
    )
}
