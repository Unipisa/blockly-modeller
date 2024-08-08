import plantumlEncoder from "plantuml-encoder";
import { GENERATORS } from "../../generators";
import { DOM_NODES } from "../../utils/domElements";


// funzione che scorre elementi e rimuove quelli con nome vuoto.
export function cleanXmi(elements) {
  return elements.filter(element => {
    if (element.name && element.name.trim() !== '') {
      if (element.ownedElements) {
        element.ownedElements = cleanXmi(element.ownedElements);
      }
      return true;
    }
    return false;
  });
}


function generateUmlUrl(umlString) {
  const encoded = plantumlEncoder.encode(umlString);
  return `http://www.plantuml.com/plantuml/img/${encoded}`;
}

//responsabilità di aggiornare il DOM con l'immagine del diagramma UML
function displayUmlDiagram(umlUrl) {
  const umlDiagramDiv = DOM_NODES.umlDiagramDiv;
  umlDiagramDiv.innerHTML = `<img src="${umlUrl}" alt="UML Diagram">`;

}

//responsabile dell'intero processo di conversione e visualizzazione del diagramma UML.
export const displayUML = (xmiWS) => {
  const umlString = GENERATORS.UML.convertToUML(xmiWS);

  const isValidUml = umlString && !umlString.includes("BlocklyModel") && umlString.trim() !== "" && umlString.trim() !== "@startuml\n@enduml";

  if (isValidUml) {
    const umlUrl = generateUmlUrl(umlString);
    displayUmlDiagram(umlUrl);
    DOM_NODES.plantUML.value = umlString; //per stampare Plant UML txt nell'hidden field.

    const downloadUMLLink = DOM_NODES.downloadUMLLink;
    if (downloadUMLLink) {
      downloadUMLLink.href = umlUrl;
    }
  } else {
    // Se la stringa UML è vuota, svuota il contenuto del div e dell'input nascosto sennò si vede la pag WEB
    DOM_NODES.umlDiagramDiv.innerHTML = "";
    DOM_NODES.plantUML.value = "";
    const downloadUMLLink = DOM_NODES.downloadUMLLink;
    if (downloadUMLLink) {
      downloadUMLLink.href = "#";
    }
    console.warn("Generated UML string is empty. Skipping diagram generation.");
  }

  DOM_NODES.outputDiv.src = ''; // Usando DOM_NODES per accedere a outputDiv
}