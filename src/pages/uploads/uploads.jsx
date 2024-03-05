import React, { useState, useEffect } from 'react';
import Header from '../../Components/header/header';
import './uploads.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from './DeleteModal';
import ToastMessage from '../../Components/ToastMessage/ToastMessage';

 
 
function Upload() {
    const uid = sessionStorage.getItem('uid');
 
    const [resourceName, setResourceName] = useState('');
    const [resources, setResources] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedResource, setSelectedResource] = useState(null); // Track the selected resource for deletion
    const [showModal, setShowModal] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
 
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
 
    const handleDelete = (resourceId) => {
        setSelectedResource(resourceId); // Set the selected resource for deletion
        setShowModal(true); // Show the modal
    };
 
    const confirmDelete = async () => {
        try {
            // Close the modal
            setShowModal(false);
            // Make DELETE request to delete the resource
            await fetch(`http://127.0.0.1:5000/delete/${selectedResource}`, {
                method: 'DELETE'
            });
            // Filter out the deleted resource from the resources state
            setResources(prevResources => prevResources.filter(resource => resource.resourceid !== selectedResource));
            // Display toast message for successful deletion
            setToastMessage('Resource deleted successfully');
        } catch (error) {
            console.error('Error deleting resource:', error);
        }
    };
 
    const closeModal = () => {
        setShowModal(false); // Close the modal
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
                                <div className="resource-name">{resource.resourceName.length > 25 ? resource.resourceName.substring(0, 25) + '...' : resource.resourceName}</div>
                                <div className='info'>Size: {resource.resourceSize}</div>
                                <div className='info'>Date of Upload: {resource.dateOfUpload}</div>
                                <div className='info'>No. of Downloads: {resource.noOfDownloads}</div>
                                <a href={resource.uploadFile} target="_blank" rel="noopener noreferrer">Download</a>
                            </div>
                            <div className="button-container">
                                <a onClick={() => handleDelete(resource.resourceid)}><FontAwesomeIcon icon={faTrash} className='trash-icon'/></a>
                            </div>
                        </div>
                    ))}
                </div>
                {showModal && (
                    <DeleteModal
                        confirmDelete={confirmDelete}
                        closeModal={closeModal}
                    />
                )}
            </div>
            {toastMessage && <ToastMessage message={toastMessage} onClose={() => setToastMessage('')} />}
        </div>
    );
}
 
export default Upload;
 