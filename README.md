# Impulse Test App

## Overview
Test application for Impulse company

## Requirements

Before running the application, ensure you have the following installed:

1. **Node.js**: Version `22.x` (Check compatibility in the `engines` field of `package.json` if specified).
2. **Package Manager**: `yarn` (recommended).
3. **Docker**: To run the application and its dependencies using `docker-compose`.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd impulse-test-app
   ```

2. Install dependencies using `yarn`:
   ```bash
   yarn install
   ```

---

## Running the Application

### 1. Development Mode
Start the application in development mode with live reload:
```bash
yarn start:dev
```

### 2. Production Mode
1. Build the application:
   ```bash
   yarn build
   ```

2. Run the application:
   ```bash
   yarn start:prod
   ```


## Migrations

### Generating a Migration
To generate a new migration:
1. Ensure your `data-source.ts` is configured correctly.
2. Use the following command:
   ```bash
   yarn migration:generate <MigrationName>
   ```

### Creating a Migration (Empty Migration File)
To create a new empty migration file:
```bash
yarn migration:create <MigrationName>
```

### Running Migrations
Apply all pending migrations to the database:
```bash
yarn migration:run
```

### Reverting Migrations
Undo the last applied migration:
```bash
yarn migration:revert
```

---

## Docker

### Running with Docker Compose
1. Ensure `docker` and `docker-compose` are installed.
2. Start the application along with its dependencies (e.g., database) using:
   ```bash
   docker-compose up --build
   ```
3. Stop the application:
   ```bash
   docker-compose down
   ```

---

## Scripts Summary

| Command                    | Description                                                   |
|----------------------------|---------------------------------------------------------------|
| `yarn start:dev`           | Run the app in development mode with live reload.             |
| `yarn start:prod`          | Run the app in production mode.                               |
| `yarn build`               | Build the app for production.                                 |
| `yarn migration:generate`  | Generate a new migration.                                     |
| `yarn migration:create`    | Create an empty migration file.                               |
| `yarn migration:run`       | Apply migrations to the database.                             |
| `yarn migration:revert`    | Undo the last applied migration.                              |
| `docker-compose up --build`| Build and run the app using Docker Compose.                   |
| `docker-compose down`      | Stop the Docker Compose setup.                                |

---

## Notes

- Ensure the environment variables required for the application (e.g., database credentials) are properly set in `.env` or in the `docker-compose.yml` file.
- Use `yarn` as the package manager to avoid issues with dependency resolution. 
