import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/ProfilePage.css';  
import url from './url'
import NavBar from './NavBar'; 
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; 
import { useNavigate  } from 'react-router-dom';







const ProfilePage = () => {
  const username = sessionStorage.getItem("username");  
  const [products, setProducts] = useState([]); 
  const [karma, setKarma] = useState(0);  
  const [balance, setBalance] = useState(0);
  const [showUploadPopup, setShowUploadPopup] = useState(false);  
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [photos, setPhotos] = useState([]); 
  const navigate = useNavigate();  


  useEffect(() => {
    fetchUserKarma();
    fetchUserBalance();
    fetchUserProducts();
  }, []);

  const fetchUserKarma = async () => {
    try {
      const response = await axios.get(`${url.url}/getUserKarma?username=${username}`);
      setKarma(response.data.karma); 
    } catch (error) {
      console.error("Error fetching user karma:", error);
    }
  };

  const fetchUserBalance = async () => {
    try { 
      const response = await axios.get(`${url.url}/getUserBalance?username=${username}`);
      setBalance(response.data.balance);  
    } catch (error) {
      console.error("Error fetching user BALANCE:", error);
    }
  };
  const fetchUserProducts = async () => {
    try {
      const response = await axios.get(`${url.url}/getUserProducts?username=${username}`);  
      setProducts(response.data.products); 
    } catch (error) {
      console.error("Error fetching user products:", error);
    }
  };

  const handleUploadProduct = async () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('productName', productName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('quantity', quantity);

    photos.forEach((photo, index) => {
      formData.append('photos', photo);  
    });

    try {
      await axios.post(`${url.url}/uploadProduct`, formData);
      setShowUploadPopup(false);  
      fetchUserProducts();  
    } catch (error) {
      console.error("Error uploading product:", error);
    }
  };

  const handleDeleteProduct = async (productName) => {
    try {
      await axios.get(`${url.url}/deleteProduct?username=${username}&productName=${productName}`);
      fetchUserProducts();  
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };


  const handleLogout = async () => {
    try {
      await signOut(auth); 
      navigate('/'); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  return (
    <div className="profile-page">
    <h1> {username}</h1>

   
    <div className="karma-section">
      <h2>Karma: {karma}</h2>
    </div>

    <div className="balance-container">
  <div className="balance-section">
    <h2>Balance: {balance}</h2>
  </div>
  <button onClick={() => setShowUploadPopup(true)}>Cashout!</button>

        <button className="logout-button" onClick={handleLogout}>Logout</button>
    
</div>





    
    <button onClick={() => setShowUploadPopup(true)}>Upload New Product</button>

   
    {showUploadPopup && (
      <div className="upload-popup">
        <h2>Upload Product</h2>
        <input type="text" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <input type="file" multiple onChange={(e) => setPhotos(Array.from(e.target.files))} />
        <button onClick={handleUploadProduct}>Save</button>
        <button onClick={() => setShowUploadPopup(false)}>Cancel</button>
      </div>
    )}

    
    <div className="products-section">
      <h2>Your Uploaded Products</h2>
      <div className="products-scroll-view">
        {products.map((product) => (
          <div key={product.productName} className="product-item">
            <h3>{product.productName}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Quantity: {product.quantity}</p>
            <div className="product-images">
              {product.photos.map((photoUrl, index) => (
                <img key={index} src={photoUrl} alt={`Product ${index}`} />
              ))}
            </div>
            <button className='delete-button' onClick={() => handleDeleteProduct(product.productName)}>Delete</button>
          </div>
        ))}
      </div>
    </div>

    
    <NavBar />
  </div>
  );
};

export default ProfilePage;
