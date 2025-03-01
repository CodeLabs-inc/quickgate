# Full Stack Dockerized Application

This project sets up a complete full stack environment using Docker. It includes a **frontend**, a **backend**, and a **MongoDB** database—all orchestrated via Docker Compose.

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)

## Overview
This application leverages Docker to containerize three essential components:
- **Frontend:** The user interface of the application.
- **Backend:** The API server
- **MongoDB:** The database

Using Docker Compose, all these services are configured to run seamlessly together in a single command, making setup and deployment a breeze.


## Installation
1. **Download the Repository**  
   Clone or download the repository to your local machine.
   
2. **Build and Run Containers**  
   Open your terminal, navigate to the project directory, and execute:
   ```bash
   docker-compose up --build
   ```


## Usage
After running the above command, Docker Compose will build the images (if necessary) and start all the services:

The frontend will be accessible on the designated port (check your configuration).
The backend will start serving API requests.
The MongoDB container will initialize the database, ready for connections.



## Usage

```bash
.
├── docker-compose.yml        # Docker Compose file to orchestrate the containers
├── frontend/                 # Frontend application source code
├── backend/                  # Backend application source code
└── mongo/                    # MongoDB configuration 
```
