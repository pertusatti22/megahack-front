import React from 'react';

import './style.css';
import logo from '../../assets/safeshub_logo_3.svg';

export default function Footer() {
    return (
        <div className="footerContainer">
            <p className="textFooter">Feito no Mega Hack 3.0</p>
            <img src={logo} className="logoImgBranco" alt=""/>
        </div>
    )
}
