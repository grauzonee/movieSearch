import { Router, Request, Response } from 'express';
import { addMovieJob } from '../queue/movieQueue';

export const router = Router();

router.post(
    '/movies', async (req: Request, res: Response) => {
        await addMovieJob({ title: "Test" });
        res.status(200).json({ success: true })
    }
)
