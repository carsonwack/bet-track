import React, { Component } from 'react';
import API from '../utils/API';
import DropDownName from '../components/DropDownName';
import ReactModal from 'react-modal';


class Login extends Component {

    state = {
        users: [],
        filtered: [],
        showModal: false,
        modalName: '',
        modalId: ''
    }

    componentDidMount() {
        // Gets all users from db
        // Caches them in state.users -> array of arrays in format:  [ {firstName: 'carson', lastName: 'wack', id: _id}, ...]
        API.getAllUsers()
            .then(res => {
                let firstLastId = [];
                for (let userObj of res.data) {
                    firstLastId.push({ firstName: userObj.firstName, lastName: userObj.lastName, _id: userObj._id })
                }
                this.setState({
                    users: firstLastId
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
    }

    nameClicked = (fName, lName, id) => {
        const fullName = `${fName} ${lName}`;
        this.setState({
            showModal: true,
            modalName: fullName,
            modalId: id
        })
    }

    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    yesStartMatch = () => {
        this.handleCloseModal();
        // API.startMatch
    }



    render() {


        return (
            <div className="Home bg-blue-200">
                <div className="border-2 border-gray-600">
                    <h1>Home</h1>
                </div>
                <br />
                <br />
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
                        <div key={user._id} onClick={() => this.nameClicked(user.firstName, user.lastName, user._id)}>
                            <DropDownName key={user._id} {...user} />
                        </div>
                    )

                    )
                    :
                    (null)
                }

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