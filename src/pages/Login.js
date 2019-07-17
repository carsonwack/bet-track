import React, { Component } from "react";
import { GoogleLogin } from 'react-google-login';
import dotenv from 'dotenv';
dotenv.config();


class Login extends Component {
    state = {
        isAuthenticated: false,
        user: null,
        token: ""
    };

    render() {

        const responseGoogle = (response) => {
            console.log(response);
        }

        let content = this.state.isAuthenticated ?
            (
                <div>
                    <div>
                        <button onClick={this.logout} className="button">
                            Log out
                        </button>
                    </div>
                </div>

            ) :
            (
                <GoogleLogin
                    clientId={process.env.GOOGLE_CLIENT_ID}
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
            );

        return (
            <div className="Login">
                {content}
            </div>
        )


    }
}

export default Login; 