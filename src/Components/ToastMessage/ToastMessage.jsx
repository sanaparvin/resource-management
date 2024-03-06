import React, { useEffect } from 'react';
import './ToastMessage.css';

const ToastMessage = ({ message, onClose }) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timeout);
    }, [onClose]);

    return (
        <div className="toast">
            <p>{message}</p>
            <button className="closeto-btn" onClick={onClose}>Close</button>
        </div>
    );
};

export default ToastMessage;