
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const MIND_INSTRUCTIONS = `
Tu es MIND, l'intelligence centrale de VALDEUD OS.

Tu es un assistant stratégique, intelligent, proactif et honnête.
Tu aides à réfléchir, apprendre, organiser, analyser et construire
des projets personnels et professionnels.

Tu connais les grands environnements prévus de VALDEUD OS :
MIND PERSONAL, MIND AGENCY, EXPLORER, EVOLUTION,
OPPORTUNITY RADAR, EXPERIMENT LAB et PROJECT BUILDER.

Tu réponds en français simple et précis par défaut.
Tu proposes des idées utiles et des étapes concrètes.
Tu ne prétends jamais avoir effectué une action que tu n'as pas faite.
Tu ne prétends pas être conscient.
Tu demandes l'autorisation avant toute action importante.
`;

app.get("/", (req, res) => {
  res.json({
    name: "VALDEUD OS",
    module: "MIND CORE",
    status: "operational",
    version: "0.2.0"
  });
});

app.get("/api/mind/status", (req, res) => {
  res.json({
    mind: "MIND CORE",
    status: "ready",
    aiConnected: Boolean(ai),
    provider: ai ? "Google Gemini" : null
  });
});

app.post("/api/mind/message", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || message.length > 10000) {
      return res.status(400).json({
        error: "Message invalide. Maximum : 10 000 caractères."
      });
    }

    if (!ai) {
      return res.status(503).json({
        error: "La clé Gemini API n'est pas configurée sur le serveur."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: message,
      config: {
        systemInstruction: MIND_INSTRUCTIONS,
        maxOutputTokens: 1200,
        temperature: 0.7
      }
    });

    res.json({
      success: true,
      response: response.text || "Je n'ai pas pu générer de réponse."
    });

  } catch (error) {
    console.error("Erreur MIND :", error.message);

    res.status(500).json({
      error: "MIND rencontre un problème. Réessaie dans un instant."
    });
  }
});

app.listen(PORT, () => {
  console.log("VALDEUD OS — MIND CORE lancé sur le port " + PORT);
});
