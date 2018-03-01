// src/components/NotFound/index.js
import React, { Component } from 'react';
import Sorry from '../Common/404'
import './style.css';

export default class NotFound extends Component {
  render() {
    return (
      <div>
        <Sorry />
      </div>
    );
  }
  goBack () {
    this.props.history.goBack();
  }
}
