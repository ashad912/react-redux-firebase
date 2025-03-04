import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signIn } from '../../store/actions/authActions'
import { Redirect } from 'react-router-dom'

class SignIn extends Component {
    state = {
        email: "",
        password: ""
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value

        })
    }

    handleSumbit = (e) => {
        e.preventDefault();
        this.props.signIn(this.state)
        //console.log(this.state)
    }

    render() {
        if(this.props.auth.uid) return <Redirect to='/' />
        const { authError } = this.props
        return (
        <div className="container">
            <form onSubmit={this.handleSumbit} className="white">
                <h5 className="grey-text text-darken-3">Sign In</h5>
                <div className="input-field"> {/*materialize gives here space*/}
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" onChange={this.handleChange}/>
                </div>
                <div className="input-field"> {/*materialize gives here space*/}
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" onChange={this.handleChange}/>
                </div>
                <div className="input-field">
                    <button className="btn pink lighten-1 z-depth-0">Login</button>
                    <div className="red-text center">
                        { authError ? <p>{authError}</p> : null //the same by if below - :<
                        /*() => {
                            if(authError){
                                return(
                                    <p>{authError}</p>
                                )
                            }else{
                                return null
                            }
                        })*/}
                    </div>
                </div>
            </form>
        </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authError: state.auth.authError, // auth in rootReducer, authError in authReducer, state global Redux store
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (creds) => dispatch(signIn(creds))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
