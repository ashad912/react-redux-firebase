import React, { Component } from 'react'
import { connect } from 'react-redux';
import PointList from './PointList'
import SwipeableViews from 'react-swipeable-views';
import { virtualize, bindKeyboard } from 'react-swipeable-views-utils';
import { mod } from 'react-swipeable-views-core';
import {updateAppState} from '../../store/actions/canvasActions'
import {exportResults} from '../../store/actions/canvasActions'


const VirtualizeSwipeableViews = bindKeyboard(virtualize(SwipeableViews));

const stylesSlides = {
    slide: {
      padding: 15,
      minHeight: 100,
      color: '#fff',
    },
    slide1: {
      backgroundColor: '#FEA900',
    },
    slide2: {
      backgroundColor: '#B3DC4A',
    },
    slide3: {
      backgroundColor: '#6AC0FF',
    },
  };

class Slider extends Component {

    state = {
        slideIndex: 0,
    }


    handleChangeSlideIndex = slideIndex => {
        this.setState({
            slideIndex: slideIndex,
        });
    };

    switchNewAppState = (newIndex) => {
        switch (newIndex) {
            case 0:
                this.props.updateAppState('position');
                break;
            case 1:
                this.props.updateAppState('tragus');
                break;
            case 2:
                this.props.updateAppState('correction');
                break;
            case 3:
                this.props.updateAppState('export');
                break;
            default:
                this.props.updateAppState('position')  
        } 
    }

    handleSlideBack = () => {
        const currentIndex = this.state.slideIndex;
        const newIndex = currentIndex !== 0 ? (currentIndex-1) : (currentIndex);

        this.switchNewAppState(newIndex);
        
        this.setState({
            slideIndex: newIndex,
        });  
        
        
    };

    handleSlideNext = () => {
        const currentIndex = this.state.slideIndex;
        const newIndex = currentIndex !== 3 ? (currentIndex + 1) : (0);
        
        this.switchNewAppState(newIndex);
        

        this.setState({
            slideIndex: newIndex,
        });
        
        if(currentIndex === 3) {
            this.setState({
                exported: false
            }); 
        }
        
        
    };
  
    handleDeletePoint = (id) => {
        console.log(this.props);
        console.log('halo');
        this.props.deletePoint(id);
    }

    newSample = () => {
        return (
            <button className="btn pink lighten-1 z-depth-0 right" onClick={this.handleSlideNext}>New sample</button>
        )
    }

    handleExport = () => {
        this.props.exportResults(this.props.results)
        .then(() =>{
            this.setState({
                exported: true
            })
        })
    }

    render() {

        const exportString = !this.state.exported ? (
            <div>Export</div> 
        ) : (  
            <div>Export again</div>      
        )

        const makeContent = (params) => {
            const { index } = params;
            switch (index) {
                default:
                    return (
                        <div>
                            <p>Add two positioning points.</p>
                            <PointList points={this.props.positionPoints} deletePoint= {this.handleDeletePoint}/>
                        </div>
                        
                    );
                case 1:
                    return (
                        <div>
                            <p>Add point in the half height of the tragus.</p>
                            <PointList points={this.props.tragusPoints} deletePoint= {this.handleDeletePoint} />
                        </div>
                        
                    );
                case 2:
                    return (
                        <div>
                            <p>Optionally, correct extreme ear points.</p>
                            <div className="row">
                                <button className="btn pink lighten-1 z-depth-0 right" onClick={() => this.props.handleExtremes()}>Compute extremes again</button>
                            </div>
                            <PointList points={this.props.extremePoints} deletePoint= {this.handleDeletePoint} />
                        </div>
                        
                    );
                case 3:
                    return (
                        <div>
                            <p>Export results to database.</p>
                            <div className="card z-depth-0 project-summary">
                                <div className="card-content grey-text text-darken-3">
                                    <span className="card-title">Results</span>
                                    <p>Something: {this.props.results.id}</p>
                                    <p>Name:  {this.props.results.name}</p>
                                    <button className="btn pink lighten-1 z-depth-0 right" onClick={this.handleExport}>{exportString}</button>
                                </div>
                                
                            </div>
                        </div>
                        
                    );
                        
            } 
            
        }

        

        const slideRenderer = (params) => {
            const { index, key } = params;
            let style;
            const content = makeContent(params)
            
            switch (mod(index, 3)) {
              case 0:
                style = stylesSlides.slide1;
                break;
          
              case 1:
                style = stylesSlides.slide2;
                break;
        
              case 2:
                style = stylesSlides.slide3;
                break;
          
              default:
                break;
            }

            const nextButtonConditions = () => {
                
                switch (this.state.slideIndex) {
                    case 0:
                        return this.props.positionPoints.length === 2;
                    case 1:
                        return this.props.tragusPoints.length === 1;
                    case 2:
                        return this.props.extremePoints.length === 2;
                    case 3:
                        return false;
                    default:
                        return true; 
                } 
            }

            const nextButton = nextButtonConditions() ? (
                <button className="btn pink lighten-1 z-depth-0 right" onClick={this.handleSlideNext}>Next</button>
            ) : (
                null
            )

            const backButton = this.state.slideIndex > 0 ? (
                <button className="btn pink lighten-1 z-depth-0 left" onClick={this.handleSlideBack}>Back</button>
            ) : (
                null
            )
        
            return (
                <div style={Object.assign({}, stylesSlides.slide, style)} key={key}>
                    {backButton}
                    {this.state.slideIndex === 3 && this.state.exported && this.newSample()}
                    {nextButton}
                    <br></br>
                    {content}
                </div>
                );
        }

    return (
        <div>
            <VirtualizeSwipeableViews
                            index={this.state.slideIndex}
                            onChangeIndex={this.handleChangeSlideIndex}
                            slideRenderer={slideRenderer}
            />
        </div>
    )
  }
}

const mapStateToProps = (state) => {
    return {
        positionPoints: state.canvas.points.slice(0,2),
        tragusPoints: state.canvas.points.slice(2,3),
        extremePoints: state.canvas.points.slice(3,5),
        results: state.canvas.results
    } 
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateAppState: (appState) => dispatch(updateAppState(appState)),
        exportResults: (results) => dispatch(exportResults(results))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Slider)
