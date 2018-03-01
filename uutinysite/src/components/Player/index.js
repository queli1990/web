// src/components/player/index.js
import React, { Component } from 'react';
import Nav from '../Common/Nav';
import store from '../utils/Storage';
import md5 from 'md5';
import './style.css';
import api from "../api";

export default class Player extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  album = {}
  typeId = 2  //2：电视剧、 综艺类 3： 电影
  state = {
    album: {},
    episodes: [],
    related: [],
    src: '',
    activeIndex: 0
  }
  componentWillMount() {
    this.setState({
      activeIndex : 0
    })
    this.album = store.get('album')
    this.typeId = this.album.genre_id
    
    let {id, token} = this.props.match.params
    this.fetchAlbum(id, token)
    this.getUserIP();
    sessionStorage.removeItem('beginTime');
  }
  componentDidMount () {
    let video = this.refs.video;
    if (video !== undefined) {
      video.addEventListener('ended',this.postRecord);
      video.addEventListener('playing',this.setBeginTime.bind(this));
    }
  }
  componentWillUnmount () {
    this.postRecord();
  }
  setBeginTime () {
    let storeTime = sessionStorage.getItem('beginTime');
    if (!storeTime) {
      let begintime = this.getNowFormatDate();
      store.set('beginTime',begintime);
    }
  }
  getNowFormatDate() {
    var x = new Date();
    var y = "yyyy-MM-dd hh:mm:ss";
    var z ={y:x.getFullYear(),M:x.getMonth()+1,d:x.getDate(),h:x.getHours(),m:x.getMinutes(),s:x.getSeconds()};
    return y.replace(/(y+|M+|d+|h+|m+|s+)/g,function(v) {return ((v.length>1?"0":"")+eval('z.'+v.slice(-1))).slice(-(v.length>2?v.length:2))});
  }
  getUserIP () {
    var opts = {
      method: 'GET'
    }
    var requestUrl = 'http://cdn.100uu.tv/getIp';
    fetch(requestUrl,opts)
    .then ((response)=>{
      return response.json();
    })
    .then((responseText)=>{
      let currentUserIP = responseText.ip;
      store.set('userIP', currentUserIP)
    })
  }
  guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
  }
  postRecord () {
    let video = this.refs.video;
    let userIP = sessionStorage.getItem('userIP');
    let item = store.get('album');
    let albumID = item.id;
    let name = item.name + (this.state.activeIndex+1);
    let playedTime = Math.floor(video.currentTime*1000);
    let beginTime = sessionStorage.getItem('beginTime');
    let endTime = this.getNowFormatDate();
    let platform = 'mweb';
    let version = '1.0';
    let isCollection = '0';
    let uuid ;
    if (!localStorage.getItem('uuid')) {
      uuid = this.guid();
      localStorage.setItem('uuid',uuid);
    } else {
      uuid = localStorage.getItem('uuid');
    }
    let appendStr = uuid + version + platform + userIP + albumID +name + playedTime + isCollection + beginTime + endTime;
    let strMd5 = md5(appendStr);
    sessionStorage.removeItem('beginTime');
    let params = {
      'deviceId':uuid,
      'version':version,
      'platform':platform,
      'ip':userIP,
      'albumId':albumID,
      'albumTitle':name,
      'watchLength':playedTime,
      'isCollection':isCollection,
      'startTime':beginTime,
      'endTime':endTime,
      'channel': 'uu100',
      'sign':strMd5
    };
    // let url = 'http://api.100uu.tv/app/member/doVideoStatistics.do';
    let url = `http://api.100uu.tv/app/member/doVideoStatistics.do?deviceId=${uuid}&version=${version}&platform=${platform}&ip=${userIP}&albumId=${albumID}&albumTitle=${name}&watchLength=${playedTime}&isCollection=${isCollection}&startTime=${beginTime}&endTime=${endTime}&channel=uu100&sign=${strMd5}`
    fetch(url,{
      method:'POST'
    })
    .then((response)=>{
      return response.json();
    })
    .then((jsonData)=>{

    })
    .catch((error)=>{
      console.log('error-----'+error);
    })
  }
  fetchAlbum(id, token) {
    // let url = this.typeId === 3 ? `https://api.vimeo.com/videos/${id}` : `https://api.vimeo.com/albums/${id}/videos?sort=alphabetical`
    let url = this.typeId === 3 ? `https://api.vimeo.com/videos/${id}` :
    `https://api.vimeo.com/me/albums/${id}/videos?direction=desc&page=1&per_page=100`
    fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      return res.json()
    })
    .then(json => {
      let array = this.typeId === 3 ? [] : json.data
      let episodes = this.orderArray(array);
      let src = this.typeId === 3 ? json.files[0].link : episodes[0].files[0].link
      this.setState({
        episodes: episodes,
        src: src
      })
    })
    .catch(err =>{
      console.log(err)
    })
    this.fetchRelated()
  }
  fetchRelated() {
    let url = api.related(this.album.id)
    fetch(url)
    .then(res =>{
      return res.json()
    })
    .then(json =>{
      this.setState({
        related: json.data
      })
    })
  }
  renderSelections() {
    let { episodes,  activeIndex} = this.state
    if (episodes.length === 0) return

    let cname = this.typeId === 4 ? "variety-item" : "episodes-item"
    let arr = []
    for (let i = 0; i < episodes.length; i++) {
      let aName = activeIndex === i ? "active" : ""
      let currentName = cname + " " + aName
      let dname = this.typeId === 4 ? episodes[i].name : i + 1
      let item = ( <li className={currentName}
        key={i}
        onClick={()=>{this.changeURl(i)}}>
          { dname }
        </li>)
      arr.push(item)
    }
    return arr
  }
  renderRelated() {
    let {related} = this.state
    if(related.length === 0 ) {return}
    let arr = []
    for(let i = 0 ; i < related.length; i++) {
      let item = (<figure key={i} onClick={()=>{ this.changeAlbum(i) }}>
          <img src = {related[i].landscape_poster_s} alt=""/>
          <figcaption>{related[i].name}</figcaption>
        </figure>)

      arr.push(item)
    }
    return arr
  }
  changeURl(i) {
    console.log("===========切换剧集==============")
    this.postRecord();
    this.setState({
      activeIndex: i,
      src: this.state.episodes[i].files[0].link
    })
  }
  changeAlbum(i) {
    this.postRecord();
    this.album = this.state.related[i]
    this.typeId = this.album.genre_id
    let id = this.album.vimeo_id
    let token = this.album.vimeo_token
    this.fetchAlbum(id, token)
  }
  goBack() {
    this.props.history.goBack()
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
  render() {
    
    let flag = api.getFlag()
    let lan = store.get('language')
    let str = flag === 0 ? 'org' : 'content'
    let eps = this.state.episodes.length
    let epStr = lan[13][str].replace(/{}/, eps)
    // const { className, ...props } = this.props;
    return (
      <div className="video-container">
        <Nav navText={this.album.name} back={this.goBack.bind(this)} visble={true} />
        <video src={this.state.src} autoPlay controls ref="video"/>
        <div className="album-box">
          <div className="album-title">
            <span>{lan[3][str]}</span>
            <span style={{"float": "right"}}>{epStr}</span>
          </div>

          <ul className="album-selections">
            {this.renderSelections()}
          </ul>

          <div className="director">
            <span className="director-text">{lan[0][str]}：</span>
            <span className="director-name">{this.album.director}</span>
          </div>
          <div className="actor">
            <span className="actor-text">{lan[1][str]}：</span>
            <span className="actor-name">{this.album.cast1} {this.album.cast2} {this.album.cast3} {this.album.cast4}</span>
          </div>

          <div className="intro">
            <span className="intro-text">{lan[2][str]}：</span>
            <span className="intro-name">{this.album.description}</span>
          </div>

          <div className="split-line"></div>

          <div className="ralted-box">
            <h1>{lan[5][str]}</h1>
            <div className="related-container">
              {this.renderRelated()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
