import { ws } from "../runner/runner.js";


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
        blockType: null,       // To capture block type
        fieldName: null,       // To capture field name if applicable
        newValue: null         // To capture new value if applicable
    };

    /*
    if (event.blockId) {
        const block = ws.blockDB_(event.blockId);
        if (block) {
            logData.blockType = block.type; // Capture block type
        }
    }*/

    // Log event data to the console (for debugging) and send to the server
    console.log('Logging Blockly event:', logData);

    // Send the event log data to the server
    sendLogToServer(logData);
}