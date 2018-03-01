// src/components/About/index.js
import React, { Component } from 'react';
import './style.css';
import Nav from '../Common/Nav'
import store from '../utils/Storage'
import Loader from '../Common/Loader';
import api from '../api'
// React.PropTypes is deprecated since React 15.5.0, use the npm module prop-types instead
export default class List extends Component {
  static propTypes = {}
  static defaultProps = {}
  state = {}
  constructor(props) {
    super(props)
    this.state = {
      content_data : [],
      page : 1,
      totalPage : 100,
      isLoading : true,
    }
  }
  render() {
    // const { className, ...props } = this.props;
    return (
      <div className="list-box">
        {this.nav()}
        <div className="bigDiv" ref="scrollDiv">{this.content()}</div>
        <Loader visble={this.state.isLoading}/>
      </div>
    );
  }
  nav () {
    var data = JSON.parse(this.props.match.params.data);
    // var {genreID,categoryName} = data;
    var { categoryName } = data;
    return <Nav navText={categoryName} back={()=>this.goback()} visble={true}/>
  }
  content () {
    if (this.state.content_data.length === 0) return
    let array = [];
    for (var i = 0; i < this.state.content_data.length; i++) {
      let item = this.state.content_data[i];
      array.push(
        <div className="content_cell" key={i} onClick={()=>{this.goToPlayer(item)}}>
          <img src={item.landscape_poster_s} alt="img"/>
          <span>{item.name}</span>
        </div>
      )
    }
    return array;
  }
  goToPlayer (item) {
    let id = item.vimeo_id
    let token = item.vimeo_token

    store.set('album', item)
    this.props.history.push(`/player/${id}/${token}`)
  }
  onScrollHandle(event) {
    const clientHeight = event.target.clientHeight
    const scrollHeight = event.target.scrollHeight
    const scrollTop = event.target.scrollTop
    const isBottom = (clientHeight + scrollTop === scrollHeight)
    if (isBottom) {
      let currentPage = this.state.page + 1;
      if (currentPage > this.state.totalPage) return;
      this.setState({
        page : currentPage
      })
      this.requestData(currentPage);
    }
  }
  componentDidMount() {
    let node = this.refs.scrollDiv;
    node.addEventListener('scroll', this.onScrollHandle.bind(this));
  }
  componentWillMount () {
    this.requestData(this.state.page);
  }
  requestData (page) {
    this.setState({
      isLoading : true
    })
    var data = JSON.parse(this.props.match.params.data);
    var { genreID } = data;
    let url = api.albums(genreID, page, 20)
    // let url = `http://cdn.100uu.tv/albums/?genre=${genreID}&format=json&platform=mobile&page=${page}&page_size=20`;
    fetch(url)
    .then((response)=>{
      return response.json();
    })
    .then((jsonData)=>{
      var data = [];
      if (jsonData.results.length%2 === 1 ) {
        jsonData.results.pop();
      }
      data = this.state.content_data.concat(jsonData.results);
      this.setState({
        content_data : data,
        totalPage : Math.ceil(jsonData.count/20),
        isLoading : false
      })
    })
    .catch((error)=>{
      console.log('获取列表页失败：'+error);
    })
  }
  goback () {
    this.props.history.goBack();
  }
}
