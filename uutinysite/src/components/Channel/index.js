// src/components/Channel/index.js
import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import Nav from '../Common/Nav';
import TabBar from '../Common/TabBar';
import store from '../utils/Storage';
import api from '../api';
import './style.css';
require('es6-promise').polyfill();

// React.PropTypes is deprecated since React 15.5.0, use the npm module prop-types instead
export default class Channel extends Component {
  // static propTypes = {}
  constructor(props) {
    super(props)
    this.state = {
      channelLists: []
    }
  }
  componentWillMount() {
    let url = api.cmombileUrl('index2/?format=json&platform=mobile');
    fetch(url)
    .then(res => {
      return res.json()
    })
    .then(json =>{
      this.setState({
        channelLists: json.genres
      })
    })
    .catch(err => {
      alert("err")
    })
  }
  renderChannelLists() {
    let { channelLists } = this.state
    if (channelLists.length === 0) return

    let channelArr = []
    for (let i = 0; i < channelLists.length; i++ ) {
      let item =  ( <figure key={i} onClick={() => {this.goHome(i)}}>
                    <img className="channel-icon" src={channelLists[i].image_focus} lat="" />
                    <figcation>{channelLists[i].name}</figcation>
                   </figure> )
      channelArr.push(item)
    }
    return channelArr
  }
  tabBarItemClick (index) {
    if (index === 1) {
      return
    } else if (index === 0) {
      this.props.history.push('/');
    } else if (index === 2) {
      this.props.history.push('/search');
    }
  }
  goHome(i) {
    let id = this.state.channelLists[i].id
    this.props.history.push(`/home/${id}`);
  }
  render() {
    let flag = api.getFlag()
    let str = flag === 0 ? 'org' : 'content'
    let language = store.get('language')
    let channelName = language[9][str]
    return (
      <div className="channel-container">
        {/* channel nav */}
        <Nav navText={channelName} />

        <div className="channel-box">
          {this.renderChannelLists()}
        </div>

        <TabBar selectedIndex={1} itemClick={(e)=>this.tabBarItemClick(e)}/>
      </div>
    );
  }
}
