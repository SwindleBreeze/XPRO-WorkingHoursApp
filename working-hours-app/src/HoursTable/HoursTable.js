import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import axios from "axios";
import moment from "moment"; // Importing moment
import "react-datepicker/dist/react-datepicker.css";
import { Tab, Nav, Container, Row, Col, Table, Button, Navbar } from "react-bootstrap";

const MyHours = () => {
    const [hours, setHours] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [editingRow, setEditingRow] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const axiosInstance = axios.create({
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchHours();
    }, [month, year, activeFilter]);

    const exportToExcel = () => {
        const data = hours.map((row) => ({
            Date: moment(row.date).format("YYYY-MM-DD"),
            Arrival: row.arrivalTime || "N/A",
            "Lunch Start": row.lunchStartTime || "N/A",
            "Lunch End": row.lunchEndTime || "N/A",
            Departure: row.departureTime || "N/A",
            Absent: row.isAbsent ? "Yes" : "No",
            "Absence Name": row.absenceName || "N/A",
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Working Hours");
        let name = sessionStorage.getItem("Username");
        // Trigger Excel file download
        XLSX.writeFile(workbook, `Working_Hours_${month}_${year}_${name}.xlsx`);
    };

    const fetchHours = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                `http://localhost:5217/api/WorkingHours/${sessionStorage.getItem("UserID")}/${month}/${year}`
            );
            setHours(response.data.message ? [] : response.data);
        } catch (error) {
            console.error("Error fetching hours", error);
            setHours([]);
        }
        setLoading(false);
    };

    const updateHour = async (rowId, updatedRow) => {
        await axiosInstance.put(`http://localhost:5217/api/WorkingHours/${rowId}`, updatedRow);
        fetchHours();
    };

    const handleEdit = (id, field, value) => {
        setHours((prev) =>
            prev.map((row) =>
                row.workingHoursID === id ? { ...row, [field]: value } : row
            )
        );
    };

    const saveEdit = async (row) => {
        try {
            await updateHour(row.workingHoursID, row);
            setEditingRow(null);
            // Optionally, you can add a success message here
            alert("Updated successfully");
        } catch (error) {
            // Handle error if the update fails
            console.error("Error saving edit:", error);
            alert("Error updating data");
        }
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    const filteredHours = hours.filter((row) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "working") return !row.isAbsent;
        if (activeFilter === "absent") return row.isAbsent;
        return true;
    });

    const deleteHour = async (rowId) => {
        try {
            await axiosInstance.delete(`http://localhost:5217/api/WorkingHours/${rowId}`);
            fetchHours();
            alert("Deleted successfully");
        } catch (error) {
            console.error("Error deleting record", error);
            alert("Error deleting record");
        }
    };

    const calculateTotalWorkedHours = (hoursData) => {
        let totalHours = 0;
        hoursData.forEach((row) => {
            const arrival = moment(row.arrivalTime, "HH:mm");
            const departure = moment(row.departureTime, "HH:mm");
            if (arrival.isValid() && departure.isValid() && !row.isAbsent) {
                totalHours += moment.duration(departure.diff(arrival)).asHours();
            }
        });
        return totalHours;
    };

    const totalWorkedHours = calculateTotalWorkedHours(filteredHours);

    const workingDays = filteredHours.filter((row) => !row.isAbsent).length;

    const averageHoursPerWeek = workingDays > 0 ? totalWorkedHours / workingDays : 0;

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {/* Navbar */}
            <Navbar bg="dark" expand="lg" variant="dark">
                <Container>
                    <Navbar.Brand href="/Dashboard">Totally Real Official Business</Navbar.Brand>
                    <Nav className="ml-auto">
                        <Button
                            variant="outline-primary"
                            onClick={() => navigate("/dashboard")}
                        >
                            Back to Dashboard
                        </Button>
                    </Nav>
                </Container>
            </Navbar>

            <Container className="mt-3">
                {/* Month and Year Filters */}
                <Tab.Container activeKey={activeFilter}>
                    <Nav variant="tabs" className="mb-3" onSelect={handleFilterChange}>
                        <Nav.Item>
                            <Nav.Link eventKey="all">All Days</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="working">Working Days</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="absent">Absent Days</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Tab.Container>

                <Row>
                    <Col>
                        <label>
                            Month:
                            <select value={month} onChange={(e) => setMonth(e.target.value)}>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString("default", { month: "long" })}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </Col>
                    <Col>
                        <label>
                            Year:
                            <input
                                type="number"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                min="2000"
                            />
                        </label>
                    </Col>
                    <Col className="text-end">
                        <Button variant="success" onClick={exportToExcel}>
                            Export to Excel
                        </Button>
                    </Col>
                </Row>

                {/* Hours Table */}
                <Table striped bordered hover responsive className="mt-3">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Arrival</th>
                            <th>Lunch Start</th>
                            <th>Lunch End</th>
                            <th>Departure</th>
                            <th>Absent</th>
                            <th>Absence Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHours.length > 0 ? (
                            filteredHours.map((row) => (
                                <tr key={row.workingHoursID}>
                                    <td>{moment(row.date).format("YYYY-MM-DD")}</td>
                                    <td>
                                        {editingRow === row.workingHoursID ? (
                                            <input
                                                type="time"
                                                value={row.arrivalTime || ""}
                                                onChange={(e) =>
                                                    handleEdit(row.workingHoursID, "arrivalTime", e.target.value)
                                                }
                                            />
                                        ) : (
                                            row.arrivalTime
                                        )}
                                    </td>
                                    <td>
                                        {editingRow === row.workingHoursID ? (
                                            <input
                                                type="time"
                                                value={row.lunchStartTime || ""}
                                                onChange={(e) =>
                                                    handleEdit(row.workingHoursID, "lunchStartTime", e.target.value)
                                                }
                                            />
                                        ) : (
                                            row.lunchStartTime
                                        )}
                                    </td>
                                    <td>
                                        {editingRow === row.workingHoursID ? (
                                            <input
                                                type="time"
                                                value={row.lunchEndTime || ""}
                                                onChange={(e) =>
                                                    handleEdit(row.workingHoursID, "lunchEndTime", e.target.value)
                                                }
                                            />
                                        ) : (
                                            row.lunchEndTime
                                        )}
                                    </td>
                                    <td>
                                        {editingRow === row.workingHoursID ? (
                                            <input
                                                type="time"
                                                value={row.departureTime || ""}
                                                onChange={(e) =>
                                                    handleEdit(row.workingHoursID, "departureTime", e.target.value)
                                                }
                                            />
                                        ) : (
                                            row.departureTime
                                        )}
                                    </td>
                                    <td>
                                        {editingRow === row.workingHoursID ? (
                                            <input
                                                type="checkbox"
                                                checked={row.isAbsent}
                                                onChange={(e) =>
                                                    handleEdit(row.workingHoursID, "isAbsent", e.target.checked)
                                                }
                                            />
                                        ) : (
                                            row.isAbsent ? "✔" : ""
                                        )}
                                    </td>
                                    <td>{row.absenceName}</td>
                                    <td>
                                        {editingRow === row.workingHoursID ? (
                                            <Button variant="primary" onClick={() => saveEdit(row)}>
                                                Save
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="primary"
                                                    className="ms-3"
                                                    onClick={() => setEditingRow(row.workingHoursID)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    className="ms-3"
                                                    onClick={() => deleteHour(row.workingHoursID)}
                                                >
                                                    Remove
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No records found</td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                <div>Total worked hours: {totalWorkedHours.toFixed(2)} hours</div>
                <div>Average hours per week: {averageHoursPerWeek.toFixed(2)} hours</div>
            </Container>
        </div>
    );
};

export default MyHours;
