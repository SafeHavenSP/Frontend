import React, { useState, useEffect } from 'react';
import './styles/Pop.css'; // Assuming you want to style the popup

const PopUp = ({ message, showPopup, closePopup }) => {
  // Optional useEffect to automatically close the popup after 3 seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        closePopup();
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timeout when component is unmounted
    }
  }, [showPopup, closePopup]);

  return (
    <>
      {showPopup && (
        <div className="popup-container">
          <div className="popup-message">
            <p>{message}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PopUp;
