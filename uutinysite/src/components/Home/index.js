import React from 'react';
import './App.css';
import fetch from 'isomorphic-fetch';
import Lunbo from '../Common/Carouse';
import TabBar from '../Common/TabBar';
import store from '../utils/Storage'
import Loader from '../Common/Loader';
import api from "../api";

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current_home_index : 0,
      top_category_selectedIndex : 0,
      nav_genres : {},
      carousel_data : {},
      content_data : {},
      carouselObj: {},
      isLoading : true,
    }
  }
  render() {
      // if (this.state.isLoading) {
      //   return ( <Loader visble={true}/> )
      // } else {
        return (
          <div>
            {/* <!-- 顶部滑动button --> */}
            <div className="outer_nav_scroll">
              <div className="inner_nav_scroll">
                <div className="nav_scroll_content">
                  {this.navButtons()}
                </div>
              </div>
            </div>
            {/* 轮播图 */}
            {this.carousel()}
            {/* <!-- 类tableView部分 --> */}
            <div className="mainContent">{this.content()}</div>
            <TabBar selectedIndex={0} itemClick={(e)=>this.tabBarItemClick(e)}/>
            <Loader visble={this.state.isLoading}/>
          </div>
        );
      // }
  }
  navButtons () {
    if (this.state.nav_genres.length === undefined) return
    var buttons = [];
    for (var i = 0; i < this.state.nav_genres.length; i++) {
      var item = this.state.nav_genres[i];
      let id = item.id;
      let index = i;
      if (this.state.top_category_selectedIndex === i) {
        buttons.push(
          <button className="buttonSelected" type="button" key={i} onClick={()=>this.categoryBtnClick(id,index)}>
            {item.name}
          </button>
        )
      } else {
        buttons.push(
          <button type="button" key={i} onClick={()=>this.categoryBtnClick(id,index)}>
            {item.name}
          </button>
        )
      }
    }
    return buttons;
  }
  carousel () {
    if (this.state.carousel_data.length === undefined) return
    let data = [];
    for (var i = 0; i < this.state.carousel_data.length; i++) {
      let item = this.state.carousel_data[i];
      data.push({
        'src' : item.landscape_poster_s,
        'id' : item.id.toString(),
      })
    }
    return (  <Lunbo carouselObj={data} array={this.state.carousel_data} goToPlayer={this.goToPlayer.bind(this)} handleItemClick={this.handleItemClick} /> )
  }
  content () {
    if (this.state.content_data.length === undefined) return
    var contentView = [];
    for (var i = 0; i < this.state.content_data.length; i++) {
      let array = this.state.content_data[i];
      if (array.data !== undefined) {
        if (i > 0) {
          contentView.push(
            <div id="home_content" key={i}>
              <div key={i} className="graySection"></div>
              <div className="section_header" key={i*10} onClick={()=>this.sectionHeaderClick(array.genre_id,array.name)}>
                <span>{array.name}</span>
                <span className="arrow">></span>
              </div>
              <div className="content_div">
                {this.cell(array)}
              </div>
            </div>
          )
        } else {
          contentView.push(
            <div id="home_content" key={i}>
              <div className="section_header" key={i*10} onClick={()=>this.sectionHeaderClick(array.genre_id,array.name)}>
                <span>{array.name}</span>
                <span className="arrow">></span>
              </div>
              <div className="content_div">
                {this.cell(array)}
              </div>
            </div>
          )
        }
      }
    }
    return contentView;
  }
  cell (array) {
    var cells = [];
    var data = [];
    if (array.data.length%2 === 1) {
      array.data.pop()
    }
    data = array.data;
    for (var i = 0; i < data.length; i++) {
      if (i < 6) {
        let item = data[i];
        cells.push(
          <div className="content_cell" key={i} onClick={()=>this.pushPlayer(item)}>
            <img src={item.landscape_poster_s} alt="img"/>
            <span>{item.name}</span>
          </div>
        )
      }
    }
    return cells;
  }
  tabBarItemClick (index) {
    if (index === 0) {
      return
    } else if (index === 1) {
      this.props.history.push('/channel');
    } else if (index === 2) {
      this.props.history.push('/search');
    }
  }
  //区块头部点击事件
  sectionHeaderClick (genre_id,category_name) {
    console.log(genre_id,category_name);
    var data = {genreID:genre_id, categoryName:category_name}
    data = JSON.stringify(data);
    var path = `/list/${data}`
    this.props.history.push(path);
  }
  // navButton点击事件
  categoryBtnClick (categoryID,selectedIndex) {
    if (this.state.top_category_selectedIndex === selectedIndex) return ;
    this.setState({
      current_home_index : categoryID,
      top_category_selectedIndex : selectedIndex,
      carousel_data: {},
    })
    this.requestCurrentHomePageData(categoryID,selectedIndex);
    // this.props.history.push('/about/1');
    // this.props.history.push('/player');
    // this.props.history.push('../Channel/');
  }
  // 轮播图点击事件
  handleItemClick(index,href,event) {
    let item = this.array[index];
    this.goToPlayer(item);
  }
  pushPlayer(item) {
    this.goToPlayer(item);
  }
  goToPlayer(item) {
    let id = item.vimeo_id
    let token = item.vimeo_token

    store.set('album', item)
    this.props.history.push(`/player/${id}/${token}`)
  }
  // 生命周期
  componentWillMount () {
    this.requestGenresData();
  }

  requestGenresData () {
    let gerID = this.props.match.params.id
    let url = api.home()
    fetch(url)
    .then((response)=>{
      return response.json();
    })
    .then((jsonData)=>{
      store.set('language', jsonData.language)
      this.setState({
        nav_genres: jsonData.genres,
        isLoading : true,
      })
      let navBtnSelectedIndex;
      for (var i = 0; i < jsonData.genres.length; i++) {
        let item = jsonData.genres[i];
        if (item.id == gerID) {
          navBtnSelectedIndex = i
          break;
        } else {
          navBtnSelectedIndex = 0;
        }
      }
      let currentIndex;
      if (gerID) {
        currentIndex = this.props.match.params.id
      } else {
        let currentDic = jsonData.genres[this.state.current_home_index];
        currentIndex = currentDic.id;
      }
      this.requestCurrentHomePageData(currentIndex,navBtnSelectedIndex);
    })
    .catch((error)=>{
      console.log('获取首页第一个接口错误：'+error);
    })
  }
  requestCurrentHomePageData (currentSelectedID,navBtnSelectedIndex) {
    this.setState({
      isLoading : true,
    })
    let url = api.genres(currentSelectedID)
    // var url = 'http://cdn.100uu.tv/genres/' + currentSelectedID + '/?format=json&platform=mobile';
    fetch(url)
    .then((response)=>{
      return response.json();
    })
    .then((jsonData)=>{
      this.setState({
        carousel_data : (jsonData.carousel.length >=5 ? jsonData.carousel.slice(0,4) : jsonData.carousel),
        content_data : jsonData.data,
        isLoading : false,
        top_category_selectedIndex : navBtnSelectedIndex
      })
    })
    .catch((error)=>{
      console.log('获取首页第二个接口错误'+error);
    })
  }
}

export default Home;
