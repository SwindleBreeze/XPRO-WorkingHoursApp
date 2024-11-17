import React, { useEffect, useState } from 'react';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Table, Navbar, Container, Nav, Image, Form, Button, Tab, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [activeFilter, setActiveFilter] = useState('active'); // For tracking active tab
    const navigate = useNavigate();

    // Fetch users from the API
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5217/api/User');
            setUsers(response.data);
            setFilteredUsers(response.data); // Initially show all users
        } catch (error) {
            console.error('Error fetching users', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch logged-in user's profile picture
    const fetchProfilePicture = () => {
        const token = sessionStorage.getItem('jwt');
        if (token) {
            let profilePicturePath = sessionStorage.getItem('ProfilePicture');
            setProfilePicture(profilePicturePath);
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('jwt');
        navigate('/login');
    };

    // Handle filtering based on active tab
    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        if (filter === 'all') {
            setFilteredUsers(users);
        } else if (filter === 'active') {
            setFilteredUsers(users.filter((user) => user.activeStatus));
        } else if (filter === 'inactive') {
            setFilteredUsers(users.filter((user) => !user.activeStatus));
        }
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filtered = users.filter((user) =>
            Object.values(user).some((val) =>
                String(val).toLowerCase().includes(e.target.value.toLowerCase())
            )
        );

        if (activeFilter === 'active') {
            setFilteredUsers(filtered.filter((user) => user.activeStatus));
        } else if (activeFilter === 'inactive') {
            setFilteredUsers(filtered.filter((user) => !user.activeStatus));
        } else {
            setFilteredUsers(filtered);
        }
    };

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        const sortedUsers = [...filteredUsers].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredUsers(sortedUsers);
    };

    useEffect(() => {
        fetchUsers();
        fetchProfilePicture();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {/* Top Navigation Bar */}
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/Dashboard">Totally Real Official Business</Navbar.Brand>
                    <Nav className="ml-auto">
                        {/* Log Hours Button */}
                        <Button
                            variant="primary" size="sm" className="me-2"
                            onClick={() => window.location.href = "/log-hours"}
                        >
                            Log Hours
                        </Button>

                        <Button
                            variant="primary" size="sm" className="me-2"
                            onClick={() => window.location.href = "/my-hours"}
                        >
                            My Hours
                        </Button>

                        {/* Profile Picture with Dropdown Menu */}
                        <NavDropdown
                            align="end"
                            title={
                                <Image
                                    src={`http://localhost:5217/${profilePicture}`}
                                    roundedCircle
                                    width="40"
                                    height="40"
                                    alt="Profile Picture"
                                />
                            }
                            id="profile-dropdown"
                        >
                            <NavDropdown.Item href="/my-hours">My Hours</NavDropdown.Item>
                            <NavDropdown.Item href={`/edit-user/${sessionStorage.getItem('UserID')}`}>Edit Profile</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>

                </Container>
            </Navbar>

            <Container className="mt-4">
            <Tab.Container activeKey={activeFilter}>
                <Nav variant="tabs" className="mb-3" onSelect={handleFilterChange}>
                    <Nav.Item>
                        <Nav.Link eventKey="all">All Users</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="active">Active Users</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="inactive">Inactive Users</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="ms-auto">
                        {/* Add User Button */}
                        <Button variant="success" size="sm" onClick={() => navigate('/add-user')}>
                            Add User
                        </Button>
                    </Nav.Item>
                </Nav>
            </Tab.Container>

            {/* Search Bar */}
            <Form.Control
                type="text"
                placeholder="Search users"
                value={searchTerm}
                onChange={handleSearch}
                className="mb-3"
            />
        </Container>

            {/* Users Data Table */}
            <Container className="mt-4">
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('UserID')}>User ID</th>
                            <th onClick={() => handleSort('FirstName')}>First Name</th>
                            <th onClick={() => handleSort('LastName')}>Last Name</th>
                            <th onClick={() => handleSort('Email')}>Email</th>
                            <th onClick={() => handleSort('PhoneNumber')}>Phone</th>
                            <th onClick={() => handleSort('JobPosition')}>Job Position</th>
                            <th onClick={() => handleSort('TypeOfEmployment')}>Employment Type</th>
                            <th onClick={() => handleSort('ActiveStatus')}>Active Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.userID}>
                                <td>{user.userID}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber || 'N/A'}</td>
                                <td>{user.jobPosition}</td>
                                <td>{user.typeOfEmployment}</td>
                                <td>{user.activeStatus ? 'Active' : 'Inactive'}</td>
                                <td>
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate(`/edit-user/${user.userID}`)}
                                    >
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
};

export default Dashboard;
