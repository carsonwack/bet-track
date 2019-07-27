import React, { Component } from 'react';
import API from '../utils/API';
import DropDownName from '../components/DropDownName';
import DropDownMatch from '../components/DropDownMatch';
import CurrentOpenMatch from '../components/CurrentOpenMatch';
import ReactModal from 'react-modal';


class Login extends Component {

    state = {
        users: [],
        filtered: [],
        showModal: false,
        modalId: '',
        modalEmail: '',
        modalName: '',
        userEmail: '',
        matches: [],
        youser: null,
        oppser: null,
        propLabels: null
    }

    componentDidMount() {
        // Gets all users from db
        const userEmail = localStorage.getItem('currentUser');
        this.setState({
            userEmail: userEmail
        })

        API.getAllUsers()
            .then(res => {
                let userInfo = [];
                for (let userObj of res.data) {
                    if (userObj.email !== userEmail) {
                        userInfo.push({
                            _id: userObj._id,
                            email: userObj.email,
                            firstName: userObj.firstName,
                            lastName: userObj.lastName
                        })
                    }
                }
                this.setState({
                    users: userInfo
                })
            })
    }


    handleInputChange = event => {
        const { value } = event.target;
        this.checkContent(value);
    };


    checkContent = (value) => {
        // Filters out users if the first part of their name doesn't match the typed input
        if (value !== '') {
            let matchingUsers = this.state.users.filter(user => {
                let currentLetters = value.toLowerCase();
                let firstNameSubstring = user.firstName.slice(0, currentLetters.length).toLowerCase();
                let lastNameSubstring = user.lastName.slice(0, currentLetters.length).toLowerCase();
                return currentLetters === firstNameSubstring || currentLetters === lastNameSubstring;
            })

            this.setState({
                filtered: matchingUsers
            })
        }
        else {
            this.setState({
                filtered: []
            })
        }
    };

    nameClicked = (id, email, fName, lName) => {
        const fullName = `${fName} ${lName}`;
        this.setState({
            showModal: true,
            modalId: id,
            modalEmail: email,
            modalName: fullName
        })
    }

    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    yesStartMatch = () => {
        this.handleCloseModal();
        API.startMatch({
            userEmail: this.state.userEmail,
            opponentEmail: this.state.modalEmail
        })
            .then(res => {
                let newMatches = [...this.state.matches];
                newMatches.push({
                    emails: res.data.emails,
                    scores: res.data.scores,
                    propLabels: res.data.propLabels,
                    matchId: res.data._id
                })
                this.setState({
                    matches: newMatches
                    // set current open match here based on newly started match
                })
            })
    }

    setCurrentOpenMatch = (matchId, modalName) => {
        API.getMatch(matchId)
            .then(res => {
                this.reworkDataForUI(res.data.scores, res.data.propLabels, modalName);
            })
    }

    reworkDataForUI = (scores, propLabels, oppName) => {
        let user1Data = scores[0].split(' ')
        let user2Data = scores[1].split(' ')
        this.state.userEmail === user1Data ?
            this.setState({
                youser: user1Data,
                oppser: user2Data,
                propLabels: propLabels
            })
            :
            this.setState({
                youser: user2Data,
                oppser: user1Data,
                propLabels: propLabels
            })
    }


    render() {


        return (
            <div className="Home static bg-blue-200">
                <div className="border-2 border-gray-600">
                    <h1>Home</h1>
                </div>
                <br />
                <br />


                {/* SEARCH USERS */}
                <div>
                    <form
                        onSubmit={e => { e.preventDefault() }}
                    >
                        <input
                            placeholder='Search Users'
                            onChange={this.handleInputChange}
                            value={this.state.typedLetters}
                            name={'typedLetters'}
                            autoComplete='off'
                        />
                    </form>
                </div>
                {this.state.filtered.length ?
                    (this.state.filtered.map(user =>
                        <div key={user._id} onClick={() => this.nameClicked(user._id, user.email, user.firstName, user.lastName)}>
                            <DropDownName key={user._id} {...user} />
                        </div>)
                    )
                    : (null)
                }
                {/* SEARCH USERS */}




                {/* MATCHES */}
                <div className="absolute top-0 right-0 mt-12 mr-32">
                    <h3 className=""> Matches </h3>
                    {this.state.matches.map(match =>
                        <div
                            key={match.matchId}
                            onClick={() => this.setCurrentOpenMatch(match.matchId, this.state.modalName)} >
                            <DropDownMatch
                                key={match.matchId} {...match}
                                name={this.state.modalName}
                            />
                        </div>
                    )}
                </div>
                {/* MATCHES */}



                {/* CURRENT OPEN MATCH */}
                <div>
                    {this.state.youser ?
                        (
                            <CurrentOpenMatch
                                youser={this.state.youser}
                                oppser={this.state.oppser}
                                propLabels={this.state.propLabels}
                            />
                        )
                        : (null)
                    }
                </div>
                {/* CURRENT OPEN MATCH */}







                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel={this.state.modalName}
                    ariaHideApp={false}
                    style={customStyles}
                >
                    <p className="font-bold">Start a match with {this.state.modalName} ?</p>
                    <div
                        onClick={this.yesStartMatch}
                        className="cursor-pointer object-right-top">
                        Yes
                    </div>
                    <div
                        onClick={this.handleCloseModal}
                        className="cursor-pointer object-right-top">
                        No
                        </div>
                </ReactModal>
            </div>
        )


    }
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

export default Login; 