import React from 'react';


function DropDownName(props) {
    const { firstName, lastName } = props;
    return (
        <div
            className="w-64 leading-loose py-2 px-4 rounded-sm shadow-md text-lg text-center text-gray-200 bg-black hover:bg-gray-800 cursor-pointer"
        >
            {`${firstName} ${lastName}`}
        </div>
    )
}

export default DropDownName;