import React, { Component } from 'react';
import axios from 'axios';
import api from '../../../api';
import store from '../../utils/Storage';
import './style.css';

class Nav extends Component {
  state = {
    active: 1,
    titles: [],
    curGenid: 0
  }
  componentWillMount() {
    this.fetchNavLists()
  }
  fetchNavLists() {
    let url = api.nav()
    axios.get(url)
    .then(res => {
      store.set('language', res.data.language)
      let cid = this.props.id !== undefined ? +this.props.id : res.data.genres[0].id
      this.setState({
        titles: res.data.genres,
        curGenid: cid
      }, ()=>{
        let {id, genre_id} = this.state.titles[0]
        if (this.props.id !== undefined) {id = this.props.id}
        let {fetchApi} = this.props
        if (fetchApi) {this.props.fetchByID(id, genre_id)}
      })
    })
    .catch(err =>{
      console.log(err)
    })
  }
  showHide(flag) {
    if (!this.props.listenMouse) return
    this.props.showNav(flag)
  }
  renderLists() {
    let { titles,  curGenid} = this.state
    if (titles.length > 0) {
      let arr = []
      for (let i = 0; i < titles.length; i++) {
        let name =  titles[i].name
        let item = (
          <li key={i}
            onClick={()=>{this.changeItem(i)}}
            className={curGenid ===  titles[i].id ? 'active': ''}>
            {name}
          </li>
        )
        arr.push(item)
      }
      return arr
    }
  }
  changeItem(i) {
    let {titles} = this.state
    if (titles[i].id === 999) {
      return this.props.getMore('undefined', 'undefined')
    }
    this.setState({
      active: i,
      curGenid: titles[i].id
    }, ()=>{
      let {titles, active} = this.state
      this.props.fetchByID(titles[active].id, titles[active].genre_id)
    })
  }
  render() {
    let {small} = this.props
    let cname = small === true ? "sNav" : "Nav"
    return (
      <div
        onMouseOver={()=>{this.showHide(true)}}
        onMouseOut={()=>{this.showHide(false)}}
        className={cname}>
        <ul>
          {this.renderLists()}
        </ul>
        {/* <div className="nav-logo">
          {<span className="nav-text">片源合作方</span>}
        </div> */}
      </div>
    );
  }
}

export default Nav
