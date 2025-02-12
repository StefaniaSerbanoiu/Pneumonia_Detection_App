import React, { useState, useEffect } from 'react';


const Profile = () => {
  const [userData, setUserData] = useState(null);


  useEffect(() => {
    fetchUserData();
  }, []);

  
  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/user', {
        method: 'GET',
        credentials: 'include' // cookies include credentials for session
      });

      if (!response.status == 200) {
        throw new Error('Error!!! User data could not be fetched!');
      }

      const data = await response.json();
      setUserData(data);

    } catch (error) {
      console.error('Error!!! There was a problem while getting user data:', error);
    }
  };

  

  return (
    <div className="container">
      <h1>Profile</h1>
      {userData && (
        <div>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
