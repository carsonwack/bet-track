import React from 'react';

const OpenBets = ({ propLabels, youserEmail }) => {
    return (
        propLabels.filter(propBet => propBet.whoWon).map( (propBet, i, array) =>
            <div
                key={propBet._id}
                className="text-gray-700 text-left tracking-wide mt-2 mx-24"
            >
                {propBet.propLabels}

                <div>
                    {propBet.whoWon === youserEmail ? 
                    ('won') 
                    : 
                    ('lost')
                }
                </div>
                {array.length -1 !== i ? (<hr className="mx-auto pl-20" style={{ border: '0', clear: 'both', display: 'block', width: '65%', height: '1px', backgroundColor: '#c3cdd8' }} />) : (null)}
            </div>)

    );
};

export default OpenBets;