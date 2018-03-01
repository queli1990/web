// src/components/About/index.js
import React, { Component } from 'react';
import './style.css';

// React.PropTypes is deprecated since React 15.5.0, use the npm module prop-types instead
export default class About extends Component {
  static propTypes = {}
  static defaultProps = {}
  state = {}
  render() {
    // const { className, ...props } = this.props;
    let { id } = this.props.match.params
    return (
      <div className="">
        <h1>
          About + {id}
        </h1>
        <h2>{this.props.match.params.id}</h2>

      </div>
    );
  }
}
