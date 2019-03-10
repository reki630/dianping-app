import React, { Component } from 'react';
import {Redirect} from 'react-router-dom'
import LoginHeader from './Components/LoginHeader'
import LoginForm from './Components/LoginForm'
import {actions as loginActions, getUsername, getPassword, isLogin } from '../../Redux/Modules/login';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

class Login extends Component {
    render() {
        const {username,password,login,location:{state}} = this.props
        if(login){
            if(state && state.from){
                return <Redirect to={state.from}/>
            }
            return <Redirect to='/user'/>
        }
        return (
            <div>
                <LoginHeader/>
                <LoginForm username={username} password={password} onChange={this.handleChange} onSubmit={this.handleSubmit}/>
            </div>
        );
    }
    handleChange = (e) => {
        if(e.target.name === 'username'){
            this.props.loginActions.setUsername(e.target.value)
        }else if(e.target.name === 'password'){
            this.props.loginActions.setPassword(e.target.value)
        }
    }
    handleSubmit = () => {
        this.props.loginActions.login()
    }
}
const mapStateToProps = (state,props) => {
    return {
        username:getUsername(state),
        password:getPassword(state),
        login:isLogin(state)
    }
}
const mapDispatchToProps = (dispatch,props) => {
    return {
        loginActions:bindActionCreators(loginActions,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);