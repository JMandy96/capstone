import Nav from "./Components/Nav/Nav"
import Home from "./Components/views/Home"
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Register from "./Components/views/Register"
import Login from "./Components/views/Login"
import Products from "./Components/views/Products"
import { UserProvider } from "./Components/UserContext";
import ForgotPassword from "./Components/views/ForgotPassword"
import { CartProvider } from "./Components/views/Cart"
import CartView from "./Components/views/Cartview"
import OrderComplete from "./Components/views/OrderComplete"
import Checkout from "./Components/views/Checkout"
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from "@stripe/react-stripe-js"
import { useEffect, useState } from "react";
import AdminPage from "./Components/views/AdminPage"


const stripePromise = loadStripe("pk_test_51NwWhQHmtOnVZs17pvjj4jjM6d0I2KXfdjbyxBUbVolb1c1RxJ5jpgUeJkqU5meRCL8XPAhSBvR3irRMOAXg9d3U00WlFzSeJl");


function App() {
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState('')
  const [error, setError] = useState<string | null>(null);

  console.log('Client Secret:', clientSecret);
  console.log('Loading State:', loading);

  useEffect(() => {
    console.log('Fetching client secret...');

    const createPayment = async () => {
    
    try {
        const response = await fetch('https://rlvtg.onrender.com/api/createPayment', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
            items: [
              { id: 'xl-tshirt', productPrice: 1000, quantity: 1 }, 
              { id: 'another item', productPrice: 500, quantity: 1 }, 
            ],
          }),
        });
        console.log('Server Response:', response);

        if (response.ok) {
          const responseData = await response.json();
          console.log('Server Response Data:', responseData);
        
  
          const clientSecret = responseData.clientSecret;
          console.log('Client Secret:', clientSecret);
        } else {
          console.error('Request failed with status:', response.status);
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
        setLoading(false); 

        console.log('Client Secret:', data.clientSecret);
        console.log('Updated Loading State:', loading);

    } catch (error) {
      console.error("Error fetching client secret:", error);
      setError('Error fetching client secret. Please try again.');
      setLoading(false);
    }
    if (error) {
      return <div>{error}</div>; 
    }
}

    createPayment();

    console.log('Updated Client Secret:', clientSecret);
    console.log('Updated Loading State:', loading);
  }, []);




  return (
    <>
    <UserProvider>
      <CartProvider>
        <BrowserRouter>
          <div>
            <Nav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/cart" element={<CartView />} />
              <Route path="/checkout" element={<Elements stripe={stripePromise}><Checkout /></Elements>} />
              <Route path="/admin-page" element={<AdminPage />} /> 

              <Route path="/order-complete" element={<OrderComplete />} />
            </Routes>
          </div>
        </BrowserRouter>
      </CartProvider>
    </UserProvider>

    </>
  )
}

export default App
