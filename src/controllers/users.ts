import { deleteUserById, getUserById, getUsers, updateUserById } from "../db/users";
import express from "express";

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);
        return res.json(deletedUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        const user = await getUserById(id);
        if (!user) {
            return res.sendStatus(400);
        }

        const updatedUser = await updateUserById(id, username);
        return res.json(updatedUser).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};