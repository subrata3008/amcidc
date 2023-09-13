import React from "react";
import './Header.scss';
import logo from '../../img/logo.png'; 

function Header() {
    return (
      <header className="header effect1"> 
      <img src={logo} className="logo" alt="logo" />
        <p className="subText">IBM Sustainable Product Ledger on AWS</p>
      </header>
    );
  }
  
  export default Header;