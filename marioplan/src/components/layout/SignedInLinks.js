import React from 'react'
import  { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'

const SignedInLinks = (props) => //due to functional component - i have to add parameter props, and then attach dispatch to this param by mapping
{
    return (
        <ul className="right">
            <li><NavLink to="/create">New Project</NavLink></li>
            <li><NavLink to="/canvas">Canvas</NavLink></li>
            <li><a onClick={props.signOut}>Log Out</a></li> {/*we re not going to anywhere --- props.signOut without brackets, doesnt fire, only association*/}
            <li><NavLink to="/" className='btn btn-floating pink lighten-1'>{props.initials}</NavLink></li>
        </ul>
    )
}

const mapStateToProps = (state) => {
    return {
        initials: state.firebase.profile.initials
    } //netNinja chose specifing profile in parent comp, and passing it as a prop
}

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignedInLinks)