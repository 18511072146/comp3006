import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation error', details: (err as any).errors });
    }

    res.status(500).send({ errors: [{ message: err.message }] });
};