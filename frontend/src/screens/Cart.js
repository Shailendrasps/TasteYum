import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCart, useDispatchCart } from '../components/ContextReducer'

// Dynamically loads the Razorpay checkout script
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
            return resolve(true); // already loaded
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload  = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function Cart() {
    let data = useCart();
    let dispatch = useDispatchCart();
    const [loading, setLoading] = useState(false);
    const [payError, setPayError] = useState('');
    const navigate = useNavigate();

    const placeOrder = async (paymentId) => {
        const userEmail = localStorage.getItem('userEmail');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orderData`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                order_data: data,
                email: userEmail,
                Order_date: new Date().toDateString(),
                paymentId,
            })
        });
        const json = await res.json();
        if (json.success) {
            localStorage.setItem('latestOrderId', json.orderId);
            dispatch({ type: 'DROP' });
            navigate('/myOrder');
        }
    };

    const handlePayment = async () => {
        setPayError('');
        setLoading(true);
        try {
            // 1. Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                setPayError('Failed to load payment gateway. Check your internet connection.');
                setLoading(false);
                return;
            }

            // 2. Create order on backend
            const orderRes = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalPrice })
            });
            const orderData = await orderRes.json();
            if (!orderData.success) {
                setPayError('Could not initiate payment. Try again.');
                setLoading(false);
                return;
            }

            // 3. Open Razorpay checkout modal
            const options = {
                key:         process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount:      orderData.order.amount,
                currency:    'INR',
                name:        'TasteYum',
                description: 'Food Order Payment',
                order_id:    orderData.order.id,
                prefill: {
                    email: localStorage.getItem('userEmail') || '',
                },
                theme: { color: '#198754' },

                handler: async (response) => {
                    // 4. Verify payment signature on backend
                    const verifyRes = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/verify`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id:   response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature:  response.razorpay_signature,
                        })
                    });
                    const verifyData = await verifyRes.json();

                    if (verifyData.success) {
                        // 5. Verified — save order and start tracking
                        await placeOrder(verifyData.paymentId);
                    } else {
                        setPayError('Payment verification failed. Please contact support.');
                    }
                },

                modal: {
                    ondismiss: () => setLoading(false)
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', (response) => {
                setPayError(`Payment failed: ${response.error.description}`);
                setLoading(false);
            });
            rzp.open();

        } catch (e) {
            console.error('Payment error:', e);
            setPayError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    if (data.length === 0) {
        return (
            <div className='m-5 w-100 text-center fs-3'>The Cart is Empty!</div>
        );
    }

    let totalPrice = data.reduce((total, food) => total + food.price, 0);

    return (
        <div>
            <div className='container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md'>
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
                        {data.map((food, index) => (
                            <tr key={index}>
                                <th scope='row'>{index + 1}</th>
                                <td>{food.name}</td>
                                <td>{food.qty}</td>
                                <td>{food.size}</td>
                                <td>₹{food.price}</td>
                                <td>
                                    <button type='button' className='btn p-0'>
                                        <svg onClick={() => dispatch({ type: 'REMOVE', index })}
                                            xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 24 24' width='24'>
                                            <path d='M0 0h24v24H0z' fill='none' />
                                            <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h1 className='fs-2 text-light'>Total: ₹{totalPrice}/-</h1>

                {payError && (
                    <div className='mt-3 p-3' style={{ background: 'rgba(220,53,69,0.15)', border: '1px solid rgba(220,53,69,0.3)', color: '#ff6b7a', borderRadius: 8 }}>
                        {payError}
                    </div>
                )}

                <button className='btn bg-success mt-4 px-4 text-white' onClick={handlePayment} disabled={loading}>
                    {loading
                        ? <><span className='spinner-border spinner-border-sm me-2'></span>Processing...</>
                        : <>Pay ₹{totalPrice} &nbsp;🔒</>
                    }
                </button>
            </div>
        </div>
    );
}
