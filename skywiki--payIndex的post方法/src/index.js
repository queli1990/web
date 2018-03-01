import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

// import { createStore, combineReducers, applyMiddleware } from 'redux'
// import { Provider } from 'react-redux'

// import createHistory from 'history/createBrowserHistory'

// import { Route } from 'react-router'

// import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

// import reducer from './reducers'

import Routes from './routes'

import './index.css';
// import registerServiceWorker from './registerServiceWorker';

// const history = createHistory()

// const middleware = routerMiddleware(history)

// const store = createStore(
//   combineReducers({
//     ...reducer,
//     router: routerReducer
//   }),
//   applyMiddleware(middleware)
// )

// ReactDOM.render(
//   // <Provider store={store}>
//       {/* <ConnectedRouter history={history}> */}
//         <BrowserRouter>
//           <Routes />
//         </BrowserRouter>
//       {/* </ConnectedRouter> */}
//   // </Provider>
//   ,
//   document.getElementById('root')
// );

ReactDOM.render(
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
  ,
  document.getElementById('root')
);
// registerServiceWorker();
