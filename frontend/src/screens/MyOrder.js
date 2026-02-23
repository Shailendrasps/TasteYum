import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const STAGES = ['Order Placed', 'Preparing', 'Out for Delivery', 'Delivered'];

const STAGE_ICONS = {
    'Order Placed':     '🧾',
    'Preparing':        '🍳',
    'Out for Delivery': '🚗',
    'Delivered':        '✅',
};

function StatusStepper({ status }) {
    const currentIndex = STAGES.indexOf(status);
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', margin: '1.5rem 0' }}>
            {STAGES.map((stage, i) => {
                const done   = i <= currentIndex;
                const active = i === currentIndex;
                return (
                    <React.Fragment key={stage}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 90 }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: '50%',
                                background: done ? '#198754' : '#e9ecef',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 20,
                                boxShadow: active ? '0 0 0 4px rgba(25,135,84,0.25)' : 'none',
                                transition: 'all 0.4s ease'
                            }}>
                                {STAGE_ICONS[stage]}
                            </div>
                            <span style={{
                                fontSize: '0.7rem', marginTop: 6, textAlign: 'center',
                                color: done ? '#198754' : '#aaa',
                                fontWeight: active ? 700 : 400
                            }}>{stage}</span>
                        </div>
                        {i < STAGES.length - 1 && (
                            <div style={{
                                flex: 1, height: 3, minWidth: 24,
                                background: i < currentIndex ? '#198754' : '#e9ecef',
                                transition: 'background 0.4s ease',
                                marginBottom: 22
                            }} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default function MyOrder() {
    const [orderData, setOrderData] = useState([]);
    const [statusMap, setStatusMap] = useState({});
    const [latestId]                = useState(localStorage.getItem('latestOrderId'));

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) return;

        // Fetch order history with statuses
        const fetchMyData = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/myorderData`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: userEmail })
                });
                const json = await res.json();
                setOrderData(json.orderData || []);
                setStatusMap(json.statusMap || {});
            } catch (e) {
                console.error('Failed to fetch orders:', e);
            }
        };
        fetchMyData();

        // Connect to Socket.io and join the user's room
        const socket = io(process.env.REACT_APP_API_URL);
        socket.emit('join', userEmail);

        socket.on('orderStatusUpdate', ({ orderId, status }) => {
            setStatusMap(prev => ({ ...prev, [orderId]: status }));
        });

        return () => socket.disconnect();
    }, []);

    return (
        <>
            <Navbar />
            <div className='container py-4'>

                {/* Live tracking card for the most recent order */}
                {latestId && statusMap[latestId] && (
                    <div className='card mb-5 border-0 shadow-sm' style={{ borderRadius: 16, overflow: 'hidden' }}>
                        <div style={{ background: '#198754', padding: '1rem 1.5rem' }}>
                            <h5 className='text-white mb-0'>Live Order Tracking</h5>
                            <small className='text-white-50'>Order #{latestId}</small>
                        </div>
                        <div className='card-body px-4'>
                            <StatusStepper status={statusMap[latestId]} />
                            {statusMap[latestId] !== 'Delivered' ? (
                                <p className='text-center text-muted' style={{ fontSize: '0.85rem' }}>
                                    Updates are live — no need to refresh
                                </p>
                            ) : (
                                <p className='text-center fw-semibold' style={{ color: '#198754' }}>
                                    Your order has been delivered! Enjoy your meal 🎉
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Order history */}
                <h5 className='mb-4' style={{ color: '#fff' }}>Order History</h5>

                {orderData.length === 0 ? (
                    <div className='text-center text-muted py-5'>No orders yet.</div>
                ) : (
                    orderData.map((order, oi) => {
                        const meta   = order[0] || {};
                        const items  = order.slice(1);
                        const oid    = meta.orderId;
                        const status = oid ? (statusMap[oid] || 'Delivered') : null;

                        return (
                            <div key={oi} className='card mb-4 border-0 shadow-sm'
                                style={{ borderRadius: 12, background: '#1e1e1e' }}>
                                <div className='card-header d-flex justify-content-between align-items-center'
                                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '12px 12px 0 0' }}>
                                    <span style={{ color: '#aaa', fontSize: '0.85rem' }}>📅 {meta.Order_date}</span>
                                    {status && (
                                        <span style={{
                                            background: status === 'Delivered' ? 'rgba(25,135,84,0.15)' : 'rgba(255,193,7,0.15)',
                                            color:      status === 'Delivered' ? '#20c997' : '#ffc107',
                                            padding: '2px 10px', borderRadius: 20,
                                            fontSize: '0.78rem', fontWeight: 600
                                        }}>
                                            {STAGE_ICONS[status]} {status}
                                        </span>
                                    )}
                                </div>
                                <div className='card-body'>
                                    <div className='row g-3'>
                                        {items.map((item, ii) => (
                                            <div key={ii} className='col-6 col-md-4 col-lg-3'>
                                                <div className='card h-100 border-0'
                                                    style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10 }}>
                                                    <img src={item.img} className='card-img-top' alt={item.name}
                                                        style={{ height: 120, objectFit: 'cover', borderRadius: '10px 10px 0 0' }} />
                                                    <div className='card-body p-2'>
                                                        <p className='mb-1 fw-semibold text-white' style={{ fontSize: '0.85rem' }}>{item.name}</p>
                                                        <p className='mb-0 text-muted' style={{ fontSize: '0.78rem' }}>
                                                            Qty: {item.qty} · {item.size}
                                                        </p>
                                                        <p className='mb-0 text-success fw-bold' style={{ fontSize: '0.85rem' }}>₹{item.price}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            <Footer />
        </>
    );
}
