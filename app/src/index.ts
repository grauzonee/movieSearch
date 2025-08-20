import express from "express";
import { Request, Response } from "express"

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Simple GET endpoint
app.get("/status", (req: Request, res: Response) => {
    res.json({ message: "Semantic Search API is runnning!" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

