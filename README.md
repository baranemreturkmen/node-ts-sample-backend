# node-ts-sample-backend
Node.js, typescript, mongodb sample backend. Including Express.js, RestAPI, Authentication.

## Environment Variables

The application expects the following variables to be available:

- `MONGO_URL` – MongoDB connection string used by Mongoose
- `SECRET` – secret key for generating password hashes

Create a `.env` file in development with these values and run `npm start` to load them automatically.

```bash
MONGO_URL=mongodb://localhost/mydb
SECRET=yourSecretKey
```

## HTTP and HTTPS

The server is configured to work behind a proxy and will set secure cookies only
when accessed over HTTPS. When running behind a reverse proxy, ensure that the
`X-Forwarded-Proto` header is forwarded so the application can detect HTTPS
connections.
