// src/components/About/index.js
import React, { Component } from 'react';

import './style.css';

export default class Sorry extends Component {
  render() {
    return (
      <div className="sorry" style={{'display': this.props.notFoundVisble === true ? 'block' : 'none'}}>
      </div>
    );
  }
}