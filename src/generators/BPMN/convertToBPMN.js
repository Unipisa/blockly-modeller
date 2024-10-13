import { generateRandID, generateID, cleanName } from '../../utils/utils.js';
import { fixedIDs, generateBPMNHeader } from './BPMNelements.js';

export function convertToBPMN(jsonData) {

    const blocks = jsonData.blocks || [];
    if (blocks.length === 0 || !blocks[0].actors) return {}; 

    const validActors = blocks[0].actors.filter(actor => actor.name?.trim() && actor.name.trim() !== "...............");

    if (validActors.length === 0) return {}; 

    let bpmnStatements = [];

    validActors.forEach(actor => {
        let bpmnString = `<?xml version="1.0" encoding="UTF-8"?>\n`;

        // Usa la funzione per generare l'intestazione BPMN
        bpmnString += generateBPMNHeader();

        // Creazione della collaborazione
        bpmnString += `
        <bpmn:collaboration id="${fixedIDs.collaborationId}">
        <bpmn:participant id="${fixedIDs.participantId}" name="${actor.name}" processRef="${fixedIDs.processId}" />`;

        const addedParticipants = new Set();
        let messageFlows = '';

        // Ciclo sulle attività
        (actor.activities || []).forEach(activity => {
            const activityId = `Activity_${generateID(activity.name)}`;
            const targetName = cleanName(activity.target);

            if (targetName && targetName !== "none" && !addedParticipants.has(targetName)) {
                const targetProcessId = `process_${generateRandID()}`;
                bpmnString += `
        <bpmn:participant id="${targetName}" name="${targetName}" processRef="${targetProcessId}" />
        <bpmn:process id="${targetProcessId}" targetEl="${targetName}" />`;

                addedParticipants.add(targetName);
            }

            if (targetName && targetName !== "none") {
                const messageFlowId = `Flow_${generateRandID()}`;
                messageFlows += `
        <messageFlow id="${messageFlowId}" name="${activity.name}" sourceRef="${activityId}" targetRef="${targetName}" />`;
            }
        });

        // Chiudi collaborazione con i flussi di messaggi
        bpmnString += messageFlows + `
        </bpmn:collaboration>
        <bpmn:process id="${fixedIDs.processId}" isExecutable="false">
        <bpmn:startEvent id="${fixedIDs.startEventId}">
            <bpmn:outgoing>Flow_start</bpmn:outgoing>
        </bpmn:startEvent>`;

        let previousActivityId = fixedIDs.startEventId;
        let previousFlowId = 'Flow_start';

        (actor.activities || []).forEach(activity => {
            const activityId = `Activity_${generateID(activity.name)}`;
            const incomingFlowId = previousFlowId;
            const outgoingFlowId = `Flow_${generateID(activity.name)}`;

            bpmnString += `
        <bpmn:task id="${activityId}" name="${activity.name}">
            <bpmn:incoming>${incomingFlowId}</bpmn:incoming>
            <bpmn:outgoing>${outgoingFlowId}</bpmn:outgoing>
        </bpmn:task>
        <bpmn:sequenceFlow id="${incomingFlowId}" sourceRef="${previousActivityId}" targetRef="${activityId}" />`;

            previousActivityId = activityId;
            previousFlowId = outgoingFlowId;
        });

        bpmnString += actor.activities && actor.activities.length > 0
            ? `
        <bpmn:intermediateThrowEvent id="${fixedIDs.intermediateThrowEventId}">
            <bpmn:incoming>${previousFlowId}</bpmn:incoming>
        </bpmn:intermediateThrowEvent>
        <bpmn:sequenceFlow id="${previousFlowId}" sourceRef="${previousActivityId}" targetRef="${fixedIDs.intermediateThrowEventId}"/>`
            : `
        <bpmn:intermediateThrowEvent id="${fixedIDs.intermediateThrowEventId}">
            <bpmn:incoming>${previousFlowId}</bpmn:incoming>
        </bpmn:intermediateThrowEvent>`;

        bpmnString += `
        </bpmn:process>
        </bpmn:definitions>`;

        bpmnStatements.push({ id: actor.name, xmlString: bpmnString });
    });

    return bpmnStatements;
}
