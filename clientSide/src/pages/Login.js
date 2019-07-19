import React, { Component } from "react";
import { GoogleLogin } from 'react-google-login';
import dotenv from 'dotenv';
dotenv.config();


class Login extends Component {
    state = {
        name: '',
        email: ''
    };

    setToken = (res) => {
        this.setState({
            name: res.profileObj.givenName,
            email: res.profileObj.email
        })
    }

    render() {

        const responseGoogle = (response) => {
            console.log(response);
            this.setToken(response);
        }



        return (
            <div className="Login">
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