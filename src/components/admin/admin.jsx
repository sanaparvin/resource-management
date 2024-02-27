import React, { useState, useEffect } from 'react';
import './admin.css';
import Header from '../header/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt, faDownload, faUndo } from '@fortawesome/free-solid-svg-icons';
 
function Admin() {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
 
  useEffect(() => {
    // Perform initial search when component mounts
    handleSearch();
  }, []); // Empty dependency array means this effect runs only once on mount
 
  const handleSearch = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/users?userName=${query}`);
      const data = await response.json();
      if (Array.isArray(data.response)) {
        // Update isModerator property based on roleName
        const updatedUsers = data.response.map(user => ({
          ...user,
          isModerator: user.roleName === 'moderator'
        }));
        setSearchResult(updatedUsers);
        setErrorMessage('');
      } else {
        setSearchResult([]);
        setErrorMessage('No users found');
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setErrorMessage('An error occurred while searching users');
    }
  };
 
  const handleToggle = async (userId, isModerator) => {
    try {
      const endpoint = isModerator
        ? `http://127.0.0.1:5000/users/studentsetup/${userId}`
        : `http://127.0.0.1:5000/users/moderatorsetup/${userId}`;
 
      await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
 
      // Update the isModerator property in the state
      setSearchResult(prevUsers =>
        prevUsers.map(user => {
          if (user.userid === userId) {
            return { ...user, isModerator: !isModerator };
          }
          return user;
        })
      );
 
    } catch (error) {
      console.error('Error toggling user role:', error);
    }
  };
 
  return (
    <div>
        <Header/>
        <div className='container-ad'>
          <div className='search-container-ad'>
      <div className="search-bar-ad">
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} type="submit" className='search-icon'><FontAwesomeIcon icon={faSearch}/></button>
      </div>
      </div>
      <div className='error-msge'>
      {errorMessage && <div>{errorMessage}</div>}
      </div>
      <div className="user-cards">
        {searchResult.map((user) => (
          <div key={user.userid} className="user-card">
            <div className='user-info'>
            <div>Username: {user.userName}</div>
            <div>Email: {user.userEmail}</div>
            <div>Phone Number: {user.userPhno}</div>
            <div>Role: {user.isModerator ? 'Moderator' : 'Student'}
            </div>
            </div>
            <div  className='slider'>
            <label className="switch">
              <input
                type="checkbox"
                checked={user.isModerator}
                onChange={() => handleToggle(user.userid, user.isModerator)}
              />
              <span className="slider round"></span>
            </label>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
 
export default Admin;