import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Dynamic port: Render provides process.env.PORT automatically
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve sender.html etc.

// --- Simple HTTP ping route ---
app.get("/", (req, res) => {
  res.send("✅ Unified chat + logger + AI server is awake and ready!");
});

// --- Winston logger setup ---
function createLogger() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `blockly_session_${timestamp}.log`;

  const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN, {
    // Default endpoint unless BetterStack gives you a custom one
    endpoint: "https://s1582689.eu-nbg-2.betterstackdata.com",
  });

  return winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(), // visible in Render logs
      new winston.transports.File({ filename }), // local .log file
      new LogtailTransport(logtail), // cloud logging
    ],
  });
}
const logger = createLogger();

// --- HTTP route to receive log events ---
app.post("/log-event", (req, res) => {
  const data = req.body;
  logger.info("📘 Blockly event", data);
  res.sendStatus(200);
});

// --- Endpoint per l’AI ---
app.post("/ask-ai", async (req, res) => {
  const userMessage = req.body.message;
  logger.info("🧠 Received message", { userMessage });

  try {
// --- Local Ollama AI endpoint via Caddy ---
const response = await axios.post(
  "http://79.12.206.45:8080/api/chat",
  {
    model: process.env.LLM_MODEL || "llama3.2",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userMessage }
    ],
    stream: false
  },
  {
    headers: {
      "Content-Type": "application/json",
      "Authorization":
        "Basic " +
        Buffer.from(`admin:${process.env.LLAMA_PASSWORD}`).toString("base64")
    }
  }
);


// Extract assistant response
const answer = response.data.message.content;

    logger.info("✅ AI response", { answer });
    res.json({ content: answer });
  } catch (error) {
    logger.error("❌ Errore LLM API", error.response?.data || error.message);
    res
      .status(500)
      .json({ error: "Errore LLM API", details: error.response?.data });
  }
});

// --- Start server only once ---
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// --- WebSocket setup (attached to the same server) ---
const wss = new WebSocketServer({ server });

let viewers = [];
let senders = [];

wss.on("connection", (ws, req) => {
  const url = req.url;
  if (url === "/sender") {
    senders.push(ws);
    console.log("🟢 New sender connected");
  } else {
    viewers.push(ws);
    console.log("👀 New viewer connected");
  }

  ws.on("message", (msg) => {
    logger.info("💬 Chat message", { msg: msg.toString() });
    viewers.forEach((client) => {
      if (client.readyState === ws.OPEN) client.send(msg.toString());
    });
  });

  ws.on("close", () => {
    viewers = viewers.filter((c) => c !== ws);
    senders = senders.filter((c) => c !== ws);
  });
});


app.get("/test-proxy", async (req, res) => {
  try {
    const r = await axios.get("http://79.12.206.45:8080/api/version", {
      auth: { username: "admin", password: process.env.LLAMA_PASSWORD }
    });
    res.json(r.data);
  } catch (err) {
    res.json({ error: err.toString() });
  }
});
