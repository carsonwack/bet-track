import React from 'react';


function DropDownName(props) {
    let { firstName, lastName, _id } = props;
    return (
        <div className="flex mt-2 pb-2">
            <div className="w-full h-12">
                
                <button className="w-40 rounded-sm shadow-md text-center bg-black text-white hover:bg-gray-800 cursor-pointer" >
                    {firstName} {lastName}
                </button>
            </div>
        </div>
    )
}

export default DropDownName;