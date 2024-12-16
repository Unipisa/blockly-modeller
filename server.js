const express = require("express");
const cors = require("cors");
const winston = require("winston");
const path = require("path");
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Track current session
let currentSession = {
  logger: null,
  filename: null,
};

// Function to generate a timestamp string
function generateTimestamp() {
  const now = new Date();
  return now
    .toISOString()
    .replace(/T/, "_")
    .replace(/:/g, "-")
    .replace(/\..+/, "");
}

// Function to create a new logger instance
function createLogger(timestamp) {
  const filename = `blockly_session_${timestamp}.log`;
  const fullPath = path.join(__dirname, filename);

  return {
    logger: winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [new winston.transports.File({ filename: fullPath })],
    }),
    filename: filename,
    fullPath: fullPath,
  };
}

// Endpoint to start a new session
app.post("/new-session", (req, res) => {
  const timestamp = generateTimestamp();
  const newSession = createLogger(timestamp);

  // Update current session
  currentSession = {
    logger: newSession.logger,
    filename: newSession.filename,
    fullPath: newSession.fullPath,
  };

  currentSession.logger.info("New session started");

  res.json({
    message: "New session started",
    sessionId: timestamp,
    filename: newSession.filename,
  });
});

// Endpoint to receive log events
app.post("/log-event", (req, res) => {
  if (!currentSession.logger) {
    return res.status(400).json({
      error: "No active session. Please create a new session first.",
    });
  }

  const logData = req.body;
  currentSession.logger.info("Received Blockly event", logData);

  res.sendStatus(200);
});

// Endpoint to download current session log
app.get("/download-log", (req, res) => {
  if (!currentSession.logger || !currentSession.fullPath) {
    return res.status(400).json({
      error: "No active session log available",
    });
  }

  res.download(currentSession.fullPath, currentSession.filename, (err) => {
    if (err) {
      res.status(500).json({
        error: "Error downloading log file",
        details: err.message,
      });
    }
  });
});

// Get current session info
app.get("/session-info", (req, res) => {
  if (!currentSession.logger) {
    return res.status(400).json({
      error: "No active session",
    });
  }

  res.json({
    currentSession: {
      filename: currentSession.filename,
      startedAt: currentSession.filename.split("_")[2].split(".")[0],
    },
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Available endpoints:");
  console.log("POST /new-session - Start a new logging session");
  console.log("POST /log-event   - Log an event to current session");
  console.log("GET  /download-log - Download current session log");
  console.log("GET  /session-info - Get current session information");
});
