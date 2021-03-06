import React, { Component } from 'react';

class Matches extends Component {

    opponentName = (userEmail, nameArray) => {
        let person1 = nameArray[0].split(' ');
        let person2 = nameArray[1].split(' ');
        if (person1[0] === userEmail) {
            person2[1] = person2[1][0].toUpperCase() + person2[1].slice(1);
            person2[2] = person2[2][0].toUpperCase() + person2[2].slice(1);
            return `${person2[1]} ${person2[2]}`
        }
        else {
            person1[1] = person1[1][0].toUpperCase() + person1[1].slice(1);
            person1[2] = person1[2][0].toUpperCase() + person1[2].slice(1);
            return `${person1[1]} ${person1[2]}`
        }
    }

    render() {

        const { userEmail, matches, setMatch } = this.props;
        return (
            <div className="absolute top-0 right-0 mt-16 mr-20">
                <h3 className="text-center mb-1 text-xl"> Matches </h3>
                {matches.map(match => (
                    <div
                        key={match._id}
                        onClick={() => setMatch(match._id, this.opponentName(userEmail, match.names))}
                        className="w-64 py-2 px-2 rounded-sm shadow-md text-lg text-center bg-black text-white hover:bg-gray-800 cursor-pointer"
                    >
                        {this.opponentName(userEmail, match.names)}
                    </div>
                ))}
            </div>
        );
    }
}

export default Matches;