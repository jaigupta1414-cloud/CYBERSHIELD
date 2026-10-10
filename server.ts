import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Multi-turn Gemini Chat Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is available.',
      });
    }

    const { 
      message, 
      history = [], 
      roleType = 'simple_explainer', 
      useFast = false,
      grounding = 'none' 
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Role definitions & simple words instruction
    let systemInstruction = '';
    if (roleType === 'simple_explainer') {
      systemInstruction = `You are "Simple Words Guide" inside CyberShield.
Your absolute goal is to explain technical cybersecurity, internet servers, website addresses, SSL security padlocks, science, and emergency safety to everyday people who have NEVER used technical jargon.
RULES:
1. Use 5th-grade plain English. Never use unexplained acronyms like DNS, SSL, TTL, VPC, CID, BSL without giving a friendly 1-sentence metaphor (e.g. "DNS is like the Contacts app in your phone that turns a person's name into their phone number").
2. Be warm, reassuring, encouraging, and helpful.
3. Keep answers clear and digestible with bullet points.`;
    } else if (roleType === 'emergency_advisor') {
      systemInstruction = `You are "Emergency & Safety Advisor" inside CyberShield.
You assist users in distress, guiding them through panic situations, finding safe zones, nearest hospitals, first aid steps, and explaining emergency location tracking in plain, calm language.`;
    } else {
      systemInstruction = `You are "CyberShield Systems Specialist".
You provide accurate technical breakdowns of network routing, Let's Encrypt TLS renewal, Reverse Proxy bindings, AlphaFold structural confidence, and ISO-27001 compliance, while also offering plain-English summaries.`;
    }

    // Determine model
    // gemini-3.1-flash-lite for tasks that should happen fast
    // gemini-3.5-flash for general tasks (with search or maps grounding)
    let model = useFast ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash';

    // Format contents for multi-turn history
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }
    }
    // Append latest user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // Configure tools for Search Grounding and Maps Grounding
    const config: any = {
      systemInstruction,
    };

    if (grounding === 'search') {
      config.tools = [{ googleSearch: {} }];
    } else if (grounding === 'maps') {
      config.tools = [{ googleMaps: {} }];
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config,
    });

    const replyText = response.text || 'I understood your question, but could not produce a response.';
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata || null;

    res.json({
      text: replyText,
      groundingMetadata,
      modelUsed: model,
    });
  } catch (err: any) {
    console.error('Gemini chat error:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate response from Gemini',
    });
  }
});

// Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CyberShield full-stack server running on http://0.0.0.0:${port}`);
  });
}

startServer();
