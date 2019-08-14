import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import API from '../utils/API';
import logo from '../logo.png';
import dotenv from 'dotenv';
dotenv.config();


class Login extends Component {
    state = {
        email: '',
        firstName: '',
        lastName: '',
        howsItWork: false
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

    flipHowsItWork = () => {
        this.setState({ howsItWork: !this.state.howsItWork })
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
                <div className="sm:w-full md:w-2/3 lg:w-1/3">
                    <p className="mx-auto text-4xl">Bet-Track</p>
                    <img className="h-16 w-20 mx-auto" src={logo} alt="bet track logo" />
                    <div className="flex">
                        <div className="mx-auto sm:pl-0 md:pl-10 py-10 w-1/3 justify-start">
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
                                style={{ 'boxShadow': '-1px 2px 2px 0px rgba(0, 0, 0, 0.29)' }}
                                className="w-40 rounded-sm cursor-pointer pl-4 pr-2 pb-2 py-2"
                                onClick={this.flipHowsItWork}
                            > How's it work?
                            <span><i className={`pl-2 fas fa-caret-${this.state.howsItWork ? 'down' : 'up'} align-middle`}></i></span></p>
                        </div>
                    </div>
                    {this.state.howsItWork ? (
                        <div>
                            <ol className="text-left sm:pl-10 md:pl-20 lg:pl-20">
                                <li>-Log in</li>
                                <li>-Find a User (Someone else who's logged in before).</li>
                                <li>-Click their name to start a match.</li>
                                <li>-Create new bets for them to answer yes/no to.</li>
                                <li>-Click 'won' or 'lost' based on the outcome.</li>
                                <li>-That's it! The site tracks the total score, bet history, etc.</li>
                            </ol>
                        </div>
                    ) : (null)}
                </div>


            </div>

        )

    }
}




export default Login; 