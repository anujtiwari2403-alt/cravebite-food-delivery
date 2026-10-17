import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('WARNING: GEMINI_API_KEY environment variable is not set. Gemini features may fail.');
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const SYSTEM_INSTRUCTION = `You are CraveBite's Executive AI Chef & Food Concierge.
Your mission is to elevate the dining experience of CraveBite customers.
Roles & Responsibilities:
1. Recommend artisanal dishes from the CraveBite menu:
   - Classic Cheese Burger (₹199, Non-veg, 4.8★) - Double smash patty with cheddar, caramelized onions.
   - Margherita Pizza (₹249, Veg, 4.9★) - Buffalo mozzarella, San Marzano tomato coulis, fresh basil.
   - Creamy Alfredo Pasta (₹229, Veg, 4.7★) - Fettuccine in rich garlic parmesan cream sauce.
   - Paneer Tikka Wrap (₹179, Veg, 4.9★) - Grilled spicy cottage cheese, mint chutney, flaky paratha.
   - Chocolate Lava Cake (₹129, Veg, 4.9★) - Warm Belgian molten chocolate center with vanilla scoop.
   - Crispy Veg Momos (₹149, Veg, 4.8★) - Steamed & crisp-fried dumplings with spicy red dip.
2. Provide personalized recommendations based on mood, dietary restrictions (keto, vegan, nut allergies, gluten sensitivity), or caloric goals.
3. Suggest perfect food & beverage pairings (e.g., fries with burger, garlic bread with alfredo, dessert after spicy wrap).
4. When asked about locations, kitchen hubs, delivery zones, or nearby dining, provide accurate information and refer to Google Maps places.
5. Keep your tone hospitable, gastronomic, clear, and appetizing. Use concise formatting with bullet points.`;

  // POST /api/chat - Multi-turn conversational endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const {
        messages,
        model = 'gemini-3.8-flash',
        useMaps = false,
        userLocation,
      } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'messages array is required' });
      }

      // Check if user query has geographic/places intent to enable Maps Grounding
      const lastMessage = messages[messages.length - 1];
      const lastText = (lastMessage?.content || '').toLowerCase();
      const hasLocationKeywords =
        useMaps ||
        /\b(near|nearby|kitchen|location|branch|address|hub|directions|restaurant|bangalore|bengaluru|indiranagar|koramangala|where|place)\b/i.test(
          lastText
        );

      // Model selection rule:
      // gemini-3.8-flash for general tasks & maps grounding
      // gemini-3.1-flash-lite for fast tasks
      // gemini-4-argon for complex tasks
      let selectedModel = model;
      if (hasLocationKeywords) {
        // As per prompt constraint: Use gemini-3.8-flash (with googleMaps tool)
        selectedModel = 'gemini-3.8-flash';
      }

      const formattedContents = messages.map((m: any) => ({
        role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content || '' }],
      }));

      const config: any = {
        systemInstruction: SYSTEM_INSTRUCTION,
      };

      if (hasLocationKeywords) {
        config.tools = [{ googleMaps: {} }];
        // Default to Indiranagar, Bengaluru coordinates if not provided
        const lat = userLocation?.latitude ?? 12.9784;
        const lng = userLocation?.longitude ?? 77.6408;

        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng,
            },
          },
        };
      }

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: formattedContents,
        config,
      });

      const replyText = response.text || '';
      const groundingChunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      // Extract Maps URLs from grounding chunks as required
      const mapsLinks: Array<{ title: string; uri: string; snippet?: string }> = [];
      if (Array.isArray(groundingChunks)) {
        for (const chunk of groundingChunks) {
          if (chunk.maps?.uri) {
            mapsLinks.push({
              title: chunk.maps.title || 'View on Google Maps',
              uri: chunk.maps.uri,
              snippet:
                (chunk.maps.placeAnswerSources?.reviewSnippets?.[0] as any)?.text ||
                (chunk.maps.placeAnswerSources?.reviewSnippets?.[0] as any)?.content ||
                undefined,
            });
          }
        }
      }

      // Detect dishes mentioned in response for 1-click cart action
      const mentionedDishes: string[] = [];
      const dishKeywords = [
        { id: 'dish-1', name: 'Classic Cheese Burger' },
        { id: 'dish-2', name: 'Margherita Pizza' },
        { id: 'dish-3', name: 'Creamy Alfredo Pasta' },
        { id: 'dish-4', name: 'Paneer Tikka Wrap' },
        { id: 'dish-5', name: 'Chocolate Lava Cake' },
        { id: 'dish-6', name: 'Crispy Veg Momos' },
      ];
      for (const dish of dishKeywords) {
        if (replyText.toLowerCase().includes(dish.name.toLowerCase())) {
          mentionedDishes.push(dish.id);
        }
      }

      return res.json({
        text: replyText,
        mapsLinks,
        mentionedDishes,
        modelUsed: selectedModel,
        usedMapsGrounding: hasLocationKeywords,
      });
    } catch (err: any) {
      console.error('Gemini Chat error:', err);
      return res.status(500).json({
        error: err.message || 'Failed to generate response from Gemini',
      });
    }
  });

  // POST /api/maps-explore - Dedicated Google Maps Grounding endpoint for kitchens and food spots
  app.post('/api/maps-explore', async (req, res) => {
    try {
      const { query = 'Top artisanal kitchens and restaurants near Indiranagar Bengaluru', userLocation } = req.body;
      const lat = userLocation?.latitude ?? 12.9784;
      const lng = userLocation?.longitude ?? 77.6408;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: query,
        config: {
          systemInstruction:
            'You are a food guide expert for CraveBite. Provide an engaging overview of nearby gourmet food kitchens, pizzerias, and burger hubs with their signature specialties.',
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: lat,
                longitude: lng,
              },
            },
          },
        },
      });

      const replyText = response.text || '';
      const groundingChunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      const mapsLinks: Array<{ title: string; uri: string; snippet?: string }> = [];
      if (Array.isArray(groundingChunks)) {
        for (const chunk of groundingChunks) {
          if (chunk.maps?.uri) {
            mapsLinks.push({
              title: chunk.maps.title || 'View location on Google Maps',
              uri: chunk.maps.uri,
              snippet:
                (chunk.maps.placeAnswerSources?.reviewSnippets?.[0] as any)?.text ||
                (chunk.maps.placeAnswerSources?.reviewSnippets?.[0] as any)?.content ||
                undefined,
            });
          }
        }
      }

      return res.json({
        text: replyText,
        mapsLinks,
        modelUsed: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.error('Maps explore error:', err);
      return res.status(500).json({
        error: err.message || 'Failed to fetch Google Maps grounded places',
      });
    }
  });

  // In development, mount Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CraveBite Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
