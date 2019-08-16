import React, { Component } from 'react';
import API from '../utils/API';
import DropDownName from '../components/DropDownName';
import Matches from '../components/Matches';
import CreateNewBet from '../components/CreateNewBet';
import OpenBets from '../components/OpenBets';
import ClosedBets from '../components/ClosedBets';
import Modal from '../components/Modal';
import Nav from '../components/Nav';


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
        if (this.state.createBetStarted) {
            this.flipBetStarted()
        }
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
        this.setState({ createBetStarted: false })
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
            modalName: fullName,
            userTyped: ''
        }, this.checkContent)
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
        this.setState({ createBetStarted: !this.state.createBetStarted },
            () => this.state.createBetStarted ? null : this.setState({ betTyped: '' }))
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
            <div className="Home static">

                <Nav>
                    {/* USER SEARCH */}
                    <form
                        onSubmit={e => { e.preventDefault() }}
                    >
                        <input
                            className="shadow appearance-none border border-green-900 rounded h-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                            placeholder='Search Users'
                            onChange={this.handleInputChange}
                            value={this.state.userTyped}
                            autoComplete='off'
                            style={{ width: "236.5px" }}
                        />
                    </form>
                    <div className="absolute z-10">
                        {this.state.filtered.length ?
                            (this.state.filtered.map(user =>
                                <div
                                    key={user._id}
                                    onClick={() => this.nameClicked(user.email, user.firstName, user.lastName)}
                                >
                                    <DropDownName key={user._id} {...user} />
                                </div>)
                            )
                            : (null)
                        }
                    </div>
                    {/* USER SEARCH */}
                </Nav>






                {/* MATCHES */}
                {this.state.matches.length ?
                    (
                        <Matches
                            userEmail={this.state.userEmail}
                            matches={this.state.matches}
                            setMatch={this.setCurrentOpenMatch}
                        />

                    )
                    : (<p >{this.state.noMatchesMessage}</p>)}
                {/* MATCHES */}





                {/* CURRENT OPEN MATCH */}
                {this.state.youser ?
                    (
                        <div className="container my-20 mx-auto h-full flex text-center justify-center">
                            <div className="relative w-2/3 md:w-1/2 lg:w-2/5 bg-gray-400 rounded-lg shadow-md">
                                <p className="mx-auto mt-6 tracking-wide text-green-900 font-black uppercase">
                                    You <span className="px lowercase">vs</span> {this.state.opponentName.split(' ')[0]}
                                </p>
                                <button className="absolute top-0 right-0 mt-1 mr-1 px-3 pb-2 text-sm focus:outline-none" onClick={this.flipOpenCompleted} >
                                    {this.state.openOrCompleted ? 'Bet History' : 'Back'} <i className="ml align-middle fas fa-angle-right"></i>
                                </button>
                                <hr className={`mx-auto ${!this.state.openOrCompleted ? 'mb-10' : ''} bg-gray-500 pl-20`}
                                    style={{ border: '0', clear: 'both', display: 'block', width: '20%', height: '1px' }} />
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
                                            <div style={{ "maxHeight": "350px", "overflowY": "scroll", "boxShadow": "0px 0px 5px -4px rgba(0,0,0,0.46)" }}>
                                                <OpenBets
                                                    propLabels={this.state.propLabels}
                                                    pickedYesOrNo={this.pickedYesOrNo}
                                                    deletePropBet={this.deletePropBet}
                                                    pickedWonOrLost={this.pickedWonOrLost}
                                                />
                                            </div>
                                        </div>
                                    )
                                    :
                                    (
                                        <div style={{ "maxHeight": "350px", "overflowY": "scroll", "boxShadow": "0px 0px 5px -4px rgba(0,0,0,0.46)" }}>
                                            <ClosedBets
                                                propLabels={this.state.propLabels}
                                                youserEmail={this.state.userEmail}
                                            />
                                        </div>
                                    )
                                }
                                <div className="flex justify-center">
                                    <p
                                        className="mb-8 mt-8 text-lg text-gray-900 font-black uppercase tracking-wide px-2 pt-2"
                                        style={{ 'borderBottom': '1px dotted rgb(35, 83, 61)', 'borderRadius': '5px', height: '27.5px' }}
                                    >
                                        {this.whatIsTheScore()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                    : (
                        <div className="container my-20 mx-auto h-full flex text-center justify-center">
                            <div className="w-2/3 md:w-1/2 lg:w-2/5 bg-gray-400 rounded-lg shadow-md">
                                <p className="py-12">Select a Match <span><i className="ml-1 align-middle fas fa-long-arrow-alt-right"></i></span></p>
                            </div>
                        </div>
                    )
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