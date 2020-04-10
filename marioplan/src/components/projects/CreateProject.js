import React, { Component } from 'react'
import { connect } from 'react-redux'
import {createProject} from '../../store/actions/projectActions'
import { Redirect } from 'react-router-dom'

class CreateProject extends Component {
    state = {
        title: "",
        content: ""
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value

        })
    }

    handleSumbit = (e) => {
        e.preventDefault();
        //console.log(this.state)
        this.props.createProject(this.state) //not this.state.project - there is no property, now we pass state with two fields
        this.props.history.push('/')
    }

    render() {

        if(!this.props.auth.uid) return <Redirect to='/signin' />
        return (
        <div className="container">
            <form onSubmit={this.handleSumbit} className="white">
                <h5 className="grey-text text-darken-3">Create Project</h5>
                <div className="input-field"> {/*materialize gives here space*/}
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" onChange={this.handleChange}/>
                </div>
                <div className="input-field"> {/*materialize gives here space*/}
                    <label htmlFor="content">Project Content</label>
                    <textarea id="content" className="materialize-textarea" onChange={this.handleChange}></textarea>
                </div>
                <div className="input-field">
                    <button className="btn pink lighten-1 z-depth-0">Create</button>
                </div>
            </form>
        </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.firebase.auth
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        createProject: (project) => dispatch(createProject(project))
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(CreateProject)
