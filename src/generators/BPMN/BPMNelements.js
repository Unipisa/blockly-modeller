import { cleanName } from "../../utils/utils";

// Oggetto fixedIDs
export const fixedIDs = {
    definitionsId: "sid-38422fae-e03e-43a3-bef4-bd33b32041b2",
    collaborationId: "Collaboration_00xbjuv",
    participantId: "Participant_0om4akc",
    processId: "Process_1ibjsha",
    startEventId: "StartEvent",
    intermediateThrowEventId: "Event_1xxqcqf"
};

// Funzione per generare l'intestazione BPMN
export function generateBPMNHeader() {
    return `<bpmn:definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
              xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
              xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI"
              xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC"
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              id="${fixedIDs.definitionsId}"
              targetNamespace="http://bpmn.io/bpmn"
              exporter="bpmn-js (https://demo.bpmn.io)"
              exporterVersion="15.1.3">`;
}

