import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import './index.css';
import App from './Containers/App';
import store from './Redux/store'

ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>, 
document.getElementById('root'));
