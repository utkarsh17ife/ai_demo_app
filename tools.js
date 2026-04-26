const db = require('./db');
const { OpenAI } = require('openai');
const openai = new OpenAI();

/**
 * Performs a vector similarity search on the products table
 * @param {string} query - The user's search query
 */
async function searchProductsTool(query) {
    // 1. Generate embedding for the search query
    const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query,
    });
    const vector = embeddingResponse.data[0].embedding;

    // 2. Query DB using Cosine Similarity (<=> operator)
    const sql = `
    SELECT name, description, price 
    FROM products 
    ORDER BY embedding <=> $1 
    LIMIT 3;
  `;

    const res = await db.query(sql, [JSON.stringify(vector)]);
    return res.rows;
}

const tools = [{
    type: "function",
    function: {
        name: "searchProducts",
        description: "Search for toys in the database using vector similarity based on description",
        parameters: {
            type: "object",
            properties: { query: { type: "string" } },
            required: ["query"],
        },
    },
}];

module.exports = { searchProductsTool, tools };