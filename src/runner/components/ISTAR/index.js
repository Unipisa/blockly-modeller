import {icons} from'../../../blocks/icons.js';

//import './lib/app/istarcore/lib/jquery.min.js';
import './lib/app/ui/lib/jscolor/jscolor.min.js';
import './lib/app/ui/lib/bootstrap/bootstrap.min.js';
import './lib/app/ui/lib/bootstrap3-editable/bootstrap-editable.min.js';
import './lib/app/ui/lib/bootbox/bootbox.min.js';
import './lib/app/istarcore/istarFunctions.js';

//TODO: aggiungere qua le librerie caricate in index.html. Mettendole qua ci sono problemi di ordine di lettura 

import {updateIstarModel} from './lib/app/istarcore/istarFunctions.js';

import { getTodayDate } from '../../../utils/utils.js';



export function view(json) { 

try {
    //TODO: eseguire update soltanto nel caso in cui il json sia stato inizializzato o aggiornato...
    updateIstarModel(json);

} catch (error) {

    console.error("Caught error in Component iStar:", error);

    return error;
}

}

export function addButtonDownload(id) { 
    try {
      var targetDiv = document.getElementById(id);
  
      if (targetDiv) {
          targetDiv.parentElement.insertAdjacentHTML('afterbegin', `
              <div class="btndwnld">
              <a id="downloadButtonISTARjson" class="button-13"  onclick=""><img src="${icons.icon_savebpmn}" width="12" height="12"  alt="download-istar" title="download iStar source" /> iStar</a>
              <a id="downloadButtonISTARsvg" class="button-13" onclick=""><img src="${icons.icon_savesvg}" width="20" height="20"  alt="download-istarimage" title="download image" /></a>
            </div>
              `);
              
      } 

      document.getElementById('downloadButtonISTARjson').addEventListener('click', function() {
        saveISTAR('txt');
      });

      document.getElementById('downloadButtonISTARsvg').addEventListener('click', function() {
        saveISTAR('svg');
      });
  
  
  
  
  
      
    } catch (error) {
  
      console.error("Caught error in Component:", error);
  
      return error;
  
    }
  } 



  export async function saveISTAR(type){

    let blobType;
    let fileExt;
    const title = document.getElementById("customTitle");
    // get date
    var today = getTodayDate();

  
  
    if( type == "txt" ){
      blobType = 'text/txt';
      fileExt = 'txt';
    }
  
    if( type == "svg" ){
      blobType = 'image/svg+xml';
      fileExt = 'svg';
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
    link.download = `${today}_diagram-ISTAR-${type}_${title.value}.${fileExt}`;
    link.click();
    URL.revokeObjectURL(link.href);


}  
  
  
  