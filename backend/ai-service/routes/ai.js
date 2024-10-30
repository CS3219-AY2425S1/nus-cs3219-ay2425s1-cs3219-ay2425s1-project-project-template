const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Add programming context to the prompt
    const prompt = `As a programming assistant, help with this coding question. Context: ${context}. Question: ${message}`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    res.json({ 
      response: completion.choices[0].message.content,
      type: 'ai'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;