import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../header/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import "./profile.css"; // Import CSS file for styling

function Profile() {
  const uid = sessionStorage.getItem("uid");
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [option, setOption] = useState("password"); // Default option is password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/users/${uid}`);
        const data = await response.json();
        setUserData(data.response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [uid]);

  const handleChangeOption = (selectedOption) => {
    setOption(selectedOption);
    setShowModal(true); // Show modal when option changes
    // Clear old message when option changes
    setMessage("");
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/users/passwordupdate/${uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );
      const data = await response.json();
      setMessage(data.response);
      if (data.statuscode === 200) {
        // Clear input fields
        setOldPassword("");
        setNewPassword("");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const handleChangePhoneNumber = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/users/phnoupdate/${uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userPhno: newPhoneNumber }),
        }
      );
      const data = await response.json();
      setMessage(data.response);
      if (data.statuscode === 200) {
        // Clear input field
        setNewPhoneNumber("");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error updating phone number:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="profile-container">
        <div className="profile-title">My Profile</div>
        
        <div className="pro-container">{userData && (
          <div className="profile-data">
            <div className="pro-image-box">
          <FontAwesomeIcon icon={faUserAlt} className=" profile-image" />
        </div>
            <h4 className="user-name"> {userData.userName}</h4>
            <p>Email ID: {userData.userEmail}</p>
            <div className="phno">
              <p>Phone Number: {userData.userPhno}</p>
              <a onClick={() => handleChangeOption("phonenumber")}>
                Change
              </a>
            </div>
            <div className="password-btn">
              <button onClick={() => handleChangeOption("password")}>
                Change Password
              </button>
            </div>
          </div>
        )}</div>


        {message && <div className="message">{message}</div>}

        {showModal && (
          <div className="modal">
              <div className="modal-content">
              <span className="close" onClick={() => setShowModal(false)}>
                &times;
              </span>
              {option === "password" && (
                <div className="pass-box">
                  <label htmlFor="oldPassword">Old Password:</label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
              )}
              <div className="pass-box">
                <label htmlFor="newInput">
                  {option === "password" ? "New Password" : "New Phone Number"}:
                </label>
                <input
                  type={
                    option === "password" && showPasswords ? "text" : "text"
                  }
                  id="newInput"
                  value={option === "password" ? newPassword : newPhoneNumber}
                  onChange={(e) =>
                    option === "password"
                      ? setNewPassword(e.target.value)
                      : setNewPhoneNumber(e.target.value)
                  }
                />
              </div>
              {option === "password" && (
                <div>
                  <input
                    type="checkbox"
                    id="showPasswords"
                    checked={showPasswords}
                    onChange={() => setShowPasswords(!showPasswords)}
                  />
                  <label htmlFor="showPasswords">Show</label>
                </div>
              )}
              <button
                onClick={
                  option === "password"
                    ? handleChangePassword
                    : handleChangePhoneNumber
                }
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
