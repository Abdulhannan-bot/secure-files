# Secure Files (Django DRF + React Project)

A web application built using Django Rest Framework (DRF) for the backend and React for the frontend.

---

## **Features**
- Django as the backend server with REST API.
- React as the frontend framework.
- MySQL database integration.
- Environment variables for secure configuration.
- Flexible architecture for scaling and customization.

---

## **Requirements**

Ensure you have the following installed on your system:
- Python (3.x)
- Node.js and npm
- MySQL
- virtualenv

---

## **Installation and Setup**

### **Backend Setup (Django)**

1. Download and unzip the project folder.

2. Create a virtual environment and activate it:
    ```bash
    virtualenv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3. Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Configure the `.env` file:
    - Create a `.env` file in the root of your Django project.
    - Add the following keys and replace `<value>` with your actual configuration:
        ```dotenv
        SECRET_KEY=<your-secret-key>
        SERVER='DEVELOPMENT  # Set to PRODUCTION in production
        EMAIL_HOST_USER=<email-host>
        EMAIL_HOST_PASSWORD=<gmail-app-password>
        SUPER_ADMIN=<admin-email>
        ```
    - **How to generate a Gmail app password:**
        To set up a Gmail app password for secure email authentication, follow these steps:
        1. Visit the [Google App Passwords setup page]([https://support.google.com/accounts/answer/185833?hl=en](https://www.youtube.com/watch?v=lSURGX0JHbA)).
        2. Follow the instructions to create an app password for your Gmail account.
        3. Use the generated password in place of `<gmail-app-password>` in the `.env` file.

5. Run database migrations:
    ```bash
    python manage.py migrate
    ```

6. Create a superuser:
    - Run the following command to create a superuser (admin account):
      ```bash
      python manage.py createsuperuser
      ```
    - You will be prompted to enter:
      - **Email**: Enter the email address for the admin user.
      - **Password**: Enter the password for the admin user.
      - **Retype Password**: Confirm the password.
    - Once created, you can use this account to log in to the Django admin panel.


---

### **Frontend Setup (React)**

1. Navigate to the frontend folder:
    ```bash
    cd <project-frontend-folder>
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```
---

## **Running the Project**

### **Running the Application**

You have two options to run the application:

#### **Option 1: Run Backend and Frontend Individually**

1. **Backend (Django)**:
    - Navigate to the **backend** directory:
      ```bash
      cd backend
      ```
    - Start the Django development server:
      ```bash
      python manage.py runserver
      ```

2. **Frontend (React)**:
    - Navigate to the **frontend** directory:
      ```bash
      cd frontend
      ```
    - Start the React development server:
      ```bash
      npm start
      ```

The frontend will be accessible at `http://localhost:3000`, and the backend will be running at `http://localhost:8000`.


#### **Option 2: Run Using Docker**

To run the application using Docker, follow these steps:

1. **Install Docker**:
    - If you don't have Docker installed, follow the instructions in the official [Docker installation guide](https://docs.docker.com/get-docker/) for your operating system.

2. **Build and Run the Docker Containers**:
    - In the root directory of the project (where `docker-compose.yml` is located), run the following command:
      ```bash
      docker-compose up --build
      ```

    - This will build the Docker images and start the containers for both the frontend and backend.

    - You can access the frontend at `http://localhost:3000`, and the backend at `http://localhost:8000`.

---

## **Additional Notes**

- If you choose the Docker method, make sure Docker and Docker Compose are installed correctly.
- The Docker setup will handle both the backend and frontend, including dependencies and environment variables, automatically.
