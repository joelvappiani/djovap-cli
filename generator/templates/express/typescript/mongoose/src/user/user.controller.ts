import { Request, Response } from 'express';
import * as userService from './user.service';
import { NextFunction } from 'connect';
import { NotFoundError } from '../utils/errors';

export const showAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await userService.showAll()
        if (!users.length) {
            throw new NotFoundError({ message: 'No users found in the DB' })
        }
        res.json({ users })
    } catch (err) {
        next(err)
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await userService.createUser(req.body)
        res.json({ result, message: 'User created in db successfully' })
    } catch (err) {
        next(err)
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await userService.updateUser(id, req.body)
        if (!result) {
            throw new NotFoundError({ message: 'User not found' })
        }
        res.json({ result, message: 'User updated successfully' })
    } catch (err) {
        next(err)
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await userService.deleteUser(id)
        if (!result) {
            throw new NotFoundError({ message: 'User not found' })
        }
        res.send(`User ${id} deleted successfully`)
    } catch (err) {
        next(err)
    }
};
