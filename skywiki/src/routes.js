// src/routes.js
import React from 'react';
import {Route ,BrowserRouter as Router} from 'react-router-dom';

import Home from './components/Home';
import App from './components/App';

const Routes = (props) => (
  <Router>
    <Route path="/" component={(props) => (
      <App {...props}>
        {/* <Switch> */}
          <Route exact path='/' component={Home} />
           {/* <Route path='/search/:word' component={Search} /> */}
          {/* <Route exact path='/' component={Home} /> */}
           {/* <Route path='/search' component={Search} /> */}
          {/*<Route path='/bar' component={Bar} /> */}
        {/* </Switch> */}
      </App>
    )}>
    </Route>
  </Router>
  // <Switch {...props}>
  //   <Route exact path="/" component={Home} />
  //   {/* <Route path="*" component={NotFound} /> */}
  // </Switch>
);

export default Routes;
