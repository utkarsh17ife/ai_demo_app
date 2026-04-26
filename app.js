require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const { searchProductsTool, tools } = require('./tools');

const app = express();
app.use(express.json());
const openai = new OpenAI();

/**
 * Endpoint that handles an LLM reasoning loop.
 * It will continue to execute tools until the LLM provides a final text response.
 */
app.post('/search_product', async (req, res) => {
    const { userQuery } = req.body;

    const messages = [
        {
            role: "system",
            content: `You are a strict shopping assistant. 
1. Use the search tool to find products. 
2. ONLY suggest products that are genuinely relevant to the user's intent. 
3. If the tool returns 3 items but only 1 is relevant, discard the others. 
4. If NOTHING is relevant, explain that you couldn't find a good match.`
        },
        { role: "user", content: userQuery }
    ];

    try {
        let keepRunning = true;

        while (keepRunning) {
            // 1. Send current conversation to LLM
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: messages,
                tools: tools,
            });

            const responseMessage = response.choices[0].message;
            messages.push(responseMessage);

            // 2. Check if the LLM wants to call a tool
            if (responseMessage.tool_calls) {
                for (const toolCall of responseMessage.tool_calls) {
                    if (toolCall.function.name === "searchProducts") {
                        const args = JSON.parse(toolCall.function.arguments);

                        // Execute the vector search
                        const results = await searchProductsTool(args.query);

                        // 3. Add tool results to the conversation history
                        messages.push({
                            role: "tool",
                            tool_call_id: toolCall.id,
                            content: JSON.stringify(results),
                        });
                    }
                }
                // Loop continues to let the LLM see the tool output
            } else {
                // 4. No more tool calls? Return the final text answer
                keepRunning = false;
                return res.json({ answer: responseMessage.content });
            }
        }
    } catch (error) {
        console.error("Error in AI loop:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(3000, () => console.log('AI App running on port 3000 with Tool Loop enabled.'));