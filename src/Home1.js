import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Grid, Card, CardContent, CardMedia, Typography, Modal, Box, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import url from './url'
import NavBar from './NavBar'; 
import { useNavigate  } from 'react-router-dom';
import PopUp from './PopUp'; 





const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [openModal, setOpenModal] = useState(false); 
  const navigate = useNavigate();  
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [thumbsUpSelected, setThumbsUpSelected] = useState(false);
  const [thumbsDownSelected, setThumbsDownSelected] = useState(false);






  const handleThumbsUpClick = async () => {

  
    const username = sessionStorage.getItem('username'); 
    const prodName= selectedProduct.uploadedBy+ "_" +selectedProduct.productName
    const productId = prodName; 
    const whoUploaded = selectedProduct.uploadedBy
    try {
      await axios.post(`${url.url}/like-product`, { username, productId,whoUploaded  });
      showPopupMessage('Product liked successfully!');
    } catch (error) {
      console.error('Error liking product:', error);
      showPopupMessage('Failed to like product.');
    }
  };
  
  const handleThumbsDownClick = async () => {

    const username = sessionStorage.getItem('username'); 
    const prodName= selectedProduct.uploadedBy+ "_" +selectedProduct.productName
    const productId = prodName; 
    const whoUploaded = selectedProduct.uploadedBy

    
    try {
      await axios.post(`${url.url}/dislike-product`, { username, productId ,whoUploaded});
      showPopupMessage('Product disliked successfully!');
    } catch (error) {
      console.error('Error disliking product:', error);
      showPopupMessage('Failed to dislike product.');
    }
  };
  

    useEffect(() => {
      const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
      sessionStorage.setItem('cart', JSON.stringify(cart));
    }, []);


  useEffect(() => {
    axios.get(`${url.url}/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setOpenModal(false);
  };

  const cartNav= () =>{
    navigate('/cart')
  }
  const handleAddToCart = (product) => {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || []; 
   // console.log("quantity", product.quantity)
   const productCount = cart.filter(item => item.id === product.id).length;
   console.log("product clicked", product.id)
console.log("in cart", productCount, cart.filter(item => item.productId === product.productId))
console.log("prod quan", product.quantity)
   if (productCount >= product.quantity ) {
       showPopupMessage(`You cannot buy anymore of ${product.productName}, none in stock.`);
       return; 
   }

    cart.push(product); 
    sessionStorage.setItem('cart', JSON.stringify(cart)); 
    console.log('Product added to cart:', product);
    showPopupMessage(`${product.productName} added to cart successfully!`);

    //made a change
  };


  const handleMessageSeller = () => {
    const username = sessionStorage.getItem('username');
    const seller = selectedProduct.uploadedBy;
    const chatId1 = `${username}_${seller}`;
    const chatId2 = `${seller}_${username}`;
  
    sessionStorage.setItem('chatId1', chatId1);
    sessionStorage.setItem('chatId2', chatId2);
    sessionStorage.setItem('user2', seller);
  
    navigate('/dm');
  };




  const showPopupMessage = (message) => {
    console.log("popup clicked");
    setPopupMessage(message);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div style={{ padding: '20px', width: '1000px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Use the reusable PopUp component */}
      <PopUp
        message={popupMessage} // Pass the message to display
        showPopup={showPopup}   // Control whether the popup is visible
        closePopup={closePopup} // Function to close the popup
      />

    {/* Search bar */}
    <TextField
      label="Search Products"
      variant="outlined"
      fullWidth
      margin="normal"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ width: '100%' }}
    />

    {/* Go to Cart Button */}
    <Button
      variant="contained"
      color="primary"
      onClick={() => cartNav()}
      style={{ marginBottom: '20px', width: '100%' }}
    >
      Go to Cart
    </Button>

   




    {/* Scroll view for products */}
    {/*min and max height adjust the grid size */}
    <div style={{ minHeight: '400px', maxHeight: '400px', overflowY: 'auto', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minWidth: '300px' }}>
      <Grid container spacing={2}>
        {filteredProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card onClick={() => handleOpenModal(product)} style={{ cursor: 'pointer' }}>
              <CardMedia
                component="img"
                height="140"
                image={product.photos[0]}
                alt={product.productName}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {product.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" component="div">
                  ${product.price}
                </Typography>
                <Typography variant="h6" component="div">
                  Quantity: {product.quantity}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  {/* Modal for product details */}
  <Modal open={openModal} onClose={handleCloseModal}>
  <Box sx={modalStyle}>
    {selectedProduct && (
      <>
        <Typography variant="h4" component="h2">
          {selectedProduct.productName}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {selectedProduct.description}
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Price: ${selectedProduct.price}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Uploaded by: {selectedProduct.uploadedBy}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Quantity: {selectedProduct.quantity}
        </Typography>
        {/* Display all photos in the modal */}
        <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll', marginTop: '10px' }}>
          {selectedProduct.photos.map((photo, index) => (
            <img key={index} src={photo} alt={`Product ${index}`} style={{ width: '100px', marginRight: '10px' }} />
          ))}
        </div>
        {/* Thumbs Up and Thumbs Down Buttons */}
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={handleThumbsUpClick}
            color={thumbsUpSelected ? 'primary' : 'default'}
            style={{ padding: '0' , width: '50px'}} // Optional: reduce padding around the icon

          >
            <ThumbUpIcon />
          </IconButton>
          <IconButton
            onClick={handleThumbsDownClick}
            color={thumbsDownSelected ? 'primary' : 'default'}
            style={{ padding: '0', width: '10px' }} // Optional: reduce padding around the icon

          >
            <ThumbDownIcon />
          </IconButton>
        </div>
        {/* Add to Cart Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAddToCart(selectedProduct)}
          style={{ marginTop: '20px' }}
        >
          Add to Cart
        </Button>
        {/* Message Seller Button */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleMessageSeller()}
          style={{ marginTop: '20px', marginLeft: '10px' }}
        >
          Message Seller
        </Button>
      </>
    )}
  </Box>
</Modal>


  {/* Include the NavBar component */}
  <NavBar />
</div>

  );
};

export default Home;
