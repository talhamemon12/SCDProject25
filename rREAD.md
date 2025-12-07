## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Setup Instructions](#setup-instructions)
6. [Usage](#usage)
7. [Docker & Docker Compose Details](#docker--docker-compose-details)
8. [Volumes and Data Persistence](#volumes-and-data-persistence)
9. [Environment Variables](#environment-variables)
10. [Deployment Steps](#deployment-steps)
11. [Issues Encountered](#issues-encountered)
12. [Screenshots and Documentation](#screenshots-and-documentation)
13. [Repository Update](#repository-update)
14. [Future Enhancements](#future-enhancements)
15. [References](#references)

---

## Project Overview
NodeVault is a **CLI-based Node.js application** designed to securely manage, store, and export records using MongoDB as the persistent backend.  
The purpose of this project is to simulate a real-world production deployment scenario, containerize a Node.js application, and orchestrate it using **Docker Compose**.

> ⚠️ Note: NodeVault is **entirely CLI-based**. It does **not** run in a browser. All interactions occur through the terminal.

This project demonstrates:
- Containerization with Docker
- Orchestration with Docker Compose
- Persistent MongoDB storage using Docker volumes
- Environment variable management using `.env` files
- Automation features like backups, data export, and statistics

---

## Key Features

### CRUD Operations
- **Add Record:** Insert new records into the vault.
- **List Records:** View all records.
- **Update Record:** Modify records by ID.
- **Delete Record:** Remove records permanently.

### Advanced Features
- **Search Records:** Search by name or ID; case-insensitive.
- **Sort Records:** Sort by Name or Creation Date (ascending/descending).
- **Export Vault Data:** Generates `export.txt` with structured, human-readable data.
- **Automatic Backups:** Backups created on each add or delete operation, stored in `/backups` with timestamped filenames.
- **Vault Statistics:** View total records, last modification, longest name, earliest and latest record dates.

---

## Project Structure

SCDProject25/
│
├── backend/ # Application source code
│ ├── main.js # Application entry point
│ ├── models/ # MongoDB schemas/models
│ ├── utils/ # Backup, export, statistics utilities
│ └── Dockerfile # Dockerfile to containerize backend
│
├── docker-compose.yml # Compose file for orchestration
├── .env # Environment configuration
├── README.md # Project documentation
└── backups/ # Automatic backups stored here

yaml
Copy code

---

## Prerequisites
- Docker (latest stable)
- Docker Compose (v2 recommended)
- Node.js v16 (for local builds)
- Ubuntu Server/Desktop environment (no WSL)
- Terminal/CLI access

---

## Setup Instructions

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd SCDProject25
2. Create .env File
Create a .env file at the root with the following variables:

env
Copy code
MONGODB_URI=mongodb://mongodb:27017
DB_NAME=nodevault
NODE_ENV=production
PORT=3000
MONGO_INITDB_DATABASE=nodevault
3. Clean Docker Environment
Remove old containers and images to simulate a fresh deployment:

bash
Copy code
docker system prune -a
⚠️ This removes all unused containers, images, and networks.

4. Build and Run Using Docker Compose
bash
Copy code
docker compose up --build
MongoDB container starts first and is health-checked.

App container waits for MongoDB to be ready before connecting.

CLI menu will appear in the terminal after successful startup.

Usage
Once containers are running, the CLI presents the following menu:

markdown
Copy code
===== NodeVault =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Exit
6. Search Records
7. Sort Records
8. Export Data
9. List Backups
10. Restore Backup
11. View Vault Statistics
=====================
Interact using numeric options.

Backups and exports are stored in Docker volumes mapped to your host machine.

Docker & Docker Compose Details
Services
1. MongoDB Service

Image: mongo:7.0

Container name: nodevault-mongodb-compose

Volume: mongodb-persistent-data (persistent database storage)

Network: nodevault-network

Healthcheck ensures app waits for database readiness.

2. App Service

Image: Built from backend/Dockerfile

Container name: nodevault-app-compose

Depends on MongoDB being healthy

Volume: app-backups for automatic backups

Network: nodevault-network

Command: node main.js

Docker Volumes
mongodb-persistent-data: MongoDB persistent storage

app-backups: Automatic backup storage

Network
nodevault-network custom bridge network for secure communication between app and MongoDB.

Volumes and Data Persistence
MongoDB data persists even if containers are stopped or removed.

App backups persist across container restarts.

Demonstrated persistent data during multiple testing sessions.

Environment Variables
The application uses environment variables for configuration:

Variable	Description
MONGODB_URI	MongoDB connection string
DB_NAME	Database name
NODE_ENV	Environment (production/development)
PORT	Application port
MONGO_INITDB_DATABASE	Initial MongoDB database name

Deployment Steps
Ensure .env is configured.

Create external volumes:

bash
Copy code
docker volume create mongodb-persistent-data
docker volume create app-backups
Run Docker Compose:

bash
Copy code
docker compose up --build
Verify services:

bash
Copy code
docker compose ps
Interact with NodeVault through terminal CLI.

Issues Encountered
CLI-based application cannot run in a browser.

readline was closed error due to detached terminal mode.

Node.js version mismatch with server environment (fixed using container).

Docker Compose version warning (version attribute obsolete).

External volume references missing, causing failures.

Python distutils missing, prevented Docker Compose from running on host.

Prune conflicts (docker system prune -a sometimes failed).

MongoDB authentication warnings ignored (no auth configured).

Backup folder permissions sometimes needed correction for volumes.

Container restarts observed when app exited due to CLI environment issues.

Screenshots and Documentation
Docker Build Process: Capture terminal logs showing images being built.

Docker Compose Services Running: Show docker compose ps with containers up.

CLI Application Interaction: Terminal screenshot showing menu and operations.

Since NodeVault is CLI-based, no browser screenshots are applicable.

Repository Update
Added docker-compose.yml

Added .env for environment configuration

Added README.md (detailed documentation)

Maintains a feature branch workflow with proper commits

Future Enhancements
Implement MongoDB authentication for secure access.

Optional browser GUI for vault management.

Logging system for backup and operation monitoring.

Orchestration with Kubernetes or Docker Swarm for production.