const express = require("express");
const { GoogleGenerativeAI } = require('@google/generative-ai');
require("dotenv").config();

const router = express.Router();

// Google API Configuration
const genomics = google.genomics("v2alpha1");
const serviceAccountKey = JSON.parse(process.env.GOOGLE_GEMMA_KEY); // Load your service account key from environment variable
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccountKey,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});



module.exports = router;