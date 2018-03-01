import React, { Component } from 'react';

import VerticalLists from './VerticalLists'
import MixLists from './MixLists'
import HorizontaLists from './HorizontaLists'

import './style.css';


class Lists extends Component {

  shouldComponentUpdate(props, state) {
    if (props.classify.length === 0) {
      return false
    }
    return true
  }
  renderLists() {
    let {classify} = this.props
    if (classify.length === 0) return
    
    let arr = []
    for (let i = 0; i < classify.length; i++) {
      let index = i + 1
      let data = classify[i]

      let key = index % 3
      let item 
      
      switch (key) {
        case 0: //竖图
          item = this.renderVerticalLists(data, index)
          break;
        case 1: //混合
          item = this.renderMixLists(data, index)
          break;
        case 2: //横图
          item = this.renderHorizontaLists(data, index)
          break;
        default:
          break;
      }
      arr.push(item)
    }
    return arr
  }
  getMore(id, genre_id) {
    this.props.getMore(id, genre_id)
  }
  playVideo(id, token, yt_id) {
    this.props.playVideo(id, token, yt_id)
  }
  renderVerticalLists(data, index) {
    return (<VerticalLists lists={data}
       key={index}
       playVideo={this.playVideo.bind(this)} 
       getMore={this.getMore.bind(this)}/>)
  }
  renderHorizontaLists(data, index) {
    return (<HorizontaLists lists={data} 
        key={index} 
        playVideo={this.playVideo.bind(this)} 
        getMore={this.getMore.bind(this)}/>)
  }
  renderMixLists(data, index) {
    return (<MixLists lists={data} 
        key={index} 
        playVideo={this.playVideo.bind(this)} 
        getMore={this.getMore.bind(this)}/>)
  }
  render() {
    return (
      <div className="lists">
        {this.renderLists()}
      </div>
    );
  }
}

export default Lists
