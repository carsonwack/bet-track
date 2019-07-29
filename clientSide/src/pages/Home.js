import React, { Component } from 'react';
import API from '../utils/API';
import DropDownName from '../components/DropDownName';
import DropDownMatch from '../components/DropDownMatch';
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
        propLabels: null,
        currentScore: null,
        createBetStarted: false,
        propBetTyped: '',
        currentMatchId: ''
    }

    componentDidMount() {
        const userEmail = localStorage.getItem('currentUser');
        // Gets all users from db
        this.setState({
            userEmail: userEmail
        }, () => {
            API.getAllMatches(this.state.userEmail)
                .then(res => console.log('res:', res.data))
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

    handlePropBetChange = event => {
        const { value } = event.target;
        this.setState({ propBetTyped: value })
    };
    handleSubmit = event => {
        event.preventDefault();
        let bet = { bet: this.state.propBetTyped }
        API.addBet(this.state.currentMatchId, bet).then(res => console.log(res));
    }


    checkContent = (value) => {
        // Filters out users whose names don't match the typed input
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
                    // set current open match as this one ^ that was just started
                })
            })
    }

    setCurrentOpenMatch = (matchId, modalName) => {
        API.getMatch(matchId)
            .then(res => {
                this.reworkDataForUI(res.data.scores, res.data.propBets, modalName);
            })
        this.setState({ currentMatchId: matchId })
    }

    reworkDataForUI = (scores, propLabels, oppName) => {
        console.log('oppName:', oppName)
        let user1Data = scores[0].split(' ')
        let user2Data = scores[1].split(' ')
        this.state.userEmail === user1Data[0] ?
            this.setState({
                youser: user1Data,
                oppser: user2Data,
                propLabels: propLabels
            }, () => this.calcCurrentScore())
            :
            this.setState({
                youser: user2Data,
                oppser: user1Data,
                propLabels: propLabels
            }, () => this.calcCurrentScore())
    }

    setCurrentScore = (totalScore) => {
        this.setState({ currentScore: totalScore })
    }

    calcCurrentScore = () => {
        let yourScore = parseInt(this.state.youser[1])
        let oppScore = parseInt(this.state.oppser[1])
        let totalScore = yourScore - oppScore
        this.setCurrentScore(totalScore)
    }

    whatIsTheScore = () => {
        let totalScoreCopy = this.state.currentScore
        if (totalScoreCopy > 0) {
            return `Up by ${totalScoreCopy}`
        }
        else if (totalScoreCopy < 0) {
            return `Down by ${Math.abs(totalScoreCopy)}`
        }
        else {
            return 'Tied'
        }
    }

    upScoreBy1 = () => {
        let anotherCopy = this.state.currentScore
        anotherCopy++
        this.setState({ currentScore: anotherCopy })
    }
    downScoreBy1 = () => {
        let someCopy = this.state.currentScore
        someCopy--
        this.setState({ currentScore: someCopy })
    }

    buttonText = () => {
        if (this.state.typeBetStarted) {
            return 'Click'
        }
    }

    flipBetStarted = () => {
        this.setState({ createBetStarted: !this.state.createBetStarted })
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
                            <div>
                                <div> Bets:
                                    <div className="currentPropBets">
                                        <button
                                            onClick={this.flipBetStarted}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">{this.state.createBetStarted ? 'Clear' : 'Create New Bet'}
                                        </button>
                                        {this.state.createBetStarted ?
                                            (<form onSubmit={this.handleSubmit}>
                                                <textarea
                                                    value={this.state.value}
                                                    onChange={this.handlePropBetChange}
                                                />
                                                <input type="submit" value="Submit" />
                                            </form>)
                                            :
                                            (null)
                                        }
                                    </div>
                                    {this.state.propLabels.length ?
                                        (this.state.propLabels.map(propBet =>
                                            <p key={propBet}>
                                                {propBet}
                                            </p>)
                                        )
                                        :
                                        (<p>No Bets</p>)
                                    }
                                </div>
                                <div>

                                    <button onClick={this.upScoreBy1}>I Won</button>
                                    <button onClick={this.downScoreBy1}>I Lost</button>
                                    <p>Total Score: {this.whatIsTheScore()}</p>

                                </div>
                                {/* Your Total bets Won: {this.props.youser[1]}
                                Opponent Total bets Won: {this.props.oppser[1]} */}
                            </div>
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