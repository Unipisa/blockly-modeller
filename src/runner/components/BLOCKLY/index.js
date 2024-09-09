import * as Blockly from "blockly";
import {icons} from'../../../blocks/icons.js';

export function addButtonDownload(id, ws) { 

    try {
      var targetDiv = document.getElementById(id);
      if (targetDiv) {
          targetDiv.parentElement.insertAdjacentHTML('afterbegin', `
                  <div id="ieWs"><input type="file" id="fileInput" style="display: none;">
                  <div class="btndwnld blockly">
                  <div class="button-13"><img src="${icons.icon_import}" width="20" height="20" id="importWs" alt="upload-link" title="upload from local" /></div>
                  <div class="button-13"><img src="${icons.icon_export}" width="20" height="20" id="exportWs" alt="download-link" title="download workspace" /></div>
                  </div>
                  </div>
              `);
      } 


    var downloadWsLink = document.getElementById('exportWs');
      
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
    //console.log("jsonImport", jsonImport);
    Blockly.serialization.workspaces.load(jsonImport, ws);
};
reader.readAsText(file);

});








      
    } catch (error) {

      console.error("Caught error in Component:", error);

      return error;

    }
  

}