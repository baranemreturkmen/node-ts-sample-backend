import express from "express";
import { getUserByEmail, createUser } from "../db/users";
import { random, authentication } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.sendStatus(400);
            return;
        }

        const user = await getUserByEmail(email).select("+authentication.salt +authentication.password");
        if (!user) {
            res.sendStatus(400);
            return;
        }

        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash) {
            res.sendStatus(403);
            return;
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();//Burada save yapmak ne kadar mantıklı?

        res.cookie("NODE-TS-AUTH", user.authentication.sessionToken, { domain: "localhost", path: "/" });
        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const register = async (req: express.Request, res: express.Response) => {
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
        return res.status(200).json(user).end();//burada response'da tüm user'a ait bilgileri göndermemek lazım.(Örneğin: password, salt)
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};