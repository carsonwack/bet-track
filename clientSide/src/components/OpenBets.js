import React from 'react';

const OpenBets = ({ propLabels, pickedYesOrNo, deletePropBet, pickedWonOrLost }) => {
    return (
        propLabels.filter(propBet => !propBet.whoWon).map( propBet =>
            <div
                key={propBet._id}
                className="border border-gray-700"
            >
                {propBet.propLabels}
                <button
                    className={propBet.selected === 'Yes' ? 'bg-green-300 font-bold rounded-full'
                        : 'bg-gray-300 font-bold rounded-full'}
                    onClick={() => pickedYesOrNo(propBet._id, true)}
                >
                    Yes
                </button>
                <button
                    className={propBet.selected === 'No' ? 'bg-green-300 font-bold rounded-full'
                        : 'bg-gray-300 font-bold rounded-full'}
                    onClick={() => pickedYesOrNo(propBet._id, false)}
                >
                    No
                </button>
                <div
                    className="cursor-pointer"
                    onClick={() => deletePropBet(propBet._id)}
                >
                    x
                </div>
                {propBet.selected !== 'notYet' ?
                    (
                        <div>
                            <button
                                onClick={() => pickedWonOrLost(propBet._id, true)}
                            >
                                Won
                            </button>
                            <button
                                onClick={() => pickedWonOrLost(propBet._id, false)}
                            >
                                Lost
                            </button>
                        </div>
                    )
                    : (null)}
            </div>)

    );
};

export default OpenBets;