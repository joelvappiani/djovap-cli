import { Request, Response } from 'express';
import * as homeService from './home.service';

export const homeMessage = (req: Request, res: Response): void => {
    const message = homeService.homeMessage()
    res.send(message)
};

export const testMessage = (req: Request, res: Response): void => {
    const test = homeService.testMessage()
    res.send(test)
};

