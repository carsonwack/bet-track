import React from 'react';

const OpenBets = ({ propLabels, youserEmail }) => {
    return (
        propLabels.filter(propBet => propBet.whoWon).map((propBet, i, array) =>
            <div>
                <div className="flex justify-between">
                    <div
                        key={propBet._id}
                        className="text-gray-700 text-left tracking-wide my-3 mx-24"
                    >
                        {propBet.propLabels}
                    </div>
                    <div className="self-center mr-16" role="img" aria-label="Face With Rolling Eyes Emoji">
                        {propBet.whoWon === youserEmail ?
                            ('💰')
                            :
                            (null)
                        }
                    </div>

                </div>
                {array.length - 1 !== i ? (<hr className="mx-auto pl-20" style={{ border: '0', clear: 'both', display: 'block', width: '65%', height: '1px', backgroundColor: '#c3cdd8' }} />) : (null)}
            </div>
        )

    );
};

export default OpenBets;