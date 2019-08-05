import React, { Component } from 'react';
import API from '../utils/API';
import DropDownName from '../components/DropDownName';
import Matches from '../components/Matches';
import CreateNewBet from '../components/CreateNewBet';
import OpenBets from '../components/OpenBets';
import ClosedBets from '../components/ClosedBets';
import Modal from '../components/Modal';


class Home extends Component {

    state = {
        users: [],
        filtered: [],
        showModal: false,
        modalEmail: '',
        modalName: '',
        userEmail: '',
        userFullName: '',
        opponentName: '',
        matches: [],
        youser: null,
        oppser: null,
        propLabels: null,
        currentScore: null,
        createBetStarted: false,
        currentMatchId: '',
        betTyped: '',
        userTyped: '',
        noMatchesMessage: 'No current matches',
        openOrCompleted: true
    }

    componentDidMount() {
        const getUserEmail = localStorage.getItem('currentUser');
        const getUserName = localStorage.getItem('currentUserName');
        this.setState({
            userEmail: getUserEmail,
            userFullName: getUserName
        }, () => { this.getAllMatches() })

        API.getAllUsers()
            .then(res => {
                let otherUsers = res.data.filter(user => user.email !== getUserEmail)
                this.setState({ users: otherUsers })
            })
    }

    getAllMatches = () => {
        API.getAllMatches(this.state.userEmail)
            .then(res =>
                this.setState({
                    matches: res.data
                })
            )
            .catch(() =>
                this.setState({
                    matches: [],
                    noMatchesMessage: "Couldn't find matches"
                })
            );
    }


    handleInputChange = (e) => {
        const { value } = e.target;
        this.setState({ userTyped: value }, () => this.checkContent());
    };

