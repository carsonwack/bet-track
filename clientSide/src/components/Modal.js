import React from 'react';
import ReactModal from 'react-modal';


const customStyles = {
    content: {
        top: '50%',
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
                <p className="font-bold">Start match with {modalName} ?</p>
                <div
                    onClick={yesStartMatch}
                    className="cursor-pointer object-right-top">
                    Yes
                    </div>
                <div
                    onClick={handleCloseModal}
                    className="cursor-pointer object-right-top">
                    No
                        </div>
            </ReactModal>
        </div>
    );
};



export default Modal;