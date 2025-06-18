import { deleteUserById, getUserById, getUsers, updateUserById } from "../db/users";
import express from "express";
import { toSafeUser } from "../helpers";

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        const safeUsers = users.map((user) => toSafeUser(user));
        return res.status(200).json(safeUsers);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);
        if (!deletedUser) {
            return res.sendStatus(400);
        }
        return res.json(toSafeUser(deletedUser));
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        if (!username || typeof username !== "string") {
            return res.sendStatus(400);
        }

        const user = await getUserById(id);
        if (!user) {
            return res.sendStatus(400);
        }

        const updatedUser = await updateUserById(id, { username });
        if (!updatedUser) {
            return res.sendStatus(400);
        }
        return res.json(toSafeUser(updatedUser)).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};