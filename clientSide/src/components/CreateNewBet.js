import React from 'react';

const CreateNewBet = ({ opponentName, flipBetStarted, createBetStarted, handleSubmit, betTyped, handlePropBetChange }) => {
    return (
        <div>
            <p> You vs {opponentName} </p>

            <div className="currentPropBets">
                <button
                    onClick={flipBetStarted}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
                    {createBetStarted ? 'Clear' : 'Create New Bet'}
                </button>
                {createBetStarted ?
                    (<form onSubmit={handleSubmit}>
                        <input
                            className="w-5/12"
                            name={'betTyped'}
                            value={betTyped}
                            onChange={handlePropBetChange}
                            placeholder='Ex: Kawhi will score at least 20 points tonight'
                            autoComplete='off'
                        />
                        <button type="submit">Submit</button>
                    </form>)
                    :
                    (null)
                }
            </div>
        </div>
    );
};

export default CreateNewBet;