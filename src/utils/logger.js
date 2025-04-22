//const winston = require('winston');
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;

// Define the custom format
const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
    format: combine(
        timestamp(), // Add timestamps to log messages
        customFormat  // Apply the custom formatting
    ),
    transports: [
        new transports.Console(), // Log to console
        // You can add file transports here for Node.js
    ]
});

export default logger;

function sendLogToServer(logData) {
    fetch('http://localhost:3000/log-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to send log:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error sending log:', error);
    });
}

// Event listener function for Blockly events
export function logBlocklyEvent(event) {
    const logData = {
        type: event.type,           // Type of event (e.g., create, delete, change)
        blockId: event.blockId,     // ID of the block affected by the event
        element: event.element,      // Additional element data (if available)
        targetType : event.targetType || 'UNKNOWN',      // Additional element data (if available)
        blockType: null,       // To capture block type
        fieldName: null,       // To capture field name if applicable
        newValue: null,         // To capture new value if applicable

    };


    // Log event data to the console (for debugging) and send to the server
    console.log('Logging Blockly event:', logData);

    //logger.info('Logging message', logData);
    // Send the event log data to the server
    //sendLogToServer(logData);
    sendLogToServer(logData);

}