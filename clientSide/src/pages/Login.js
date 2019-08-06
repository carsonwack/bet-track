import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import API from '../utils/API';
import logo from '../logo.png'
import dotenv from 'dotenv';
dotenv.config();


class Login extends Component {
    state = {
        email: '',
        firstName: '',
        lastName: ''
    };

    setName = (res) => {
        this.setState({
            email: res.profileObj.email,
            firstName: res.profileObj.givenName,
            lastName: res.profileObj.familyName
        }, () => this.setLocal(this.state.email, `${this.state.firstName} ${this.state.lastName}`))
    }

    setLocal = (userEmail, nameOfUser) => {
        localStorage.setItem('currentUser', userEmail)
        localStorage.setItem('currentUserName', nameOfUser)
    }

    login = () => {
        this.props.yesLoggedIn();
    }

    render() {

        const responseGoogle = (response) => {
            this.setName(response);
            if (response.tokenObj.id_token) {
                API.saveUser({
                    email: this.state.email,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName
                })
                    .then(() => this.login())
                    .then(() => this.props.history.push('/'))
            }
        }



        return (
            <div className="container my-20 mx-auto h-full flex text-center justify-center">
                <div className="w-1/3">
                    <p className="mx-auto text-4xl">Bet-Track</p>
                    <img className="h-16 w-20 mx-auto" src={logo} alt="bet track logo" />
                    <div className="flex">
                        <div className="mx-auto pl-10 py-10 w-1/3 justify-start">
                            <GoogleLogin
                                clientId={process.env.REACT_APP_G_CLIENT_ID}
                                buttonText="Login"
                                onSuccess={responseGoogle}
                                onFailure={responseGoogle}
                                cookiePolicy={'single_host_origin'}
                            />
                        </div>
                        <div className="w-1/3 justify-end my-auto mx-auto">
                            <p
                                style={{'boxShadow': '-1px 2px 2px 0px rgba(0, 0, 0, 0.29)'}}
                                className="rounded-sm cursor-pointer pl-4 pr-2 pb-2 py-2"> How's it work? 
                            <span><i className="pl-2 fas fa-caret-up align-middle"></i></span></p>
                        </div>
                    </div>
                </div>
            </div>

        )

    }
}




export default Login; 