# Healthcare Project

A healthcare web application built using **React**, **Node.js**, **Express**, **MySQL**, **Sequelize**, **Multer** (for image uploads), and **Nodemailer** (for email verification). Patients can book consultations with doctors by sending their reasons, descriptions, and images. Doctors can manage their availability, and accept/reject consultations.

## Features

- **User Registration**: Users can sign up with their email and password.
- **Email Verification**: An email with a verification link is sent to users upon registration.
- **Patient-Doctor Consultation**: 
  - Patients can book consultations by sending their reasons, descriptions, and images (uploaded via Multer).
  - Doctors can view consultation requests, accept/reject them, and schedule time slots.
- **Doctor Availability Management**: Doctors can set their availability by creating time slots.
- **Consultation Status**: Doctors can mark consultations as "accepted," "rejected," or "completed."
- **Image Upload**: Multer is used to handle image uploads for consultation requests.

## Technologies Used

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MySQL with Sequelize ORM
- **Image Upload**: Multer
- **Email Verification**: Nodemailer
- **Authentication**: JWT (JSON Web Token)
- **Other Libraries**:
  - bcryptjs (for password hashing)
  - Axios (for HTTP requests)

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (https://nodejs.org/)
- **npm** (Node.js package manager)
- **MySQL** (https://www.mysql.com/)

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amitkumarvishnu/healthcare
