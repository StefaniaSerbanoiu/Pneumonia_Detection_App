import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import httpClient_axios from '../httpClient_axios';


const Navbar = () => {
  const [showHelpModal, setShowHelpModal] = useState(false);

  const openHelpModal = () => setShowHelpModal(true);
  const closeHelpModal = () => setShowHelpModal(false);


  const handleLogout = async () => {
    try {
      const response = await httpClient_axios.post("//localhost:5000/logout", {});

      if (!response.status == 200) {
        throw new Error('Error!!! Logout operation failed!');
      }

      window.location.href = '/'; // redirect to the login page after successful logout
      
    } catch (error) {
      console.error('Error!!! Error while logging out :', error);
    }
  };



  return (
    <nav className="navbar navbar-expand navbar-purple flex-column flex-md-row bd-navbar">
      <Link className="navbar-brand mr-0 mr-md-2" to="/upload">Pneumonia Detection App</Link>
      
      <div className="ms-auto">
        <ul className="navbar-nav flex-row "  >
          <li className="nav-item">
            <Link className="nav-link" to="/upload" style={{ fontSize: '30px', marginRight: '20px' }}>Upload</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/profile" style={{ fontSize: '30px', marginRight: '20px' }}>See Profile</Link>
          </li>
          <li className="nav-item">
            <button className="nav-link btn btn-link" style={{ fontSize: '30px', marginRight: '20px' }} onClick={openHelpModal}>Help</button>
          </li>
          <li className="nav-item"> 
            <button className="nav-link btn btn-link" style={{ fontSize: '30px' }} onClick={handleLogout}>Log out</button>
          </li>
        </ul>
      </div>

      <Modal show={showHelpModal} onHide={closeHelpModal}>
        <Modal.Header closeButton>
          <Modal.Title>Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            In order to get a result, upload an image from your computer of a chest radiography.
            After uploading, you will see the picture again along with the result.
            Then, the result can be downloaded as a .txt/.csv file or sent to your email address.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeHelpModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </nav>
  );
};

export default Navbar;
