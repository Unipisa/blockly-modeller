const express = require('express');
const cors = require('cors');  // Import CORS
const winston = require('winston');
const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Function to generate a timestamp string (e.g., 2024-10-10_14-30-45)
function generateTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/T/, '_').replace(/:/g, '-').replace(/\..+/, '');
}

// Create a new session log file with a timestamp suffix
function createLoggerWithTimestamp() {
    const timestamp = generateTimestamp();  // Generate the timestamp
    const filename = `blockly_session_${timestamp}.log`;  // Create filename with timestamp

    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()  // Log as JSON for structured logging
        ),
        transports: [
            new winston.transports.File({ filename })  // Use the dynamic filename
        ]
    });
}

// Initialize logger for the current session
let logger = createLoggerWithTimestamp();

// Endpoint to receive log events
app.post('/log-event', (req, res) => {
    // Get the log data sent from the frontend
    const logData = req.body;

    // Log the entire event data in a structured format
    logger.info('Received Blockly event', logData);

    res.sendStatus(200);  // Send a success response
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    // Every time the server starts, a new session log file is created
});
