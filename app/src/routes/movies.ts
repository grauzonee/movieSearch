import { Router, Request, Response } from 'express';

export const router = Router();

router.post(
    '/movies', (req: Request, res: Response) => { res.status(200).json({ success: true }) }
)
