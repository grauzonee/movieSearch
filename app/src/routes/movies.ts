import { Router, Request, Response } from 'express';
import multer from "multer"
import { addMovieJob } from '@queue/movieQueue';
import { addFileJob } from '@queue/fileQueue';
import { movieSchema } from '@schemas/movieSchema';
import { ValidationErrorItem } from 'joi';

export const router = Router();
const upload = multer({ dest: "uploads/" });

router.post(
    '/movies', async (req: Request, res: Response) => {
        const { value, error } = movieSchema.validate(req.body);
        if (error) {
            const message = error.details.map((i: ValidationErrorItem) => { return i.message }).join(',');
            res.status(400).json({ success: false, message })
            return;
        }
        const { title, plot, genres } = value;
        console.log("title", title, plot, genres)
        await addMovieJob({ title, plot, genres }, 1, 1);
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
