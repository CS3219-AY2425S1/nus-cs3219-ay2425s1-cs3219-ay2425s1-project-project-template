const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Initialize OpenAI with error handling
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} catch (error) {
  console.error('Error initializing OpenAI:', error);
}

router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Check if message starts with "hi ai"
    if (!message.toLowerCase().trim().startsWith('hi ai')) {
      return res.json({ 
        response: "Please start your message with 'hi ai' to get AI assistance.",
        type: 'ai'
      });
    }

    // Remove "hi ai" from the message
    const actualMessage = message.substring(5).trim();
    
    // Create the prompt with context
    const messages = [
      {
        role: "system",
        content: "You are a helpful programming assistant. Please provide a very concise, single-sentence response to this programming question."
      },
      {
        role: "user",
        content: `Context: ${context}\nQuestion: ${actualMessage}`
      }
    ];
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 100
    });

    res.json({ 
      response: completion.choices[0].message.content,
      type: 'ai'
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: "An error occurred while processing your request.",
      details: error.message 
    });
  }
});

module.exports = router;