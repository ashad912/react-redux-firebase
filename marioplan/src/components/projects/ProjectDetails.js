import React from 'react'//rce - make class, rfe - make func
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import moment from 'moment'

const ProjectDetails = (props) => {//there is props connected with Router
    //const id = props.match.params.id
    if(!props.auth.uid) return <Redirect to='/signin' />
    
    console.log(props)
    const project = props.project
    console.log(project.createdAt)
    console.log(project.createdAt.toDate())
    console.log(moment(project.createdAt.toDate()).calendar())
    if(project){
        return(
            <div className="container section project-details">
                <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">{project.title} </span>
                        <p>{project.content}</p>
                    </div>
                </div>
                <div className="card-action grey lighten-4 grey-text">
                    <div>{project.authorFirstName} {project.authorLastName}</div>
                    <div>{moment(project.createdAt.toDate()).calendar()}</div> {/*didnt work, due to lack of prop 'createdAt' in first dummy doc! AND
                    it has to be .toDate() cause of timestamp format, and .toString() then
                    we ve installed 'moment' librasy to easy handle this task*/}
                </div>
            </div>
        )
    }else{
        return (
            <div className="container center">
                <p>Loading project...</p>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.match.params.id
    const projects = state.firestore.data.projects //does not have to be ordered - just id finder
    const project = projects ? projects[id] : null
    //console.log(state)
    //if(projects)
    //    console.log(projects[id])
    return {
        //project: projects.find((project) => {
        //    return project.id === id
        //}) finder doesnt work due to other id methodology
        project: project,
        auth: state.firebase.auth
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        {collection: 'projects'}
    ])
)(ProjectDetails)


