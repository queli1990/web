import React, { Component } from 'react';
// import store from '../../utils/Storage';
import api from '../../../api';
import './style.css';
import bannerVIP from '../../../images/banner-VIP.png';

class Carousel extends Component {
  state = {
    curentSrc: '',
    active: 0,
    isPay : false
  }
  carousel = []
  componentWillReceiveProps(a, b) {
    if (a.carousel.length > 0) {
      this.setState({
        curentSrc: a.carousel[0].landscape_poster_b,
        isPay : a.carousel[0].pay
      })
    }
  }
  shouldComponentUpdate(props, state) {
    return true
  }
  renderLists() {
    let { carousel } = this.props
    let name = api.getFlag() === 0 ? 'name' : 'en_name'
    let carouselArr = JSON.parse(JSON.stringify(carousel))
    if (carouselArr.length > 0) {
      let arr = []
      let data = carouselArr.length > 9 ? carouselArr.splice(0, 9) : carouselArr
      this.carousel = data
      for (let i = 0; i < data.length; i++) {
        let item = (
          <li key={i}
            onClick={()=>{this.playVideo()}}
            onMouseOver={()=>{this.changePoster(i)}}>
              {data[i][name]}
          </li>
        )
        arr.push(item)
      }
      return arr
    }
  }
  playVideo() {
    let {active} = this.state
    let {carousel} = this.props
    let item = carousel[active]

    sessionStorage.setItem('album', JSON.stringify(item));
    // let userInfoDic = JSON.parse(localStorage.getItem('userInfo'));
    console.log('需要判断');
    // if (item.pay) { //付费剧集
    //   if (userInfoDic == null) { //未登录
    //     return this.props.showLoginView();
    //   }
    //   if (!userInfoDic.isVip) {
    //     return this.props.pushPersonal();
    //   }
    // }

    if (item.ad_url !== null && typeof item.ad_url === "string") {
      return window.open(item.ad_url)
    }
    this.props.playVideo(item.id, item.vimeo_token, item.yt_id)
  }
  changePoster(i) {
    this.setState({
      active: i,
      curentSrc: this.carousel[i].landscape_poster_b,
      isPay : this.carousel[i].pay
    })
  }
  render() {
    // let {navId} = this.props
    // let cName = navId === 1 ? 'carousel-box cb' : 'carousel-box'
    let cName = 'carousel-box'
    return (
      <div className="carousel">
        <img className="carousel-img"
          onClick={()=>{this.playVideo()}}
          alt="loading..."
          src={this.state.curentSrc}/>
        <img className="calvip"
             alt="vip"
             src={bannerVIP}
             style={{'display' : this.state.isPay ? 'inline-block' : 'none'}}/>
        <ul className={cName}>
          {this.renderLists()}
        </ul>
      </div>
    );
  }
}

export default Carousel
