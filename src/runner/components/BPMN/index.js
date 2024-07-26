//TODO: completare con setBPMN, diagrammi multipli e autolayout
const autolayout = require('./lib/bpmn-auto-layout/dist/index.cjs')
import {icons} from'../../../blocks/icons.js';


export async function view(json) { 

try {
   const bpmnJS = new BpmnJS({
  container: '#processModel'
});
  const {
    warnings
  } = await bpmnJS.importXML(json);
 //console.log('success!');
  //bpmnJS.get('processModel_'+id).zoom('fit-viewport');
  try {
    
  //console.log('mettere in ' + id);
  var myblurb;
  //check if targetDivSvg already exists
  const targetDivSvg = document.getElementById("attore");
  if (targetDivSvg == null) {
    // Element exists
    const targetDivSvg = document.createElement('div');
    targetDivSvg.id = "attore";
    targetDivSvg.classList.add("targetSvg");
  
    // TODO
    //const targetContainer = document.getElementById("codeOutputBPMN");
  
    //const firstChild = targetContainer.firstChild.nextSibling;
  
    // Insert the new div before the first child of processDiv
    //targetContainer.insertBefore(targetDivSvg, firstChild.nextSibling);
  
  }
  //console.log('messo in ' + targetDivSvg.id);
  myblurb = await bpmnJS.saveSVG();
  var svg = await myblurb.svg;
  //console.log('update');
  //targetDivSvg.innerHTML = svg;
  
    //console.log('Exported BPMN 2.0 diagram in SVG format', svg);
  } catch (err) {
  
    console.error(err);
  }
  console.log('Imported BPMN 2.0 diagram', warnings);
} catch (err) {

  const {
    warnings
  } = err;

  console.log('Failed to import BPMN 2.0 diagram', err, warnings);

  return err;

}

  

}

export function addButtonDownload(id, ws) { 
  try {
    var targetDiv = document.getElementById(id);
    console.log(targetDiv);

    if (targetDiv) {
        targetDiv.insertAdjacentHTML('afterbegin', `
            <div class="btndwnld">
            <a id="downloadButtonBPMN" class="button-13"  onclick=""><img src="${icons.icon_savebpmn}" width="12" height="12"  alt="download-bpmn" title="download BPMN source" /> BPMN</a>
            <a id="downloadButton2" class="button-13" onclick=""><img src="${icons.icon_savesvg}" width="20" height="20"  alt="download-plantumlimage" title="download image" /></a>
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