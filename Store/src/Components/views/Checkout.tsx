import React, { useState, useEffect, FormEvent } from 'react';
import { LayoutObject, loadStripe, Layout} from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement, LinkAuthenticationElement, CardElement } from '@stripe/react-stripe-js';
import './Styles/checkout.css'
// import { useCart } from './Cart'

const stripePromise = loadStripe("pk_test_51NwWhQHmtOnVZs17pvjj4jjM6d0I2KXfdjbyxBUbVolb1c1RxJ5jpgUeJkqU5meRCL8XPAhSBvR3irRMOAXg9d3U00WlFzSeJl");


interface Address {
  userId: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  address_type: string;
}

interface AddressFormProps {
  onSubmit: (address: Address) => void;
  userId: string;
}

interface CheckoutFormProps {
  onPaymentSuccess: (paymentMethod: any) => void; 
  address: Address;
}


const AddressForm: React.FC<AddressFormProps> = ({ onSubmit, userId }) => {
  const [address, setAddress] = useState<Address>({
    userId,
    street: '',
    city: '',
    state: '',
    postal_code: '',
    address_type: 'shipping',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(address);
  };

 
  return (
    
    <form  onSubmit={handleSubmit}>
    <div className='address'>
    <h2>Shipping Address</h2>
    <label>
      Street: 
      <input 
        type="text" 
        name="street" 
        value={address.street} 
        onChange={handleChange}
      />
    </label>
    <label>
      City: 
      <input 
        type="text" 
        name="city" 
        value={address.city} 
        onChange={handleChange}
      />
    </label>
    <label>
      State: 
      <input 
        type="text" 
        name="state" 
        value={address.state} 
        onChange={handleChange}
      />
    </label>
    <label>
      Postal Code: 
      <input 
        type="text" 
        name="postal_code" 
        value={address.postal_code} 
        onChange={handleChange}
      />
    </label>
    <button type="submit">Submit Address</button>
  </div>
  </form>
  
  );
};


const CheckoutForm: React.FC<CheckoutFormProps> = ({ address }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState('null')
  const [isLoading, setIsLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null); 


  useEffect(() => {
    const fetchClientSecret = async () => {
      setIsLoading(true);

      try {
        const response = await fetch('http://localhost:5000/api/createPayment', {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify({
            items: [
              { id: 'xl-tshirt', productPrice: 1000, quantity: 1 },
            ],
          }),
        });
        const data = await response.json();
        setClientSecret(data.clientSecret as string);
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };

    if (address) {  
      fetchClientSecret();
    }
  }, [address]);

useEffect(() => {
  if (!stripe) {
    return;
  }

  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  stripe.retrievePaymentIntent(clientSecret).then((result: any) => {


    if ('paymentIntent' in result) {
      switch ((result as any).paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
          } else if ('error' in result) {
        console.error('Error fetching payment intent:', result.error.message);
    }

    
  });
}, [stripe]);

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!stripe || !elements  || !clientSecret) {
    console.warn('Stripe, elements, or clientSecret is missing. Exiting payment process.');
    setMessage('There was an error processing your payment. Please try again later.');
    return;
  }

  setIsLoading(true);
  try {
    const cardElement = elements.getElement(CardElement);


const { paymentMethod, error } = await stripe.createPaymentMethod({
  type: 'card',
  card: cardElement!,
});

if (error) {
  console.error('Error creating PaymentMethod:', error);
  return;
}

if (!paymentMethod) {
  console.error('No payment method received');
  return;
}

    const result: any = await stripe.confirmPayment({
      elements: elements,
      clientSecret: clientSecret,
      confirmParams: {
        payment_method:  paymentMethod.id,
        return_url: "http://localhost:5173/order-complete",
      },
    });
    
    
    

    
    

  if (result.error) {
    console.error('Payment failed:', result.error.message || result.error);
    setMessage('Payment failed. Please check your card details or try another payment method.');
} else if (result.paymentIntent) {
  switch (result.paymentIntent.status) {
    case 'succeeded':
      setMessage('Payment succeeded! Thank you for your purchase.');

      //order status info, confirmation emails.

      break;

    case 'processing':
      setMessage('Your payment is processing. Please wait for confirmation.');

      // Check payment status link

      break;

    case 'requires_payment_method':
      setMessage('Your payment was not successful. Please update your payment details.');

      // Add a link to update payment details

      break;

    default:
      setMessage('Something went wrong with your payment.');

      //Handle other payment statuses as needed

      break;
  }
}
} catch (error) {
  console.error('Error confirming payment:', error);
  setMessage('Payment failed. Please check your card details or try another payment method.');
}
  setIsLoading(false);
};

  interface IPaymentOptions{
    layout: Layout | LayoutObject
  }
  const paymentElementOptions: IPaymentOptions = {
    layout: "tabs"
  }

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <LinkAuthenticationElement
          id="link-authentication-element"

        />
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
          </span>
        </button>
        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  );
}

type CheckoutProps = {};

const Checkout: React.FC<CheckoutProps> = ({}) => {

  const userId = 'userID'; 
  
  const [address, setAddress] = useState<Address | null>(null);
  
  const handleAddressSubmit = (submittedAddress: Address) => {
    setAddress(submittedAddress);

  };
  
  const handlePaymentSuccess = async (paymentMethod: any) => {
    console.log('Payment Method:', paymentMethod);
   
  };

  return (
    <div className='checkout'>
      <h1>Checkout</h1>
      {!address ? (
        <AddressForm userId={userId} onSubmit={handleAddressSubmit} />
      ) : (
        <Elements stripe={stripePromise}>
          <CheckoutForm onPaymentSuccess={handlePaymentSuccess} address={address} />
        </Elements>
      )}
    </div>
  );
};

export default Checkout;