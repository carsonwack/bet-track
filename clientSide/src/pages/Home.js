import React, { Component } from 'react';
import API from '../utils/API';
import DropDownName from '../components/DropDownName';
// import DropDownMatch from '../components/DropDownMatch';
import ReactModal from 'react-modal';


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
        noMatchesMessage: 'No current matches'
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
                let otherUsers = res.data.filter( user => user.email !== getUserEmail)
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
            let matchingUsers = users.filter( user => 
            currentLetters === user.firstName.slice(0, currentLetters.length).toLowerCase() 
            || currentLetters === user.lastName.slice(0, currentLetters.length).toLowerCase() )

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

    reworkDataForUI = (scores, propLabels, oppName) => {
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
        let totalScoreCopy = this.state.currentScore;
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

    flipBetStarted = () => {
        this.setState({ createBetStarted: !this.state.createBetStarted })
    }

    opponentName = (nameArray) => {
        let person1 = nameArray[0].split(' ');
        let person2 = nameArray[1].split(' ');
        if (person1[0] === this.state.userEmail) {
            return `${person2[1]} ${person2[2]}`
        }
        else {
            return `${person1[1]} ${person1[2]}`
        }
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
            API.wonLostChosen(this.state.currentMatchId, { myString: myString, oppString: oppString, betId: betId, won: this.state.userFullName })
                .then(() => this.setCurrentOpenMatch(this.state.currentMatchId, this.state.opponentName));
        }
        else {
            let newOppScore = parseInt(this.state.oppser[1]) + 1;
            let oppString = `${this.state.oppser[0]} ${newOppScore}`;
            let myString = `${this.state.youser[0]} ${this.state.youser[1]}`;
            API.wonLostChosen(this.state.currentMatchId, { myString: myString, oppString: oppString, betId: betId, won: this.state.opponentName })
                .then(() => this.setCurrentOpenMatch(this.state.currentMatchId, this.state.opponentName));
        }
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
                <div className="absolute top-0 right-0 mt-12 mr-32">
                    <h3 className=""> Matches </h3>
                    {this.state.matches.length ?
                        (this.state.matches.map(match =>
                            <div
                                key={match._id}
                                onClick={() => this.setCurrentOpenMatch(match._id, this.opponentName(match.names))}
                                className="w-40 rounded-sm shadow-md text-center bg-black text-white hover:bg-gray-800 cursor-pointer"
                            >
                                {this.opponentName(match.names)}
                            </div>)
                        )
                        : (<p>{this.state.noMatchesMessage}</p>)
                    }
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
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
                                            {this.state.createBetStarted ? 'Clear' : 'Create New Bet'}
                                        </button>
                                        {this.state.createBetStarted ?
                                            (<form onSubmit={this.handleSubmit}>
                                                <input
                                                    className="w-5/12"
                                                    name={'betTyped'}
                                                    value={this.state.betTyped}
                                                    onChange={this.handlePropBetChange}
                                                    placeholder='Ex: Kawhi will score at least 20 points tonight'
                                                    autoComplete='off'
                                                />
                                                <button type="submit">Submit</button>
                                            </form>)
                                            :
                                            (null)
                                        }
                                    </div>
                                    {this.state.propLabels.length ?
                                        (this.state.propLabels.map(propBet =>
                                            <div
                                                key={propBet._id}
                                                className="border border-gray-700"
                                            >
                                                {propBet.propLabels}
                                                <button
                                                    className={propBet.selected === 'Yes' ? 'bg-green-300 font-bold rounded-full'
                                                        : 'bg-gray-300 font-bold rounded-full'}
                                                    onClick={() => this.pickedYesOrNo(propBet._id, true)}
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    className={propBet.selected === 'No' ? 'bg-green-300 font-bold rounded-full'
                                                        : 'bg-gray-300 font-bold rounded-full'}
                                                    onClick={() => this.pickedYesOrNo(propBet._id, false)}
                                                >
                                                    No
                                                </button>
                                                {propBet.selected !== 'notYet' ?
                                                    (
                                                        <div>
                                                            <button
                                                                onClick={() => this.pickedWonOrLost(propBet._id, true)}
                                                            >
                                                                I Won
                                                            </button>
                                                            <button
                                                                onClick={() => this.pickedWonOrLost(propBet._id, false)}
                                                            >
                                                                I Lost
                                                            </button>
                                                        </div>
                                                    )
                                                    : (null)}
                                            </div>)
                                        )
                                        :
                                        (<p>No Bets</p>)
                                    }
                                </div>
                                <div>

                                    <p>Total Score: {this.whatIsTheScore()}</p>

                                </div>

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

export default Home; 