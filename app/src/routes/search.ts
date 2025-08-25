import { Router, Request, Response } from 'express';
import { searchMovie } from '@helper/searchHelper.js';

export const router = Router();

router.get(
    '/search', async (req: Request, res: Response) => {
        const { q } = req.query;
        if (typeof (q) === 'string') {
            const result = await searchMovie(q)
            res.status(200).json({ success: true, data: result })
        } else {
            res.status(400).json({ success: false, message: "Q field is missing" })
        }
    }
)
