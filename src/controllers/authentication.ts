import express from "express";
import { getUserByEmail, createUser } from "../db/users";
import { random, authentication } from "../helpers";

export const register = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            res.sendStatus(400);
            return;
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            res.sendStatus(400);
            return;
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};