import express from "express";
import { deleteUser, getAllUsers } from "../controllers/users";
import { isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
    router.get("/users", isAuthenticated as unknown as express.RequestHandler
        , getAllUsers as unknown as express.RequestHandler);
    router.delete("/users/:id", isAuthenticated as unknown as express.RequestHandler
        , deleteUser as unknown as express.RequestHandler);
};