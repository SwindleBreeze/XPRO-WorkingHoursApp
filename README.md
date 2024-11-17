# XPRO - Working hours app

## Overview
This project is a task assigned by XPRO. The application is designed to allow users to log their working hours, track arrivals, departures, breaks, and various types of absences. The backend is implemented in C# using .NET, while the frontend is developed using React.js, offering a user-friendly interface for seamless interaction.

## Table of Contents
- [Features](#features)
- [User Registration and Login](#user-registration-and-login)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  
## Features
- **User Entry:** Users can input their personal details, including name, surname, phone number, email, job position, and type of employment.
- **Users Table Display:** A comprehensive table displays all entered users, with options to add, search, edit, and filter users based on active status.
- **Logging Working Hours:** Users can log their daily working hours, including arrival, departure, and lunch/break times. The application calculates the duration automatically.
- **Absence Types:** A dedicated table specifies various types of absence, allowing users to select the appropriate reason for their absence on a particular date.
- **My Hours Menu:** Each user has access to a "My Hours" menu, displaying their working hours for the current and past months, with the ability to edit individual dates.
- **Export to Excel:** Monthly hours for each user can be exported to Excel for further analysis and reporting.

## User Registration and Login
Users can register on their own by providing their details and creating an account. Alternatively, for testing purposes, the following default users are available:

- **Username: test, Password: test**
- **Username: admin, Password: admin**
- **Username: newuser, Password: 1234**

## Running the Application
**Backend:**
- Navigate to the `/WorkingHoursApp` directory.
- Run the command: `dotnet run`.
- The backend will be accessible at `http://localhost:5217`.

**Frontend:**
- Navigate to the `/working-hours-app` directory.
- Install dependencies using: `npm install`.
- Start the frontend using: `npm run start`.
- The frontend will be accessible at `http://localhost:3000`.

## API Documentation
The Swagger API documentation is available at `http://localhost:5217/swagger/index.html`. It provides detailed information about the backend APIs and their functionalities.
