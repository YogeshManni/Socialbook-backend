# SocialBook Backend Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Features](#2-features)
3. [Technologies Used](#3-technologies-used)
4. [System Architecture](#4-system-architecture)
5. [Setup and Installation](#5-setup-and-installation)
6. [API Documentation](#6-api-documentation)
7. [Database Schema](#7-database-schema)
8. [Middleware](#8-middleware)
9. [Security Measures](#9-security-measures)
10. [Testing](#10-testing)
11. [Contribution Guidelines](#11-contribution-guidelines)
12. [Future Improvements](#12-future-improvements)

---

## 1. Project Overview

The SocialBook backend is built with **Node.js** and **Express**, providing RESTful APIs to support frontend operations. It manages user authentication, post handling, event scheduling, and discussion forums. The backend connects to a **PostgreSQL** database to store data efficiently.

---

## 2. Features

- **User Authentication**: Secure login, registration, and JWT-based authentication.
- **Posts and Comments**: CRUD operations for user posts, comments, and likes.
- **Event Management**: Allows users to create, update, and view events.
- **Discussions**: Enables users to start and participate in discussions.
- **People Directory**: Fetch users, CRUD operation for profiles, user filteration.

---

## 3. Technologies Used

- **Node.js**: Runtime environment for server-side JavaScript.
- **Express**: Fast, unopinionated, minimalist web framework.
- **PostgreSQL**: Relational database for data storage.
- **Sequelize**: ORM for database management.
- **JWT**: For secure authentication and authorization.

---

## 4. System Architecture

The backend follows a **MVC (Model-View-Controller)** architecture:

- **Controllers**: Handle HTTP requests and responses.
- **Models**: Define data structure and interact with the database.
- **Routes**: Define API endpoints for client interaction.

---

## 5. Setup and Installation

To set up and run the backend locally:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/socialbook-backend.git
   cd socialbook-backend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Environment Variables**: Create a `.env` file in the root directory and add the following:

   ```env
     DB_USER = Database username
     DB_DATABASE = Database name
     DB_PASSWORD = Database password
     DB_PORT = Database port
     DB_HOST = Database host
     EMAIL_USER = Email used to send otp
     EMAIL_PASS = Email password
     JWT_SECRET_KEY  = JWT secret key
     ORIGIN = Frontend url
   ```

4. **Start the Server**:

   ```bash
   npm start
   ```

   After starting project and if your database is successfully connected, the `index.js` script in `db` folder will create all the tables automatically.

---

## 6. API Documentation

- **User Authentication:**

  - **POST /api/register**

    - Registers a new user.
    - **Parameters**:
      - `email`: User's email address.
      - `password`: User's password.
      - `name`: User's full name.
    - **Response**: Success message with JWT token for authenticated sessions.

  - **POST /api/login**
    - Authenticates a user and returns a JWT token.
    - **Parameters**:
      - `email`: User's email.
      - `password`: User's password.
    - **Response**: JWT token and user details.

- **Profile Management:**

  - **GET /api/profile**

    - Fetches the logged-in user's profile information.

  - **POST /api/profile/update**
    - Updates user profile, including name, bio, and profile picture.

- **Posts:**

  - **POST /api/posts/create**

    - Allows users to create a post with images, videos, and captions.
    - **Parameters**:
      - `media`: Uploaded image or video file.
      - `caption`: Caption for the post.
    - **Response**: Success message with post details.

  - **GET /api/posts**
    - Fetches all posts, with support for pagination.

- **Comments and Likes:**

  - **POST /api/posts/comment**

    - Allows users to comment on a post.
    - **Parameters**:
      - `comment`: Text of the comment.

  - **POST /api/posts/like**
    - Allows users to like a post.

- **Event Management:**

  - **POST /api/events/create**
    - Allows users to create events.
    - **Parameters**:
      - `title`: Event title.
      - `date`: Date and time of the event.
      - `location`: Event location.
    - **Response**: Success message with event details.

---

## 7. Database Schema

The main tables used in the database include:

- **Users**: Stores user credentials and profile information.
- **Posts**: Holds user posts and associated data.
- **Comments**: Stores comments on posts.
- **Events**: Holds event details.
- **Discussions**: Stores discussion names.
- **DiscussionsData**: Stores discussion thread data like comments and likes.

---

## 8. Middleware

- **Authentication Middleware**:

  - Verifies JWT tokens for protected routes.

- **Error Handling Middleware**:
  - Catches and formats server errors to provide user-friendly messages.

---

## 9. Security Measures

- **Password Hashing**:

  - All user passwords are hashed using bcrypt for secure storage.

- **JWT Tokens**:

  - Used for session management and authentication, ensuring secure access to protected routes.

- **File Validation**:
  - Media files (images and videos) are validated for type and size to ensure security.

---

## 10. Testing

### Unit Tests

- **Backend Tests**: Use Mocha or Jest for testing controllers, services, and routes.

**Running Tests**

To run all tests:

```bash
npm test
```

---

## 11. Contribution Guidelines

1. **Fork the Repository**: Clone your fork to your local machine.
2. **Create a New Branch**:
   ```bash
   git checkout -b feature/feature-name
   ```
3. **Commit Changes**: Use clear, descriptive commit messages.
4. **Push and Create PR**: Push to the branch and open a pull request on GitHub.

---

## 12. Future Improvements

1. **Real-Time Updates**: Integrate WebSocket for real-time notifications and messaging.
2. **Advanced Moderation**: Implement AI-based content moderation for posts discussion and comments.
3. **Data Caching**: Use Redis to optimize frequently accessed data.

---
