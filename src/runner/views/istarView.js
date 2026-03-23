import { GENERATORS } from "../../generators";
import { displayAITranslation } from "../../utils/aiModelTranslation.js";

export const displayISTAR = (objectWS) => {
    let istarstring = GENERATORS.ISTAR.convertToIstar(objectWS);
    //displayAITranslation(JSON.stringify(istarstring, null, 2),"layerISTARtranslation");

    return istarstring
};

  