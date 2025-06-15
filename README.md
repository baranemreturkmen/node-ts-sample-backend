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
