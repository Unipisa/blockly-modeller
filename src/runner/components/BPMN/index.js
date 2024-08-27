//TODO: completare con downloadBPMN
//TODO: cambiare collegamento a libreria e sistemare per github
//const autolayout = require('./lib/bpmn-auto-layout/dist/index.cjs')
import {layoutProcess} from './lib/bpmn-auto-layout/lib/index.js';
import {icons} from'../../../blocks/icons.js';
import {BPMNparser} from './XMLBPMNparser.js';
import { getAllActorsBlocksinWs } from "../../../listeners/index.js";
import { getTodayDate } from '../../../utils/utils.js';

var exportcodebpmn = [];

export async function view(json) {

  
  if(!json.length || json.length <= 0) return;

  document.getElementById("processModel").innerHTML = '';

  var bpmnJS = [];

  json.forEach(async element => { 

    const id = element.id;
    const diagramXML = element.xmlString;

    const nameBlockInWS = getAllActorsBlocksinWs();

    if(nameBlockInWS.includes(id)) {    

      const targetContainer = document.getElementById("processModel");
      const targetDivBpmnContainer = document.createElement('div');
      targetDivBpmnContainer.id = 'processModel_'+id;
      targetDivBpmnContainer.classList.add("targetBpmn");
      targetDivBpmnContainer.style.visibility = "hidden";

      targetContainer.appendChild(targetDivBpmnContainer);
  
      bpmnJS[id] = new BpmnJS({
        container: '#processModel_'+id
      });

      var newDiagram = await layoutProcess(diagramXML);

      var parsedDiagram = BPMNparser(newDiagram, diagramXML);

      try {

        const {
          warnings
        } = await bpmnJS[id].importXML(parsedDiagram);
        //bpmnJS.get('processModel_'+id).zoom('fit-viewport');

        //try {
    
          var titleElement = document.createElement('p');       

          titleElement.textContent = "Process "+id;
 
          var myblurb;
          
          const targetDivSvg = document.createElement('div');
          targetDivSvg.id = id;
          targetDivSvg.classList.add("targetSvg");
          targetDivSvg.style.borderBottom = "1px solid #fff";

          myblurb =  await bpmnJS[id].saveSVG();
          var svg =   myblurb.svg;

          
          //const targetContainer = document.getElementById("processModel");
          let targetDivSvgAlreadyInDOM = document.getElementById(id);

          if (targetDivSvgAlreadyInDOM == undefined) {

          targetDivSvg.innerHTML = ''; // Clear existing content if necessary
          targetDivSvg.appendChild(titleElement); // Append the title element
          targetDivSvg.innerHTML += svg;
          targetContainer.prepend(targetDivSvg);
          }

        /*} catch (err) {
  
          console.error(err);
        }*/

      //console.log('Imported BPMN 2.0 diagram', warnings);

      updateExportElement(id, parsedDiagram, svg);


      } catch (err) {

      const {
        warnings
      } = err;

      console.log('Failed to import BPMN 2.0 diagram', err, warnings);

      }



    }

    



  });



} 


export function addButtonDownload(id) { 
  try {
    var targetDiv = document.getElementById(id);

    if (targetDiv) {

        targetDiv.insertAdjacentHTML('afterbegin', `
            <div class="btndwnld">
            <a id="downloadButtonBPMNxml" class="button-13"><img src="${icons.icon_savebpmn}" width="12" height="12"  alt="download-bpmn" title="download BPMN source" /> BPMN</a>
            <a id="downloadButtonBPMNsvg" class="button-13"><img src="${icons.icon_savesvg}" width="20" height="20"  alt="download-plantumlimage" title="download image" /></a>
          </div>
            `);

            document.getElementById('downloadButtonBPMNxml').addEventListener('click', function() {
              saveBPMN('xml');
            });

            document.getElementById('downloadButtonBPMNsvg').addEventListener('click', function() {
              saveBPMN('svg');
            });
    } 


    
  } catch (error) {

    console.error("Caught error in Component:", error);

    return error;

  }

} 

export async function saveBPMN(type){

  let blobType;
  let fileExt;
  const title = document.getElementById("customTitle");
  // get date
  var today = getTodayDate();


  if( type == "xml" ){
    blobType = 'text/xml';
    fileExt = 'bpmn';
  }

  if( type == "svg" ){
    blobType = 'image/svg+xml';
    fileExt = 'svg';
  }


  const link = document.createElement("a");

  const JSZip = require("jszip");

  const zip = new JSZip();
  
  exportcodebpmn.forEach(element => {

    let blobContent;

    if( type == "xml" ){
      blobContent = element.code;
    }
  
    if( type == "svg" ){
      blobContent = element.svg;   
    }
  
  
  const file = new Blob([blobContent], { type: blobType });

  zip.file(element.id+"_file."+fileExt, file);
  
});

zip.generateAsync({type:"blob"})
.then(function(content) {
    link.href = URL.createObjectURL(content);
link.download = `workspace_state.zip`;
link.download = `${today}_diagram-BPMN-${type}_${title.value}.zip`;

link.click();
URL.revokeObjectURL(link.href);
});


}


function updateExportElement(id,updatedXmlString,updatedSvgString){


var bpmnexportitem = {}
bpmnexportitem.id = id;
bpmnexportitem.code = updatedXmlString;
bpmnexportitem.svg = updatedSvgString;


let foundIndex = exportcodebpmn.findIndex(obj => obj.id === id);

if(foundIndex >= 0){
  exportcodebpmn[foundIndex].code = updatedXmlString;
  exportcodebpmn[foundIndex].svg = updatedSvgString;

}
else {
  exportcodebpmn.push(bpmnexportitem);

}

refreshExportElement();

}

function refreshExportElement(){

  const nameBlockInWS = getAllActorsBlocksinWs();

  exportcodebpmn.forEach(element => {



    if(!nameBlockInWS.includes(element.id)) { 
      
      exportcodebpmn = exportcodebpmn.filter(innerelement => innerelement.id !== element.id);


    }
});

}
