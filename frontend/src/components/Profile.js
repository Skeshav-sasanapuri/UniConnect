import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useEmail } from '../context/EmailContext'; // Import the email context


function Profile() {
  const { email } = useEmail(); // Access the email from context
  const [profile, setProfile] = useState({
    name: '',
    birthDate: '',
    major: '',
    year: 'Undergraduate: 1st year',
    bio: '',
    interests: '',
    links: '',
  });

   useEffect(() => {
      const fetchProfile = async () => {
          try {
              const response = await axios.get('http://localhost:8080/getprofile', {
                  params: { email },  // Pass the email as query parameters
              });
              setProfile(response.data);  // Set the profile data to state
          } catch (error) {
              console.error('Error fetching profile:', error);
          }
      };

      if (email) {
          fetchProfile();
      }
  }, [email]);  // Only fetch when email is available

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const profileWithEmail = { ...profile, email }; // Add email to profile object
      await axios.post('http://localhost:8080/profile', profileWithEmail);
      alert('Profile created/updated successfully!');
    } catch (error) {
      alert('Error updating profile.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create/Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
              type="text"
              className="form-control"
              name="name"
              value={profile.name}
              onChange={handleChange}
          />
        </div>
          <div className="mb-3">
              <label className="form-label">Birth Date:</label>
              <input
                  type="date"
                  className="form-control"
                  name="birthDate"
                  value={profile.birthDate}

                  onChange={handleChange}
              />
          </div>
          <div className="mb-3">
              <label className="form-label">Major:</label>
              <input
                  type="text"
                  className="form-control"
                  name="major"
                  value={profile.major}
                  onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Academic Year:</label>
          <select
              type="text"
              className="form-control"
              name="year"
              value={profile.year}
              onChange={handleChange}
          >
            <option value="Undergraduate: 1st year">Undergraduate: 1st year</option>
            <option value="Undergraduate: 2nd year">Undergraduate: 2nd year</option>
            <option value="Undergraduate: 3rd year">Undergraduate: 3rd year</option>
            <option value="Undergraduate: 4th year">Undergraduate: 4th year</option>
            <option value="Graduate: 1st year">Graduate: 1st year</option>
            <option value="Graduate: 2nd year">Graduate: 2nd year</option>
            <option value="Postgraduate">Postgraduate</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Bio:</label>
          <textarea
              className="form-control"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Interests/Skills:</label>
          <input
              type="text"
              className="form-control"
              name="interests"
              placeholder={"Separate skills using comma"}
              value={profile.interests}
              onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Add Link (Portfolio):</label>
          <input
              type="text"
              className="form-control"
              name="links"
              value={profile.links}
              onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Save Profile</button>
      </form>
    </div>
  );
}

export default Profile;

