import { GENERATORS } from "../../generators";

export const displayISTAR = (objectWS) => {
    let istarstring = GENERATORS.ISTAR.convertToIstar(objectWS);
    return istarstring
};

  