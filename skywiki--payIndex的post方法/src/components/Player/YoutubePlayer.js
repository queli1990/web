import React, { Component } from 'react'
import YouTube from 'react-youtube'
import Header from '../Common/Header'

class YouTubePlayer extends Component {
  goSearch (keyword) {
    if (keyword.length === 0) return;
    var path = `/search/${keyword}`
    this.props.history.push(path);
  }
  _onReady(event) {
    event.target.playVideo();
  }
  goHome() {
    this.props.history.push('/')
  }
  render() {
    let vid = this.props.match.params.id
    // let vid = "TMnalfz2KTE"
    const opts = {
      width: '1420',
      height: '797',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };
    return (
      <div>
         <Header search={(e)=>this.goSearch(e)} goHome={this.goHome.bind(this)}/>
         <div className="bigContent">
          <YouTube
            videoId={vid}
              opts={opts}
              onReady={this._onReady}
            />
        </div>
      </div>
    );
  }
}

export default YouTubePlayer
