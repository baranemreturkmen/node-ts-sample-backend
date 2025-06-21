import express from "express";
import getRouter from "../../src/router"; // default export edilen fonksiyon
import * as authRoutes from "../../src/router/authentication";
import * as userRoutes from "../../src/router/users";

describe("Main router", () => {
  it("should call authentication and users route initializers", () => {
    const authSpy = jest.spyOn(authRoutes, "default").mockImplementation(() => {});
    const userSpy = jest.spyOn(userRoutes, "default").mockImplementation(() => {});

    const result = getRouter();

    expect(authSpy).toHaveBeenCalledWith(expect.any(Function));
    expect(userSpy).toHaveBeenCalledWith(expect.any(Function));

    expect(typeof result).toBe('function');
    expect(typeof result.use).toBe('function'); // express router olduğuna işaret

    authSpy.mockRestore();
    userSpy.mockRestore();
  });
});