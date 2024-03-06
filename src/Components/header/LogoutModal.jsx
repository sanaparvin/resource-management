import React from 'react';

const LogoutModal = ({ confirmLogout, closeModal }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <p>Are you sure you want to logout?</p>
                <div className="modal-buttons">
                    <button className="logout-btn" onClick={confirmLogout}>Logout</button>
                    <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;