import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;
import 'setimmediate';

// Define the custom format
const customFormat = printf(({ level, message, timestamp, ...meta }) => {
    let logMessage = `${timestamp} [${level}]: ${message}`;

    // Ensure that we log meta fields in a structured way
    if (meta && Object.keys(meta).length > 0) {
        // This ensures we log the full meta object as a JSON string
        logMessage += ' ' + JSON.stringify(meta);
    }

    return logMessage;
});

// Create the logger instance
const logger = createLogger({
    format: combine(
        timestamp(),  // Add timestamps to log messages
        customFormat  // Apply the custom formatting
    ),
    transports: [
        new transports.Console(),  // Log to console
        // Add File transport conditionally for Node.js environment
        ...(typeof window === 'undefined' ? [new transports.File({ filename: 'logfile.log' })] : [])
    ]
});

export default logger;

// Function to send log data to the server
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
        type: event.type,            // Type of event (e.g., create, delete, change)
        blockId: event.blockId,      // ID of the block affected by the event
        element: event.element,      // Additional element data (if available)
        targetType: event.targetType || 'UNKNOWN',  // Additional element data (if available)
        blockType: event.blockType || 'UNKNOWN',    // Block type (if available)
        fieldName: event.fieldName || 'UNKNOWN',    // Field name (if applicable)
        newValue: event.newValue || 'UNKNOWN',      // New value (if applicable)
    };

    // Log event data to the console (for debugging)
    console.log('Logging Blockly event:', logData);

    // Use winston logger to log the event, including the extra fields
    // Pass `logData` as the second argument to capture all the meta fields
    logger.info('Blockly event logged', logData);

    // Send the event log data to the server
    sendLogToServer(logData);
}
