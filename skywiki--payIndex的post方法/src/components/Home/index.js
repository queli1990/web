import React, { Component } from 'react';
import axios from 'axios';

import Header from '../Common/Header'
import Nav from '../Common/Nav'
import Carousel from '../Common/Carousel'
import Lists from '../Common/Lists'
import presenter from '../utils/PostPlayerTime'
import api from '../../api'
// import store from '../utils/Storage'
// import Footer from '../Common/Footer'

import './App.css';

class Home extends Component {
  state = {
    titles: [],
    carousel: [],
    classify: [],
    curGenid: 0,
  }
  genre_id = 0
  cid = 0
  componentWillMount() {
    presenter.getUserIP()
    this.activeCount()
  }
  activeCount() {
    let uuid = localStorage.getItem("uuid")
    if(uuid === null) {
      uuid = presenter.guid()
      localStorage.getItem("uuid", uuid)
    }
    let ip = sessionStorage.getItem('userIP')
    let vtime = presenter.getNowFormatDate()
    let channel =  'uu100'
    let language = api.getPlatform()
    let url = `http://api.100uu.tv/app/member/doActiveMembers.do?deviceId=${uuid}&version=1.0&platform=web&channel=${channel}&language=${language}&ip=${ip}&visitingTime=${vtime}`
    axios(url)
    .then(res=>{
      console.log('统计'+res.data.status);
    })
    .catch(err=>{
      console.log(err);
    })
  }
  fetchByID(id, genre_id) {
    this.genre_id = genre_id
    let url = api.genres(id)
    axios.get(url)
    .then(res =>{
      let carousel_uu = res.data.carousel;
      let classify_uu = res.data.data;
      this.setState({
        carousel: carousel_uu,
        classify: classify_uu
      })
    })
    .catch(err =>{
      console.log(err)
    })
  }
  getMore(id, genre_id) {
    this.props.history.push(`/more/${genre_id}/${this.genre_id}`)
  }
  playVideo(id, token, yt_id) {
    let album = JSON.parse(sessionStorage.getItem('album'))
    if (yt_id !== undefined) {
      this.props.history.push(`/ytplayer/${yt_id}`)
    } else {
      this.props.history.push(`/player/${album.id}`)
    }
  }
  goPersonal() {
    this.props.history.push(`/pay/p`)
  }
  goHome() {
    // this.props.history.push(`/88`)
    window.location.reload()
  }
  render() {
    let { id } = this.props.match.params
    return (
      <div className="App">
        <Header
          ref="hd"
          goHome={this.goHome.bind(this)}
          goPersonal={this.goPersonal.bind(this)}
          search={(e)=>this.goSearch(e)}/>
        <Nav
          id={id}
          getMore={this.getMore.bind(this)}
          fetchApi = {true}
          titles={this.state.titles}
          fetchByID={this.fetchByID.bind(this)}/>
        <Carousel
          navId={this.genre_id}
          playVideo={this.playVideo.bind(this)}
          carousel={this.state.carousel}
          showLoginView={this.showLoginView.bind(this)}
          pushPersonal={this.goPersonal.bind(this)}/>
        <Lists
          classify={this.state.classify}
          playVideo={this.playVideo.bind(this)}
          getMore={this.getMore.bind(this)}/>
      </div>
    );
  }
  showLoginView() {
    this.refs.hd.showLoginView();
  }
  goSearch (keyword) {
    if (keyword.length === 0) return;
    var path = `/search/${keyword}`
    this.props.history.push(path);
  }
}

export default Home
