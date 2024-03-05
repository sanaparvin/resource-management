import React from 'react';
 
const DeleteModal = ({ confirmDelete, closeModal }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <p>Are you sure you want to delete this resource?</p>
                <div className="modal-buttons">
                    <button className="delete-btn" onClick={confirmDelete}>Delete</button>
                    <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                </div>
            </div>
        </div>
    );
};
 
export default DeleteModal;
