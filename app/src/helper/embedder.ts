import { pipeline } from "@xenova/transformers"

type Embedder = (text: string, options?: { pooling?: string; normalize?: boolean }) => Promise<{ data: Float32Array }>;
let embedder: Embedder | null = null;

async function getEmbedder(): Promise<Embedder> {
    if (!embedder) {
        embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2") as Embedder;
        return embedder;
    }
    return embedder
}

export async function embedText(text: string) {
    const model = await getEmbedder();
    const output = await model(text, { pooling: "mean", normalize: true });
    return Array.from(output.data);
}
