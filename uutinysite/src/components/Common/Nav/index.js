// src/components/About/index.js
import React, { Component } from 'react';

import './style.css';

export default class Nav extends Component {
  goBack() {
    if (this.props.back) {
      this.props.back()
    } 
  }
  render() {
    let { navText, visble } = this.props
    return (
      <nav>
        <span onClick={()=>{this.goBack()}} style={{'display': visble === true ?'' : 'none'}}></span>
        <span>{navText}</span>
      </nav>
    );
  }
}
