// src/components/About/index.js
import React, { Component } from 'react';
import './style.css';
import axios from 'axios';
import store from '../utils/Storage'
import presenter from '../utils/PostPlayerTime'

export default class Player extends Component {
  typeId = 2 //1或者数组个数==1:电影    4：综艺    其余为电视剧
  state = {
    album : {},
    episodes : [],
    related : [],
    src : "",
    activeIndex : 0
  }
  componentDidMount () {
    // presenter.getUserIP();
  }
  componentDidUpdate() {
    // {this.addListener()}
  }
  componentWillUnmount () {
    // this.postRecord();
  }
  postRecord () {
    let video = this.refs.video;
    let playedTime = Math.floor(video.currentTime*1000);
    let item = store.get('album');
    let name = item.name + (this.state.activeIndex+1);
    let channel = 'vi';
    presenter.post(playedTime,name,channel);
  }
  componentWillMount () {
    window.location.href = "http://vi.100uu.tv"
    // this.fetchInfoByID()
  }
  fetchInfoByID () {
    // let id = this.props.match.params.id;
    let id = '1862';
    let url = `http://cdn.100uu.tv/albums/${id}/?format=json&platform=apple-tv`;
    axios.get(url)
    .then(json =>{
      this.album = json.data;
      this.typeId = this.album.genre_id;
      store.set('album',json.data);
      this.fetchAlbum(this.album.vimeo_id,this.album.vimeo_token);
    })
    .catch(err =>{
      console.log(err)
    })
  }
  fetchAlbum (id,token) {
    let url = this.typeId === 3 ? `https://api.vimeo.com/videos/${id}` :
    `https://api.vimeo.com/me/albums/${id}/videos?direction=desc&page=1&per_page=100`
    axios.get(url,{
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
        src: src
      })
    })
    .catch(err =>{
      console.log(err)
    })
    this.fetchRelated()
  }
  fetchRelated () {
    let url = `http://cdn.100uu.tv/related/${this.album.id}/`
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
  render() {
    if (this.album === undefined) {
      return (
      <div></div>
    )} else {
      let currentVideoName = this.album.name;
      return (
        <div className="bigContent">
          <video src={this.state.src} autoPlay controls ref="video"/>
          <span className="videoName">{currentVideoName}</span>
          <div className="line"></div>
          {this.upEpisodes()}
          {this.episodes()}
          {this.descriptionView()}
          {this.renderRecomend()}
        </div>
      )
    }
  }
  addListener () {
    let video = this.refs.video;
    sessionStorage.removeItem('beginTime');
    video.addEventListener('ended',this.postRecord);
    video.addEventListener('playing',presenter.setBeginTime());
  }
  upEpisodes () {
    if (!(this.typeId === 3)) {
      return (
        <span className="selectEpisode">Danh sách các tập</span>
        //选集
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
    let director = 'Đạo diễn：' + item.director;
    let cast1 = item.cast2.length > 0 ? item.cast1 + '/' : item.cast1;
    let cast2 = item.cast3.length > 0 ? item.cast2 + '/' : item.cast2;
    let cast3 = item.cast4.length > 0 ? item.cast3 + '/' : item.cast3;
    let actor = 'Diễn viên：' + cast1 + cast2 + cast3 + item.cast4;
    let description = item.description;
    return (
      <div className="introduce">
        <div className="lineOne">
          <span>Giới thiệu nội dung：</span>
        </div>
        <div className="lineTwo">
          <span className="span_director">{director}</span>
          <span className="span_actor">{actor}</span>
        </div>
        <span className="left" style={{width:120}}>Nội dung phim：</span>
        <span className="right" style={{marginLeft:120}}>{description}</span>
      </div>
    )
  }
  renderRecomend () {
    if (this.state.related.length > 0) {
      return (
        <div>
          <h2 className="verticalLine">|</h2>
          <span className="reconmedTitle"> Đề Cử </span>
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
    console.log('选中了'+index);
    this.setState({
      activeIndex : index,
      src : this.state.episodes[index].files[0].link
    })
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
}
