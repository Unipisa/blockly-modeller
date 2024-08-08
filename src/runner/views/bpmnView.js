import { GENERATORS } from "../../generators";

export const displayBPMN = (objectWS) => {
    var bpmnstring = GENERATORS.BPMN.convertToBPMN(objectWS);
    console.log(bpmnstring);
    return bpmnstring;
  };
  