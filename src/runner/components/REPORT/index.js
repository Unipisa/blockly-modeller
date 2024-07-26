import { VIEWS } from "../../views";
import {icons} from'../../../blocks/icons.js';


export function view(json) { 

    try {

        return VIEWS.displayReport(json);
    
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
        targetDiv.parentNode.insertAdjacentHTML('afterbegin', `
            <div class="btndwnld">
            <a id="downloadReport" class="button-13"  onclick=""><img src="${icons.icon_downloadreport}"  height="20"  alt="download-report" title="download BPMN source" /></a>
          </div>
            `);
    } 
  } catch (error) {

    console.error("Caught error in Component:", error);

    return error;

  }
} 