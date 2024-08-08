import { VIEWS } from "../../views";
import {icons} from'../../../blocks/icons.js';
import { getTodayDate } from '../../../utils/utils.js';


export function view(json) { 

    try {

        return VIEWS.displayReport(json);
    
    } catch (error) {

      console.error("Caught error in Component:", error);

      return error;

    }
  

}


export function addButtonDownload(id) { 
  try {
    var targetDiv = document.getElementById(id);

    if (targetDiv) {
        targetDiv.parentNode.insertAdjacentHTML('afterbegin', `
            <div class="btndwnld">
            <a id="downloadButtonReport" class="button-13"  onclick=""><img src="${icons.icon_downloadreport}"  height="20"  alt="download-report" title="download BPMN source" /></a>
          </div>
            `);

          document.getElementById('downloadButtonReport').addEventListener('click', function() {
              saveReport();
            });

    } 
  } catch (error) {

    console.error("Caught error in Component:", error);

    return error;

  }
} 


export async function saveReport(){

  const content = document.getElementById("codeOutputReport").innerText;
  const title = document.getElementById("customTitle");
  
  // get date
  var today = getTodayDate();


  
  const link = document.createElement("a");
  //const comment = document.getElementById("comment");
  //var textComment = new String();
 /* if(comment.value != ''){
    textComment = '\nNOTES: ' + comment.value;
  } */

  const file = new Blob([content], { type: 'text/xml' });

    link.href = URL.createObjectURL(file);
    link.download = `${today}_diagram-report_${title.value}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);



}
