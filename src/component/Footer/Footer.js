import React from "react";
import './Footer.scss';
import logo from '../../img/logo.png'; 

function Footer() {
    return (
      <footer className="Footer"> 
      <img src={logo} className="logo" alt="logo" /> 
      </footer>
    );
  }
  
  export default Footer;