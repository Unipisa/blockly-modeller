import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve sender.html etc.

// --- Simple HTTP ping route ---
app.get("/", (req, res) => {
  res.send("✅ Unified chat + logger server is awake and ready!");
});

// --- Winston logger setup ---
function createLogger() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `blockly_session_${timestamp}.log`;

    const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN, {
    // Optional: use default endpoint unless Logtail gives you a custom one
    endpoint: "https://s1582689.eu-nbg-2.betterstackdata.com", 
  });

  return winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      // To console (so logs appear in Render dashboard)
      new winston.transports.Console(),
      // To file (works locally; not persistent on free Render)
      new winston.transports.File({ filename }),
            new LogtailTransport(logtail)

    ]
  });
}
const logger = createLogger();

// --- HTTP route to receive log events ---
app.post("/log-event", (req, res) => {
  const data = req.body;
  logger.info("📘 Blockly event", data);
  res.sendStatus(200);
});

// --- Start HTTP server ---
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// --- WebSocket setup ---
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
