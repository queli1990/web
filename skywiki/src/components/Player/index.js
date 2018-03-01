
// src/components/About/index.js
import React, { Component } from 'react';
import './style.css';
import axios from 'axios';
import store from '../utils/Storage'
import presenter from '../utils/PostPlayerTime'
import Header from '../Common/Header'
import YouTube from 'react-youtube'
import Nav from '../Common/Nav'
import api from '../../api'

export default class Player extends Component {
  lanId = 0
  typeId = 2 //1或者数组个数==1:电影    4：综艺    其余为电视剧
  lanstr = ''
  state = {
    album : {},
    episodes : [],
    related : [],
    src : "",
    activeIndex : 0,
    isYoutube: false,
    player: null,
    navVisble: false
  }
  componentDidMount () {
    presenter.getUserIP();
  }
  shouldComponentUpdate(a, b) {
    if (b.src === "") {
      return false
    }
    return true
  }
  componentDidUpdate () {
    let video = this.refs.video;
    if (video !== undefined) {
      sessionStorage.removeItem('beginTime');
      video.addEventListener('ended',this.postRecord);
      video.addEventListener('playing',presenter.setBeginTime());
    }
  }
  componentWillUnmount () {
    this.postRecord();
  }
  postRecord () {
    let {isYoutube, player} = this.state
    let video = isYoutube ? player: this.refs.video;
    let playedTime = isYoutube ? Math.floor(video.getCurrentTime()*1000) : Math.floor(video.currentTime*1000);
    let item = store.get('album');
    let name = item.name + (this.state.activeIndex+1);
    let language = api.getPlatform();
    presenter.post(playedTime,name,language);
  }
  componentWillMount () {
    this.album = store.get('album');
    this.language = store.get('language');
    this.typeId = this.album.genre_id;
    this.lanId = api.getFlag();
    this.lanstr = this.lanId === 0 ? 'org' : 'content';
    // let {id,token} = this.props.match.params;
    let  {vimeo_id, vimeo_token} = this.album
    this.fetchAlbum(vimeo_id, vimeo_token);
  }
  fetchAlbum (id,token) {
    let url = api.episodes(this.album.id)
    axios.get(url)
    .then(res=>{
      let len = res.data.episodes === undefined ? 0 : res.data.episodes.length
      if(len > 0) {
        this.setState({
          episodes: res.data.episodes,
          src: res.data.episodes[0].videoId,
          isYoutube: true
        })
      } else {
        let url = this.typeId === 3 ? `https://api.vimeo.com/videos/${id}` :
        `https://api.vimeo.com/me/albums/${id}/videos?direction=desc&page=1&per_page=100`

        axios.get(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        .then(json =>{
          let episodes = this.typeId === 3 ? [] : json.data.data;
          var array = this.orderArray(episodes);
          let src = this.typeId === 3 ? json.data.files[0].link : array[0].files[0].link;
          this.setState({
            episodes: array,
            src: src,
            isYoutube: false
          })
        })
        .catch(err =>{
          console.log(err)
        })
      }
    })
    this.fetchRelated()
  }
  showNav(flag) {
    clearInterval(this.interval)
    if (!flag) {
      this.interval = setTimeout(()=>{
        this.setState({
          navVisble: flag
        })
      }, 500)
    } else {
      this.setState({
        navVisble: flag
      })
    }
  }
  fetchByID(id, genre_id){
    this.props.history.push(`/${id}`)
  }
  getMore(id, aid) {
    console.log('---------------')
    this.props.history.push('/more/undefined/1')
  }
  goHome() {
    this.props.history.push('/')
  }
  fetchRelated () {
    let url = api.related(this.album.id)
    axios.get(url)
    .then(json =>{
      this.setState({
        related : json.data.data
      })
    })
    .catch(err =>{
      console.log(err)
    })
  }
  renderNav() {
    let {navVisble} = this.state
    if (navVisble) {
      return (
        <Nav
          getMore={this.getMore.bind(this)}
          showNav = {this.showNav.bind(this)}
          listenMouse={true}
          fetchApi = {false}
          small={true}
          fetchByID={this.fetchByID.bind(this)} />
      )
    }
  }
  renderPlayer() {
    if (this.state.isYoutube) {
      const opts = {
        width: '1420',
        height: '797',
        playerVars: { // https://developers.google.com/youtube/player_parameters
          autoplay: 1
        }
      };
      return (
        <YouTube
          videoId={this.state.src}
          opts={opts}
          onReady={this._onReady.bind(this)} /> )
    }
    return (
      <video src={this.state.src}
        autoPlay
        controls
        ref="video"
        poster={this.album.landscape_poster} />
    )
  }
  _onReady (event) {
    event.target.playVideo();
    this.setState({
      player: event.target,
    });
  }
  render() {
    let currentVideoName = this.album.name;
    let str = api.getFlag() === 0 ? 'org' : 'content'
    let lan = store.get('language')
    let homeText = lan[8][str]
    let channelText = lan[9][str]
    return (
      <div>
        <div>
          <Header
            goHome={this.goHome.bind(this)}
            search={(e)=>this.goSearch(e)} />
          <div className="moreHeader">
            <span className="more-home" onClick={()=>{this.goHome()}}>{homeText}</span>
            <span className="more-channel"
              onMouseOut={()=>{this.showNav(false)}}
              onMouseOver={()=>{this.showNav(true)}} >
                {channelText}
              </span>
          </div>
        </div>
        <div className="navContent">
          {this.renderNav()}
          <div className="bigContent">
            {this.renderPlayer()}
            {/* {this.renderYoutubePlayer()} */}
            <span className="videoName">{currentVideoName}</span>
            <div className="line"></div>
            {this.upEpisodes()}
            {this.episodes()}
            {this.descriptionView()}
            {this.renderRecomend()}
          </div>
        </div>
      </div>
    )
  }
  upEpisodes () {
    if (!(this.typeId === 3)) {
      let title = this.language[3][this.lanstr]
      return (
        <span className="selectEpisode">{title}</span>
      )
    }
  }
  episodes () {
    if (!(this.typeId === 3)){ //电影
      var array = [];
      for (var i = 0; i < this.state.episodes.length; i++) {
        let item = this.state.episodes[i];
        let aName = this.state.activeIndex === i ? "active" : "";
        let typeName = this.typeId === 4 ? "rectangle" : "square";
        let currentName = typeName + " " + aName;
        let title = this.typeId === 4 ? item.name : i+1 ;
        let index = i;
        array.push(
          <button key={i} className={currentName} onClick={()=>this.chooseEpisode(index)}>{title}</button>
        )
      }
      return array
    }
  }
  descriptionView () {
    //返回描述和导演、演员部分
    let item = this.album;
    let lan = this.language
    let director = lan[0][this.lanstr] + item.director;
    let cast1 = item.cast2.length > 0 ? item.cast1 + '/' : item.cast1;
    let cast2 = item.cast3.length > 0 ? item.cast2 + '/' : item.cast2;
    let cast3 = item.cast4.length > 0 ? item.cast3 + '/' : item.cast3;
    let actor =  lan[1][this.lanstr] + ' ' + cast1 + cast2 + cast3 + item.cast4;
    let description = item.description;
    return (
      <div className="introduce">
        <div className="lineOne">
          <span>{lan[2][this.lanstr]}</span>
        </div>
        <div className="lineTwo">
          <span className="span_director">{director}</span>
          <span className="span_actor">{actor}</span>
        </div>
        <span className="left">{lan[2][this.lanstr]}</span>
        <span className="right">{description}</span>
      </div>
    )
  }
  renderRecomend () {
    if (this.state.related.length > 0) {
      let lan = this.language
      return (
        <div>
          <h2 className="verticalLine">|</h2>
          <span className="reconmedTitle">{lan[5][this.lanstr]}</span>
          <div className="outer_relatedView">
            <div className="content_relatedView">
              {this.renderRelated()}
            </div>
          </div>
        </div>
      )
    }
  }
  renderRelated () {
    let tempArray = [];
    for (var i = 0; i < this.state.related.length; i++) {
      let item = this.state.related[i];
      let index = i;
      tempArray.push(
        <figure className="cell" key={i} onClick={()=>this.selecteRelated(index)}>
          <img src={item.portrait_poster_m} className="cell_img"/>
          <figcaption className="cell_title">{item.name}</figcaption>
        </figure>
      )
    }
    return tempArray;
  }
  selecteRelated (index) {
    this.setState({
      activeIndex : 0
    })
    let token = this.state.related[index].vimeo_token;
    let id = this.state.related[index].vimeo_id;
    this.album = this.state.related[index];
    this.typeId = this.album.genre_id;
    this.fetchAlbum(id,token);
    store.set('album',this.state.related[index]);
    this.postRecord();
  }
  chooseEpisode (index) {
    if (index === this.state.activeIndex) return
    this.postRecord();
    console.log('选中了'+index)
    if (this.state.isYoutube) {
      this.setState({
        activeIndex : index,
        src : this.state.episodes[index].videoId
      })
    } else {
      this.setState({
        activeIndex : index,
        src : this.state.episodes[index].files[0].link
      })
    }
  }
  orderArray (array) {
    var tempArray = [];
    array.map((item,index)=>{
      var episodeIndex = this.addIndex(item)
      item.episodeIndex = episodeIndex
      tempArray.push(item);
    });
    if (this.typeId === 4) {
      tempArray.sort(function(a,b){
        return b.episodeIndex - a.episodeIndex;
      });
    } else {
      tempArray.sort(function(a,b){
        return a.episodeIndex - b.episodeIndex;
      });
    }
    return tempArray;
  }
  addIndex (dic) {
    var name = dic.name;
    var episodeIndex = name.replace(/[^0-9]/ig,"");
    return episodeIndex;
  }
  goSearch (keyword) {
    if (keyword.length === 0) return;
    var path = `/search/${keyword}`
    this.props.history.push(path);
  }
}
