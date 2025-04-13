const express = require("express");
const { GoogleGenerativeAI } = require('@google/generative-ai');
require("dotenv").config();

const router = express.Router();

const googleGenerativeAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const gemini = googleGenerativeAI.getGenerativeModel({model: 'gemini-2.0-flash'})

router.post("/stream", async (req, res) => {
  try {
      /** Read the request data. */
      const chatHistory = req.body.history || [];
      const msg = req.body.chat;

      const chat = gemini.startChat({
          history: chatHistory,
      });

      const result = await chat.sendMessageStream(msg);
      for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          res.write(chunkText);
      }
      res.end();
  } catch (error) {
      console.error("Error in /stream route:", error);
      res.status(500).json({ error: "Failed to process the chat request." });
  }
});


module.exports = router;