import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import './header.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUpload, faSignOutAlt, faPlus, faHome, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
 
const Header = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    // const location = useLocation();
    // const searchParams = new URLSearchParams(location.search);
    // const uid = searchParams.get("uid"); // Default role if not provided
    const navigate = useNavigate();
    const uid = sessionStorage.getItem('uid');
    const roleIndex = sessionStorage.getItem('roleIndex');
 
    // console.log(uid);
    
 
  // Function to handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    
    // Function to handle file upload
    const handleUploadSubmit = async (event) => {
        event.preventDefault();
    
        // Check if a file is selected
        if (!selectedFile) {
        alert("Please select a file to upload.");
        return;
        }
    
        // Create FormData object to send the file
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("userid", uid); // Append user ID to FormData
        formData.append("uploadFile", selectedFile);
    
        try {
        // Make POST request to upload endpoint
        const response = await axios.post(
            "http://localhost:5000/upload",
            formData,
            {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            }
        );
    
        // Handle successful upload response
        console.log("Upload successful:", response.data);
        // You may update the UI or perform other actions after successful upload
        alert("Resource uploaded successfully!");
        } catch (error) {
        console.error("Error uploading file:", error);
        // Handle upload error
        alert("Error uploading file. Please try again.");
        }
    };


    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            sessionStorage.clear();
            navigate('/');
        }
    };
 

return (
 
    <header className="header">
        <div className="logo">
        <a href={`/home`}>
          <FontAwesomeIcon icon={faHome} className='home-icon' />
        </a>
        </div>
        <div className="profile">
        <a href={`/profile`}>
        <FontAwesomeIcon icon={faUserAlt} className='user-icon' />
            </a>
        </div>
        <div className="side-nav">
            {/* Upload Section */}
            <div className="upload-section">
                <div className="uploads">
                <div className="upload-part">
                    <label htmlFor="file-input">
                    <FontAwesomeIcon icon={faPlus} className='upload-icon' />
                    </label>
                    <input
                    type="file"
                    id="file-input"
                    onChange={(event) => {
                        handleFileChange(event); // Call handleFileChange to update the selected file
                        handleUploadSubmit(event); // Call handleUploadSubmit to upload the file immediately
                    }}
                    style={{ display: "none" }}
                    />
                </div>
                <div className="upload-button">
                </div>
                </div>
            </div>
            <ul>
            <li>
            <a href={`/profile`}><FontAwesomeIcon icon={faUser} className='profile-icon'/>
                Profile
            </a>
            </li>
            <li>
            <a href={`/uploads`}><FontAwesomeIcon icon={faUpload} className='profile-icon'/>
                My Uploads
            </a>
            </li>
        {roleIndex == 3 && (
            <li>
            <a href={`/moderator`}>
            <FontAwesomeIcon icon={faSignOutAlt} className='profile-icon'/>
                    Moderator Settings
            </a>
            </li>
            )}
            {roleIndex == 2 && (
            <li>
            <a href={`/admin`}>
            <FontAwesomeIcon icon={faSignOutAlt} className='profile-icon'/>
                    Admin Settings
            </a>
            </li>
            )}
            <li>
            <a onClick={() =>handleLogout()}><FontAwesomeIcon icon={faSignOutAlt} className='profile-icon'/>
                Logout
            </a>
            </li>
        </ul>
        </div>
    </header>
    
      
    );
};
 
export default Header;