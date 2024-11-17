// src/TablePage/TablePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TablePage = () => {
  const [users, setUsers] = useState([]);

  // Fetch data from the API when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5217/api/User')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  return (
    <div className="table-page">
      <h1>User List</h1>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userID}>
              <td>{user.userID}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePage;
