import React, { Component } from 'react';
import './style.css';
import xImg from '../../../images/x.png'
import userNameNormal from '../../../images/userNameNormal.png'
import userNameSelected from '../../../images/userNameSelected.png'
import userPwdNormal from '../../../images/userPwdNormal.png'
import userPwdSelected from '../../../images/userPwdSelected.png'
import tool from './PostUserData'


class LoginView extends Component {
  state = {
    allInputLength : false,
    showLogin : true
  }
  render () {
    if (this.state.showLogin) { //登录页面
      return (
        <div className="shadowView" style={{'display':this.props.isVisible === true ? 'block' : 'none'}}>
          <div className="login_border">
            {/* <div className="panel"> */}
              <img className="backBtn"
                alt="not found"
                src={xImg}
                onClick={this.hideCurrentView.bind(this)}
              />
              <span className="loginViewTitle">登录</span>
              <div className="user-pwd">
                <img ref="nameImg" src={userNameNormal} alt='用户名'/>
                <input ref="uName" onChange={this.uNameChange.bind(this)} type="text" placeholder="请输入邮箱地址"></input>
              </div>
              <div className="user-pwd" style={{top:'161px'}}>
                <img ref="pwdImg" src={userPwdNormal} alt='密码'/>
                <input ref="uPwd" onChange={this.pwdChange.bind(this)} type="text" placeholder="请输入用密码"></input>
              </div>
              <span className="forgetPwd" onClick={this.forgetPwd.bind(this)}>忘记密码</span>
              <button style={this.state.allInputLength ? {'backgroundColor' : '#FF8000'} : {'backgroundColor' : '#CCCCCC'}} className="loginBtn" onClick={this.loginMethod.bind(this)}>登录</button>
              <span className="leftBlackTitle">没有账号?</span>
              <span className="orangeTitle" onClick={this.showRegistView.bind(this)}>立即注册</span>
            </div>
          {/* </div> */}
        </div>
      )
    } else { //注册页面
      return (
        <div className="shadowView" style={{'display':this.props.isVisible === true ? 'block' : 'none'}}>
          <div className="regist_border">
            <img className="backBtn"
              alt="not found"
              src={xImg}
              onClick={this.hideCurrentView.bind(this)}
            />
            <span className="loginViewTitle">注册</span>
            <div className="user-pwd">
              <img ref="nameImg" src={userNameNormal} alt='用户名'/>
              <input ref="registName" onChange={this.uNameChange.bind(this)} type="text" placeholder="请输入您的邮箱地址"></input>
            </div>
            <div className="user-pwd" style={{top:'161px'}}>
              <img ref="pwdImg" src={userPwdNormal} alt='密码'/>
              <input ref="registPwd" onChange={this.pwdChange.bind(this)} type="text" placeholder="请输入用密码"></input>
            </div>
            <div className="user-pwd" style={{top:'217px'}}>
              <img ref="rePwdImg" src={userPwdNormal} alt='密码'/>
              <input ref="registRepwd" onChange={this.rePwdChange.bind(this)} type="text" placeholder="请再次输入用密码"></input>
            </div>
            <button onClick={this.registMethod.bind(this)} disabled={this.state.allInputLength ? "" : "disabled"} style={this.state.allInputLength ? {'background-color' : '#FF8000'} : {'background-color' : '#CCCCCC'}} className={this.state.allInputLength ? "registBtn-allow" : "registBtn-forbid"}>注册</button>
            <sapn className="regist_agree">点击注册表示同意</sapn>
            <span className="regist_protocol">《优优TV用户服务协议》</span>
            <span className="haveAccount">我有账号！</span>
            <span className="backLogin" onClick={this.showLoginView.bind(this)}>立即登录</span>
          </div>
        </div>
      )
    }
  }
  loginMethod () {
    var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    if (!reg.test(this.refs.uName.value)) {
      alert('请输入合法的邮箱地址');
      return;
    }
    if (this.refs.uPwd.value.length < 6 ) {
      alert('请输入6位以上的密码');
      return;
    }
    let nameStr = this.refs.uName.value;
    let pwdStr = this.refs.uPwd.value;
    let _this = this;
    tool.login(nameStr,pwdStr,()=>{
      _this.hideCurrentView();
      _this.props.getUserName();
    });
  }
  registMethod () {
    var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    if (!reg.test(this.refs.registName.value)) {
      alert('请输入合法的邮箱地址');
      return;
    }
    if (this.refs.registPwd.value.length < 6 ) {
      alert('请输入6位以上的密码');
      return;
    }
    if (this.refs.registPwd.value !== this.refs.registRepwd.value) {
      alert('两次输入密码不一致');
      return ;
    }
    let nameStr = this.refs.registName.value;
    let pwdStr = this.refs.registPwd.value;
    let _this = this
    tool.regist(nameStr,pwdStr, ()=>{
      _this.hideCurrentView()
    });
  }
  forgetPwd() {
    var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    if (!reg.test(this.refs.uName.value)) {
      alert('请输入合法的邮箱地址');
      return;
    }
    let _this = this;
    tool.forgetPwd(this.refs.uName.value);
  }
  hideCurrentView () { //将当前的浮层隐藏
    this.clear();
    this.setState({
      showLogin : true,
      allInputLength : false
    })
    this.props.hideView();
  }
  clear () { //清除当前的input的值和回复默认图片
    if (this.state.showLogin) { //登录页面
      this.refs.uName.value = "";
      this.refs.uPwd.value = "";
      let nameImgNode = this.refs.nameImg;
      nameImgNode.setAttribute("src",userNameNormal);
      let pwdImgNode = this.refs.pwdImg;
      pwdImgNode.setAttribute("src",userPwdNormal);
    } else { //注册页面
      this.refs.registName.value = "";
      this.refs.registPwd.value = "";
      this.refs.registRepwd.value = "";
      let nameImgNode = this.refs.nameImg;
      nameImgNode.setAttribute("src",userNameNormal);
      let pwdImgNode = this.refs.pwdImg;
      pwdImgNode.setAttribute("src",userPwdNormal);
    }
  }
  showRegistView () {
    this.clear();
    this.setState({
      showLogin : false,
      allInputLength : false
    })
  }
  showLoginView () {
    this.clear();
    this.setState({
      showLogin : true,
      allInputLength : false
    })
  }
  uNameChange (event) {
    // console.log(event.target.value);
    let node = this.refs.nameImg;
    if (event.target.value.length > 0) {
      node.setAttribute("src",userNameSelected);
    } else {
      node.setAttribute("src",userNameNormal);
    }
    this.shouldChangeLoginBtnBackgroundColor();
  }
  pwdChange (event) {
    let node = this.refs.pwdImg;
    if (event.target.value.length > 0) {
      node.setAttribute("src",userPwdSelected);
    } else {
      node.setAttribute("src",userPwdNormal);
    }
    this.shouldChangeLoginBtnBackgroundColor();
  }
  rePwdChange (event) {
    let node = this.refs.rePwdImg;
    if (event.target.value.length > 0) {
      node.setAttribute("src",userPwdSelected);
    } else {
      node.setAttribute("src",userPwdNormal);
    }
    this.shouldChangeLoginBtnBackgroundColor();
  }
  shouldChangeLoginBtnBackgroundColor () {
    if (this.state.showLogin) { //登录页面
      let userNameInput = this.refs.uName;
      let pwdInput = this.refs.uPwd;
      if (userNameInput.value.length > 0 && pwdInput.value.length > 0) {
        this.setState ({
          allInputLength : true
        })
      } else {
        this.setState ({
          allInputLength : false
        })
      }
    } else { //注册页面
      let userNameInput = this.refs.registName;
      let pwdInput = this.refs.registPwd;
      let rePwdInput = this.refs.registRepwd;
      if (userNameInput.value.length > 0 && pwdInput.value.length > 0 && rePwdInput.value.length > 0) {
        this.setState ({
          allInputLength : true
        })
      } else {
        this.setState ({
          allInputLength : false
        })
      }
    }
  }

}

export default LoginView
