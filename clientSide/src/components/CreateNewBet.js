import React from 'react';

const CreateNewBet = ({ flipBetStarted, createBetStarted, handleSubmit, betTyped, handlePropBetChange }) => {
    return (
            <div className="mt-2 currentPropBets">
                <button
                    onClick={flipBetStarted}
                    className={`${createBetStarted ? 'bg-red-700 hover:bg-red-800' : 'bg-green-900 hover:bg-green-800'} tracking-wide text-white py-2 px-4 rounded border-b-2 border-gray-900 shadow focus:outline-none my-6`}>
                    {createBetStarted ? 'Clear Bet' : 'New Bet'}
                </button>
                {createBetStarted ?
                    (<form onSubmit={handleSubmit}>
                        <input
                            className="text-green-900 pl-2 ml-8 focus:outline-none"
                            name={'betTyped'}
                            value={betTyped}
                            onChange={handlePropBetChange}
                            placeholder="'Kawhi will score at least 20 points tonight'"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            style={{ width: "280px", "fontSize": "90%", "borderRadius": "5px"}}
                        />
                        <button className="ml-3 bg-transparent hover:bg-green-900 text-green-900 font-bold hover:text-white pb pt-2 px-2 border border-green-900 hover:border-transparent rounded" type="submit">Submit</button>
                    </form>)
                    :
                    (null)
                }
            </div>
    );
};

export default CreateNewBet;