import React from 'react'

export default function Card(props) {
    const priceOptions = Object.keys(props.options);
    const handleAddToCart = ()=>{
        
    }

    return (
        <div>
            <div className="card mt-3" style={{ "width": "18rem", "maxHeight": "380px" }}>
                <img src={props.imgSrc} className="card-img-top" alt="..." style={{height:"180px",objectFit:"fill"}}/>
                <div className="card-body">
                    <h5 className="card-title">{props.foodName}</h5>
                    <div className='container w-100'>
                        <select className='m-2 h-100 bg-success'>
                            {Array.from(Array(6), (e, i) => {
                                return (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                )
                            })}
                        </select>
                        <select className='m-2 h-100 bg-success'>
                            {
                                priceOptions.map(priceOption => {
                                    return (<option key={priceOption} value={priceOption}>{priceOption}</option>)
                                })
                            }
                        </select>
                        <div className='d-inline h-100 fs-5'>
                            Total Price
                        </div>
                    </div>
                    <hr></hr>
                    <button className='btn btn-success justify-content-center ms-2' onClick={handleAddToCart}>Add to Cart</button>
                </div>
            </div>
        </div>
    )
}
