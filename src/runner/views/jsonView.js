import { GENERATORS } from "../../generators";
import { DOM_NODES } from "../../utils/domElements";

export const displayJSON = (ws) => {
  const objectWS = GENERATORS.JSON.generator.workspaceToCode(ws);
  const jsonWS = JSON.stringify(objectWS, null, 2);
  //DOM_NODES.codeDiv.innerHTML = `<pre><code>${jsonWS}</code></pre>`;
  return objectWS;
};
