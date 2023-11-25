import React, { useState } from 'react'
import { Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'
import Cart from '../screens/Cart';
import Modal from '../Modal';
import { useCart } from './ContextReducer';

export default function Navbar() {
  const navigate = useNavigate();
  const [cartView,setCartView] = useState(false);
  let data = useCart();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate('/login');
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-success">
        <div className="container-fluid">
          <Link className="navbar-brand fs-1 fst-italic" to="/">TasteYum</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active fs-5" aria-current="page" to="/">Home</Link>
              </li>
              {localStorage.getItem("authToken")?
              <li className="nav-item">
                <Link className="nav-link active fs-5" aria-current="page" to="/">My Orders</Link>
              </li>:""
              }
            </ul>
          </div>
          {localStorage.getItem("authToken") ?
            <div className='d-flex'>
              <div className="btn bg-white text-success mx-2" to="/login" onClick={() => {setCartView(true)}}>My Cart{" "}
              <Badge pill bg='danger'>{data.length}</Badge>
              </div>
              {cartView ? <Modal onClose={() => {setCartView(false)}}><Cart/></Modal>:null}
              <div className="btn bg-white text-danger mx-2" to="/createuser" onClick={handleLogout}>Logout</div>
            </div>
            : <div>
              <Link className="btn bg-white text-success mx-2" to="/login">Login</Link>
              <Link className="btn bg-white text-success mx-2" to="/createuser">Signup</Link>
            </div>
          }
        </div>
      </nav>
    </div>
  )
}
