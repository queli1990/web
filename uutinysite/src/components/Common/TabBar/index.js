// src/components/About/index.js
import React, { Component } from 'react'
import homeNormal from '../../../images/homeNormal.png'
import homeSelected from '../../../images/homeSelected.png'
import chinnalNormal from '../../../images/chinnalNormal.png'
import chinnalSelected from '../../../images/chinnalSelected.png'
import findNormal from '../../../images/findNormal.png'
import findSelected from '../../../images/findSelected.png'
import store from '../../utils/Storage'
import api from '../../api'

import './style.css';

export default class TabBar extends Component {
  render() {
    return (
      <div className="TabBar">{this.tabBarButtons()}</div>
    )
  }
  tabBarItemClick (index) {
    this.props.itemClick(index);
  }
  tabBarButtons () {
    let flag = api.getFlag()
    let str = flag === 0 ? 'org' : 'content'
    let language = store.get('language')
    if (language === null) return
    let name = language[8][str]
    let channelName = language[9][str]
    let sName = language[10][str]
    let data = [
      {
        name: name,
        icon: homeNormal,
        selectedIcon: homeSelected,
        id: 0
      },
      {
        name: channelName,
        icon:chinnalNormal,
        selectedIcon:chinnalSelected,
        id: 1
      },
      {
        name: sName,
        icon:findNormal,
        selectedIcon:findSelected,
        id: 2
      },
    ]
    var buttons = [];
    for (var i = 0; i < data.length; i++) {
      let item = data[i];
      if (this.props.selectedIndex === i) {//选中
        buttons.push(
          <div className="TabBarItem" key={i} onClick={()=>{this.tabBarItemClick(item.id)}}>
            <img src={item.selectedIcon} alt="#"/>
            <span className="selectedSpan">{item.name}</span>
          </div>
        )
      } else { //未选中
        buttons.push(
          <div className="TabBarItem" key={i} onClick={()=>{this.tabBarItemClick(item.id)}}>
            <img src={item.icon} alt="#"/>
            <span className="normalSpan">{item.name}</span>
          </div>
        )
      }
    }
    return buttons;
  }
}