    handlePropBetChange = (event) => {
        const { value } = event.target;
        this.setState({ betTyped: value })
    };
    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.betTyped === '') return
        let bet = { bet: this.state.betTyped }
        API.addBet(this.state.currentMatchId, bet)
            .then(() => {
                this.getAllBets();
                this.setState({ betTyped: '' });
            });
    }

    getAllBets = () => {
        API.getAllBets(this.state.currentMatchId)
            .then(res => this.setState({ propLabels: res.data.propBets }))
    }


    checkContent = () => {
        // Filters out users whose names don't match the typed input
        let { users, userTyped } = this.state;
        if (userTyped !== '') {
            let currentLetters = userTyped.toLowerCase();
            let matchingUsers = users.filter(user =>
                currentLetters === user.firstName.slice(0, currentLetters.length).toLowerCase()
                || currentLetters === user.lastName.slice(0, currentLetters.length).toLowerCase())

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

    nameClicked = (email, fName, lName) => {
        const fullName = `${fName} ${lName}`;
        this.setState({
            showModal: true,
            modalEmail: email,
            modalName: fullName
        })
    }

    handleCloseModal = () => {
        this.setState({ showModal: false, userTyped: '' }, this.checkContent);
    }

    yesStartMatch = () => {
        this.handleCloseModal();
        API.startMatch({
            userEmail: this.state.userEmail,
            opponentEmail: this.state.modalEmail,
            name1: this.state.userFullName,
            name2: this.state.modalName
        }).then(() => this.getAllMatches());
    }

    setCurrentOpenMatch = (matchId, opponentName) => {
        API.getMatch(matchId)
            .then(res => {
                this.reworkDataForUI(res.data.scores, res.data.propBets, opponentName);
            })
        this.setState({ currentMatchId: matchId, opponentName: opponentName })
    }

    reworkDataForUI = (scores, propLabels) => {
        let user1Data = scores[0].split(' ');
        let user2Data = scores[1].split(' ');
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

    calcCurrentScore = () => {
        let yourScore = parseInt(this.state.youser[1])
        let oppScore = parseInt(this.state.oppser[1])
        let totalScore = yourScore - oppScore
        this.setCurrentScore(totalScore)
    }

    setCurrentScore = (totalScore) => {
        this.setState({ currentScore: totalScore })
    }

    whatIsTheScore = () => {
        const { currentScore } = this.state;
        if (currentScore > 0) {
            return `Up by ${currentScore}`
        }
        else if (currentScore < 0) {
            return `Down by ${Math.abs(currentScore)}`
        }
        else {
            return 'Tied'
        }
    }

    flipBetStarted = () => {
        this.setState({ createBetStarted: !this.state.createBetStarted })
    }


    pickedYesOrNo = (betId, selection) => {
        if (selection) {
            API.yesChosen(this.state.currentMatchId, { betId: betId, val: 'Yes' })
                .then(() => this.getAllBets());
        }
        else {
            API.yesChosen(this.state.currentMatchId, { betId: betId, val: 'No' })
                .then(() => this.getAllBets());
        }
    }

    pickedWonOrLost = (betId, selection) => {
        if (selection) {
            let newUserScore = parseInt(this.state.youser[1]) + 1;
            let myString = `${this.state.youser[0]} ${newUserScore}`;
            let oppString = `${this.state.oppser[0]} ${this.state.oppser[1]}`;
            API.wonLostChosen(this.state.currentMatchId, { myString: myString, oppString: oppString, betId: betId, won: this.state.youser[0] })
                .then(() => this.setCurrentOpenMatch(this.state.currentMatchId, this.state.opponentName));
        }
        else {
            let newOppScore = parseInt(this.state.oppser[1]) + 1;
            let oppString = `${this.state.oppser[0]} ${newOppScore}`;
            let myString = `${this.state.youser[0]} ${this.state.youser[1]}`;
            API.wonLostChosen(this.state.currentMatchId, { myString: myString, oppString: oppString, betId: betId, won: this.state.oppser[0] })
                .then(() => this.setCurrentOpenMatch(this.state.currentMatchId, this.state.opponentName));
        }
    }

    deletePropBet = (betId) => {
        API.deleteBet(this.state.currentMatchId, betId)
            .then(() => this.getAllBets());
    }

    flipOpenCompleted = () => {
        this.setState({ openOrCompleted: !this.state.openOrCompleted })
    }

    render() {
        return (
            <div className="Home static bg-blue-200">


                {/* SEARCH USERS */}
                <div>
                    <form
                        onSubmit={e => { e.preventDefault() }}
                    >
                        <input
                            placeholder='Search Users'
                            onChange={this.handleInputChange}
                            value={this.state.userTyped}
                            autoComplete='off'
                        />
                    </form>
                </div>
                {this.state.filtered.length ?
                    (this.state.filtered.map(user =>
                        <div key={user._id} onClick={() => this.nameClicked(user.email, user.firstName, user.lastName)}>
                            <DropDownName key={user._id} {...user} />
                        </div>)
                    )
                    : (null)
                }
                {/* SEARCH USERS */}




                {/* MATCHES */}
                {this.state.matches.length ?
                    (
                        <Matches
                            userEmail={this.state.userEmail}
                            matches={this.state.matches}
                            setMatch={this.setCurrentOpenMatch}
                        />

                    )
                    : (<p>{this.state.noMatchesMessage}</p>)
                }
                {/* MATCHES */}





                {/* CURRENT OPEN MATCH */}
                {this.state.youser ?
                    (
                        <div>
                            <button onClick={this.flipOpenCompleted} >
                                {this.state.openOrCompleted ? 'View Bet History' : 'View Open Bets'}
                            </button>
                            {this.state.openOrCompleted ?
                                (
                                    <div>
                                        <CreateNewBet
                                            opponentName={this.state.opponentName}
                                            flipBetStarted={this.flipBetStarted}
                                            createBetStarted={this.state.createBetStarted}
                                            handleSubmit={this.handleSubmit}
                                            betTyped={this.state.betTyped}
                                            handlePropBetChange={this.handlePropBetChange}
                                        />
                                        <OpenBets
                                            propLabels={this.state.propLabels}
                                            pickedYesOrNo={this.pickedYesOrNo}
                                            deletePropBet={this.deletePropBet}
                                            pickedWonOrLost={this.pickedWonOrLost}
                                        />
                                    </div>
                                )
                                :
                                (
                                    <ClosedBets
                                        propLabels={this.state.propLabels}
                                        youserEmail={this.state.userEmail}
                                    />
                                )
                            }


                                <p>Total Score: {this.whatIsTheScore()}</p>
                        </div>
                    )
                    : (<p>Select a Match from the right</p>)
                }
                {/* CURRENT OPEN MATCH */}









                <Modal
                    showModal={this.state.showModal}
                    modalName={this.state.modalName}
                    yesStartMatch={this.yesStartMatch}
                    handleCloseModal={this.handleCloseModal}
                />
            </div>
        )
    }
}



export default Home; 