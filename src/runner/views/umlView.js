import plantumlEncoder from "plantuml-encoder";
import { GENERATORS } from "../../generators";
import { DOM_NODES } from "../../utils/domElements";
import { displayAITranslation } from "../../utils/aiModelTranslation.js";
import { extractAImappedElements } from "../../utils/aiModelTranslation.js";
import { debounce } from "../../utils/utils.js";
let typingTimer = null;
let lastKeyTime = 0;
const lowerBound = 500;    // ms
const upperBound = 5000;   // ms

// funzione che scorre elementi e rimuove quelli con nome vuoto.
export function cleanXmi(elements) {
  return elements.filter(element => {
    if (element.name != '' && element.name.trim() !== '') {
      if (element.ownedElements) {
        element.ownedElements = cleanXmi(element.ownedElements);
      }
      return true;
    }
    return false;
  });
}

const debouncedDisplayUmlDiagram = debounce(function (umlUrl) {
  const umlDiagramDiv = document.getElementById('codeOutputUML');
  umlDiagramDiv.innerHTML = `<img src="${umlUrl}" alt="UML Diagram">`;
}, 100);

function generateUmlUrl(umlString) {
  //console.log("Generating UML URL",umlString);
  const encoded = plantumlEncoder.encode(umlString);
  //return `https://www.plantuml.com/plantuml/png/${encoded}`;
  return `https://plantuml-server-uxv0.onrender.com/png/${encoded}`;
}

/*responsabilità di aggiornare il DOM con l'immagine del diagramma UML
function displayUmlDiagram(umlUrl) {
  const umlDiagramDiv = document.getElementById('codeOutputUML');
  //const umlDiagramDiv = DOM_NODES.umlDiagramDiv;
  umlDiagramDiv.innerHTML = `<img src="${umlUrl}" alt="UML Diagram">`;
}*/

// Returns true if the image loads correctly
function isImageOk(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url + "?cacheBuster=" + Date.now(); // avoids cached errors
  });
}

// Try to load a PlantUML image until it becomes available
async function waitForValidUmlImage(umlString, {
  maxRetries = 10,
  delay = 10
} = {}) {

  const url = generateUmlUrl(umlString);


  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Checking UML image (attempt ${attempt}/${maxRetries})`, url);

    const ok = await isImageOk(url);

    if (ok) {
      console.log("UML image is valid:", url);
      return url;
    }

    // retry with small delay
    await new Promise(res => setTimeout(res, delay));

    // exponential backoff
    delay *= 1.5;
  }

  throw new Error("UML image could not be generated after retries");
}


const debouncedUmlUpdate_orig = function (umlString) {

  const umlUrl = generateUmlUrl(umlString);

  const umlDiagramDiv = document.getElementById('codeOutputUML');
  umlDiagramDiv.innerHTML = `<img src="${umlUrl}" alt="UML Diagram">`;

  displayAITranslation(umlString, "codeOutputCHAT");

  document.dispatchEvent(new CustomEvent("umlUpdated", {
    detail: { umlString, umlUrl }
  }));

  const downloadUMLLink = DOM_NODES.downloadUMLLink;
  if (downloadUMLLink) {
    downloadUMLLink.href = umlUrl;
  }

};

function checkFinishTyping(umlString) {
  const now = performance.now();
  const idleTime = now - lastKeyTime;

  // Equivalent to:
  // if (A_TimeIdleKeyboard < lower_bound || A_TimeIdleKeyboard > upper_bound)
  if (idleTime < lowerBound || idleTime > upperBound) {
    // Keep waiting — restart timer (like SetTimer CheckFinishTyping, 300)
    typingTimer = setTimeout(() => checkFinishTyping(umlString), 300);
    return;
  }

  // User really stopped typing
  // Stop timer (like SetTimer CheckFinishTyping, false)
  clearTimeout(typingTimer);
  typingTimer = null;

  // Run your UML update
  realUmlUpdate(umlString);
}

function realUmlUpdate(umlString) {

  const umlUrl = generateUmlUrl(umlString);

  const umlDiagramDiv = document.getElementById('codeOutputUML');
  umlDiagramDiv.innerHTML = `<img src="${umlUrl}" alt="UML Diagram">`;

  displayAITranslation(umlString, "codeOutputCHAT");

  document.dispatchEvent(new CustomEvent("umlUpdated", {
    detail: { umlString, umlUrl }
  }));

  const downloadUMLLink = DOM_NODES.downloadUMLLink;
  if (downloadUMLLink) {
    downloadUMLLink.href = umlUrl;
  }
}

function debouncedUmlUpdate(umlString) {
  lastKeyTime = performance.now();

  // "Typing..." indicator if you want
  // status.textContent = "Typing...";

  // Cancel any existing timer (this is like SetTimer CheckFinishTyping, false)
  clearTimeout(typingTimer);

  // Start a new timer (equivalent to SetTimer CheckFinishTyping, 300)
  typingTimer = setTimeout(() => checkFinishTyping(umlString), 300);
}


//responsabile dell'intero processo di conversione e visualizzazione del diagramma UML.
export const displayUML = (xmiWS) => {
  const umlDiagramDiv = document.getElementById('codeOutputUML');

  const umlString = GENERATORS.UML.convertToUML(xmiWS);

  const isValidUml = umlString && !umlString.includes("BlocklyModel") && umlString.trim() !== "" && umlString.trim() !== "@startuml\n@enduml";


  if (isValidUml) {

  //debouncedUmlUpdate_orig(umlString);
  debouncedUmlUpdate(umlString);


  } else {
    // Se la stringa UML è vuota, svuota il contenuto del div e dell'input nascosto sennò si vede la pag WEB
    umlDiagramDiv.innerHTML = "";
    // DOM_NODES.plantUML.value = "";
    const downloadUMLLink = DOM_NODES.downloadUMLLink;
    if (downloadUMLLink) {
      downloadUMLLink.href = "#";
    }
  }
  return umlString;
  // DOM_NODES.outputDiv.src = ''; // Usando DOM_NODES per accedere a outputDiv
}