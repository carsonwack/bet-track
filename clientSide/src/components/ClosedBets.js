import React from 'react';

const OpenBets = ({ propLabels, youserEmail }) => {
    return (
        propLabels.filter(propBet => propBet.whoWon).map(propBet =>
            <div
                key={propBet._id}
                className="text-gray-600 border border-gray-700"
            >
                {propBet.propLabels}

                <div>
                    {propBet.whoWon === youserEmail ? 
                    ('won') 
                    : 
                    ('lost')
                }
                </div>
            </div>)

    );
};

export default OpenBets;