import { Router, Request, Response } from 'express';
import { addMovieJob } from '@queue/movieQueue';

export const router = Router();

router.post(
    '/movies', async (req: Request, res: Response) => {
        const { title, plot, genres } = req.body;
        await addMovieJob({ title, plot, genres });
        res.status(200).json({ success: true })
    }
)
