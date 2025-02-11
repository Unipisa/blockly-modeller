import { createLogger, format, log, transports } from 'winston';
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced version of sendLogToServer
const debouncedSendLogToServer = debounce(sendLogToServer, 1000); // 1 second delay

const rateLimitState = {
    remaining: 10,       // Default remaining requests
    resetTime: Date.now(), // Epoch time in milliseconds when rate limit resets
    bucket: null,        // Rate limit bucket
    retryAfter: 0,       // Milliseconds to wait if rate limited
    global: false,       // Indicates if a global rate limit is hit
};

export async function logBlocklyEvent(event) {

    return; 
    
    if (!event) {
        console.error('No event data provided.');
        return;
    }

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

    console.log('Logging Blockly event:', logData);

    // Send the event log data to the server
    // sendLogToServer(logData);

    const now = Date.now() / 1000; // Current time in seconds

    if (rateLimitState.global || rateLimitState.remaining === 0) {
        if (now < rateLimitState.resetTime) {
            const waitTime = Math.ceil(rateLimitState.resetTime - now);
            console.warn(`Rate limit active. Retry after ${waitTime} seconds.`);
            return;
        }
    }

    try {
        const response = await fetch('https://discord.com/api/webhooks/1318320645632950352/eYnxKZBey_UcmYIscuW4X8g96ZBLFm4ny1L-fMc10PSTxzRGgcOyzXsUj6Nh42VMeaqi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: JSON.stringify(logData),
                username: "Logger Bot"
            }),
        });

        // Update rate limit state
        rateLimitState.remaining = parseInt(response.headers.get('X-RateLimit-Remaining')) || rateLimitState.remaining;
        const resetTime = parseInt(response.headers.get('X-RateLimit-Reset')); // Epoch time (seconds)
        rateLimitState.resetTime = resetTime || rateLimitState.resetTime;

        if (response.status === 429) {
            // Handle rate limit exceeded
            const retryAfter = parseFloat(response.headers.get('Retry-After')) || 0;
            console.warn(`Rate limit exceeded. Retrying after ${retryAfter} seconds.`);
            rateLimitState.global = response.headers.get('X-RateLimit-Global') === 'true';
            rateLimitState.resetTime = now + retryAfter;
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        console.log('Log successfully sent to server.');
    } catch (error) {
        console.error('Error sending log to server:', error);
    }
}