import React, { Component } from 'react';


class CurrentOpenMatch extends Component {

    calcCurrentScore = () => {
        const { youser, oppser } = this.props;
        let yourScore = parseInt(youser[1])
        let oppScore = parseInt(oppser[1])
        let totalScore = yourScore - oppScore;

        if (totalScore > 0) {
            return `Up by ${totalScore}`
        }
        else if (totalScore < 0) {
            return `Down by ${totalScore}`
        }
        else {
            return 'Tied'
        }
    }

    render() {
        return (
            <div>
                <div>
                    <div> Bets: 
                    {this.props.propLabels.length ? 
                    (this.props.propLabels.map( prop => 
                        <p key={prop}>
                            {prop}
                        </p>
                    )
                    )
                    :
                    (<p>No Bets</p>)
                    }
                    </div>

                </div>
                <div>
                    <p> Total Score: {this.calcCurrentScore()} </p>
                </div>
                {/* Your Total $ Won: {this.props.youser[1]}
            Opponent Total $ Won: {this.props.oppser[1]} */}
            </div>
        )
    }
}

export default CurrentOpenMatch;