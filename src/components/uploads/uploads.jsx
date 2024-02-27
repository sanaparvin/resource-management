
import React, { useState, useEffect } from 'react';
import Header from '../header/header';
import './uploads.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
 
function Upload() {
    const uid = sessionStorage.getItem('uid');
 
    const [resourceName, setResourceName] = useState('');
    const [resources, setResources] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
 
    useEffect(() => {
        fetchResources();
    }, []);
 
    const fetchResources = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/userresources?userid=${uid}`);
            const data = await response.json();
            if (Array.isArray(data.response) && data.response.length > 0) {
                setResources(data.response);
                setErrorMessage('');
            } else {
                setResources([]);
                setErrorMessage('No resources found');
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
            setErrorMessage('An error occurred while fetching resources');
        }
    };
 
    const handleSearch = async () => {
        try {
            // Clear previous error message
            setErrorMessage('');
            
            const response = await fetch(`http://127.0.0.1:5000/userresources?userid=${uid}&resourceName=${resourceName}`);
            const data = await response.json();
            if (Array.isArray(data.response) && data.response.length > 0) {
                setResources(data.response);
            } else {
                setResources([]);
                setErrorMessage('No resources found');
            }
        } catch (error) {
            console.error('Error searching for resources:', error);
        }
    };
 

    const handleDelete = async (resourceId) => {
        try {
            // Display confirmation dialog
            const confirmed = window.confirm("Are you sure you want to delete this resource?");
            if (!confirmed) {
                return; // Do nothing if user cancels
            }
    
            await fetch(`http://127.0.0.1:5000/delete/${resourceId}`, {
                method: 'DELETE'
            });
            // Filter out the deleted resource from the resources state
            setResources(prevResources => prevResources.filter(resource => resource.resourceid !== resourceId));
        } catch (error) {
            console.error('Error deleting resource:', error);
        }
    };
 
    return (
        <div>
            <Header/>
            <div className="my-upload-container">
                <h3 className='title-up'>My Uploads</h3>
                <div className="search-container-up">
                    <div className='search-bar-up'>
                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={resourceName}
                            onChange={(e) => setResourceName(e.target.value)}
                        />
                        <button onClick={handleSearch} type="submit" className='search-icon'>
                            <FontAwesomeIcon icon={faSearch}/>
                        </button>
                    </div>
                </div>
                <div className='error-msge'>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                </div>
                <div className="resource-cards">
                    {resources.map((resource) => (
                        <div key={resource.resourceid} className="resource-card">
                            <div className="resource-info">
                                <div className="resource-name">Resource Name: {resource.resourceName}</div>
                                <div className='info'>Resource Size: {resource.resourceSize}</div>
                                <div className='info'>Date of Upload: {resource.dateOfUpload}</div>
                                <div className='info'>No. of Downloads: {resource.noOfDownloads}</div>
                                <a href={resource.uploadFile} target="_blank" rel="noopener noreferrer">View</a>
                            </div>
                            <div className="button-container">
                                <button onClick={() => handleDelete(resource.resourceid)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
 
export default Upload;
