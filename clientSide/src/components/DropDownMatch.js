import React from 'react';


function DropDownMatch(props) {
    let { name } = props;
    return (
        <div className="w-40 rounded-sm shadow-md text-center bg-black text-white hover:bg-gray-800 cursor-pointer">
            {name}
        </div>
    )
}

export default DropDownMatch;