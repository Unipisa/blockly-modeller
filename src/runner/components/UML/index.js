//TODO

import {icons} from'../../../blocks/icons.js';


export function view(json) { 

    try {

        return json;
    
    } catch (error) {

      console.error("Caught error in Component:", error);

      return error;

    }
  

}

export function addButtonDownload(id, ws) { 
  try {
    var targetDiv = document.getElementById(id);
    console.log(targetDiv);

    if (targetDiv) {
        targetDiv.parentElement.insertAdjacentHTML('afterbegin', `
            <div class="btndwnld">
            <a id="downloadButtonUML1" class="button-13"  onclick=""><img src="${icons.icon_savebpmn}" width="12" height="12"  alt="download-bpmn" title="download XMI source" /> XMI</a>
            <a id="downloadButtonBPMN" class="button-13"  onclick=""><img src="${icons.icon_savebpmn}" width="12" height="12"  alt="download-bpmn" title="download PlantUML source" /> PlantUML</a>
            <a id="downloadButtonUML3" class="button-13" onclick=""><img src="${icons.icon_savesvg}" width="20" height="20"  alt="download-plantumlimage" title="download image" /></a>
          </div>
            `);
    } 
  } catch (error) {

    console.error("Caught error in Component:", error);

    return error;

  }
} 



