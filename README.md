# 🏎️ F1GPT - Formula 1 RAG Chatbot

An AI-powered chatbot that answers questions about Formula 1 racing using Retrieval-Augmented Generation (RAG). Built with Next.js, Google Gemini AI, and Astra DB for vector search.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)
![Gemini](https://img.shields.io/badge/Google%20Gemini-AI-blue?logo=google)
![Astra DB](https://img.shields.io/badge/Astra%20DB-Vector%20Search-purple)

## ✨ Features

- **RAG-Powered Responses**: Retrieves relevant F1 context from a vector database to provide accurate, up-to-date answers
- **Gemini AI Integration**: Uses Google's Gemini 2.5 Flash Lite model for fast, intelligent responses
- **Vector Search**: Astra DB stores F1 knowledge embeddings for semantic similarity search
- **Modern UI**: Clean, responsive chat interface built with Next.js and CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React, TypeScript
- **AI Model**: Google Gemini 2.5 Flash Lite (chat) + text-embedding-004 (embeddings)
- **Vector Database**: DataStax Astra DB
- **Styling**: CSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Google Gemini API Key
- Astra DB Account with a vector-enabled database

### Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key
ASTRA_DB_APPLICATION_TOKEN=your_astra_db_token
ASTRA_DB_API_ENDPOINT=your_astra_db_endpoint
ASTRA_DB_NAMESPACE=your_keyspace
ASTRA_DB_COLLECTION=your_collection_name
```

### Installation

```bash
# Install dependencies
npm install

# Load sample F1 data into Astra DB (run once)
npx ts-node scripts/loaddb.ts

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting about F1!

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # Chat API with RAG
│   ├── components/           # React components
│   ├── page.tsx              # Main chat page
│   └── global.css            # Styles
├── scripts/
│   └── loaddb.ts             # Script to load F1 data into Astra DB
└── .env                      # Environment variables
```

## 🔧 How It Works

1. **User Query**: User asks a question about Formula 1
2. **Embedding**: The query is converted to a vector using Gemini's text-embedding-004 model
3. **Vector Search**: Astra DB finds the 5 most similar F1 documents
4. **Context Injection**: Retrieved documents are added to the prompt as context
5. **Response Generation**: Gemini generates an answer using both the context and its knowledge

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
