import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import winston from "winston";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so your GitHub Pages front-end can connect
app.use(cors({ origin: "*" }));

// Optional: serve static files if needed
app.use(express.static("public"));

// Start the HTTP server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// --- Create WebSocket server ---
const wss = new WebSocketServer({ server });

// --- Optional Winston logger ---
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, message }) => `[${timestamp}] ${message}`)
  ),
  transports: [new winston.transports.Console()]
});

// Lists of clients
let viewers = [];
let senders = [];

// --- WebSocket connection handler ---
wss.on("connection", (ws, req) => {
  const url = req.url;

  if (url === "/sender") {
    senders.push(ws);
    console.log("🟢 New sender connected");
  } else {
    viewers.push(ws);
    console.log("👀 New viewer connected");
  }

  ws.on("message", (message) => {
    logger.info(`📩 Message: ${message}`);

    // Send message to all viewers
    viewers.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    viewers = viewers.filter((c) => c !== ws);
    senders = senders.filter((c) => c !== ws);
  });
});
