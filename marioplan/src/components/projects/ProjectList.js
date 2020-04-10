import React from 'react'
import ProjectSummary from './ProjectSummary'
import { Link } from 'react-router-dom'

const ProjectLists = ({projects}) => { //need to nest project content in ProjectSummary
    
    const projectList = projects ? (
        projects.map(project => { //filter is to rewrting under condition, here good is map
            return(
                <Link to={'/project/' + project.id} key={project.id}> {/*here is id from db */}
                    <ProjectSummary project={project} /> {/*remember about key - key have to be in parent element, in this case Link*/}
                </Link>
            ) 
        })
    ) : (
        <span>There is no projects my lord!</span>
    )

    //net Ninja - do it like:
    // {projects && projects.map(project => {  //first con checks existing

    //}} inside div project list section
    
    return (
        //in future: global list of projects from redux by param: {projects}, passed here
        <div className="project list section">
           {projectList}
        </div>
    )
}

export default ProjectLists;