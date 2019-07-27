import React from 'react';


function DropDownName(props) {
    let { firstName, lastName } = props;
    return (
        <div className="flex mt-2 pb-2">
            <div className="w-full h-12">
                <div className="w-40 rounded-sm shadow-md text-center bg-black text-white hover:bg-gray-800 cursor-pointer" >
                    {firstName} {lastName}
                </div>
            </div>
        </div>
    )
}

export default DropDownName;