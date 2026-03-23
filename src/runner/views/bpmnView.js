import { GENERATORS } from "../../generators";
import { displayAITranslation } from "../../utils/aiModelTranslation.js";

export const displayBPMN = (objectWS) => {
    var bpmnstring = GENERATORS.BPMN.convertToBPMN(objectWS);
    //TODO: iterare su tutti gli elementi e fare displayAITranslation per ognuno
    //if(bpmnstring.length>0  && bpmnstring[0]['xmlString']) displayAITranslation(bpmnstring[0]['xmlString'],"layerBPMNtranslation");
    
    return bpmnstring;
  };
  