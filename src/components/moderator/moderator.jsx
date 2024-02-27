import React, { useState } from 'react';
import './moderator.css'; // Importing CSS file for styling
import Header from '../header/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt, faDownload, faUndo } from '@fortawesome/free-solid-svg-icons';
 
function Moderator() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [resourceSearchResults, setResourceSearchResults] = useState([]);
  const [error, setError] = useState(null);
 
  const handleOptionClick = (option) => {
    setSelectedOption(option === selectedOption ? null : option);
    setSearchQuery(''); // Reset search query when switching options
    setError(null); // Clear any previous errors
  
    if (option === 'Users') {
      fetch('http://127.0.0.1:5000/users')
        .then(response => response.json())
        .then(data => {
          setUserSearchResults(data.response || []); // Set the fetched user data
        })
        .catch(error => {
          console.error('Error fetching users:', error);
          setError('Error fetching users'); // Display error message
        });
    } else if (option === 'Resources') {
      fetch('http://127.0.0.1:5000/userresources')
        .then(response => response.json())
        .then(data => {
          setResourceSearchResults(data.response || []); // Set the fetched resource data
        })
        .catch(error => {
          console.error('Error fetching resources:', error);
          setError('Error fetching resources'); // Display error message
        });
    }
  };
 
  const handleSearch = () => {
    setUserSearchResults([]); // Reset user search results
    setResourceSearchResults([]); // Reset resource search results
    setError(null); // Clear any previous errors
 
    if (selectedOption === 'Users') {
      fetch(`http://127.0.0.1:5000/users?userName=${searchQuery}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data.response)) {
            setUserSearchResults(data.response); // Set the fetched user data
          } else {
            setError('No users found'); // Display error message
          }
        })
        .catch(error => {
          console.error('Error fetching users:', error);
          setError('Error fetching users'); // Display error message
        });
    } else if (selectedOption === 'Resources') {
      fetch(`http://127.0.0.1:5000/userresources?resourceName=${searchQuery}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data.response)) {
            setResourceSearchResults(data.response); // Set the fetched resource data
          } else {
            setError('No resources found'); // Display error message
          }
        })
        .catch(error => {
          console.error('Error fetching resources:', error);
          setError('Error fetching resources'); // Display error message
        });
    }
  };
 
  const handleDeleteUser = (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      fetch(`http://127.0.0.1:5000/users/${userId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            // Remove the deleted user from the userSearchResults
            setUserSearchResults(prevUsers => prevUsers.filter(user => user.userid !== userId));
          } else {
            console.error('Failed to delete user');
            setError('Failed to delete user');
          }
        })
        .catch(error => {
          console.error('Error deleting user:', error);
          setError('Error deleting user');
        });
    }
  };
 
  const handleDeleteResource = (resourceId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this resource?");
    if (confirmDelete) {
      fetch(`http://127.0.0.1:5000/delete/${resourceId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            // Remove the deleted resource from the resourceSearchResults
            setResourceSearchResults(prevResources => prevResources.filter(resource => resource.resourceid !== resourceId));
          } else {
            console.error('Failed to delete resource');
            setError('Failed to delete resource');
          }
        })
        .catch(error => {
          console.error('Error deleting resource:', error);
          setError('Error deleting resource');
        });
    }
  };
 
  return (
    <div>
        <Header/>
    <div className="container-mod">
      <h1 className='title-mod'>Manage User and Resources</h1>
      <div className="options">
        <button onClick={() => handleOptionClick('Users')} className='btn-users'>Users</button>
        <button onClick={() => handleOptionClick('Resources')} className='btn-resources'>Resources</button>
      </div>
      {selectedOption && (
        <div className="options-name">
          <div className='search-container-mod'>
          <div className="search-bar-mod">
            <input type="text" placeholder={`Search ${selectedOption}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button onClick={handleSearch} type="submit" className='search-icon'><FontAwesomeIcon icon={faSearch}/></button>
          </div>
          </div>
          {error && <p className="error">{error}</p>}
          {selectedOption === 'Users' && userSearchResults.length > 0 && (
            <div className="card-container-mod">
              {userSearchResults.map(user => (
                <div className="card-modU" key={user.userid}>
                  <div className='info-mod'>
                  <p>Name: {user.userName}</p>
                  <p>Role: {user.roleName}</p>
                  <p>Email: {user.userEmail}</p>
                  <p>Phone: {user.userPhno}</p>
                  <button onClick={() => handleDeleteUser(user.userid)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {selectedOption === 'Resources' && resourceSearchResults.length > 0 && (
            <div className="card-container-mod">
              {resourceSearchResults.map(resource => (
                <div className="card-modR" key={resource.resourceId}>
                  <div className='info-mod'>
                  <p>Name: {resource.resourceName}</p>
                  <p>Size: {resource.resourceSize}</p>
                  <button onClick={() => handleDeleteResource(resource.resourceid)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
}
 
export default Moderator;