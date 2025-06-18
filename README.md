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

To enable HTTPS directly in Node.js, also provide your certificate and key:

```bash
HTTPS_KEY=./certs/key.pem
HTTPS_CERT=./certs/cert.pem
```
Optionally set `HTTPS_PORT` to override the default `8443`.

## HTTP and HTTPS

The server is configured to work behind a proxy and will set secure cookies only
when accessed over HTTPS. When running behind a reverse proxy, ensure that the
`X-Forwarded-Proto` header is forwarded so the application can detect HTTPS
connections.

Alternatively you can run HTTPS directly in Node.js by providing `HTTPS_KEY` and
`HTTPS_CERT` as shown above. When both variables are set the server will listen
on the configured `HTTPS_PORT` (default `8443`) in addition to the regular HTTP
port.
