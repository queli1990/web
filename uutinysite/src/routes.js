// src/routes.js
import React from 'react';
import {Route, Switch } from 'react-router';

import Home from './components/Home';
import About from './components/About';
import NotFound from './components/NotFound';
import Channel from './components/Channel';
import Player from './components/Player';
import VietnamPlayer from './components/Player/VietnamPlayer';
import Search from './components/Search';
import List from './components/List';

const Routes = (props) => (
  <Switch {...props}>
    <Route exact path="/" component={Home} />
     <Route exact path="/home/:id" component={Home} />
    <Route path="/about/:id" component={About} />
    <Route path="/channel" component={Channel} />
    <Route path="/player/:id/:token" component={Player}/>
    <Route path="/player/:id" component={VietnamPlayer}/>
    <Route path="/search" component={Search} />
    <Route path="/list/:data" component={List}/>
    <Route path="*" component={NotFound} />
  </Switch>
);

export default Routes;
