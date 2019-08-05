import React, { Component } from 'react';

class Matches extends Component {

    opponentName = (userEmail, nameArray) => {
        let person1 = nameArray[0].split(' ');
        let person2 = nameArray[1].split(' ');
        if (person1[0] === userEmail) {
            return `${person2[1]} ${person2[2]}`
        }
        else {
            return `${person1[1]} ${person1[2]}`
        }
    }

    render() {

        const { userEmail, matches, setMatch } = this.props;
        return (
            <div className="absolute top-0 right-0 mt-12 mr-32">
                <h3> Matches </h3>
                {matches.map(match => (
                    <div
                        key={match._id}
                        onClick={() => setMatch(match._id, this.opponentName(userEmail, match.names))}
                        className="w-40 rounded-sm shadow-md text-center bg-black text-white hover:bg-gray-800 cursor-pointer"
                    >
                        {this.opponentName(userEmail, match.names)}
                    </div>
                ))}
            </div>
        );
    }
}

export default Matches;