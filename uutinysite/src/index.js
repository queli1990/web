import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes'

import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';
// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
  <BrowserRouter>
      <Routes />
  </BrowserRouter>,
  document.getElementById('root')
);
// registerServiceWorker();
