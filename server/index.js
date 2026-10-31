require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.json({
    name: "VALDEUD OS",
    module: "MIND CORE",
    status: "operational",
    version: "0.1.0",
    message: "Le cerveau de VALDEUD OS est en préparation."
  });
});

// Vérifier l'état de MIND
app.get("/api/mind/status", (req, res) => {
  res.json({
    mind: "MIND CORE",
    status: "ready",
    textMode: true,
    voiceMode: "planned",
    memory: {
      personal: "planned",
      agency: "planned"
    }
  });
});

// Route de test
app.post("/api/mind/message", (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      error: "Un message valide est nécessaire."
    });
  }

  res.json({
    success: true,
    received: message,
    response: "Message reçu. Le moteur IA sera connecté dans une prochaine phase."
  });
});

app.listen(PORT, () => {
  console.log(`VALDEUD OS MIND CORE lancé sur le port ${PORT}`);
});
