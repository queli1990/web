import React, { Component } from 'react';
import store from '../../../utils/Storage';
import api from '../../../../api';
import './style.css'

class VerticalLists extends Component {
  renderVerticaLists() {
    let { lists } = this.props
    let name = api.getFlag() === 0 ? 'name' : 'en_name'
    let arr = []
    if (lists.data === undefined) return
    for (let i = 0; i < lists.data.length; i++) {
      let a = lists.data[i]
      let item = (
        <figure key={i} onClick={()=>{this.playVideo(i)}}>
          <img src={a.portrait_poster_m} alt="not found"/>
          <p className="figure-name">{a[name]}</p>
        </figure>
      )
      arr.push(item)
    }
    return arr
  }
  playVideo(i) {
    let {data} = this.props.lists
    store.set('album',data[i]);
    this.props.playVideo(data[i].vimeo_id, data[i].vimeo_token, data[i].yt_id)
  }
  handleClick() {
    let { id, genre_id } = this.props.lists
    this.props.getMore(id, genre_id)
  }
  render() {
    if (this.props.lists.data === undefined) {
      return (
        <div></div>
      )
    }

    let str = api.getFlag() === 0 ? 'org' : 'content'
    console.log(api.getFlag())
    let lan = store.get('language')
    let moreText = lan[7][str]
    return (
      <div className="verticaLists">
        <div className="title">
          <h2> 
            {this.props.lists.name}
            <span className="more-text" onClick={()=>{this.handleClick()}}>{moreText} > > </span>
          </h2>
        </div>

        <div className="verticalBox">
          {this.renderVerticaLists()}
        </div>
      </div>
    );
  }
}

export default VerticalLists