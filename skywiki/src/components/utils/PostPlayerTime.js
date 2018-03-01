import store from './Storage'
import axios from 'axios';

class Presenter {
  setBeginTime () {
    let storeTime = sessionStorage.getItem('beginTime');
    if (!storeTime) {
      let begintime = this.getNowFormatDate();
      store.set('beginTime',begintime);
    }
  }
  getNowFormatDate() {
    var x = new Date();
    var y = "yyyy-MM-dd hh:mm:ss";
    var z ={y:x.getFullYear(),M:x.getMonth()+1,d:x.getDate(),h:x.getHours(),m:x.getMinutes(),s:x.getSeconds()};
    return y.replace(/(y+|M+|d+|h+|m+|s+)/g,function(v) {return ((v.length>1?"0":"")+eval('z.'+v.slice(-1))).slice(-(v.length>2?v.length:2))});
  }
  guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
  }
  getUserIP () {
    var requestUrl = 'http://cdn.100uu.tv/getIp';
    axios(requestUrl)
    .then ((response)=>{
      let currentUserIP = response.data.ip;
      store.set('userIP', currentUserIP)
    })
  }
  post (playedTime,name,language) {
    let userIP = sessionStorage.getItem('userIP');
    let item = store.get('album');
    let albumID = item.id;
    let beginTime = sessionStorage.getItem('beginTime');
    let endTime = this.getNowFormatDate();
    let platform = 'web';
    let channel = 'uu100';
    let version = '1.0';
    let isCollection = '0';
    let uuid ;
    if (!localStorage.getItem('uuid')) {
      uuid = this.guid();
      localStorage.setItem('uuid',uuid);
    } else {
      uuid = localStorage.getItem('uuid');
    }
    let params = {
      'deviceId':uuid,
      'version':version,
      'platform':platform,
      'ip':userIP,
      'albumId':albumID,
      'albumTitle':name,
      'watchLength':playedTime, 
      'isCollection':isCollection,
      'startTime':beginTime, 
      'endTime':endTime,
      'channel':channel
    };
    let url = `http://api.100uu.tv/app/member/doVideoStatistics.do?deviceId=${uuid}&version=${version}&platform=${platform}&channel=${channel}&language=${language}&ip=${userIP}&albumId=${albumID}&albumTitle=${name}&watchLength=${playedTime}&isCollection=${isCollection}&startTime=${beginTime}&endTime=${endTime}`
    axios(url)
    .then(res=>{
      console.log('发送播放数据：'+res.data.status);
    })
    .catch(err=>{
      console.log('发送播放数据失败'+err);
    })
  }
}

let presenter = new Presenter()

export default presenter
