import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './views/home';
import Contact from './views/contact';
import Who from './views/who';
import FAQ from './views/faq';
import Register from './views/register';

const Routes = () => {
    return(
        <BrowserRouter>
            <Route component = {Home} path = "/" exact/>
            <Route component = {Who} path = "/who" exact/>
            <Route component = {Contact} path = "/contact" exact/>
            <Route component = {FAQ} path = "/faq" exact/>
            <Route component = {Register} path = "/register" exact/>
        </BrowserRouter>
    )
}

export default Routes;