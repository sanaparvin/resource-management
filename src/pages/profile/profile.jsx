import React, { useState, useEffect } from "react";
import Header from '../../Components/header/header';
import "./profile.css";
import ToastMessage from '../../Components/ToastMessage/ToastMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen} from '@fortawesome/free-solid-svg-icons';

function Profile() {
  const uid = sessionStorage.getItem("uid");
  const [userData, setUserData] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [option, setOption] = useState("password");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [message, setMessage] = useState("");
  const [toastMessage, setToastMessage] = useState('');

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
    setShowProfileModal(true);
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
      setToastMessage(data.response);
      if (data.statuscode === 200) {
        setOldPassword("");
        setNewPassword("");
        setShowProfileModal(false);
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
      setToastMessage(data.response);
      if (data.statuscode === 200) {
        setNewPhoneNumber("");
        setShowProfileModal(false);
        setUserData(prevUserData => ({
            ...prevUserData,
            userPhno: newPhoneNumber
        }));
      }
    } catch (error) {
      console.error("Error updating phone number:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="profile-container ">
        <div className="profile-title">My Profile</div>
        <div className="pro-container">{userData && (
          <div className="profile-data">
            <div className="pro-image-box">
            <div className="profile-initial">{userData.userName[0].toUpperCase()}</div>
            </div>
            <h4 className="user-name"> {userData.userName}</h4>
            <p> <b>Email ID : </b>{userData.userEmail}</p>
            <div className="phno">
              <p><b>Phone Number : </b>{userData.userPhno}</p>
              <a onClick={() => handleChangeOption("phonenumber")}>
              <FontAwesomeIcon icon={faPen} className='change-icon'/>
              </a>
            </div>
            <div className="password-btn">
              <button onClick={() => handleChangeOption("password")}>
                <b>Change Password</b>
              </button>
            </div>
          </div>
        )}
        </div>

        {message && <div className="message">{message}</div>}

          {showProfileModal && (
            <div className="modal-p show-modal">
              <div className="modal-profile">
                <span className="close" onClick={() => setShowProfileModal(false)}>
                  &times;
                </span>
                <div className="modal-functions">
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
                    <label htmlFor="newPassword">
                      {option === "password" ? "New Password" : "New Phone Number"}:
                    </label>
                    {option === "password" ? (
                      <input
                        type={showPasswords ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        id="newPhoneNumber"
                        value={newPhoneNumber}
                        onChange={(e) => setNewPhoneNumber(e.target.value)}
                      />
                    )}
                  </div>
                  {option === "password" && (
                    <div className="check-box">
                      <input
                        type="checkbox"
                        id="showPasswords"
                        checked={showPasswords}
                        onChange={() => setShowPasswords(!showPasswords)}
                      />
                      <label htmlFor="showPasswords">Show</label>
                    </div>
                  )}
                  <div className="sbmt-btn">
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
              </div>
            </div>
          )}
        {showProfileModal && <div className="modal-overlay"></div>}
      </div>
      {toastMessage && <ToastMessage message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  );
}

export default Profile;