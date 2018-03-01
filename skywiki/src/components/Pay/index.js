import React, { Component } from 'react';
import './style.css';
import logo from '../../images/logo.png'
import loginSelected from '../../images/loginSelected.png'
import wechatPublic from '../../images/wechatPublic.png'
import continuePay from '../../images/continuePay.png'
import packagesSelectedImg from '../../images/packagesSelected.png'
import axios from 'axios';
import api from '../../api'
import logo0 from '../../images/payalLogo.png'
import logo1 from '../../images/wechatLogo.png'
import logo2 from '../../images/alipayLogo.png'
import md5 from 'md5'
import QRCode from 'qrcode.react'

class Pay extends Component {
  // constructor () {
  //   super();
  //   this.changePackages = this.changePackages.bind(this)
  // }
  imagepath = [logo0, logo1, logo2];
  userInfoDic = JSON.parse(localStorage.getItem('userInfo'));
  state = {
    packages : [],
    payWays : [],
    packagesSelected : 1,
    payWaysSelected : 1,
    payLinkObj1 : [],
    payLinkObj2 : [],
    payLinkObj3 : []
  }
  componentWillMount() {
    let url = api.getPayUrl();
    let _this = this;
    axios(url)
    .then ((response)=>{
      this.setState({
        packages : response.data.packages,
        payWays : response.data.payWays
      })
      _this.fetchPayLink(_this.state.packagesSelected-1)
    })
    .catch(err =>{
      console.log(err)
    })
  }
  componentDidMount() {
    document.getElementsByClassName('footer')[0].style.marginTop = "0px"
  }
  // 创建订单
  fetchPayLink(i) {
    if (i == 0) { //为了不重复创建订单，加入的判断条件
      if (this.state.payLinkObj1.orderNo != undefined) {
        this.changePayWayLink();
        return
      }
    } else if(i == 1) {
      if (this.state.payLinkObj2.orderNo != undefined) {
        this.changePayWayLink();
        return
      }
    } else {
      if (this.state.payLinkObj3.orderNo != undefined) {
        this.changePayWayLink();
        return
      }
    }
    let packageId = this.state.packages[this.state.packagesSelected-1].packageId;
    let paywayId = this.state.payWays[this.state.payWaysSelected-1].payId;
    let platform = 'web-pc';
    let channel = 'uu100';
    let combinStr = this.userInfoDic.token+packageId+paywayId+platform+channel;
    let md5Str = md5(combinStr);
    let url = `http://api.100uu.tv/app/order/doPayment.do?token=${this.userInfoDic.token}&packageId=${packageId}&paywayId=${paywayId}&platform=${platform}&channel=${channel}&sign=${md5Str}`
    let num = i, _this = this;
    axios(url)
    .then((res)=>{
      if (num == 0) { //为了不重复创建订单，加入的判断条件
        _this.setState({
          payLinkObj1 : res.data
        })
      } else if(num == 1) {
        _this.setState({
          payLinkObj2 : res.data
        })
      } else {
        _this.setState({
          payLinkObj3 : res.data
        })
      }
    })
    .catch(err =>{
      console.log(err);
    })
  }
  // 修改订单支付方式
  changePayWayLink() {
    this.checkOrderIsPay();
    let orderNo ,payID;
    if (this.state.packagesSelected == 1) {
      orderNo = this.state.payLinkObj1.orderNo;
    } else  if(this.state.packagesSelected == 2){
      orderNo = this.state.payLinkObj2.orderNo;
    } else if (this.state.packagesSelected == 3) {
      orderNo = this.state.payLinkObj3.orderNo;
    }
    let paywayId = this.state.payWays[this.state.payWaysSelected-1].payId;
    let combinStr = md5(this.userInfoDic.token + orderNo + this.state.payWaysSelected + 'web');
    let url = `http://api.100uu.tv/app/order/doRepay.do?token=${this.userInfoDic.token}&orderNo=${orderNo}&paywayId=${paywayId}&platform=web&sign=${combinStr}`
    let _this = this;
    axios(url)
    .then((res)=>{
      if (_this.state.packagesSelected == 1) { //为了不重复创建订单，加入的判断条件
        _this.setState({
          payLinkObj1 : res.data
        })
      } else if(_this.state.packagesSelected == 2) {
        _this.setState({
          payLinkObj2 : res.data
        })
      } else {
        _this.setState({
          payLinkObj3 : res.data
        })
      }
    })
    .catch(err=>{
      console.log(err);
    })
  }
  render () {
    return (
      <div style={{"background" : "#CCCCCC"}}>
        <div className="Header">
          <img className="h-logo" src={logo} alt="not found"/>
          <img className="haveLogin"
            alt="not found"
            src= {loginSelected}
          />
          {this.renderButton()}
          <sapn className="exitBtn" onClick={()=>this.goHome()}>退出</sapn>
        </div>
        <span className="personalTitle">个人中心</span>
        {this.userInfoView()}
        {this.renderPayWaysView()}
        <div className="bottomView"></div>
      </div>
    )
  }
  renderPayWaysView() {
    return (
      <div className="payBoard">
        <div className="continuePay">
          <img alt="立即续费" src={continuePay}/>
          <span>立即续费</span>
        </div>
        <div className="priceView">
          {this.renderPackages()}
        </div>
        <p className="payBoard_title">支付方式</p>
        <div className="payWaysView">
          <div className="left">
            {this.renderPayWaysLeft()}
          </div>
          <div className="right">
            {this.renderPayWaysRight()}
          </div>
        </div>
      </div>
    )
  }
  renderPayWaysRight() {
    let {payWays} = this.state;
    if (this.state.packages.length === 0) return;
    if (this.state.payWaysSelected === 1) {
      let currency = this.state.packages[this.state.packagesSelected-1].symbol;
      let price = this.state.packages[this.state.packagesSelected-1].sellPrice;
      let paypalURL ;
      if (this.state.packagesSelected == 1) {
        paypalURL = this.state.payLinkObj1.url;
      } else if (this.state.packagesSelected == 2) {
        paypalURL = this.state.payLinkObj2.url;
      } else if (this.state.packagesSelected == 3) {
        paypalURL = this.state.payLinkObj3.url;
      }
      return (
        <div className="rightPayPalContent">
          <img style={{'float':'left','width':'160px','height':'80px'}} src={this.state.payWays[0].payway_logo}/>
          <div className="paypalTitle">
            <span style={{'display':'inline-block','marginTop':'28px','marginLeft':'3.9%','fontSize':'22px','color':'#4A4A4A'}}>支付:</span>
            <span style={{'fontSize':'22px','color':'#FF8000'}}>{currency}{price}</span>
          </div>
          <a href={paypalURL} style={{'textDecoration': 'none'}} target="_blank" onClick={this.checkOrderIsPay.bind(this)}>使用PayPal支付</a>
        </div>
      )
    } else if (this.state.payWaysSelected === 2) { //返回二维码
      let url ;
      if (this.state.packagesSelected == 1) {
        url = 'http://paysdk.weixin.qq.com/example/qrcode.php?data='+this.state.payLinkObj1.url;
      } else if (this.state.packagesSelected == 2) {
        url = 'http://paysdk.weixin.qq.com/example/qrcode.php?data='+this.state.payLinkObj2.url;
      } else if (this.state.packagesSelected == 3) {
        url = 'http://paysdk.weixin.qq.com/example/qrcode.php?data='+this.state.payLinkObj3.url;
      }
      let currency = this.state.packages[this.state.packagesSelected-1].symbol;
      let price = this.state.packages[this.state.packagesSelected-1].sellPrice;
      return (
        <div className="wechatPay">
          <img src={url}/>
          <div className="wechatPayTitle">
            <p><span>微信扫码支付：</span><span>{currency}{price}</span></p>
            <p>打开手机端微信扫一扫</p>
          </div>
        </div>
      )
    } else {
      let currency = this.state.packages[this.state.packagesSelected-1].symbol;
      let price = this.state.packages[this.state.packagesSelected-1].sellPrice;
      let aliQRCode;
      if (this.state.packagesSelected == 1) {
        aliQRCode = this.state.payLinkObj1.url;
      } else if (this.state.packagesSelected == 2) {
        aliQRCode = this.state.payLinkObj2.url;
      } else if (this.state.packagesSelected == 3) {
        aliQRCode = this.state.payLinkObj3.url;
      }
      return (
        <div className="wechatPay">
          <div className="payQRCode">
            <QRCode
              value={aliQRCode}
              size={150}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
            />
          </div>
          <div className="wechatPayTitle">
            <p><span>支付宝扫码支付：</span><span>{currency}{price}</span></p>
            <p>打开手机端支付宝扫一扫</p>
          </div>
        </div>
      )
    }
  }
  renderPayWaysLeft() {
    let {payWays} = this.state;
    if (payWays.length === 0) return
    let arr = []
    for (var i = 0; i < payWays.length; i++) {
      let number = i+1;
      let imgPath = this.imagepath[i]
      let item = (
        <div className={this.state.payWaysSelected === i+1 ? 'leftItemNormal' : 'leftItem'} key={i} onClick={()=>this.changePayWay(number)}>
          <img src={imgPath}/>
        </div>
      )
      arr.push(item)
    }
    return arr
  }
  renderPackages() {
    let {packages} = this.state
    if (packages.length === 0) return
    let arr = []
    for(let i = 0; i < packages.length; i++) {
      let originalPrice = '原价:' + packages[i].originalPrice;
      let currency = this.state.packages[this.state.packagesSelected-1].symbol
      let item = (
        <div key={i} className={`packagesItem${i}`} style={{'border' : this.state.packagesSelected === i+1 ? '2px solid #FF8000':'1px solid #CCCCCC'}} onClick={()=>this.changePackages(i+1)}>
          <span className="months">{packages[i].packageName}</span>
          <div style={{'marginTop':'12px'}}>
            <span style={{'fontSize': '16px','color':'#4A4A4A'}}>现价：</span>
            <span style={{'fontSize': '26px','color':'#FF8000'}}>{currency}</span>
            <span style={{'fontSize': '26px','color':'#FF8000'}}>{packages[i].sellPrice}</span>
            <span style={{'fontSize': '16px','color':'#9B9B9B'}}>(</span>
            <span style={{'fontSize': '16px','color':'#9B9B9B','textDecoration':'line-through'}}>{originalPrice}</span>
            <span style={{'fontSize': '16px','color':'#9B9B9B'}}>)</span>
          </div>
          <img alt="套餐" src={packagesSelectedImg} style={{'display':this.state.packagesSelected === i+1 ? 'block' : 'none','position':'absolute','right':'0px','bottom':'0px'}}/>
        </div>
      )
      arr.push(item)
    }
    return arr
  }
  userInfoView() {
    let dic = JSON.parse(localStorage.getItem('userInfo'));
    let name = dic.userName;
    let dueTime = dic.dueTime;
    return (
      <div className="left_up">
        <span className="blackSpan" style={{'top':'68px','width':'79px'}}>我的ID:</span>
        <span className="orangeSpan" style={{'left': '175px','top': '68px','width': '200px'}}>{name}</span>
        <span className="blackSpan" style={{'top':'116px','width':'130px'}}>VIP到期时间:</span>
        <span className="orangeSpan" style={{'left': '226px','top': '116px','width': '120px'}}>{dueTime}</span>
        <img className="wechatPublicImg" src={wechatPublic} alt="公众号"/>
        <div className="followWechat">
          <span className="">关注微信公众号</span>
          <span className="">提出您的意见</span>
        </div>
      </div>
    )
  }
  renderButton() {
    let dic = JSON.parse(localStorage.getItem('userInfo'));
    let name = dic.userName;
    return (
      <button className="userNameTitle">{name}</button>
    )
  }
  changePayWay(i) {
    this.setState({
      payWaysSelected : i
    },()=>{
      this.changePayWayLink()
    })
  }
  changePackages(i) {
    this.setState({
      packagesSelected : i
    },()=>{
      this.fetchPayLink(i-1)
    })
  }
  checkOrderIsPay() {
    clearInterval(this.timeInterval)
    this.timeInterval = setInterval(() => this.cheakPay(), 3000);
  }
  cheakPay() {
    let orderNo ;
    if (this.state.packagesSelected == 1) {
      orderNo = this.state.payLinkObj1.orderNo;
    } else  if(this.state.packagesSelected == 2){
      orderNo = this.state.payLinkObj2.orderNo;
    } else if (this.state.packagesSelected == 3) {
      orderNo = this.state.payLinkObj3.orderNo;
    }
    let url = `https://api.100uu.tv/app/order/doQueryOrderForPC.do`
    let data = {'token':this.userInfoDic.token, 'orderNo':orderNo, 'platform':'web', 'channel':'uu100'}
    axios.post(url,data)
    .then((res)=>{
      debugger
    })
    .catch(err=>{
      console.log(err)
    })
    // axios(url)
    // .then ((response)=>{
    //   console.log(response.data);
    //   if (response.data.status == 3) {
    //     localStorage.setItem('userInfo',response.data);
    //     clearInterval(this.timeInterval)
    //   }
    // })
    // .catch(err =>{
    //   console.log(err)
    // })
  }
  goHome() {
    localStorage.removeItem('userInfo');
    this.props.history.push('/');
  }
}


export default Pay
