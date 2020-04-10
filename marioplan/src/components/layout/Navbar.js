import React from 'react'
import  { Link } from 'react-router-dom'
import SignedInLinks from "./SignedInLinks"
import SignedOutLinks from "./SignedOutLinks"
import { connect } from 'react-redux'


const Navbar = (props) => {
    const { auth } = props;
    //we d like to check existing uid, and control visibility of nav links
    const links = auth.uid ? <SignedInLinks/> : <SignedOutLinks/>
    return (
        <nav className="nav wrapper grey darken-3">
            <div className="containter">
                <Link to="/" className="brand-logo center">MarioPlan</Link>
                {links}
            </div>
        </nav>
    )
}

const mapStateToProps = (state) => {
    //console.log(state);
    return {
        auth: state.firebase.auth //connecting to firebaseReducer by rootReducer (Redux global state), and using auth prop
    }
    
}

export default connect(mapStateToProps)(Navbar)