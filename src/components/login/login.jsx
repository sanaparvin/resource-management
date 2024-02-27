import React, { useState } from 'react';
import Styles from './login.module.css'; // Import CSS file for custom styling
 
const Login = () => {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPhone, setSignupPhone] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState(''); // State to store response message
    const [showLogin, setShowLogin] = useState(true); // Toggle between login and signup forms
    const [showLoginPassword, setShowLoginPassword] = useState(false); // State to toggle show/hide password in login form
    const [showSignupPassword, setShowSignupPassword] = useState(false); // State to toggle show/hide password in signup form
 
    const handleLogin = async (e) => {
        e.preventDefault();
        setResponseMessage(''); // Clear response message before making a new login attempt
        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail: loginEmail, userPassword: loginPassword }),
            });
    
            if (response.status === 200) {
                const data = await response.json();
                const uid = data.userid;
                const roleIndex = data.roleIndex;
                sessionStorage.setItem('uid',uid);
                sessionStorage.setItem('roleIndex',roleIndex);
                window.location.href = `/home`;
            } else {
                const data = await response.json();
                setResponseMessage(data.response); // Set response message from JSON response
            }
        } catch (error) {
            setResponseMessage(error.message); // Set error message
        }
    };
    
    const handleSignup = async (e) => {
      e.preventDefault();
      setResponseMessage(''); // Clear response message before making a new signup attempt
      try {
          const response = await fetch('http://127.0.0.1:5000/users', {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json',
              },
              body: JSON.stringify({
              userName: signupName,
              userEmail: signupEmail,
              userPhno: signupPhone,
              userPassword: signupPassword,
              }),
          });
   
          const data = await response.json(); // Parse response body as JSON
          if (response.ok) {
              const uid = data.userid;
              const roleIndex = data.roleIndex;
              sessionStorage.setItem('uid',uid);
              sessionStorage.setItem('roleIndex',roleIndex);
              window.location.href = `/home`; // Redirect to home page if signup is successful
          } else {
              setResponseMessage(data.response); // Set response message from JSON response
          }
   
          // Reset signup form fields after successful signup
          setSignupName('');
          setSignupEmail('');
          setSignupPhone('');
          setSignupPassword('');
      } catch (error) {
          setResponseMessage(error.message); // Set error message
      }
  };
     
    const toggleForm = () => {
        setShowLogin(!showLogin);
        setResponseMessage(''); // Clear any response message when toggling between forms
    };
     
    const toggleShowLoginPassword = () => {
    setShowLoginPassword(!showLoginPassword);
    };
     
    const toggleShowSignupPassword = () => {
        setShowSignupPassword(!showSignupPassword);
    };
     
    return (
        <div className={Styles.container}>
            <div className={Styles.loginContainer}>
                <div className={Styles.card}>
                    <h2>{showLogin ? 'Login' : 'Sign Up'}</h2>
                        <form onSubmit={showLogin ? handleLogin : handleSignup}>
                            {showLogin ? (
                                <div>
                                    <label htmlFor="loginEmail" className={Styles.formLabel}>Email:</label>
                                    <input
                                        type="email"
                                        id="loginEmail"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        className={Styles.formControl}
                                        required
                                    />
                                    <label htmlFor="loginPassword" className={Styles.formLabel}>Password:</label>
                                    <div className={Styles.inputGroup}>
                                    <input
                                    type={showLoginPassword ? 'text' : 'password'}
                                    id="loginPassword"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    className={Styles.formControl}
                                    required
                                    />
                                    <button
                                    type="button"
                                    className={Styles.btnOutlineSecondary}
                                    onClick={toggleShowLoginPassword}
                                >
                                    {showLoginPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                    ) : (
                    <div>
                        <label htmlFor="signupName" className={Styles.formLabel}>Name:</label>
                            <input
                            type="text"
                            id="signupName"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            className={Styles.formControl}
                            required
                            />
                        <label htmlFor="signupEmail" className={Styles.formLabel}>Email:</label>
                            <input
                            type="email"
                            id="signupEmail"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            className={Styles.formControl}
                            required
                            />
                        <label htmlFor="signupPhone" className={Styles.formLabel}>Phone:</label>
                            <input
                            type="tel"
                            id="signupPhone"
                            value={signupPhone}
                            onChange={(e) => setSignupPhone(e.target.value)}
                            className={Styles.formControl}
                            required
                            />
                        <label htmlFor="signupPassword" className={Styles.formLabel}>Password:</label>
                            <div className={Styles.inputGroup}>
                            <input
                                type={showSignupPassword ? 'text' : 'password'}
                                id="signupPassword"
                                value={signupPassword}
                                onChange={(e) => setSignupPassword(e.target.value)}
                                className={Styles.formControl}
                                required
                            />
                            <button
                                type="button"
                                className={Styles.btnOutlineSecondary}
                                onClick={toggleShowSignupPassword}
                                >{showSignupPassword ? 'Hide' : 'Show'}
                            </button>
                            </div>
                        </div>
                        )}
                        <button type="submit" className={`${Styles.btn} ${Styles.btnPrimary}`}>{showLogin ? 'Login' : 'Sign Up'}</button>
                    </form>
                    {/* Display response message */}
                    {responseMessage && <div className={Styles.alert}>{responseMessage}</div>}
                    {/* Toggle between login and signup forms */}
                    <p className={Styles.para}>
                        {showLogin ? (
                        <>
                            Don't have an account? <button onClick={toggleForm} className={Styles.btnLink}>Sign up</button>
                        </>
                        ) : (
                        <>
                            Already have an account? <button onClick={toggleForm} className={Styles.btnLink}>Login</button>
                        </>
                        )}
                    </p>
                    </div>
                </div>
                </div>
            );
};
 
export default Login;