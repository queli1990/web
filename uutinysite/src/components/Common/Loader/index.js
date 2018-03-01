// src/components/About/index.js
import React, { Component } from 'react';

import './style.css';

export default class Loader extends Component {
  render() {
    let visble = this.props.visble;
    return (
      <div className="content" style={{'display': visble === true ?'' : 'none'}}>
        <div className="loader"></div>
      </div>
    );
  }
}
