import React, { Component } from 'react';
import store from '../../../utils/Storage';
import api from '../../../../api';
import './style.css';

class MixLists extends Component {
  renderMixLists() {
    let { lists } = this.props
    let name = api.getFlag() === 0 ? 'name' : 'en_name'
    let arr = []
    if (lists.data === undefined) return
    let b = JSON.parse(JSON.stringify(lists.data))
    let data = b.length > 8 ? b.splice(0, 9) : b
    for (let i = 1; i < data.length; i++) {
      let a = data[i]
      let pTag 
      if(this.props.lists.name === "天维频道") {
        let sName = a.title_sub === null ? a.name : a.title_sub
        pTag = (<div><p className="figure-mainname">{a.name}</p>
        <p className="figure-subname">{sName}</p></div>)
      } else {
        pTag = (<p className="figure-name">{a[name]}</p>)
      }
      let item = (
        <figure key={i} onClick={()=>{this.play(i)}}>
          <img src={a.landscape_poster_s} alt="loading..."/>
          {pTag}
          <div className={a.pay ? 'mixvip': ''}></div>
        </figure>
      )
      arr.push(item)
    }
    return arr
  }
  play(i) {
    let {data} = this.props.lists
    store.set('album',data[i]);

    if (data[i].ad_url !== null && typeof data[i].ad_url === "string" ) {
      return window.open(data[i].ad_url)
    }
    this.props.playVideo(data[i].vimeo_id, data[i].vimeo_token, data[i].yt_id)
  }
  handleClick() {
    let { id, genre_id } = this.props.lists
    this.props.getMore(id, genre_id)
  }
  renserSubTitle() {

  }
  renderLeftName() {
    let data = this.props.lists.data
    if(this.props.lists.name === "天维频道") {
      let sName = data[0].title_sub === null ? data[0].name : data[0].title_sub
      let item = (<div><p className="figure-mainname">{data[0].name}</p>
      <p className="figure-subname">{data[0].name}</p></div>)
      return item
    } else {
      let name = api.getFlag() === 0 ? 'name' : 'en_name'
      return ( <p className="figure-name">{data[0][name]}</p> )
    }
  }
  render() {
    if (this.props.lists.data === undefined) {
      return (
        <div></div>
      )
    }
    let str = api.getFlag() === 0 ? 'org' : 'content'
    let lan = store.get('language')
    let moreText = lan[7][str]
    return (
      <div className="mixLists">
        <div className="mixtitle">
          <h2>
            {this.props.lists.name}
            <span className="more-text" onClick={()=>{this.handleClick()}}>{moreText} > > </span>
          </h2>
        </div>

        <div className="mixBox">
          <div className="mix-left">
          <figure onClick={()=>{this.play(0)}}>
            <img src={this.props.lists.data[0].landscape_poster_s} alt="loading..."/>
            {this.renderLeftName()}
            {this.renserSubTitle()}
          </figure>
          </div>
          <div className="mix-right">
            {this.renderMixLists()}
          </div>
        </div>
      </div>
    );
  }
}

export default MixLists
