import express from "express";
import registerRoutes from "../../src/router/authentication";
import * as authController from "../../src/controllers/authentication";

describe("authRoutes", () => {
  it("should register /auth/register and /auth/login routes", () => {
    const router = {
      post: jest.fn(),
    } as unknown as express.Router;

    registerRoutes(router);

    expect(router.post).toHaveBeenCalledWith(
      "/auth/register",
      authController.register as unknown as express.RequestHandler
    );

    expect(router.post).toHaveBeenCalledWith(
      "/auth/login",
      authController.login as unknown as express.RequestHandler
    );
  });
});