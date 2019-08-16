import React from 'react';

const OpenBets = ({ propLabels, pickedYesOrNo, deletePropBet, pickedWonOrLost }) => {
    return (
        propLabels.filter(propBet => !propBet.whoWon).map((propBet, i, array) =>
            <div
                key={propBet._id}
                className="relative"
            >
                <div className="text-gray-900  tracking-wide mt-2 mx-12">
                    {propBet.propLabels}
                </div>
                <div>
                    <button
                        className={propBet.selected === 'Yes' ? 'px-3 py-1 my-3 mr-4 bg-green-400 tracking-wide text-gray-800 rounded focus:outline-none'
                            : 'px-3 py-1 my-3 mr-4 bg-gray-300 tracking-wide text-gray-800 rounded focus:outline-none'}
                        onClick={() => pickedYesOrNo(propBet._id, true)}
                    >
                        Yes
                </button>
                    <button
                        className={propBet.selected === 'No' ? 'px-3 py-1 my-3 ml-4 bg-red-400 tracking-wide text-gray-800 rounded focus:outline-none'
                            : 'px-3 py-1 my-3 ml-4 bg-gray-300 tracking-wide text-gray-800 rounded focus:outline-none'}
                        onClick={() => pickedYesOrNo(propBet._id, false)}
                    >
                        No
                </button>
                </div>
                <div
                    className="cursor-pointer absolute top-0 right-0 mr-5"
                    onClick={() => deletePropBet(propBet._id)}
                >
                    <i className="align-top text-red-900 fas fa-times"></i>
                </div>

                {propBet.selected !== 'notYet' ?

                    (<div><hr className="mt-2 mb-3 mx-auto" style={{ borderTop: '1px dotted #6D6E6E', clear: 'both', display: 'block', width: '21%', height: '0px' }} />
                        <div className="mb-4">
                            <button
                                className="mr-4 text-green-900 focus:outline-none"
                                onClick={() => pickedWonOrLost(propBet._id, true)}
                            >
                                Won
                            </button>
                            <button
                                className="ml-4 text-red-900 focus:outline-none"
                                onClick={() => pickedWonOrLost(propBet._id, false)}
                            >
                                Lost
                            </button>
                        </div>
                    </div>
                    )
                    : (null)}
                {array.length - 1 !== i ? (<hr className="mx-auto pl-20" style={{ border: '0', clear: 'both', display: 'block', width: '65%', height: '1px', backgroundColor: '#c3cdd8' }} />) : (null)}

            </div>)

    );
};

export default OpenBets;