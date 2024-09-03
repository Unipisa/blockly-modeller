import { icons } from "../../../blocks/icons.js";
import { getTodayDate } from "../../../utils/utils.js";
import { displayUML } from "../../views/umlView.js";

var umlstring = "";
var xmistring = "";

// Funzione per visualizzare i diagrammi UML e aggiornare exportcodeuml
export function view(xmiWS) {
  try {
    if (!xmiWS || xmiWS.length === 0) {
      console.log("xmiWS vuoto.");
      return;
    }
    xmistring = xmiWS;
    umlstring = displayUML(xmiWS);
  } catch (error) {
    console.error("Caught error in UML view:", error);
  }
}

// Funzione per aggiungere i pulsanti di download
export function addButtonDownload(id) {
  try {
    var targetDiv = document.getElementById(id);

    if (targetDiv) {
      targetDiv.parentElement.insertAdjacentHTML(
        "afterbegin",
        `
            <div class="btndwnld">
            <a id="downloadButtonUMLplant" class="button-13"><img src="${icons.icon_savebpmn}" width="12" height="12" alt="download-bpmn" title="download XMI source" /> XMI</a>
            <a id="downloadButtonUMLxmi" class="button-13"><img src="${icons.icon_savebpmn}" width="12" height="12" alt="download-bpmn" title="download PlantUML source" /> PlantUML</a>
            <a id="downloadButtonUMLjpg" class="button-13"><img src="${icons.icon_savesvg}" width="20" height="20" alt="download-plantumlimage" title="download image" /></a>
          </div>
            `
      );

      document
        .getElementById("downloadButtonUMLplant")
        .addEventListener("click", function () {
          saveUML("xmi");
        });

      document
        .getElementById("downloadButtonUMLxmi")
        .addEventListener("click", function () {
          saveUML("plant", umlstring); 
        });

      document
        .getElementById("downloadButtonUMLjpg")
        .addEventListener("click", function () {
          saveUML("jpg");
        });
    }
  } catch (error) {
    console.error("Caught error in Component:", error);
    return error;
  }
}

// Funzione per salvare i diagrammi UML
export async function saveUML(type) {
  let blobType;
  let fileExt;
  const title = document.getElementById("customTitle");
  var today = getTodayDate();

  // Determina il tipo di blob e l'estensione del file basati sul tipo di esportazione
  if (type == "plant") {
    blobType = "text/plain";
    fileExt = "txt";

    // Usa umlString per il contenuto da salvare
    const file = new Blob([umlstring], { type: blobType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = `${today}_diagram-UML-${type}_${title.value}.${fileExt}`;
    link.click();
    URL.revokeObjectURL(link.href);
    return;
  }

  if (type == "xmi") {
    blobType = "application/xml";
    fileExt = "xmi";

    const file = new Blob([xmistring], { type: blobType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = `${today}_diagram-UML-${type}_${title.value}.${fileExt}`;
    link.click();
    URL.revokeObjectURL(link.href);
    return;
  }

  if (type == "jpg") {
    blobType = "image/jpeg";
    fileExt = "jpg";

    // Trova l'immagine del diagramma UML nel DOM
    const umlContainer = document.getElementById("codeOutputUML");
    const umlImage = umlContainer ? umlContainer.firstElementChild : null;

    if (umlImage && umlImage.src && umlImage.tagName === "IMG") {
      var url = umlImage.src;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const imageData = await response.blob();
          const imageUrl = URL.createObjectURL(imageData);
          const link = document.createElement("a");
          link.href = imageUrl;
          link.download = "image.png";

          link.click();
        } else {
          console.log(
            "Failed to download the image. Status code:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error:", error);
      }

      return;
    }
  }
}
