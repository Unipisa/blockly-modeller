import { generateRandID, generateID, cleanName } from '../../utils/utils.js';



export function convertToBPMN(jsonData) {
    const fixedIDs = {
        definitionsId: "sid-38422fae-e03e-43a3-bef4-bd33b32041b2",
        collaborationId: "Collaboration_00xbjuv",
        participantId: "Participant_0om4akc",
        processId: "Process_1ibjsha",
        startEventId: "StartEvent",
        intermediateThrowEventId: "Event_1xxqcqf"
    };

    // Controllo della presenza di blocchi e attori
    if (!jsonData.blocks || jsonData.blocks.length === 0 || !jsonData.blocks[0].actors) {
        return {}; // Restituisci un oggetto vuoto se il formato JSON non è valido
    }

    // Verifica della presenza di almeno un attore con nome valido
    const validActors = jsonData.blocks[0].actors.filter(actor => actor.name && actor.name.trim() !== "" && actor.name.trim() !== "...............");

    if (validActors.length === 0) {
        return {}; // Restituisci un oggetto vuoto se non ci sono attori validi
    }

    var bpmnStatements = [];

    // Creazione dei file BPMN per ogni attore
    validActors.forEach(actor => {
        const actorNameCleaned = cleanName(actor.name);
        let bpmnString = `<?xml version="1.0" encoding="UTF-8"?>\n`;

        // intestazione
        bpmnString += `<bpmn:definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
                          xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                          xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI"
                          xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC"
                          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                          id="${fixedIDs.definitionsId}"
                          targetNamespace="http://bpmn.io/bpmn"
                          exporter="bpmn-js (https://demo.bpmn.io)"
                          exporterVersion="15.1.3">`;

        bpmnString += `
        <bpmn:collaboration id="${fixedIDs.collaborationId}">`;
        const participantId = fixedIDs.participantId;
        const processId = fixedIDs.processId;

        bpmnString += `
        <bpmn:participant id="${participantId}" name="${actor.name}" processRef="${processId}" />`;
        
        let messageFlows = '';

        if (actor.activities && actor.activities.length > 0) {
            actor.activities.forEach(activity => {
                const activityId = `Activity_${generateID(activity.name)}`;
                const targetName = cleanName(activity.target);

                if (targetName) {
                    const targetActor = validActors.find(a => cleanName(a.name) === targetName) || { name: actor.name };
                    const messageFlowId = `Flow_${generateRandID()}`;
                    messageFlows += `
        <messageFlow id="${messageFlowId}" name="${activity.name}" sourceRef="${activityId}" targetRef="${targetActor.name}" />`;

        //<bpmn:messageFlow id="${messageFlowId}" name="${activity.name}" sourceRef="${activityId}" targetRef="${targetActor.name}" />`;
                }
            });
        }

        bpmnString += `${messageFlows}
    </bpmn:collaboration>
    <bpmn:process id="${processId}" isExecutable="false">
        <bpmn:startEvent id="${fixedIDs.startEventId}">
            <bpmn:outgoing>Flow_start</bpmn:outgoing>
        </bpmn:startEvent>`;

        let previousActivityId = fixedIDs.startEventId;
        let previousFlowId = 'Flow_start';

        if (actor.activities && actor.activities.length > 0) {
            actor.activities.forEach((activity, index) => {
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

            bpmnString += `
        <bpmn:intermediateThrowEvent id="${fixedIDs.intermediateThrowEventId}">
            <bpmn:incoming>${previousFlowId}</bpmn:incoming>
        </bpmn:intermediateThrowEvent>
        <bpmn:sequenceFlow id="${previousFlowId}" sourceRef="${previousActivityId}" targetRef="${fixedIDs.intermediateThrowEventId}"/>`;
        } else {
            bpmnString += `
        <bpmn:intermediateThrowEvent id="${fixedIDs.intermediateThrowEventId}">
            <bpmn:incoming>${previousFlowId}</bpmn:incoming>
        </bpmn:intermediateThrowEvent>`;
        }

        bpmnString += `
    </bpmn:process>
</bpmn:definitions>`;


        // Aggiungi la stringa BPMN per l'attore all'array dei risultati
        //bpmnStatements[actor.name] = bpmnString;
        const bpmnStatement = { 'id': actor.name, 'xmlString': bpmnString  }
        bpmnStatements.push(bpmnStatement);

    });



    return Array.isArray(bpmnStatements) ? bpmnStatements : [bpmnStatements];

}

