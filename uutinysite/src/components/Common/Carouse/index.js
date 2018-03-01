// src/components/About/index.js
import React, { Component } from 'react';
import Carousel from 'react-zkcarousel';

// import './style.css';

export default class Lunbo extends Component {
  constructor(props) {
    super(props)
    this.handleItemClick = this.handleItemClick.bind(this)
  }
  handleItemClick(index,href,event) {
    this.props.handleItemClick(index,href,event)
  }
  render() {
    return (<Carousel data={this.props.carouselObj} autoplay click={this.handleItemClick}/>)
  }
}
