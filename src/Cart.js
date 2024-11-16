import React, { useState, useEffect } from 'react';
import { Button, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import './styles/Cart.css';
import NavBar from './NavBar'; 
import { loadStripe } from '@stripe/stripe-js'; 
import url from './url'
import axios from 'axios';

const stripePromise = loadStripe('xxxxxx'); 




const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = () => {
    const cartData = JSON.parse(sessionStorage.getItem('cart')) || [];

    const aggregatedCart = cartData.reduce((acc, product) => {
      const found = acc.find(item => item.productName === product.productName);
      if (found) {
        found.quantity += 1;
      } else {
        acc.push({ ...product, quantity: 1 });
      }
      return acc;
    }, []);

    setCartItems(aggregatedCart);

    const total = aggregatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const handleRemoveItem = (productName) => {
    const updatedCart = cartItems.map(item => {
      if (item.productName === productName) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }).filter(item => item.quantity > 0);

    setCartItems(updatedCart);
    updateSessionStorage(updatedCart);

    const newTotal = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(newTotal);
  };

  const updateSessionStorage = (updatedCart) => {
    const flatCart = [];
    updatedCart.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        flatCart.push(item);  
      }
    });
    sessionStorage.setItem('cart', JSON.stringify(flatCart));
  };

  
  const handleCheckout = async () => {
     console.log("cart items", cartItems)
    try {
     
      const response = await axios.post(`${url.url}/create-checkout-session`,{ cartItems:cartItems, currentUser: sessionStorage.getItem("username")});
      
    
      const { id } = response.data;
      const stripe = await stripePromise;
      setCartItems([]); 
      sessionStorage.removeItem("cart"); 
      
      const { error } = await stripe.redirectToCheckout({
        sessionId: id,
      });
     
    } catch (error) {
      console.error('Error during checkout:', error.message);
    }
  };

  return (
    <div className="cart-container">
      <Typography variant="h4" className="cart-title">Shopping Cart</Typography>

      
      {cartItems.length === 0 ? (
        <Typography variant="h6" className="no-items-message">No items in cart yet</Typography>
      ) : (
        <>
          
          <div className="cart-items-container">
            <Grid container spacing={2}>
              {cartItems.map((item, index) => (
                <Grid item xs={12} key={index}>
                  <Card className="cart-item-card">
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.photos[0]}
                      alt={item.productName}
                    />
                    <CardContent>
                      <Typography variant="h6">{item.productName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                      <Typography variant="h6">Price: ${item.price}</Typography>
                      <Typography variant="body1">Quantity: {item.quantity}</Typography>
                      {/* Remove button */}
                      <Button 
                        variant="outlined" 
                        color="secondary" 
                        onClick={() => handleRemoveItem(item.productName)}
                        className="remove-button"
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>

        
          <div className="cart-summary">
            <Typography variant="h5">Total Price: ${totalPrice.toFixed(2)}</Typography>
            <Button variant="contained" color="primary" onClick={handleCheckout} className="checkout-button">
              Checkout
            </Button>
          </div>
        </>
      )}
      <NavBar />
    </div>
  );
};

export default Cart;
