import md5 from 'md5'
import axios from 'axios';
import Alert from 'react-s-alert';

class PostTool {
  regist (username,pwd,hideView) {
    let platform = "web";
    let channel = "uu100";
    let combinStr = username + pwd + platform + channel;
    let sign = md5(combinStr);
    let url = `http://api.100uu.tv/app/member/doRegister.do?&userName=${username}&password=${pwd}&platform=${platform}&channel=${channel}&sign=${sign}`;
    axios(url)
    .then ((response)=>{
      if (response.data.status === '1') {
        alert('已经注册过');
      } else if(response.data.status === '2'){
        alert('注册成功');
        hideView();
      } else {
        alert('注册失败，请重试');
      }
    })
    .catch(err =>{
      console.log(err)
    })

    // let url = 'http://api.100uu.tv/app/member/doRegister.do';
    // let params = {
    //   "userName" : username,
    //   "password" : pwd,
    //   'platform' : platform,
    //   'channel' : channel,
    //   'sign' : sign
    // }
    // let config = {
    //   method: 'GET',
    //   mode: 'no-cors',
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     'Content-Type': 'application/json',
    //   },
    //   withCredentials: true,
    //   credentials: 'same-origin',
    // };
    // axios.post(url,params,config)
    // .then(res =>{
    //   console.log(res.data);
    // })
    // .catch(err =>{
    //   console.log(err)
    // })
  }
  login (name,pwd,hideView) {
    let platform = "web";
    let combinStr = name + pwd + platform;
    let sign = md5(combinStr);
    let url = `http://api.100uu.tv/app/member/doLogin.do?&userName=${name}&password=${pwd}&platform=web&sign=${sign}`;
    axios(url)
    .then ((response)=>{
      if (response.data.status === '1') {
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        hideView();
      } else if(response.data.status === '2'){
        alert('用户名或密码错误');
      } else {
        alert('登录失败，请重试');
      }
    })
    .catch(err =>{
      console.log(err)
    })
  }
  forgetPwd(email){
    let url = `http://api.100uu.tv/app/member/doRetrievePasswordOne.do?email=${email}`;
    axios(url)
    .then ((response)=>{
      if (response.data.status === '1') {
        alert('邮件已发送至您邮箱');
      } else if(response.data.status === '2') {
        alert('账号不存在');
      } else {
        alert('服务端异常');
      }
    })
    .catch(err =>{
      console.log(err)
    })
  }
}

let postTool = new PostTool()

export default postTool
