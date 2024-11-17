import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import moment from 'moment';

const WorkingHoursForm = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        date: '',
        arrivalTime: moment('07:00', 'HH:mm'), // Initialize with a moment object
        departureTime: moment('15:00', 'HH:mm'), // Initialize with a moment object
        lunchStartTime: null,
        lunchEndTime: null,
        isAbsent: false,
        absenceTypeID: null,
    });

    const [absenceTypes, setAbsenceTypes] = useState([]);
    const [errors, setErrors] = useState({
        lunchTimeError: '', // Error for lunch time validation
    });

    // Set up Axios instance with JWT token
    const axiosInstance = axios.create({
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
        },
    });

    useEffect(() => {
        // Fetch absence types for dropdown
        fetchAbsenceTypes();

        // Set the default date to today
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; 
        setFormData({
            ...formData,
            date: formattedDate,
        });
    }, []);

    const fetchAbsenceTypes = async () => {
        try {
            const response = await axiosInstance.get('http://localhost:5217/api/Reports/AbsenceTypes');
            setAbsenceTypes(response.data);
        } catch (error) {
            console.error('Error fetching absence types:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCheckboxChange = (e) => {
        setFormData({
            ...formData,
            isAbsent: e.target.checked,
        });
    };

    const handleTimeChange = (name) => (newTime) => {
        setFormData({
            ...formData,
            [name]: newTime,
        });

        // Validate lunch time whenever any time is changed
        if (name === 'lunchStartTime' || name === 'lunchEndTime') {
            validateLunchTime();
        }
    };

    // Validate lunch times
    const validateLunchTime = () => {
        let errorMessage = '';

        if (formData.lunchStartTime && formData.lunchEndTime) {
            const lunchStart = moment(formData.lunchStartTime);
            const lunchEnd = moment(formData.lunchEndTime);
            const arrivalTime = moment(formData.arrivalTime);
            const departureTime = moment(formData.departureTime);

            if (lunchStart.isBefore(arrivalTime) || lunchStart.isAfter(departureTime)) {
                errorMessage = 'Lunch start time must be between arrival and departure times.';
            } else if (lunchEnd.isBefore(arrivalTime) || lunchEnd.isAfter(departureTime)) {
                errorMessage = 'Lunch end time must be between arrival and departure times.';
            }
        }

        setErrors({
            ...errors,
            lunchTimeError: errorMessage,
        });
    };

    // Validate the entire form before submission
    const validateForm = () => {
        // Run the lunch time validation
        validateLunchTime();

        // If there's any error, prevent submission
        return !errors.lunchTimeError;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateForm()) {
            // If validation fails, don't submit the form and show the error
            return;
        }
    
        try {
            // Create a function to build the time object structure expected by the backend
            const createTimeObject = (time) => {
                if (!time) return null; // Return null if no time is provided
            
                const formattedTime = moment(time, 'HH:mm');
                return formattedTime.format('HH:mm:ss'); // Return a simple time string
            };
    
            // Prepare the data to send
            const dataToSend = {
                userId: sessionStorage.getItem('UserID'), // Get UserID from sessionStorage
                date: moment(formData.date).toISOString(), // Date in ISO format
                arrivalTime: createTimeObject(formData.arrivalTime), // e.g., "07:00:00"
                departureTime: createTimeObject(formData.departureTime), // e.g., "15:00:00"
                lunchStartTime: createTimeObject(formData.lunchStartTime), // e.g., "12:00:00"
                lunchEndTime: createTimeObject(formData.lunchEndTime), // e.g., "12:30:00"
                isAbsent: formData.isAbsent || false, // Default to false if isAbsent isn't set
                absenceTypeID: formData.isAbsent ? formData.absenceTypeID : null, // Only include absenceTypeID if absent
                workingHours: formData.isAbsent
                    ? []
                    : [
                          {
                              start: createTimeObject(formData.arrivalTime),
                              end: createTimeObject(formData.departureTime),
                              duration: "08:00:00", // Adjust logic to calculate duration
                          },
                      ], // Placeholder working hours
            };
    
            // Send the data to the backend
            await axiosInstance.post('http://localhost:5217/api/WorkingHours', dataToSend);
            alert('Working hours logged successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error logging working hours:', error);
    
            if (error.response && error.response.status === 409) {
                // Handle the specific "Working hours already logged for this day" conflict error
                alert('Working hours already logged for this day.');
            } else {
                // General error message if it's not a conflict
                setErrors({
                    ...errors,
                    submitError: 'Error logging working hours. Please try again.',
                });
            }
        }
    };
    
    return (
        <>
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
                <h1>Log Working Hours</h1>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Check
                                    type="checkbox"
                                    label="Mark as Absent"
                                    checked={formData.isAbsent}
                                    onChange={handleCheckboxChange}
                                />
                            </Form.Group>
                        </Col>

                        {formData.isAbsent && (
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Absence Type</Form.Label>
                                    <Form.Select
                                        name="absenceTypeID"
                                        value={formData.absenceTypeID || ''}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Absence Type</option>
                                        {absenceTypes.length > 0 ? (
                                            absenceTypes.map((absenceType) => (
                                                <option key={absenceType.absenceTypeID} value={absenceType.absenceTypeID}>
                                                    {absenceType.absenceName}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>Loading...</option>
                                        )}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        )}
                    </Row>

                    {!formData.isAbsent && (
                        <>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Arrival Time </Form.Label>
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <TimePicker
                                                name="arrivalTime"
                                                value={formData.arrivalTime}
                                                onChange={handleTimeChange('arrivalTime')}
                                                ampm={false} // Ensure 24-hour format
                                                maxTime={moment('18:00', 'HH:mm')} // Limit to 18:00
                                                minTime={moment('07:00', 'HH:mm')} // Limit to 07:00
                                                renderInput={(params) => (
                                                    <Form.Control 
                                                        {...params} 
                                                        style={{ height: '15px' }} // Adjust height to make it smaller
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Departure Time </Form.Label>
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <TimePicker
                                                name="departureTime"
                                                value={formData.departureTime}
                                                onChange={handleTimeChange('departureTime')}
                                                ampm={false} // Ensure 24-hour format
                                                maxTime={moment('18:00', 'HH:mm')} // Limit to 18:00
                                                minTime={moment('07:00', 'HH:mm')} // Limit to 07:00
                                                renderInput={(params) => (
                                                    <Form.Control 
                                                        {...params} 
                                                        style={{ height: '15px' }} // Adjust height to make it smaller
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Lunch Start Time</Form.Label>
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <TimePicker
                                                name="lunchStartTime"
                                                value={formData.lunchStartTime}
                                                onChange={handleTimeChange('lunchStartTime')}
                                                ampm={false} // Ensure 24-hour format
                                                maxTime={formData.departureTime} // Max time based on departure
                                                minTime={formData.arrivalTime} // Min time based on arrival
                                                renderInput={(params) => (
                                                    <Form.Control 
                                                        {...params} 
                                                        style={{ height: '15px' }} // Adjust height to make it smaller
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Lunch End Time</Form.Label>
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <TimePicker
                                                name="lunchEndTime"
                                                value={formData.lunchEndTime}
                                                onChange={handleTimeChange('lunchEndTime')}
                                                ampm={false} // Ensure 24-hour format
                                                maxTime={formData.departureTime} // Max time based on departure
                                                minTime={formData.arrivalTime} // Min time based on arrival
                                                renderInput={(params) => (
                                                    <Form.Control 
                                                        {...params} 
                                                        style={{ height: '15px' }} // Adjust height to make it smaller
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </>
                    )}

                    {errors.lunchTimeError && (
                        <div className="text-danger">{errors.lunchTimeError}</div>
                    )}

                    <Button type="submit">Save Working Hours</Button>
                </Form>
            </Container>
        </>
    );
};

export default WorkingHoursForm;
