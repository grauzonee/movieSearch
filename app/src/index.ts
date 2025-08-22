import express from "express";
import 'dotenv/config';
import { Request, Response } from "express"
import { router as moviesRouter } from "@routes/movies"
import { router as searchRouter } from "@routes/search"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', moviesRouter);
app.use('/api', searchRouter);

app.get("/status", (req: Request, res: Response) => {
    res.json({ message: "Semantic Search API is runnning!" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

