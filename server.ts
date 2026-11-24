import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'civicsense-ai' });
});

app.post('/api/analyze-issue', async (req, res) => {
  try {
    const { imageBase64, mimeType, notes } = req.body as {
      imageBase64?: string;
      mimeType?: string;
      notes?: string;
    };

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'Gemini API key is not configured in Secrets. Please set GEMINI_API_KEY in Settings > Secrets.',
      });
      return;
    }

    const parts: Array<{ inlineData: { mimeType: string; data: string } } | { text: string }> = [];

    if (imageBase64 && mimeType) {
      const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    parts.push({
      text: `You are CivicSense AI, a municipal triage computer vision system for Bengaluru (BBMP, BESCOM, BWSSB).
Analyze this civic grievance ${imageBase64 ? 'photo' : 'report'}${notes ? ` and citizen note: "${notes}"` : ''}.
Classify it into one of these exact category values: "roads", "garbage", "water", "streetlights", "drainage", "animals".
Also classify urgency into one of: "low", "moderate", "severe".
Provide a concise detection label (e.g. "Road_Fracture_01"), human-readable issue title, recommended municipal agency (e.g. "BBMP Roads", "BBMP SWM", "BWSSB", "BESCOM", "BBMP SWD", "BBMP AH"), confidence percentage (85-99.9), and a concise 1-2 sentence municipal description.`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            categoryLabel: { type: Type.STRING },
            agency: { type: Type.STRING },
            urgency: { type: Type.STRING },
            severityLabel: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            detectionTag: { type: Type.STRING },
            suggestedDescription: { type: Type.STRING },
          },
          required: [
            'category',
            'categoryLabel',
            'agency',
            'urgency',
            'severityLabel',
            'confidence',
            'detectionTag',
            'suggestedDescription',
          ],
        },
      },
    });

    const parsed = JSON.parse((response.text ?? '{}').trim());
    res.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to analyze civic issue';
    res.status(500).json({ error: message });
  }
});

app.post('/api/enhance-description', async (req, res) => {
  try {
    const { description, category, landmark } = req.body as {
      description?: string;
      category?: string;
      landmark?: string;
    };

    if (!description || !description.trim()) {
      res.status(400).json({ error: 'Please enter a brief description before enhancing.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'Gemini API key is not configured in Secrets. Please set GEMINI_API_KEY in Settings > Secrets.',
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Rewrite the following citizen civic complaint into a clear, actionable, concise municipal engineering description (max 350 characters, plain text, no quotes or markdown) for Bengaluru civic authorities.
Category: ${category || 'General Civic Issue'}
Landmark: ${landmark || 'Bengaluru'}
Citizen Input: ${description}`,
    });

    const enhanced = (response.text ?? description).trim().slice(0, 500);
    res.json({ enhanced });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to enhance description';
    res.status(500).json({ error: message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CivicSense AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
