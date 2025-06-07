import express from "express";
import { deleteUser, getAllUsers, updateUser } from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
    router.get("/users", isAuthenticated as unknown as express.RequestHandler
        , getAllUsers as unknown as express.RequestHandler);
    router.delete("/users/:id", isAuthenticated as unknown as express.RequestHandler //make sure isAuthenticated first before isOwner
        ,isOwner as unknown as express.RequestHandler 
        , deleteUser as unknown as express.RequestHandler);
    router.patch("/users/:id", isAuthenticated as unknown as express.RequestHandler
        ,isOwner as unknown as express.RequestHandler 
        , updateUser as unknown as express.RequestHandler);
};