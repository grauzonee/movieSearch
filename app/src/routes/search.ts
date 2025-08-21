import { Router, Request, Response } from 'express';

export const router = Router();

router.get(
    '/search', (req: Request, res: Response) => { res.status(200).json({ success: true }) }
)
