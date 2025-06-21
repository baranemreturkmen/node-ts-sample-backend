import * as fs from "fs";

// --- Mock'lar ---
jest.mock("http", () => ({
  createServer: jest.fn(() => ({
    listen: jest.fn((port, cb) => cb && cb()),
  })),
}));

jest.mock("https", () => ({
  createServer: jest.fn(() => ({
    listen: jest.fn((port, cb) => cb && cb()),
  })),
}));

jest.mock("fs", () => ({
  readFileSync: jest.fn((path) => `${path}-content`),
}));

jest.mock("mongoose", () => ({
  connect: jest.fn(() => Promise.resolve()),
  connection: {
    on: jest.fn(),
  },
}));

jest.mock("express", () => {
  const app = {
    set: jest.fn(),
    use: jest.fn(),
  };
  return () => app;
});

jest.mock("../src/router", () => jest.fn(() => jest.fn()));

// --- Test Suite ---
describe("App Initialization", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clear require cache
    process.env = { ...OLD_ENV }; // Reset environment variables
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("should initialize HTTP server and connect to MongoDB", () => {
    process.env.PORT = "3000";
    process.env.MONGO_URL = "mongodb://localhost/test";

    require("../src/index"); // Yalnızca bu testte çağrılıyor

    const http = require("http");
    const mongoose = require("mongoose");

    expect(http.createServer).toHaveBeenCalled();
    expect(mongoose.connect).toHaveBeenCalledWith("mongodb://localhost/test");
    expect(mongoose.connection.on).toHaveBeenCalledWith("error", expect.any(Function));
    expect(mongoose.connection.on).toHaveBeenCalledWith("connected", expect.any(Function));
  });

  it("should initialize HTTPS server if key and cert are provided", () => {
  process.env.HTTPS_KEY = "key.pem";
  process.env.HTTPS_CERT = "cert.pem";
  process.env.HTTPS_PORT = "8443";

  jest.resetModules(); // index.ts'nin yeniden yüklenmesini sağla
  jest.mock("http");
  jest.mock("https");

  const fs = require("fs");
  jest.spyOn(fs, "readFileSync").mockImplementation((...args: unknown[]) => `${args[0]}-content`);

  const https = require("https");

  // index.ts'yi çağırarak server başlat
  require("../src/index");

  expect(fs.readFileSync).toHaveBeenCalledWith("key.pem");
  expect(fs.readFileSync).toHaveBeenCalledWith("cert.pem");
  expect(https.createServer).toHaveBeenCalledWith(
    {
      key: "key.pem-content",
      cert: "cert.pem-content",
    },
    expect.anything()
  );
});
});