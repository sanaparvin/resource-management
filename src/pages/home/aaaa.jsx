[12:16 PM] Godwin George U
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt, faDownload, faUndo } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Header from '../components/Components';
 
const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState('type');
    const [selectedDate, setSelectedDate] = useState(null);
    const [resources, setResources] = useState([]);
    const [popularResources, setPopularResources] = useState([]);
    const [searched, setSearched] = useState(false); // Track whether a search has been performed
 
    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };
 
    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
    };
 
    const handleSearchSubmit = async (event) => {
        if (event) {
            event.preventDefault();
        }
 
        try {
            let apiUrl = 'http://localhost:5000/userresources?';
 
            if (searchQuery) {
                apiUrl += `&resourceName=${searchQuery}`;
            }
 
            if (filterOption !== 'type' && filterOption !== 'all') {
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
                setSearched(true); // Set searched to true when resources are found
            } else {
                console.error('Unexpected API response:', response);
                setResources([]);
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
            setResources([]);
        }
    };
 
    const handleDownload = async (resourceId) => {
        try {
          await axios.get(
            `http://127.0.0.1:5000/download/${resourceId}`
          );
        } catch (error) {
          console.error("Error downloading resource:", error);
        }
    };
 
    const fetchPopularResources = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/popularresources');
            setPopularResources(response.data.response);
        } catch (error) {
            console.error('Error fetching popular resources:', error);
            setPopularResources([]);
        }
    };
 
    useEffect(() => {
        fetchPopularResources();
    }, []);
 
    useEffect(() => {
        if (filterOption !== 'type' || selectedDate !== null) {
            handleSearchSubmit();
        }
    }, [filterOption, selectedDate]);
 
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
                        <div className='filters'>
                            <div className="filter">
                                <select className='filter-select' value={filterOption} onChange={handleFilterChange}>
                                    <option value="type">Type</option>
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
                                        setFilterOption('type');
                                        setSearchQuery('');
                                    }} />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
                
            <div className='container'>
                {searched && resources.length === 0 ? (
                    <p className='no-rslts'>No resources found.</p>
                ) : resources.length > 0 && (
                    <>
                        <h2 className='PR-title'>Searched Results</h2>
                        <div className="resources">
                            {resources.map((resource, index) => (
                                <div key={index} className="resource-item card">
                                    <div className="card-body">
                                        <h4 className="initial-title">{resource.resourceName.length > 25 ? resource.resourceName.substring(0, 25) + '...' : resource.resourceName}</h4>
                                        <div className="caption">
                                            <h5 className="card-title">{resource.resourceName}</h5>
                                            <p className="card-text">Resource Size: {resource.resourceSize}</p>
                                            <p className="card-text">Date of Upload: {resource.dateOfUpload}</p>
                                            <p className="card-text">Uploaded by: {resource.username}</p>
                                        </div>
                                        <a
                                            href={resource.uploadFile}
                                            onClick={() => handleDownload(resource.resourceId)}
                                            download
                                        >
                                            <div onClick={() => fetchPopularResources()}>
                                                <button className='download-btn'>
                                                    <FontAwesomeIcon icon={faDownload} />
                                                </button>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                <h2 className='PR-title'>Popular Resources</h2>
                <div className="popular-resources">
                    {popularResources.map((resource, index) => (
                        <div key={index} className="resource-item card">
                            <div className="card-body">
                                <h4 className="initial-title">{resource.resourceName.length > 25 ? resource.resourceName.substring(0, 25) + '...' : resource.resourceName}</h4>
                                <div className="caption">
                                    <h5 className="card-title">{resource.resourceName}</h5>
                                    <p className="card-text">Date of Upload: {resource.dateOfUpload}</p>
                                    <p className="card-text">Downloads: {resource.noOfDownloads}</p>
                                </div>
                                <a
                                    href={resource.uploadFile}
                                    onClick={() => handleDownload(resource.resourceId)}
                                    download
                                >
                                    <div onClick={() => fetchPopularResources()}>
                                        <button className='download-btn'>
                                            <FontAwesomeIcon icon={faDownload} />
                                        </button>
                                    </div>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
 
export default Home;
 