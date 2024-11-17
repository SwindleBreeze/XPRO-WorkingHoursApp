// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage';
import TablePage from './TablePage/TablePage';
import RegisterPage from './RegisterPage/RegisterPage';
import Dashboard from './Dashboard/Dashboard';
import UserForm from './UserForm/UserForm';
import WorkingHoursForm from './LogHours/LogHours';
import MyHours from './HoursTable/HoursTable';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/table" element={<TablePage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path="/add-user" element={<UserForm />} />
          <Route path="/edit-user/:userId" element={<UserForm />} />
          <Route path="/log-hours" element={<WorkingHoursForm />} />
          <Route path="/my-hours" element={<MyHours />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
