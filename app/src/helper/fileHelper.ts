import csvParser from "csv-parser"
import fs from "fs"
import path from "path";
import { Movie } from "@models/Movie"

export async function extractMoviesFromCsv(filePath: string): Promise<Movie[]> {
    return new Promise((resolve, reject) => {
        const fullFilePath = path.resolve(filePath);
        const result: Movie[] = [];

        fs.createReadStream(fullFilePath)
            .pipe(csvParser())
            .on("data", (data) => {
                result.push({
                    title: data.title,
                    plot: data.plot,
                    genres: data.genres.split(',')
                });
            })
            .on("end", () => {
                fs.unlinkSync(fullFilePath);
                resolve(result);
            })
            .on("error", (err) => {
                reject(new Error("Error parsing CSV: " + err.message));
            });
    });
}
