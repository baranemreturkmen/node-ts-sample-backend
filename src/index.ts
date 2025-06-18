import express from "express";
import http from "http";
import https from "https";
import fs from "fs";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from './router';

dotenv.config();

const app = express();
app.set('trust proxy', true);

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const HTTP_PORT = parseInt(process.env.PORT || "8080", 10);
http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`HTTP server is running on http://localhost:${HTTP_PORT}`);
});

const HTTPS_KEY = process.env.HTTPS_KEY;
const HTTPS_CERT = process.env.HTTPS_CERT;
const HTTPS_PORT = parseInt(process.env.HTTPS_PORT || "8443", 10);

if (HTTPS_KEY && HTTPS_CERT) {
    const httpsOptions = {
        key: fs.readFileSync(HTTPS_KEY),
        cert: fs.readFileSync(HTTPS_CERT),
    };
    https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
        console.log(`HTTPS server is running on https://localhost:${HTTPS_PORT}`);
    });
}

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
    throw new Error("MONGO_URL is not defined");
}

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on("error", (error: Error) => {
    console.log("❌ MongoDB Connection Error:", error);
});

mongoose.connection.on("connected", () => {
    console.log("✅ Successfully connected to MongoDB.");
});

app.use('/', router());
