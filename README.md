# Node TS Sample Backend

This project is a simple user management service built with Express.js and TypeScript that runs on MongoDB. It aims to provide a sample REST API containing registration and login functionality. The project can be run directly in a development environment or inside a Docker container.

## Key Packages Used

- **express** – For the HTTP server and REST endpoints.
- **mongoose** – To create an object model on MongoDB.
- **dotenv** – Reads environment variables from a `.env` file.
- **body-parser** – Parses JSON data from incoming requests.
- **cookie-parser** – Stores session information in cookies.
- **compression** – Compresses HTTP responses.
- **cors** – Handles Cross‑Origin Resource Sharing settings.
- **lodash** – Utility functions used in middlewares.
- **nodemon** – Restarts the app on file changes during development.
- **ts-node** – Runs TypeScript files without compiling them.
- **jest** and **ts-jest** – Used for writing and running unit tests.

These packages were chosen to provide user management, secure authentication and an efficient development process.

## Installation

After cloning the repository, install the dependencies:

```bash
npm install
```

Create a `.env` file in the root directory with at least the following variables:

```bash
MONGO_URL=mongodb://localhost/mydb
SECRET=yourSecretKey
PORT=3000                    # Optional, default 8080
# If you want to use HTTPS:
# HTTPS_KEY=./certs/key.pem
# HTTPS_CERT=./certs/cert.pem
# HTTPS_PORT=8443            # Default 8443
```

## Running

### With Node

Once the packages are installed you can start the application directly:

```bash
npm start      # development mode with nodemon
# or
npm run dev    # single run with ts-node
```

### With Docker

![nodeTsDockerize](https://github.com/user-attachments/assets/a95ca628-64d2-439f-a78f-f574cae7bc27)

Run the project inside a container:

```bash
docker-compose up --build
```

If you prefer not to use docker-compose you can build your own image:

```bash
docker build -t node-ts-backend .
docker run -p 3000:3000 --env-file .env node-ts-backend
```

## API Endpoints

![PostmanApiNodeTs](https://github.com/user-attachments/assets/80777190-72ce-4866-b83b-f8c2939970a7)

### Register

`POST /auth/register`

Expected JSON:

```json
{
  "email": "user@example.com",
  "password": "password",
  "username": "user"
}
```

Example cURL:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password","username":"user"}'
```

### Login

`POST /auth/login`

Expected JSON:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

When successful it returns a cookie called `NODE-TS-AUTH` and user information.

Example cURL:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"user@example.com","password":"password"}'
```

### List Users

`GET /users`

Returns all users for the logged-in user.

```bash
curl http://localhost:3000/users -b cookies.txt
```

### Update User

`PATCH /users/:id`

Only the logged-in user can update their own account.

```bash
curl -X PATCH http://localhost:3000/users/<USER_ID> \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"username":"new-name"}'
```

### Delete User

`DELETE /users/:id`

Only the logged-in user can delete their own account.

```bash
curl -X DELETE http://localhost:3000/users/<USER_ID> -b cookies.txt
```

## HTTPS Support

The application can optionally serve on an HTTPS port using your own certificate. Add `HTTPS_KEY` and `HTTPS_CERT` variables to your `.env` file. When both variables are present HTTPS is enabled on port 8443 by default.

You can create a certificate using `openssl`:

```bash
mkdir -p certs
openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout certs/key.pem \
  -out certs/cert.pem \
  -days 365
```

Just reference the generated `certs/key.pem` and `certs/cert.pem` paths in your `.env` file.

## Unit Tests

All unit tests are written with Jest. Run them with:

```bash
npm test
```

## TODO

- Add an admin role so that certain users can delete, update or ban others. Prevent locked users from logging in.
- Improve error handling and logging.
- Provide more detailed security settings for production.
- Fix bad requests (When user try to login before register etc. Make more informative warnings for users)

This project is for demonstration purposes and open to further development.
