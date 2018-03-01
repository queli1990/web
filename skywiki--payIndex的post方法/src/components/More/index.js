import React, { Component } from 'react'
import Nav from '../Common/Nav'
import Carousel from '../Common/Carousel'
import ReactPaginate from 'react-paginate'
import Header from '../Common/Header'
import store from '../utils/Storage'
import axios from 'axios';
import api from '../../api'
import './style.css';

class More extends Component {
  state = {
    navVisble: false,
    carousel: [],
    moreLists: [],
    categories: [],
    total: 0,
    currentId: 0
  }
  componentWillMount() {
    let {id} = this.props.match.params
    if (id === "undefined") {
      return this.fetchAlbums(`http://47.52.34.173:998/albums/?format=json`)
    }
    this.setState({
      currentId: id
    }, ()=>{
      this.fetchCategories()
      let url = api.albums(this.state.currentId, 1, 33)
      this.fetchAlbums(url)
    })
  }
  fetchAlbums(url) {
    axios.get(`${url}`)
    .then(res =>{
      let {id} = this.props.match.params
      // let cal = id === "undefined" ? [] : res.data.results.splice(0, 9)
      let cal = res.data.results.splice(0, 9)
      this.setState({
        total: Math.ceil(res.data.count / 33),
        carousel: cal,
        moreLists: res.data.results
      }, ()=>{
      })
    })
    .catch(err =>{
      console.log(err)
    })
  }
  fetchCategories() {
    let {genre_id} = this.props.match.params
    let url = api.categories(genre_id)
    axios.get(url)
    .then(res =>{
      this.setState({
        categories: res.data.results,
      }, ()=>{
      })
    })
    .catch(err =>{
      console.log(err)
    })
  }
  fetchByID(id, genre_id){
    this.props.history.push(`/${id}`)
  }
  changeCategories(i) {
    let { id } = this.state.categories[i]

    this.setState({
      currentId: id
    }, () =>{
      let url = api.albums(this.state.currentId, 1, 33)
      this.fetchAlbums(url)
    })
  }
  renderNav() {
    let {navVisble} = this.state
    if (navVisble) {
      return (
        <Nav
          showNav = {this.showNav.bind(this)}
          listenMouse={true}
          fetchApi = {false}
          small={true}
          fetchByID={this.fetchByID.bind(this)} />
      )
    }
  }
  renderCarousel() {
    return (
      <Carousel
        playVideo={this.playVideo.bind(this)}
        carousel={this.state.carousel} />
    )
    // if (this.state.carousel.length > 0) {
    //   return (
    //     <Carousel
    //       playVideo={this.playVideo.bind(this)}
    //       carousel={this.state.carousel} />
    //   )
    // }
  }
  renderCategories() {
    let {categories} = this.state
    if (categories.length === 0) return
    let arr = []
    for(let i = 0; i < categories.length; i++) {
      let item = (
        <li key={i}
          onClick={()=>{this.changeCategories(i)}}>
            {categories[i].name}
          </li>
      )
      arr.push(item)
    }
    return arr
  }
  renderMoreLists() {
    let {moreLists} = this.state
    let name = api.getFlag() === 0 ? 'name' : 'en_name'
    if (moreLists.length === 0) return
    let arr = []
    for(let i = 0; i < moreLists.length; i++) {
      let item = (
        <figure key={i} onClick={()=>{this.play(i)}}>
          <img src={moreLists[i].portrait_poster_m} alt="not found"/>
          <figcaption>{moreLists[i][name]}</figcaption>
          <div className={moreLists[i].pay ? 'morevip': ''}></div>
        </figure>
      )
      arr.push(item)
    }
    return arr
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
  play(i) {
    let {moreLists} = this.state
    store.set('album', moreLists[i])
    
    let ad_url = moreLists[i].ad_url
    if (ad_url !== null && typeof ad_url === "string" ) {
      return window.open(ad_url)
    }
    this.playVideo(moreLists[i].id, moreLists[i].vimeo_token, moreLists[i].yt_id)
  }
  playVideo(id, token, yt_id) {
    if (id === undefined) {
      return  this.props.history.push(`/ytplayer/${yt_id}`)
    }
    this.props.history.push(`/player/${id}`)
  }
  handlePageClick(data) {
    let index = data.selected + 1
    let url = api.albums(this.state.currentId, index, 33)
    this.fetchAlbums(url)
  }
  goHome() {
    this.props.history.push('/')
  }
  render() {
    let str = api.getFlag() === 0 ? 'org' : 'content'
    let lan = store.get('language')
    let homeText = lan[8][str]
    let channelText = lan[9][str]
    return (
      <div className="more">
        <Header search={(e)=>this.goSearch(e)} goHome={this.goHome.bind(this)}/>
        <div className="moreHeader">
          <span className="more-home" onClick={()=>{this.goHome()}}>{homeText}</span>
          <span className="more-channel"
            onMouseOut={()=>{this.showNav(false)}}
            onMouseOver={()=>{this.showNav(true)}} >
              {channelText}
            </span>
        </div>

        {this.renderNav()}
        {this.renderCarousel()}

        <ul className="categories">{this.renderCategories()}</ul>
        <div className="moreLists">
          {this.renderMoreLists()}
        </div>
        
        <div className="paging">
          <ReactPaginate previousLabel={"<"}
                        nextLabel={">"}
                        breakLabel={ <a href="javascript:void(0)">...</a> }
                        breakClassName={"break-me"}
                        pageCount={this.state.total}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={6}
                        onPageChange={this.handlePageClick.bind(this)}
                        containerClassName={"pagination justify-content-center"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"} />
        </div>
      </div>
    );
  }
  goSearch (keyword) {
    if (keyword.length === 0) return;
    var path = `/search/${keyword}`
    this.props.history.push(path);
  }
}

export default More
