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
    /*
    const logData = {
        type: event.type,           // Type of event (e.g., create, delete, change)
        blockId: event.blockId,     // ID of the block affected by the event
        element: event.element,      // Additional element data (if available)
        targetType : event.targetType || 'UNKNOWN',      // Additional element data (if available)
        blockType: null,       // To capture block type
        fieldName: null,       // To capture field name if applicable
        newValue: null,         // To capture new value if applicable

    };
    */
    const logData = {
        type: event.type || 'UNKNOWN',
        blockId: event.blockId || 'UNKNOWN',
        element: event.element || 'UNKNOWN',
        targetType: event.targetType || 'UNKNOWN',
        blockType: event.blockType || 'UNKNOWN',
        fieldName: event.fieldName || 'UNKNOWN',
        newValue: event.newValue || 'UNKNOWN',
        newItem: event.newItem || 'UNKNOWN',
        oldItem: event.oldItem || 'UNKNOWN',
        group: event.group || false,
        isBlank: event.isBlank || false,
        isUiEvent: event.isUiEvent || false,
        oldScale: event.oldScale || 'UNKNOWN',
        recordUndo: event.recordUndo || false,
        scale: event.scale || 'UNKNOWN',
        viewLeft: event.viewLeft || 'UNKNOWN',
        viewTop: event.viewTop || 'UNKNOWN',
        workspaceId: event.workspaceId || 'UNKNOWN',
        target: event.target?.id || 'UNKNOWN',
        targetValue: event.target?.value || 'UNKNOWN',
    };


    // Log event data to the console (for debugging) and send to the server
    console.log('Logging Blockly event:', logData);

    //logger.info('Logging message', logData);
    // Send the event log data to the server
    //sendLogToServer(logData);
    sendLogToServer(logData);

}