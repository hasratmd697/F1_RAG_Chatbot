import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const { ASTRA_DB_NAMESPACE, ASTRA_DB_COLLECTION, ASTRA_DB_API_ENDPOINT, ASTRA_DB_APPLICATION_TOKEN } = process.env;

// Initialize the Astra DB client
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT!, { keyspace: ASTRA_DB_NAMESPACE });

// Use an array, not an object!
const f1Data = [
    'https://en.wikipedia.org/wiki/Formula_One',
    'https://en.wikipedia.org/wiki/List_of_Formula_One_championships',
    'https://en.wikipedia.org/wiki/List_of_Formula_One_circuits',
    'https://en.wikipedia.org/wiki/List_of_Formula_One_drivers',
    'https://en.wikipedia.org/wiki/List_of_Formula_One_teams',
    'https://en.wikipedia.org/wiki/List_of_Formula_One_cars',
    'https://www.skysports.com/f1/news',
    'https://www.formula1.com/en/latest'
];

// Text splitter for chunking content
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
});

const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
    // Gemini text-embedding-004 produces 768-dimensional vectors
    const result = await db.createCollection(ASTRA_DB_COLLECTION!, { vector: { dimension: 768, metric: similarityMetric } });
    console.log(result);
};

const scrapePage = async (url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true
        },
        gotoOptions: {
            waitUntil: "domcontentloaded"
        },
        evaluate: async (page, browser) => {
            const result = await page.evaluate(() => document.body.innerHTML);
            await browser.close();
            return result;
        }
    });
    return (await loader.scrape())?.replace(/<[^>]*>/gm, " ");
};

const loadSampleData = async () => {
    const collection = await db.collection(ASTRA_DB_COLLECTION!);
    
    for (const url of f1Data) {
        console.log(`Scraping: ${url}`);
        const content = await scrapePage(url);
        
        if (!content) {
            console.log(`No content found for ${url}`);
            continue;
        }
        
        const chunks = await splitter.splitText(content);
        console.log(`Split into ${chunks.length} chunks`);
        
        for (const chunk of chunks) {
            // Use Gemini embedding
            const embeddingResult = await embeddingModel.embedContent(chunk);
            const vector = embeddingResult.embedding.values;
            
            const res = await collection.insertOne({
                url,
                content: chunk,
                $vector: vector
            });
            console.log(res);
        }
    }
};

// Main execution
const main = async () => {
    await createCollection();
    await loadSampleData();
};

main().catch(console.error);
