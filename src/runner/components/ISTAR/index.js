import {icons} from'../../../blocks/icons.js';

//import './lib/app/istarcore/lib/jquery.min.js';
import './lib/app/ui/lib/jscolor/jscolor.min.js';
import './lib/app/ui/lib/bootstrap/bootstrap.min.js';
import './lib/app/ui/lib/bootstrap3-editable/bootstrap-editable.min.js';
import './lib/app/ui/lib/bootbox/bootbox.min.js';
import './lib/app/istarcore/istarFunctions.js';

//TODO: aggiungere qua le librerie caricate in index.html. Mettendole qua ci sono problemi di ordine di lettura 

import {updateIstarModel} from './lib/app/istarcore/istarFunctions.js';



export function view(json) { 

try {
    //TODO: eseguire update soltanto nel caso in cui il json sia stato inizializzato o aggiornato...
    updateIstarModel(json);

} catch (error) {

    console.error("Caught error in Component iStar:", error);

    return error;
}

}

export function addButtonDownload(id, ws) { 
    try {
      var targetDiv = document.getElementById(id);
      console.log("targetDivIstar");

      console.log(targetDiv);
  
      if (targetDiv) {
          targetDiv.parentElement.insertAdjacentHTML('afterbegin', `
              <div class="btndwnld">
              <a id="downloadButtonIstar" class="button-13"  onclick=""><img src="${icons.icon_savebpmn}" width="12" height="12"  alt="download-istar" title="download iStar source" /> iStar</a>
              <a id="downloadButtonIstar2" class="button-13" onclick=""><img src="${icons.icon_savesvg}" width="20" height="20"  alt="download-istarimage" title="download image" /></a>
            </div>
              `);
      } 
  
  
    //var downloadWsLink = document.getElementById('exportWs');
      /*
        downloadWsLink.addEventListener('click', function() {
      
          const link = document.createElement("a");
      
          var state = Blockly.serialization.workspaces.save(ws);
      
          var stateText = JSON.stringify(state);
          const file = new Blob([stateText], { type: 'text/xml' });
          link.href = URL.createObjectURL(file);
          link.download = `workspace_state.json`;
          link.click();
          URL.revokeObjectURL(link.href);
      });
      
  
  var upladWsLink = document.getElementById('importWs');
  
  upladWsLink.addEventListener('click', function() {
  
    document.getElementById('fileInput').click();
  
  });
  
  
  document.getElementById('fileInput').addEventListener('change', function(event) {
  
  
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    var jsonText = event.target.result;
    var jsonImport = JSON.parse(jsonText);
    console.log("jsonImport", jsonImport);
    Blockly.serialization.workspaces.load(jsonImport, ws);
  };
  reader.readAsText(file);
  
  });
  
  
  
  */
  
  
  
  
      
    } catch (error) {
  
      console.error("Caught error in Component:", error);
  
      return error;
  
    }
  } 


