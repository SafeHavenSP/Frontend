import React from 'react';
import { Link } from 'react-router-dom'; 
import './styles/NavBar.css'; 
import homeIcon from './assets/Home-icon-final.png';
import profileIcon from './assets/profile-icon.png';
import messageIcon from './assets/message-icon.png';


const NavBar = () => {
  return (
    <div className="nav-bar">
      <Link to="/profile" className="nav-button">
        <img src={profileIcon} alt="Profile" className="profile-icon" /> 
      </Link>
      <Link to="/home" className="nav-button">
        <img src={homeIcon} alt="Home" className="home-icon" />
      </Link>
      <Link to="/message" className="nav-button">
        <img src={messageIcon} alt="Message" className="message-icon" />
      </Link>
    </div>
  );
};

export default NavBar;
