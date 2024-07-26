import { GENERATORS } from "../../generators";
import { DOM_NODES } from "../../utils/domElements";

export const displayReport = (objectWS) => {
  const reportText = GENERATORS.REPORT.generateReportFromJSON(objectWS);
  return reportText;
  
  if(DOM_NODES.reportDiv){
  //DOM_NODES.reportDiv.innerHTML = reportText;
  }
  
};
