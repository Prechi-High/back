import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import TrackingPage from './components/Tracking';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/track" element={<TrackingPage />} />
    </Routes>
  </Router>
);

export default App;
