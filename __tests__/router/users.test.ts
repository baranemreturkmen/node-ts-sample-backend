import express from "express";
import registerUserRoutes from "../../src/router/users";
import * as userController from "../../src/controllers/users";
import * as middlewares from "../../src/middlewares";

describe("User routes", () => {
  it("should register /users routes with correct handlers", () => {
    const getMock = jest.fn();
    const deleteMock = jest.fn();
    const patchMock = jest.fn();

    const router = {
      get: getMock,
      delete: deleteMock,
      patch: patchMock,
    } as unknown as express.Router;

    registerUserRoutes(router);

    // 1. /users - GET
    expect(getMock).toHaveBeenCalledWith(
      "/users",
      middlewares.isAuthenticated as unknown as express.RequestHandler,
      userController.getAllUsers as unknown as express.RequestHandler
    );

    // 2. /users/:id - DELETE
    expect(deleteMock).toHaveBeenCalledWith(
      "/users/:id",
      middlewares.isAuthenticated as unknown as express.RequestHandler,
      middlewares.isOwner as unknown as express.RequestHandler,
      userController.deleteUser as unknown as express.RequestHandler
    );

    // 3. /users/:id - PATCH
    expect(patchMock).toHaveBeenCalledWith(
      "/users/:id",
      middlewares.isAuthenticated as unknown as express.RequestHandler,
      middlewares.isOwner as unknown as express.RequestHandler,
      userController.updateUser as unknown as express.RequestHandler
    );
  });
});