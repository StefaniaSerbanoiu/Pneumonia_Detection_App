import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar';
import UploadPage from './components/UploadPage';
import Profile from './components/Profile';
import LoginPage from './components/Login/LoginPage';
import NotFoundRoute from './NotFoundRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/upload/" element={<UploadPageWithNavbar />} />
        <Route path="/profile/" element={<ProfileWithNavbar />} />
        <Route path="*" element={<NotFoundRoute />} /> 
      </Routes>
    </Router>
  );
};

const UploadPageWithNavbar = () => (
  <>
    <Navbar />
    <UploadPage />
  </>
);

const ProfileWithNavbar = () => (
  <>
    <Navbar />
    <Profile />
  </>
);

export default App;
