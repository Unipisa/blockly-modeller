const express = require('express');
const cors = require('cors');  // Import CORS
const winston = require('winston');
const app = express();

// Enable CORS for all routes
app.use(cors());

// If you want to restrict it to a specific origin:
// app.use(cors({ origin: 'http://localhost:8080' }));

app.use(express.json());

// Set up winston to log into a file
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'blockly_session.log' })
    ]
});

// Endpoint to receive log events
app.post('/log-event', (req, res) => {
    const { type, blockId, element } = req.body;
    logger.info(`Event: ${type}, Block ID: ${blockId}, Element: 
${element}`);
    res.sendStatus(200);
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

