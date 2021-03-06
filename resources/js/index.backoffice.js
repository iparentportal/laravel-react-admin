import './bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';

import { _register as registerServiceWorker } from './utils/ServiceWorker';
import App from './App';
import { dark as darkTheme, light as lightTheme } from './themes/backoffice';

if (document.querySelector('#initial-content')) {
    document.querySelector('#initial-content').outerHTML = '';
}

if (document.querySelector('#root')) {
    ReactDOM.render(
        <App
            environment="backoffice"
            darkTheme={darkTheme}
            lightTheme={lightTheme}
        />,
        document.querySelector('#root'),
    );
}

const swFilepath = document.querySelector('meta[name=sw-filepath]');

if (swFilepath) {
    registerServiceWorker(swFilepath.content);
}
