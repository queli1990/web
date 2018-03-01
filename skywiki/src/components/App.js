import React from 'react';
import {Route} from 'react-router-dom';

import Home from './Home'
import Search from './Search'
import More from './More'
import Footer from './Common/Footer'
import Player from './Player'
import YoutubePlayer from './Player/YoutubePlayer'
import VietnamPlayer from './Player/VietnamPlayer'
import Pay from './Pay'

const App =({match}) => (
  <div className="App">
    <Route exact path='/' component={Home}/>
    <Route exact path='/:id' component={Home}/>
    <Route exact path='/search/:word' component={Search}/>
    <Route exact path='/more/:id/:genre_id' component={More}/>
    <Route exact path='/player/:p' component={Player} />
    <Route exact path='/pay/:p' component={Pay}/>
    {/* <Route exact path='/player/:id/:token' component={Player}/> */}
    {<Route exact path='/player/:id/:token' component={VietnamPlayer}/>}
    {<Route exact path='/ytplayer/:id' component={YoutubePlayer}/>}

    <Footer />
</div>
)

export default App
