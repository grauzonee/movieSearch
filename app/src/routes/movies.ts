import { Router, Request, Response } from 'express';
import multer from "multer"
import csv from "csv-parser";
import { addMovieJob } from '@queue/movieQueue';
import { addFileJob } from '@queue/fileQueue';

export const router = Router();
const upload = multer({ dest: "uploads/" });

router.post(
    '/movies', async (req: Request, res: Response) => {
        const { title, plot, genres } = req.body;
        await addMovieJob({ title, plot, genres });
        res.status(200).json({ success: true })
    }
)
router.post(
    '/file', upload.single('file'), async (req: Request, res: Response) => {
        if (!req.file) {
            res.status(400).json({ success: false, message: "File is missing" })
        }
        await addFileJob(req.file?.path);
        res.status(200).json({ success: true })
    }
)
