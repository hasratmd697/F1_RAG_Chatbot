import { DataAPIClient } from "@datastax/astra-db-ts"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
    // Initialize inside the function to ensure env vars are loaded
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
    
    const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN as string)
    const db = client.db(process.env.ASTRA_DB_API_ENDPOINT as string, { 
        keyspace: process.env.ASTRA_DB_NAMESPACE 
    })

    try {
        const { messages } = await req.json()
        
        // Get the latest user message
        const latestMessage = messages[messages.length - 1]?.content || ""
        
        let docContext = ""
        
        try {
            // Generate embedding
            const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" })
            const embeddingResult = await embeddingModel.embedContent(latestMessage)
            const queryVector = embeddingResult.embedding.values

            // Search for relevant context in Astra DB
            const collection = await db.collection(process.env.ASTRA_DB_COLLECTION as string)
            
            const cursor = collection.find(
                {},
                {
                    sort: { $vector: queryVector },
                    limit: 5,
                    includeSimilarity: true
                }
            )
            
            const documents = await cursor.toArray()
            
            // Build context from retrieved documents
            docContext = documents
                .map((doc: any) => doc.content)
                .join("\n\n---\n\n")
                
            console.log(`Found ${documents.length} relevant documents`)
        } catch (ragError: any) {
            console.error("RAG error:", ragError?.message)
            // Continue without context if RAG fails
        }

        const template = `You are an AI assistant who knows everything about Formula One.
Use the below context to augment what you know about Formula One racing.
The context will provide you with the most recent page data from wikipedia, the official F1 website and others.
If the context doesn't include the information you need answer based on your existing knowledge and don't mention the source of your information or what the context does or doesn't include.
Format responses using markdown where applicable and don't return images.

----------------
START CONTEXT
${docContext}
END CONTEXT
----------------

User question: ${latestMessage}`

        // Generate response using Gemini
        const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })
        const result = await chatModel.generateContent(template)
        const response = result.response.text()

        return Response.json({ message: response })

    } catch (error: any) {
        console.error("Chat API error:", error?.message || error)
        return Response.json(
            { error: "Failed to generate response", details: error?.message },
            { status: 500 }
        )
    }
}
