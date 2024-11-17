import React, { useState } from 'react';
import axios from 'axios';
import './RegisterPage.css'; // Import the CSS file for styling

function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [typeOfEmployment, setTypeOfEmployment] = useState('');
  const [comment, setComment] = useState('');
  const [activeStatus, setActiveStatus] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePictureData, setProfilePictureData] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error

    const formData = new FormData(); // Create a new FormData object

    // Append all form fields to the FormData object
    formData.append('FirstName', firstName);
    formData.append('LastName', lastName);
    formData.append('Email', email);
    formData.append('PhoneNumber', phoneNumber);
    formData.append('JobPosition', jobPosition);
    formData.append('TypeOfEmployment', typeOfEmployment);
    formData.append('Comment', comment);
    formData.append('ActiveStatus', activeStatus);
    formData.append('Username', username);
    formData.append('Password', password);

    // If a file is selected, append it to the FormData object
    if (profilePictureData) {
      formData.append('ProfilePicture', profilePictureData);
    }

    try {
      const response = await axios.post('http://localhost:5217/api/Auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
        },
      });

      // Handle successful registration (redirect to login or dashboard)
      console.log('Registration successful:', response.data);
      window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="username">Username <span className="required">*</span></label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Password <span className="required">*</span></label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="firstName">First Name <span className="required">*</span></label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="lastName">Last Name <span className="required">*</span></label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="email">Email <span className="required">*</span></label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="input-container">
            <label htmlFor="jobPosition">Job Position <span className="required">*</span></label>
            <input
              type="text"
              id="jobPosition"
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
              placeholder="Enter your job position"
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="typeOfEmployment">Type of Employment <span className="required">*</span></label>
            <select
              id="typeOfEmployment"
              value={typeOfEmployment}
              onChange={(e) => setTypeOfEmployment(e.target.value)}
              required
            >
              <option value="PermanentContract">Permanent Contract</option>
              <option value="FixedTermContract">Fixed Term Contract</option>
              <option value="Student">Student</option>
              <option value="Contracted">Contracted</option>
              <option value="Freelancer">Freelancer</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="input-container">
            <label htmlFor="comment">Comment</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter any additional comments"
            />
          </div>
          <div className="input-container">
            <label htmlFor="activeStatus">Active Status</label>
            <input
              type="checkbox"
              id="activeStatus"
              checked={activeStatus}
              onChange={(e) => setActiveStatus(e.target.checked)}
            />
          </div>
          <div className="input-container">
            <label htmlFor="ProfilePicture">Profile Picture</label>
            <input type="file" id="ProfilePicture" name="ProfilePicture" accept="image/*" onChange={(e) => setProfilePictureData(e.target.files[0])} />
          </div>
          
          <button type="submit" className="submit-button">Register</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
