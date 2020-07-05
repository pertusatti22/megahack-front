import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import logo from '../../assets/safeshub_logo_2.svg';

export default function Header() {
 return (
   <header className="headerContainer">
       <img src={logo} className="logoImg" alt="Logo Safe's Hub"/>
        <ul className="menu">
            <li><Link className="headerText" to="/somos">Quem somos</Link></li>
            <li><Link className="headerText" to="/contato">Contato</Link></li>
            <li><Link className="headerText" to="/faq">FAQ</Link></li>
        </ul>
   </header>
 );
}