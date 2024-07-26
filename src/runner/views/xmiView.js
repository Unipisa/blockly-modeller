import { GENERATORS } from "../../generators";
import { DOM_NODES } from "../../utils/domElements";


export const displayXMI = (objectWS) => {
  const xmiWS = GENERATORS.XMI.convertToXMI(objectWS);
  const sanitizedXMI = xmiWS
    .replace(/[&]/g, "&amp;")
    .replace(/[<]/g, "&lt;")
    .replace(/[>]/g, "&gt;");
  DOM_NODES.xmiDiv.innerHTML = `<pre><code>${sanitizedXMI}</code></pre>`;
  return { sanitizedXMI, xmiWS };
};
