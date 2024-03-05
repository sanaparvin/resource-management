import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUpload, faSignOutAlt, faPlus, faCog, faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogoutModal from './LogoutModal';
import logo from '../../Assets/learnhublogo.png';
import ToastMessage from '../ToastMessage/ToastMessage';
 
const Header = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();
    const uid=sessionStorage.getItem('uid');
    const roleIndex=sessionStorage.getItem('roleIndex');
    const [showModal, setShowModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [loading, setLoading] = useState(false); // State to track loading state
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [toastMessage, setToastMessage] = useState('');
 
 
 
  // Function to handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    
    // Function to handle file upload
    const handleUploadSubmit = async (event) => {
        event.preventDefault();
    
        if (!selectedFile) {
            setToastMessage("Please select a file to upload.");
            return;
        }
    
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("userid", uid);
        formData.append("uploadFile", selectedFile);
    
        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:5000/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        setUploadProgress(progress);
                    },
                }
            );
    
            console.log("Upload successful:", response.data);
            setToastMessage("Resource uploaded successfully!");
            setShowUploadModal(false);
        } catch (error) {
            console.error("Error uploading file:", error);
            setToastMessage("Error uploading file. Please try again.");
        } finally {
            setLoading(false);
            setShowUploadModal(false);
            setUploadProgress(0); // Reset progress bar
        }
    };
 
    const openModal = () => {
        setSelectedFile(null); // Clear the selected file when opening the modal
        setShowUploadModal(true);
    };
 
    const handleLogout = () => {
        setShowModal(true); // Show the logout modal
    };
 
    const confirmLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };
 
    const toggleSideNav = () => {
        setIsSideNavOpen(!isSideNavOpen);
    };
 
    const handleCloseToast = () => {
        setToastMessage(''); // Clear the toast message
    };
 
 
return (
 
    <header className="header">
        <div className="logo">
        <a href={`/home`}>
          <img src={logo} className='home-icon' />
        </a>
        </div>
        <div className="toggle-icon" onClick={toggleSideNav}>
            <FontAwesomeIcon icon={isSideNavOpen ? faTimes : faBars} className='bars-icon' />
        </div>
        <div className={`side-nav ${isSideNavOpen ? 'open' : ''}`}>
            {/* Upload Section */}
            <div className="upload-section">
                <div className="uploads">
                <div className="upload-part">
                    <label htmlFor="file-input" onClick={openModal}>
                    <FontAwesomeIcon icon={faPlus} className='upload-icon' />
                    </label>
                    <input
                        type="file"
                        id="file-input"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </div>
                <div className="upload-button">
                </div>
                </div>
            </div>
            <ul>
            <li>
            <a href={`/profile`} className={window.location.pathname === '/profile' ? 'active' : ''}>
                <FontAwesomeIcon icon={faUser} className='profile-icon'/>
                Profile
            </a>
            </li>
            <li>
            <a href={`/uploads`} className={window.location.pathname === '/uploads' ? 'active' : ''}>
                <FontAwesomeIcon icon={faUpload} className='profile-icon'/>
                My Uploads
            </a>
            </li>
        {roleIndex == 3 && (
            <li>
            <a href={`/moderator`} className={window.location.pathname === '/moderator' ? 'active' : ''}>
            <FontAwesomeIcon icon={faCog} className='profile-icon'/>
                    Moderator Settings
            </a>
            </li>
            )}
            {roleIndex == 2 && (
            <li>
            <a href={`/admin`} className={window.location.pathname === '/admin' ? 'active' : ''}>
            <FontAwesomeIcon icon={faCog} className='profile-icon'/>
                    Admin Settings
            </a>
            </li>
            )}
            <li>
            <a onClick={() => handleLogout()} className={window.location.pathname === '/logout' ? 'active' : ''}>
                <FontAwesomeIcon icon={faSignOutAlt} className='profile-icon'/>
                Logout
            </a>
            </li>
        </ul>
        </div>
        {showModal && <LogoutModal confirmLogout={confirmLogout} closeModal={() => setShowModal(false)} />}
        {showUploadModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>Are you sure you want to upload this file?</p>
                        <p>File Name: <span className='Filename'> {selectedFile ? selectedFile.name : ""}</span></p>
                        {loading ? (
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${uploadProgress}%` }}>{uploadProgress}%</div>
                            </div>
                        ) : (
                            <div className='UploadModal-btn'>
                                <button className="upload-btn" onClick={handleUploadSubmit}>Upload</button>
                                <button className="close-btn" onClick={() => setShowUploadModal(false)}>Cancel</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {toastMessage && <ToastMessage message={toastMessage} onClose={handleCloseToast} />}
    </header>
    
      
    );
};
 
export default Header;