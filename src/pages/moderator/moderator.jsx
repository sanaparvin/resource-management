import React, { useState, useEffect } from 'react';
import Header from '../../Components/header/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import './moderator.css';
import UserModal from './UserModal';
import ResourceModal from './ResourceModal';
import ToastMessage from '../../Components/ToastMessage/ToastMessage';
 
function Moderator() {
    const [selectedOption, setSelectedOption] = useState('Users');
    const [searchQuery, setSearchQuery] = useState('');
    const [userSearchResults, setUserSearchResults] = useState([]);
    const [resourceSearchResults, setResourceSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedResourceId, setSelectedResourceId] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showResourceModal, setShowResourceModal] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

 
    useEffect(() => {
        // Fetch users data when component mounts
        fetchUsers();
    }, []);
 
    const fetchUsers = () => {
        fetch('http://127.0.0.1:5000/users')
            .then(response => response.json())
            .then(data => {
                setUserSearchResults(data.response || []);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setError('Error fetching users');
            });
    };
 
    const fetchResources = () => {
        fetch('http://127.0.0.1:5000/userresources')
            .then(response => response.json())
            .then(data => {
                setResourceSearchResults(data.response || []);
            })
            .catch(error => {
                console.error('Error fetching resources:', error);
                setError('Error fetching resources');
            });
    };
 
    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setSearchQuery('');
        setError(null);
 
        if (option === 'Users') {
            fetchUsers();
        } else if (option === 'Resources') {
            fetchResources();
        }
    };
 
    const handleSearch = () => {
        setUserSearchResults([]);
        setResourceSearchResults([]);
        setError(null);
 
        if (selectedOption === 'Users') {
            fetch(`http://127.0.0.1:5000/users?userName=${searchQuery}`)
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data.response)) {
                        setUserSearchResults(data.response);
                    } else {
                        setError('No users found');
                    }
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                    setError('Error fetching users');
                });
        } else if (selectedOption === 'Resources') {
            fetch(`http://127.0.0.1:5000/userresources?resourceName=${searchQuery}`)
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data.response)) {
                        setResourceSearchResults(data.response);
                    } else {
                        setError('No resources found');
                    }
                })
                .catch(error => {
                    console.error('Error fetching resources:', error);
                    setError('Error fetching resources');
                });
        }
    };
 
    const handleDeleteUser = (userId) => {
      setSelectedUserId(userId);
      setShowUserModal(true);
  };
 
  const handleDeleteResource = (resourceId) => {
      setSelectedResourceId(resourceId);
      setShowResourceModal(true);
  };
 
  const confirmDeleteUser = () => {
      setShowUserModal(false);
      // Delete user logic
      fetch(`http://127.0.0.1:5000/users/${selectedUserId}`, {
          method: 'DELETE'
      })
          .then(response => {
              if (response.ok) {
                  setUserSearchResults(prevUsers => prevUsers.filter(user => user.userid !== selectedUserId));
                  setToastMessage('User deleted successfully');
              } else {
                  console.error('Failed to delete user');
                  setError('Failed to delete user');
              }
          })
          .catch(error => {
              console.error('Error deleting user:', error);
              setError('Error deleting user');
          });
  };
 
  const confirmDeleteResource = () => {
      setShowResourceModal(false);
      // Delete resource logic
      fetch(`http://127.0.0.1:5000/delete/${selectedResourceId}`, {
          method: 'DELETE'
      })
          .then(response => {
              if (response.ok) {
                  setResourceSearchResults(prevResources => prevResources.filter(resource => resource.resourceid !== selectedResourceId));
                  setToastMessage('Resource deleted successfully');
              } else {
                  console.error('Failed to delete resource');
                  setError('Failed to delete resource');
              }
          })
          .catch(error => {
              console.error('Error deleting resource:', error);
              setError('Error deleting resource');
          });
  };
 
  const closeModal = () => {
      setShowUserModal(false);
      setShowResourceModal(false);
  };
 
    return (
        <div>
            <Header />
            <div className="container-mod">
                <h1 className='title-mod'>Manage User and Resources</h1>
                <div className="options">
                    <button onClick={() => handleOptionClick('Users')} className={`btn-users ${selectedOption === 'Users' ? 'selected' : ''}`}>Users</button>
                    <button onClick={() => handleOptionClick('Resources')} className={`btn-resources ${selectedOption === 'Resources' ? 'selected' : ''}`}>Resources</button>
                </div>
                {selectedOption && (
                    <div className="options-name">
                        <div className='search-container-mod'>
                            <div className="search-bar-mod">
                                <input type="text" placeholder={`Search ${selectedOption}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                <button onClick={handleSearch} type="submit" className='search-icon'><FontAwesomeIcon icon={faSearch} /></button>
                            </div>
                        </div>
                        <div className='error-msge'>
                        {error && <p className="error">{error}</p>}
                        </div>
                        {selectedOption === 'Users' && userSearchResults.length > 0 && (
                            <div className="card-container-mod">
                                {userSearchResults.map(user => (
                                    <div className="card-modU" key={user.userid}>
                                        <div className='info-mod'>
                                            <p className='user-card-name'> {user.userName}</p>
                                            <p>Role: {user.roleName}</p>
                                            <p>Email: {user.userEmail}</p>
                                            <p>Phone: {user.userPhno}</p>
                                        </div>
                                        <a  onClick={() => handleDeleteUser(user.userid)}><FontAwesomeIcon icon={faTrash} className='trash-icon'/></a>
                                        
                                    </div>
                                ))}
                            </div>
                        )}
                        {selectedOption === 'Resources' && resourceSearchResults.length > 0 && (
                            <div className="card-container-mod">
                                {resourceSearchResults.map(resource => (
                                <div className="card-modR" key={resource.resourceid}>
                                    <div className='info-mod'>
                                        <p className='user-card-name'> {resource.resourceName.length > 25 ? resource.resourceName.substring(0, 25) + '...' : resource.resourceName}</p>
                                        <p>Size: {resource.resourceSize}</p>
                                        <p>Uploaded by: {resource.username}</p>
                                        <a href={resource.uploadFile} target="_blank" rel="noopener noreferrer">Download</a>
                                    </div>
                                    <a  onClick={() => handleDeleteResource(resource.resourceid)}><FontAwesomeIcon icon={faTrash} className='trash-icon'/></a>
                                </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {showUserModal && (
                <UserModal
                    confirmDelete={confirmDeleteUser}
                    closeModal={closeModal}
                />
            )}
            {showResourceModal && (
                <ResourceModal
                    confirmDelete={confirmDeleteResource}
                    closeModal={closeModal}
                />
            )}
            {toastMessage && <ToastMessage message={toastMessage} onClose={() => setToastMessage('')} />}
        </div>
    );
}
 
export default Moderator;
 