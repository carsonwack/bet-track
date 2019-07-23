import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import API from '../utils/API';
import dotenv from 'dotenv';
dotenv.config();


class Login extends Component {
    state = {
        email: '',
        name: ''
    };

    setName = (res) => {
        this.setState({
            email: res.profileObj.email,
            name: res.profileObj.givenName
        })
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
                    name: this.state.name
                }).then(() => this.login()).then(() => this.props.history.push('/'))
            }
        }

        return (
            <div className="Login mt-48 text-center">
                <GoogleLogin
                    clientId={process.env.REACT_APP_G_CLIENT_ID}
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
        )


    }
}

export default Login; 