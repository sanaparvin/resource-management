import React, { useState, useEffect } from 'react';
import {useLocation} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt, faDownload, faUndo } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Header from '../header/header';
 
const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState('all');
    const [selectedDate, setSelectedDate] = useState(null);
    const [resources, setResources] = useState([]);
    const [popularResources, setPopularResources] = useState([]);
    // const location = useLocation();
    // const searchParams = new URLSearchParams(location.search);
    // const uid = searchParams.get("uid"); // Default role if not provided
 
 
 
    // console.log(uid);
    
    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };
 
 
  
 
 
    const handleFilterChange = (event) => {
        const value = event.target.value;
        // If "All" is selected, set filterOption to an empty string
        // Otherwise, set it to the selected value
        setFilterOption(value === "all" ? "" : value);
    };
    
 
    const handleSearchSubmit = async (event) => {
        event.preventDefault();
    
        try {
            let apiUrl = 'http://localhost:5000/userresources?';
    
            if (searchQuery) {
                apiUrl += `&resourceName=${searchQuery}`;
            }
    
            if (filterOption !== 'all') {
                apiUrl += `&resourceType=${filterOption}`;
            }
 
            if (selectedDate) {
                const year = selectedDate.getFullYear();
                const month = selectedDate.getMonth() + 1; // Months are zero-based
                const day = selectedDate.getDate();
                const dateString = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
                apiUrl += `&dateOfUpload=${dateString}`;
            }
 
            const response = await axios.get(apiUrl);
 
            // Ensure that the response has a user_resources property containing an array
            if (response.data && Array.isArray(response.data.response)) {
                setResources(response.data.response);
            } else {
                // If response does not have the expected structure, handle the error
                console.error('Unexpected API response:', response);
                setResources([]);
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
            setResources([]);
        }
    };
 
     // Function to fetch popular resources
     const fetchPopularResources = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/popularresources');
            setPopularResources(response.data.response);
        } catch (error) {
            console.error('Error fetching popular resources:', error);
            setPopularResources([]);
        }
    };
 
    // Call fetchPopularResources when the component mounts
    useEffect(() => {
        fetchPopularResources();
    }, []);

    const handleDownload = async (resourceId) => {
        try {
          await axios.get(
            `http://127.0.0.1:5000/download/${resourceId}`
          );
        } catch (error) {
          console.error("Error downloading resource:", error);
        }
    };
 
 
    return (
        <div className="home-page">
            <Header />
            <div className='search-header'>
            <div className="content">
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <div className="search-bar">
                    <div>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                        />
                        <button type="submit" className='search-icon'><FontAwesomeIcon icon={faSearch}/></button>
                    </div>
                    </div>
                    <div className="filter">
                        <select className='filter-select' value={filterOption} onChange={handleFilterChange}>
                            <option value="all">All</option>
                            <option value="Pdf">Pdf</option>
                            <option value="application/vnd.openxmlformats-officedocument.presentationml.presentation">Pptx</option>
                            <option value="msword">Word</option>
                            <option value="Video">Video</option>
                        </select>
                    </div>
                    <div className="date-picker">
                        <FontAwesomeIcon icon={faCalendarAlt} className='calendar-icon'/>
                        <DatePicker
                            selected={selectedDate}
                            onChange={date => setSelectedDate(date)}
                            placeholderText="Select Date"
                            dateFormat="yyyy-MM-dd"
                        />
                        <div className="reset-filter">
                    <FontAwesomeIcon icon={faUndo} className='reset-icon' onClick={() => {
                        setSelectedDate(null);
                        setFilterOption('all');
                    }} />
                    </div>
                    </div>
                </form>
                </div>
                </div>
                <div className='container'>
                <div className="resources">
                    {resources.map((resource, index) => (
                        <div key={index} className="resource-item card">
                            <div className="card-body">
                                <h4 className="initial-title">{resource.resourceName}</h4>
                                <div className="caption">
                                    <h5 className="card-title">{resource.resourceName}</h5>
                                    <p className="card-text">Resource Size: {resource.resourceSize}</p>
                                    <p className="card-text">Date of Upload: {resource.dateOfUpload}</p>
                                    <p className="card-text">Username: {resource.username}</p>
                                    <a
                                        href={resource.uploadFile}
                                        onClick={() => handleDownload(resource.resourceid)}
                                        download
                                    >
                                        <FontAwesomeIcon icon={faDownload} />
                                        Download
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <h2 className='PR-title'>Popular Resources</h2>
                <div className="popular-resources">
                        {popularResources.map((resource, index) => (
                            <div key={index} className="resource-item card">
                                    <div className="card-body">
 
                                    <h4 className="initial-title">{resource.resourceName}</h4>
                                    <div className="caption">
                                        <h5 className="card-title">{resource.resourceName}</h5>
                                        <p className="card-text">Date of Upload: {resource.dateOfUpload}</p>
                                        <p className="card-text">Downloads: {resource.noOfDownloads}</p>
                                        <a 
                                            href={resource.uploadFile}
                                            onClick={() => handleDownload(resource.resourceId)}
                                            download
                                        >
                                          <div onClick={() => fetchPopularResources()}>
                                            <FontAwesomeIcon icon={faDownload} />
                                            Download
                                          </div>
                                        </a>
                                        </div>
                                    </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};
 
export default Home;