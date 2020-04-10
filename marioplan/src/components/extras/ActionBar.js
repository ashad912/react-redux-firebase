import React, { Component } from 'react'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {changeMode} from '../../store/actions/canvasActions'

const styles = theme => ({
    toggleContainer: {
      height: 56,
      padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      margin: `${theme.spacing.unit}px 0`,
      //background: theme.palette.background.default,
    },
  });



class ActionBar extends Component {

handleMode = (e, mode) => {
    this.props.changeMode(mode)
}
    
  render() {
    const mode = this.props.mode;
    const { classes } = this.props;
    return (
      <div className={classes.toggleContainer}>
            <ToggleButtonGroup value={mode} exclusive onChange={this.handleMode}>
                <ToggleButton value="moving">
                    <i class="material-icons">open_with</i>
                </ToggleButton>
                <ToggleButton value="addition">
                    <i class="material-icons">touch_app</i>
                </ToggleButton>
            </ToggleButtonGroup>
    </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
    return {
        mode: state.canvas.mode
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeMode: (mode) => dispatch(changeMode(mode))
    }
}

ActionBar.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ActionBar))
