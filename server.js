import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const PORT = process.env.PORT || 3000;

import cors from "cors";

app.use(cors({ origin: "*" })); // or use your exact domain for more security


// Serviamo le pagine statiche
app.use(express.static("public"));


const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const ws = new WebSocket("wss://blockly-modeller.onrender.com/sender");
// or /viewer depending on the page

// Lista dei client
let viewers = [];
let senders = [];

wss.on("connection", (ws, req) => {
  const url = req.url; // esempio: /sender o /viewer

  if (url === "/sender") {
    senders.push(ws);
    console.log("New sender connected");
  } else {
    viewers.push(ws);
    console.log("New viewer connected");
  }

  ws.on("message", (message) => {
    console.log(`Message received: ${message}`);

    // Inoltra il messaggio a tutti i viewer
    viewers.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    viewers = viewers.filter(c => c !== ws);
    senders = senders.filter(c => c !== ws);
  });
});
