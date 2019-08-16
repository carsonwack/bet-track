import React from 'react';
import ReactModal from 'react-modal';


const customStyles = {
    content: {
        top: '40%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const Modal = ({ showModal, modalName, yesStartMatch, handleCloseModal }) => {
    return (
        <div>
            <ReactModal
                isOpen={showModal}
                contentLabel={modalName}
                ariaHideApp={false}
                style={customStyles}
            >
                <p className="mt-4">Start match with <span className="font-bold">{modalName}</span>?</p>
                <div className="flex my-6">
                    <div
                        onClick={yesStartMatch}
                        className="mx-auto mr-4 font-bold cursor-pointer object-right-top text-green-900">
                        Yes
                    </div>
                    <div
                        onClick={handleCloseModal}
                        className="mx-auto ml-4 font-bold cursor-pointer object-right-top text-red-900">
                        No
                    </div>
                </div>
            </ReactModal>
        </div>
    );
};



export default Modal;