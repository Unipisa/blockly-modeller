import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;
import 'setimmediate';

// Define the custom format for logging in the frontend
const customFormat = printf(({ level, message, timestamp, ...meta }) => {
    let logMessage = `${timestamp} [${level}]: ${message}`;

    // Ensure meta is logged in a readable way
    if (meta && Object.keys(meta).length > 0) {
        logMessage += ' ' + JSON.stringify(meta);
    }
    return logMessage;
});

// Create the logger instance
const logger = createLogger({
    format: combine(
        timestamp(),
        customFormat
    ),
    transports: [
        new transports.Console(),  // Log to console
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
        // Additional fields you want to capture
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
        target: event.target ? event.target.id || 'UNKNOWN' : 'UNKNOWN',
        targetValue: event.target ? event.target.value || 'UNKNOWN' : 'UNKNOWN',
        screenX: event.screenX  || 'UNKNOWN',
        screenY: event.screenY  || 'UNKNOWN',
        offsetX: event.offsetX  || 'UNKNOWN',
        offsetY: event.offsetY  || 'UNKNOWN',
        clientX: event.clientX  || 'UNKNOWN',
        clientY: event.clientY  || 'UNKNOWN',
        /* gd layout */
        container: event.title || 'UNKNOWN',
        containerHeight: event.height || 'UNKNOWN',
        containerWidth: event.width || 'UNKNOWN',
        //rawData : event
    };

    // Log event data to the console (for debugging)
    console.log('Logging Blockly event:', logData);

    // Use winston logger to log the event, including the extra fields
    logger.info('Blockly event logged', logData);

    // Send the event log data to the server
    sendLogToServer(logData);
}
