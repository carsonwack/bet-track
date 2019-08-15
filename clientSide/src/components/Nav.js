import React from 'react';
import logo from '../logo.png';

const Nav = ({children}) => {
    return (
        <nav className="flex border-b-2 border-gray-900 items-center justify-between flex-wrap bg-green-900 px-6 py-2">
            <div className="flex items-center flex-shrink-0 mr-10">
                <img className="h-10 w-12 mx-10" src={logo} alt="bet track logo" />
                <div className="ml-12">{children}</div>
            </div>
        </nav>
    );
};

export default Nav;