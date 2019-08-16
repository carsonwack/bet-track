import React, { Component } from 'react';

class CreateNewBet extends Component {

    constructor(props) {
        super(props)
        this.betInput = React.createRef();
    }

    componentDidUpdate(prevProps) {
        const betInput = this.betInput.current;
        if (betInput) {
            betInput.focus()
        }
    }


    render() {

        const { flipBetStarted, createBetStarted, handleSubmit, betTyped, handlePropBetChange } = this.props;
        return (
            <div className="mt-2 currentPropBets">
                <button
                    onClick={flipBetStarted}
                    className={`${createBetStarted ? 'bg-red-700 hover:bg-red-800' : 'bg-green-900 hover:bg-green-800'} tracking-wide text-white py-2 px-4 rounded border-b-2 border-gray-900 shadow focus:outline-none my-6`}>
                    {createBetStarted ? 'Clear Bet' : 'New Bet'}
                </button>
                {createBetStarted ?
                    (<form className="mb-4" onSubmit={handleSubmit}>
                        <input
                            className="text-green-900 pl-2 ml-8 focus:outline-none"
                            name={'betTyped'}
                            value={betTyped}
                            onChange={handlePropBetChange}
                            placeholder={`"Kawhi will score at least 20 points tonight"`}
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            style={{ width: "280px", fontSize: "90%", borderRadius: "5px" }}
                            ref={this.betInput}
                        />
                        <button className="ml-4 hover:bg-transparent bg-green-900 hover:text-green-900 text-white py-1 px-2 border hover:border-green-900 border-transparent rounded focus:outline-none" type="submit">Submit</button>
                    </form>)
                    :
                    (null)
                }
            </div>
        );
    }
}

export default CreateNewBet;