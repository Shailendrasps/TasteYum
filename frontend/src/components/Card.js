import React, { useEffect, useRef, useState } from 'react'
import { useCart, useDispatchCart } from './ContextReducer';

export default function Card(props) {
    let dispatch = useDispatchCart();
    const priceRef = useRef();
    let data = useCart();
    let priceOptions = Object.keys(props.options);
    const [qty, setQty] = useState(1);
    const [size, setSize] = useState("");

    const handleAddToCart = async () => {
        let food = []
        for (const item of data) {
            if (item.id === props.foodItem._id) {
                food = item;
                break;
            }
        }
        if (food != []) {
            if ( food.size === size ) {
                await dispatch({ type: "UPDATE", id: props.foodItem._id, qty: qty, price:finalPrice });
            } else if( food.size !== size ){
                await dispatch({ type: "ADD", id: props.foodItem._id, name: props.foodItem.name, qty: qty, price: finalPrice, size: size, img: props.foodItem.img })
            }
        }
        else {
            await dispatch({ type: "ADD", id: props.foodItem._id, name: props.foodItem.name, qty: qty, price: finalPrice, size: size, img: props.foodItem.img })
        }
    }
    let finalPrice = qty * parseInt(props.options[size]);

    useEffect(() => {
        setSize(priceRef.current.value);
    }, [])

    return (
        <div>
            <div className="card mt-3" style={{ "width": "18rem", "maxHeight": "380px" }}>
                <img src={props.foodItem.img} className="card-img-top" alt="..." style={{ height: "180px", objectFit: "fill" }} />
                <div className="card-body">
                    <h5 className="card-title">{props.foodItem.name}</h5>
                    <div className='container w-100'>
                        <select className='m-2 h-100 bg-success' onChange={(e) => setQty(e.target.value)}>
                            {Array.from(Array(6), (e, i) => {
                                return (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                )
                            })}
                        </select>
                        <select className='m-2 h-100 bg-success' ref={priceRef} onChange={(e) => setSize(e.target.value)}>
                            {
                                priceOptions.map(priceOption => {
                                    return (<option key={priceOption} value={priceOption}>{priceOption}</option>)
                                })
                            }
                        </select>
                        <div className='d-inline h-100 fs-5'>
                            ₹{finalPrice}/-
                        </div>
                    </div>
                    <hr></hr>
                    <button className='btn btn-success justify-content-center ms-2' onClick={handleAddToCart}>Add to Cart</button>
                </div>
            </div>
        </div>
    )
}
