import React, { Component } from 'react';
import axios from 'axios';
import Nav from '../Common/Nav';
import './style.css';
import playImg from '../../images/playBtn.png'
import ReactPaginate from 'react-paginate';
import store from '../utils/Storage'
import Header from '../Common/Header'
import api from '../../api'
import otherVip from '../../images/other-VIP.png'

class Search extends Component {
  state = {
    results : [],
    totalCount : 0,//个数
    currentPageIndex : 0,//下标
    totalWitdh : 0
  }
  componentWillMount () {
    this.requestSearchWord(this.state.currentPageIndex);
  }
  fetchByID(id, genre_id) {
    this.props.history.push(`/${id}`)
  }
  goHome() {
    this.props.history.push('/')
  }
  render() {
    return (
      <div className="Search">
        <Header ref='hd'
          goHome={this.goHome.bind(this)}
          search={(e)=>this.goSearch(e)}/>
        <Nav fetchApi = {false} fetchByID={this.fetchByID.bind(this)} />
        {this.divs()}
        {this.pageSelector()}
      </div>
    );
  }
  pageSelector () {
    if (this.state.results.length === 0) return
    var width = -this.state.totalWitdh/2;
    return (
      <div className="content">
        <div style={{marginLeft:width}}>
          <ReactPaginate previousLabel={"<"}
                        nextLabel={">"}
                        breakLabel={<a href="javascript:void(0)">...</a>}
                        breakClassName={"break-me"}
                        pageCount={this.state.totalCount}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={6}
                        onPageChange={this.handlePageClick}
                        containerClassName={"pagination"}
                        pageLinkClassName={"aInPage"}
                        subContainerClassName={"pages_pagination"}
                        activeClassName={"activepage"}/>
        </div>
    </div>
    )
  }
  divs () {
    if (this.state.results.length === 0) return
    let str = api.getFlag === 0 ? 'org' : 'content'
    let lan = store.get('language')
    let dirText = lan[0][str]
    let actText = lan[1][str]
    let jqText = lan[2][str]
    let pText = lan[14][str]
    var divs = [];
    for (var i = 0; i < this.state.results.length; i++) {
      let item = this.state.results[i];
      let director = dirText + item.director;
      let cast1 = item.cast2.length > 0 ? item.cast1 + '/' : item.cast1;
      let cast2 = item.cast3.length > 0 ? item.cast2 + '/' : item.cast2;
      let cast3 = item.cast4.length > 0 ? item.cast3 + '/' : item.cast3;
      let actor = actText + cast1 + cast2 + cast3 + item.cast4;
      let description = item.description;
      divs.push(
        <div className="cellContent" key={i}>
          <img className="poster" src={item.portrait_poster} alt='img'/>
          <img className="vipImg"
               alt="vip"
               src={otherVip}
               style={{'display' : item.pay ? 'inline-block' : 'none'}}/>
          <div className="rightContent">
            <span className="span_videoName">{item.name}</span>
            <div className="lineTwo">
              <span className="span_director">{director}</span>
              <span className="span_actor">{actor}</span>
            </div>
            <div className="lineThree">
              <span className="span_description_left">{jqText}</span>
              <span className="span_description">{description}</span>
            </div>
            <div className="playBtn" onClick={()=>this.goToPlayer(item)}>
              <img src={playImg} alt="playBtn"/>
              <span>{pText}</span>
            </div>
          </div>
          <div className="line"></div>
        </div>
      )
    }
    return divs;
  }
  goToPlayer (item) {
    console.log(item);

    let userInfoDic = JSON.parse(localStorage.getItem('userInfo'));
    if (item.pay) { //付费剧集
      if (userInfoDic == null) { //未登录
        return this.refs.hd.showLoginView();
      }
      if (!userInfoDic.isVip) {
        return this.props.history.push(`/pay/p`)
      }
    }
    store.set('album',item);
    var path = `/player/${item.id}`
    this.props.history.push(path);
  }
  requestSearchWord (index) {
    let page = index+1;
    let url = api.search(this.props.match.params.word, page)
    // var url = `http://47.93.83.7:8000/albums/?search=${this.props.match.params.word}&page=${page}&page_size=10`;
    axios.get(url)
    .then(res =>{
      if (res.data.results.length === 0) {
        console.log('没有搜索内容，需要返回noresult');
      } else {
        let count = Math.floor(res.data.count/10) + 1;
        this.setState({
          totalCount : count,
          results : res.data.results,
        })
        this.getTotalWidth(count);
      }
    })
    .catch(err =>{
      console.log(err)
    })
  }
  handlePageClick = (data) => {
    let selected = data.selected;
    let maxIndex = this.state.totalCount - 1;
    var sum ;
    if (selected<4) {
      sum = 9
    } else if (selected === 4) {
      sum = 10
    } else if (2 < maxIndex-selected && maxIndex-selected <= 4) {
      sum = (maxIndex-selected+1)+5
    } else if (maxIndex-selected <= 2) {
      sum = 8
    } else {
      sum = 11;
    }
    if (maxIndex<=8) {
      sum = this.state.totalCount;
    }
    if (maxIndex ===8 && selected>=6) {
      sum = 8
    }
    this.setState({
      currentPageIndex : selected ,
      totalWitdh : (sum+2)*45
    })
    //请求数据
    this.requestSearchWord(selected);
  }
  getTotalWidth (count) {
    let selected = 0;
    let maxIndex = count - 1;
    var sum ;
    if (selected<4) {
      sum = 9
    } else if (selected === 4) {
      sum = 10
    } else if (2 < maxIndex-selected && maxIndex-selected <= 4) {
      sum = (maxIndex-selected+1)+5
    } else if (maxIndex-selected <= 2) {
      sum = 8
    } else {
      sum = 11;
    }
    if (maxIndex<=8) {
      sum = count;
    }
    if (maxIndex ===8 && selected>=6) {
      sum = 8
    }
    this.setState({
      totalWitdh : (sum+2)*45
    })
  }
  goSearch (keyword) {
    if (keyword.length === 0) return;
    let page = 1;
    let url = api.search(keyword, page)
    axios.get(url)
    .then(res =>{
      if (res.data.results.length === 0) {
        console.log('没有搜索内容，需要返回noresult');
      } else {
        let count = Math.floor(res.data.count/10) + 1;
        this.setState({
          totalCount : count,
          results : res.data.results,
        })
        this.getTotalWidth(count);
      }
    })
    .catch(err =>{
      console.log(err)
    })
    // var path = `/search/${keyword}`
    // this.props.history.push(path);
  }
}

export default Search
