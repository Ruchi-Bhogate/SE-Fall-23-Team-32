import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OwnerHeader from './OwnerHeader';
import Footer from './Footer';

function OwnerProfilePage({ userId }) {
  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    quote: '',
    // Add other fields as needed
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8080/profile/getdetails`,
    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => console.error('Error fetching user data', error));
  }, [userId]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/profile/updatedetails`, userData,
    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(response => {
        console.log('Profile updated', response.data);
        setIsEditMode(false); // Exit edit mode after update
      })
      .catch(error => console.error('Error updating profile', error));
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  return (
    <div>
        <OwnerHeader/>
    <div>
      <h1>User Profile</h1>
      {isEditMode ? (
        <form onSubmit={handleSubmit}>
          <h4>firstname</h4>
          <input name="firstname" value={userData.firstname} onChange={handleChange} />
          <h4>lastname</h4>
          <input name="lastname" value={userData.lastname} onChange={handleChange} />
          {/* Add other editable fields here */}
          <button type="submit">Save Changes</button>
        </form>
      ) : (
        <div>
          <p>First Name: {userData.firstname}</p>
          <p>Last Name: {userData.lastname}</p>
          <p>Email: {userData.email}</p>
          <p>Username: {userData.username}</p>
          <button onClick={handleEdit}>Edit Profile</button>
        </div>
      )}
    </div>
    <Footer/>
    </div>
  );
}

export default OwnerProfilePage;
