# AI Demo App

A Node.js demo that showcases **RAG (Retrieval-Augmented Generation)**, an **agentic loop**, and **tool usage** with the OpenAI API.

## What This Demonstrates

- **RAG** — semantic product search using a PostgreSQL database
- **Agentic loop** — the model decides when and how to call tools iteratively
- **Tool usage** — structured function calling to query the database

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp env.example .env
```

Open `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=your_key_here
```

### 3. Start the database

```bash
docker-compose up -d
```

### 4. Seed the database

```bash
node seed.js
```

### 5. Run the app

```bash
node app.js
```

The server starts on `http://localhost:3000`.

## API

### `POST /search_product`

Search for products using a natural language query.

**Request**

```bash
curl -X POST http://localhost:3000/search_product \
  -H "Content-Type: application/json" \
  -d '{"userQuery": "I need a gift that teaches patience and mindfulness."}'
```

**More example queries**

```bash
# Budding scientist
curl -X POST http://localhost:3000/search_product \
  -H "Content-Type: application/json" \
  -d '{"userQuery": "My daughter wants to be a paleontologist when she grows up."}'

# Creative / arts & crafts
curl -X POST http://localhost:3000/search_product \
  -H "Content-Type: application/json" \
  -d '{"userQuery": "I need a kit for making customized clothing that stands out at a party."}'

# Content creation
curl -X POST http://localhost:3000/search_product \
  -H "Content-Type: application/json" \
  -d '{"userQuery": "My son wants to start a YouTube channel for his drawings."}'

# Outdoor adventure
curl -X POST http://localhost:3000/search_product \
  -H "Content-Type: application/json" \
  -d '{"userQuery": "We are planning a secret base in the garden and need to protect our perimeter."}'
```
