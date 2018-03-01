// src/components/About/index.js
import React, { Component } from 'react'
import Nav from '../Common/Nav'
import Sorry from '../Common/404'
import TabBar from '../Common/TabBar'

import store from '../utils/Storage'
import './style.css'

import api from '../api'

export default class Search extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  inputText =  ''
  state = {
    hotSearchLists: [],
    searchResultsLists: [],
    notFoundVisble: false,
    onFocus: false,
    showResult: false
  }
  componentWillMount() {
    let url = api.hot()
    fetch(url)
    .then(res => {
      return res.json()
    })
    .then(json =>{
      this.setState({
        hotSearchLists: json.results
      })
    })
    .catch(err => {
      alert("err")
    })
  }
  goToPlayer(i) {
    let {showResult, hotSearchLists, searchResultsLists} = this.state
    let arr = showResult ? searchResultsLists : hotSearchLists

    let item = arr[i]
    let id = item.vimeo_id
    let token = item.vimeo_token

    store.set('album', item)
    this.props.history.push(`/player/${id}/${token}`)
  }
  rendSearchList() {
    let { hotSearchLists, searchResultsLists, showResult } = this.state
    if(hotSearchLists.length === 0 && searchResultsLists.length === 0) return

    let arr = showResult === true ? searchResultsLists : hotSearchLists
    let hotArr = []
    for(let i = 0; i < arr.length; i++) {
      let item = (<li key={i} onClick={()=>{ this.goToPlayer(i) }}>
          <span className={`hot hot-${i+1}`} style={{'display': showResult === true ? 'none': 'inline-block'}}>{i+1}</span>
          <span className="hot-name">{arr[i].name}</span>
      </li>)
    hotArr.push(item)
    }
    return hotArr
  }
  requestSearchTrResult() {
    // input value
    if (!this.state.onFocus) {
      this.setState({onFocus: true})
    }
    this.interval = setInterval(()=>{
      let val = this.refs.input.value
      if (val === this.inputText) return
      console.log(this.inputText)
      this.inputText = val
      let url = api.search(val)
      fetch(url)
      .then(res => {
        return res.json()
      })
      .then(json => {
        let result = json.results

        if (result.length > 0) {
          this.setState({
            searchResultsLists: json.results,
            notFoundVisble: false,
            showResult: true
          })
        } else {
          this.setState({
            notFoundVisble: true
          })
        }
      })
      .catch(err => {
        alert("err")
      })
    }, 500)
  }
  cancel() {
    this.setState({
      onFocus: false,
      notFoundVisble: false,
      showResult: false,
      searchResultsLists: []
    })
  }
  tabBarItemClick (index) {
    if (index === 2) {
      return
    } else if (index === 0) {
      this.props.history.push('/');
    } else if (index === 1) {
      this.props.history.push('/channel');
    }
  }
  textBlur() {
    clearInterval(this.interval)
    this.setState({
      onFocus: false
    })
  }
  render() {
    let { notFoundVisble, onFocus } = this.state
    let flag = api.getFlag()
    let str = flag === 0 ? 'org' : 'content'
    let language = store.get('language')
    let sNav = language[10][str]
    let sName = language[11][str]
    let sCancle = language[12][str]
    let sCancleClsName = flag === 0 ? 'cancle-span' : 'cancle-span_f'
    return (
      <div className="search-container">
        <Nav navText={sName} visble={false} />

        <div className="search-box">
          <input type="search"
            ref="input"
            className="search-input"
            placeholder={sName}
            onFocus={ ()=>{ this.requestSearchTrResult() }}
            onBlur={()=>{this.textBlur()}} />
          <span className={sCancleClsName} style={{display: onFocus === true ? 'inline-block': 'none'}} onClick={()=>{this.cancel()}}>
            {sCancle}
          </span>
          <div className="search-icon"></div>
        </div>

        <ul className="searchList-box" style={{'display': notFoundVisble === true ? 'none' : 'block'}}>
          {this.rendSearchList()}
        </ul>

        <Sorry notFoundVisble={notFoundVisble} />

        <TabBar selectedIndex={2} itemClick={(e)=>this.tabBarItemClick(e)}/>
      </div>
    );
  }
}
