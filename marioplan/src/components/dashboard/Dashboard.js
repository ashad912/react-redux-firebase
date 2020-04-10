import React, {Component} from 'react'
import Notifications from './Notifications'
import ProjectList from '../projects/ProjectList'
import ExtraContent from '../extras/ExtraContent'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'

class Dashboard extends Component {
    
    

    render(){
        
        if(!this.props.auth.uid) return <Redirect to = '/signin' />
        
        
        console.log(this.props)
        return(
            <div className="dashboard container">
                <div className="row"> {/* two different sections - materialize css*/}
                    <div className="col s12 m6">
                        <ProjectList projects = {this.props.projects}/>
                    </div> {/*12 columns on small screnn, 6 colums on medium screen - left half of screen*/}
                    <div className="col s12 m5 offset-m1">
                        <Notifications notifications = {this.props.notifications}/>
                        <ExtraContent />
                    </div> {/*one column gap*/}
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state) => { //taking from global Redux to Dashboard props
    console.log(state)
    return { //we dont need to add parenthesis - hwvr can be: return ({})
        projects: state.firestore.ordered.projects, //old: state is store, project is in rootRed, projects in projectRed
        auth: state.firebase.auth,
        notifications: state.firestore.ordered.notifications
        //new: firestore has props ordered, when it has chosen collection below
    }
}

//to use two different hoc, we have to use compose func
export default compose(
    connect(mapStateToProps),
    firestoreConnect([ //here we can order things by  time
        { collection: 'projects', orderBy: ['createdAt', 'desc']},
        { collection: 'notifications', limit: 3, orderBy: ['time', 'desc']}
        //when this comp is ative, the collection I listen to is the project collection
        //and whenever this comp first loads, or firestore data is changed in the database online, this one now induce
        //the firestore reducer to sync this store state with the project collection
    ]))(Dashboard)

    //npm run build - build app and put in build folder
    //we have to relocate build to dist due to ninja sucker mistake xdd
    //firebase deploy to dist, cause of spefication before