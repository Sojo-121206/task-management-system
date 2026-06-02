pwd# Task Management System

A robust and scalable Task Management System built with Java Spring Boot (Backend) and React (Frontend). This system features secure JWT-based authentication, role-based access control, and complete CRUD operations for managing tasks.

## Features

- **User Authentication**: Secure Registration and Login with BCrypt hashed passwords.
- **Role-Based Access**: Distinguishes between `USER` (manages own tasks) and `ADMIN` (views/deletes any task).
- **Task Management**: Create, Read, Update, and Delete tasks.
- **RESTful API**: Clean API architecture documented with Swagger/OpenAPI.
- **Modern UI**: A responsive, clean React frontend using Context API and Axios for state management and API communication.

## Tech Stack

**Backend**:
- Java 21
- Spring Boot 3.x
- Spring Security & JWT (io.jsonwebtoken)
- Spring Data JPA
- PostgreSQL Database
- Hibernate / Lombok / Bean Validation
- Swagger OpenAPI (`springdoc-openapi-starter-webmvc-ui`)
- Maven

**Frontend**:
- React.js (Vite)
- Axios
- React Router DOM

## Setup Instructions

### Prerequisites
- Java 21 or higher
- Node.js (v18+)
- PostgreSQL (v14+)
- Maven

### PostgreSQL Setup
1. Open pgAdmin or psql shell.
2. Create a new database named `taskdb`:
   ```sql
   CREATE DATABASE taskdb;
   ```
3. Ensure your local PostgreSQL server is running on port `5432` with username `postgres` and password `postgres`.
*(If using different credentials, update them in `backend/src/main/resources/application.properties`)*.

### Running Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the application using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *The backend server will start on `http://localhost:8080`.*

### Running Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will be accessible at `http://localhost:5173`.*

## Swagger Documentation
Once the backend is running, you can access the interactive API documentation at:
**[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

## API Endpoints Overview

**Authentication**
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and receive JWT

**Tasks (Protected, USER)**
- `POST /api/v1/tasks` - Create a task
- `GET /api/v1/tasks` - Get current user's tasks
- `GET /api/v1/tasks/{id}` - Get task by ID
- `PUT /api/v1/tasks/{id}` - Update a task
- `DELETE /api/v1/tasks/{id}` - Delete a task

**Admin (Protected, ADMIN)**
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/tasks` - Get all tasks from all users
- `DELETE /api/v1/admin/tasks/{id}` - Delete any task

---

## Scalability Notes & Future Improvements

To handle high traffic and ensure high availability, the following strategies can be implemented:

1. **Redis Caching**:
   - Introduce Redis to cache frequent read operations (e.g., retrieving lists of tasks or user profiles). This significantly reduces the load on the PostgreSQL database.

2. **Microservices Migration**:
   - As the application grows, it can be decoupled into microservices (e.g., `AuthService`, `TaskService`, `NotificationService`).
   - Use Spring Cloud for service discovery (Eureka) and configuration management.

3. **API Gateway**:
   - Implement an API Gateway (like Spring Cloud Gateway or Kong) to route requests, handle cross-cutting concerns (rate-limiting, security headers), and act as a single entry point for frontend clients.

4. **Load Balancing**:
   - Deploy multiple instances of the backend services and place them behind a Load Balancer (e.g., NGINX, AWS ALB) to distribute incoming traffic evenly.

5. **Docker Deployment**:
   - Containerize both the backend (Spring Boot) and frontend (React) using Docker. This ensures environment consistency across development, staging, and production.
   - Example `Dockerfile` for backend uses an eclipse-temurin:21 image, while the frontend uses a node image for building and NGINX for serving static files.

6. **Kubernetes Deployment**:
   - For orchestration, deploy the Docker containers to a Kubernetes cluster (EKS, GKE, or AKS).
   - Utilize Deployments for application scaling, Services for internal networking, and Ingress controllers for external access.

7. **CI/CD using GitHub Actions**:
   - Set up GitHub Actions workflows to automate the build, test, and deployment processes.
   - Example pipeline: Run JUnit tests -> Build Maven Package -> Build Docker Images -> Push to Docker Hub -> Deploy to Kubernetes/AWS ECS.

*This project serves as a comprehensive starting point for a scalable enterprise-grade application.*
