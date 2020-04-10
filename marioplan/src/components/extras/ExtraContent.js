import React, { Component } from 'react'
import video from './video.mp4'
class ExtraContent extends Component {

  state = {
    dimensions: null,
    active: false
  }

  componentDidMount(){
    this.handleResize();
    window.addEventListener('resize', this.handleResize)
    
  }
  componentWillUnmount(){ 
    
    window.removeEventListener('resize', this.handleResize)
    
  }

  handleResize = () => {
    this.setState({
      dimensions: {
        width: 0.87 * this.container.offsetWidth,
        height: 0.87 * this.container.offsetWidth * 9 / 16,
      },
    });
  }

  handleButton = () => {
    this.setState({
      active: true
    })

  }

  renderVideo = () => {
    return (
      <video width={this.state.dimensions.width} height={this.state.dimensions.height} controls >
        <source src={video} type="video/mp4"/>
      </video>
    )
  }

  render() {
    
    const buttonArea = !this.state.active ? (
      <div className="input-field">
          <button className="btn pink lighten-1 z-depth-0" onClick = {this.handleButton}>Unlock your extra content</button>
      </div>
    ) : (null)

    return (
      <div className="section" ref={(el) => (this.container = el)}>
            <div className="card z-depth-0" >
                <div className="card-content">
                    <span className="card-title">Your extra content!</span>
                    <ul>
                    {this.state.active && this.state.dimensions && this.renderVideo()}
                    </ul>
                    {buttonArea}
                </div>
            </div>
        </div>
    )
  }
}

export default ExtraContent
