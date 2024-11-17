import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Row, Col, Image, Navbar, Nav } from 'react-bootstrap';

const UserForm = () => {
    const { userId } = useParams(); // Get user ID from the URL params (if editing)
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        jobPosition: '',
        typeOfEmployment: 'PermanentContract',
        activeStatus: true,
        username: '',
        password: '',
    });

    const [profilePicture, setProfilePicture] = useState(null); // For file upload
    const [currentProfilePicture, setCurrentProfilePicture] = useState(null); // For displaying current picture
    const [profilePicturePreview, setProfilePicturePreview] = useState(null); // For displaying uploaded picture
    const [isEditing, setIsEditing] = useState(false);

    // Set up Axios instance with JWT token
    const axiosInstance = axios.create({
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
        },
    });

    useEffect(() => {
        return () => {
            if (profilePicturePreview) {
                URL.revokeObjectURL(profilePicturePreview);
            }
        };
    }, [profilePicturePreview]);

    useEffect(() => {
        if (userId) {
            setIsEditing(true);
            fetchUserDetails(userId);
        }

        // Fetch the current profile picture if available
        const profilePicturePath = sessionStorage.getItem('ProfilePicture');
        if (profilePicturePath) {
            setCurrentProfilePicture(profilePicturePath);
        }
    }, [userId]);

    const fetchUserDetails = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5217/api/User/${id}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
                },
            });
            const { profilePicturePath, ...userData } = response.data;
    
            // Ensure no null values
            const sanitizedData = Object.fromEntries(
                Object.entries(userData).map(([key, value]) => [key, value ?? ''])
            );
    
            setFormData(sanitizedData);
            // Handle displaying the profile picture if necessary
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
    
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setProfilePicturePreview(previewUrl);
        } else {
            setProfilePicturePreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                formDataToSend.append(key, formData[key]);
            });

            if (profilePicture) {
                formDataToSend.append('profilePicture', profilePicture); // Add the uploaded file
            }

            if (isEditing) {
                // if edit is successful, update session path for profile picture to the path from the response
                let response = await axiosInstance.put(`http://localhost:5217/api/User/${userId}`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log('response', response);
                sessionStorage.setItem('ProfilePicture', response.data.updatedUser.profilePicturePath);
                alert('User updated successfully!');
            } else {
                await axiosInstance.post('http://localhost:5217/api/User', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                alert('User added successfully!');
            }
            navigate('/dashboard'); // Redirect to the dashboard after submission
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    return (
        <>
            {/* Navbar */}
            <Navbar bg="dark" expand="lg" variant="dark">
                <Container>
                    <Navbar.Brand href="/Dashboard">Totally Real Official Business</Navbar.Brand>
                    <Nav className="ml-auto">
                        <Button
                            variant="outline-primary"
                            onClick={() => navigate('/dashboard')}
                        >
                            Back to Dashboard
                        </Button>
                    </Nav>
                </Container>
            </Navbar>
            <Container className="mt-4">
                <h1>{isEditing ? 'Edit User' : 'Add New User'}</h1>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Job Position</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="jobPosition"
                                    value={formData.jobPosition}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Type of Employment</Form.Label>
                                <Form.Select
                                    name="typeOfEmployment"
                                    value={formData.typeOfEmployment}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="PermanentContract">Permanent Contract</option>
                                    <option value="FixedTermContract">Fixed Term Contract</option>
                                    <option value="Student">Student</option>
                                    <option value="Contracted">Contracted</option>
                                    <option value="Freelancer">Freelancer</option>
                                    <option value="Other">Other</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Always display username and password fields */}
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                        <Form.Group>
                            <Form.Label>Profile Picture</Form.Label>
                            {profilePicturePreview ? (
                                // Display the uploaded image preview
                                <div className="mb-2">
                                    <Image
                                        src={profilePicturePreview}
                                        alt="Uploaded Profile"
                                        thumbnail
                                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                                    />
                                </div>
                            ) : currentProfilePicture && isEditing ? (
                                // Display the existing profile picture if no new image is uploaded
                                <div className="mb-2">
                                    <Image
                                        src={`http://localhost:5217/${currentProfilePicture}`}
                                        alt="Current Profile"
                                        thumbnail
                                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                                    />
                                </div>
                            ) : null}
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Check
                                type="checkbox"
                                label="Active"
                                name="activeStatus"
                                checked={formData.activeStatus}
                                onChange={(e) => handleInputChange(e)}
                            />
                        </Col>
                    </Row>

                    <Button variant="primary" type="submit">
                        {isEditing ? 'Save Changes' : 'Add User'}
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default UserForm;
