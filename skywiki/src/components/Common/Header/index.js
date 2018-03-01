import React, { Component } from 'react';
import './style.css';
import logo from '../../../images/logo.png'
import seachIcon from '../../../images/h-search.png'
import loginNormal from '../../../images/loginNormal.png'
import loginSelected from '../../../images/loginSelected.png'
import LoginView from '../LoginView'

class Header extends Component {
  state = {
    isVisible : false,
    didLogin : false
  }
  goHome() {
    if(this.props.goHome) {
      this.props.goHome()
    }
  }
  goPersonal() {
    if(this.props.goPersonal) {
      this.props.goPersonal()
    }
  }
  render() {
    return (
      <div className="Header">
        <img className="h-logo" src={logo} alt="not found"/>
        <input type="search" className="search" ref="searchword"/>
        <img className="search-img"
          alt="not found"
          src={seachIcon}
          onClick={()=>this.goToSearch()}/>
        <img className={this.state.didLogin ? "home_haveLogin" : "didNotLogin"}
          alt="not found"
          src= {this.state.didLogin ? loginSelected : loginNormal}
        />
        {/* <div className="h-logo_s" onClick={()=>{this.goHome()}}></div> */}
        {this.renderButton()}
        {this.renderExitBtn()}
        <LoginView isVisible={this.state.isVisible} hideView={()=>this.hideView()} getUserName={this.getUserName.bind(this)}/>
      </div>
    );
  }
  componentWillMount(){
    let userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.setState({
        didLogin : true
      })
    }
  }
  getUserName () {
    this.setState({
      didLogin : true
    })
  }
  renderButton () {
    if (this.state.didLogin) {
      let dic = JSON.parse(localStorage.getItem('userInfo'));
      let name = dic.userName;
      return (
        <button className="home_userNameTitle" onClick={this.goPersonal.bind(this)}>{name}</button>
      )
    } else {
      return (
        <button className="loginTitle" onClick={()=>{this.showLoginView()}}>登录/注册</button>
      )
    }
  }
  renderExitBtn() {
    if (this.state.didLogin) {
      return (
        <sapn className="home_exitBtn" onClick={this.removeUserInfo.bind(this)}>退出</sapn>
      )
    }
  }
  removeUserInfo() {
    localStorage.removeItem('userInfo');
    this.setState({
      didLogin : false
    })
  }
  showLoginView () {
    this.setState({
      isVisible : true
    })
    // document.getElementById("App").scrolling="no";
  }
  hideView () {
    this.setState({
      isVisible : false
    })
  }
  goToSearch () {
    let word = this.refs.searchword.value;
    // this.props.history.push(`/search/${word}`)
    this.props.search(word);
  }
}

export default Header
