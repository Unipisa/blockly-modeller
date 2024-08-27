//TODO

import {icons} from'../../../blocks/icons.js';
import { getTodayDate } from '../../../utils/utils.js';


export function view(json) { 

    try {

        return json;
    
    } catch (error) {

      console.error("Caught error in Component:", error);

      return error;

    }
  

}

export function addButtonDownload(id) { 
  try {
    var targetDiv = document.getElementById(id);

    if (targetDiv) {
        targetDiv.parentElement.insertAdjacentHTML('afterbegin', `
            <div class="btndwnld">
            <a id="downloadButtonUMLplant" class="button-13"  onclick=""><img src="${icons.icon_savebpmn}" width="12" height="12"  alt="download-bpmn" title="download XMI source" /> XMI</a>
            <a id="downloadButtonUMLxmi" class="button-13"  onclick=""><img src="${icons.icon_savebpmn}" width="12" height="12"  alt="download-bpmn" title="download PlantUML source" /> PlantUML</a>
            <a id="downloadButtonUMLjpg" class="button-13" onclick=""><img src="${icons.icon_savesvg}" width="20" height="20"  alt="download-plantumlimage" title="download image" /></a>
          </div>
            `);

            document.getElementById('downloadButtonUMLplant').addEventListener('click', function() {
              saveUML('xmi');
            });

            document.getElementById('downloadButtonUMLxmi').addEventListener('click', function() {
              saveUML('plant');
            });

            document.getElementById('downloadButtonUMLjpg').addEventListener('click', function() {
              saveUML('jpg');
            });            
    } 
  } catch (error) {

    console.error("Caught error in Component:", error);

    return error;

  }
} 


export async function saveUML(type){

  let blobType;
  let fileExt;
  const title = document.getElementById("customTitle");
  // get date
  var today = getTodayDate();


//TODO : rivedere

  if( type == "plant" ){
    blobType = 'text/txt';
    fileExt = 'txt';
  }

  if( type == "xmi" ){
    blobType = 'image/svg+xml';
    fileExt = 'xml';
  }

  if( type == "jpg" ){
    blobType = 'image/jpg';
    fileExt = 'jpg';
  }


  const link = document.createElement("a");

/*TODO CONTINUARE QUA
  element.code;

    let blobContent;

    if( type == "xml" ){
      blobContent = element.code;
    }
  
    if( type == "svg" ){
      blobContent = element.svg;   
    }
*/

  const blobContent = "TODO";   
  
  const file = new Blob([blobContent], { type: blobType });

  
  link.href = URL.createObjectURL(file);
  link.download = `${today}_diagram-UML-${type}_${title.value}.${fileExt}`;
  link.click();
  URL.revokeObjectURL(link.href);


}  


