// ToastMessage.jsx
 
import React, { useEffect } from 'react';
import './ToastMessage.css'; // Import CSS file for styling
 
const ToastMessage = ({ message, onClose }) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            onClose();
        }, 3000); // Auto-dismiss after 3 seconds
 
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