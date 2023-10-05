import React from 'react';
import { useCart } from './Cart';
import { Link } from 'react-router-dom'; 

import "./Styles/cart.css"

const CartView: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();


  return (
<>
<div className="view">
{cart.length === 0 ? (
  <p>Your cart is empty. <Link className="nav-link custom-button" to='/products'> start Shopping</Link></p>
) : (
  <table className='cart-table'>
    <thead>
      <tr>
        <th>Item Name</th>
        <th>Price</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {cart.map((item) => (
        <tr key={item.product.id}>
          <td>{item.product.name}</td>
          <td>${item.product.price}</td>
          <td>
            <button onClick={() => removeFromCart(item.product.id)} className='remove-button'>
              Remove from cart
            </button>
          </td>
        </tr>
      ))}
      <tr className='total-row'>
        <td>Total</td>
        <td>${cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)}</td>
        <td>
          <button onClick={clearCart} className="clear-cart-button">Clear Cart</button>
        </td>
      </tr>
    </tbody>
  </table>
)}
  <div className="checkout-container">
    <Link to="/checkout" className="checkout-button">
      Checkout
    </Link>
  </div>

</div>

</>
  );
};

export default CartView;