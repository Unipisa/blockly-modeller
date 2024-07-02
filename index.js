/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */



import * as Blockly from 'blockly';
import {blocks} from './blocks/myblocks';
import {generator} from './generators/javascript';
import {javascriptGenerator} from 'blockly/javascript';
//Chiara added
import {pythonGenerator} from 'blockly/python';
//end Chiara added
import {save, load} from './serialization';
import {toolbox} from './toolbox';
//import * as fs from 'fs/promises';
import './index.css';
//import bpmnAutoLayout from 'https://cdn.skypack.dev/bpmn-auto-layout';
//import { layoutProcess } from 'bpmnAutoLayout';

/* iStar and dependencies */
/*TODO: check if all dependencies are necessary for integration in ModeLLer */
/* dependencies */
//caricato in home
//import './istar/app/istarcore/lib/jquery.min.js';

//caricato in home
/* import './istar/app/istarcore/lib/lodash.min.js'; 
import './istar/app/istarcore/lib/backbone-min.js';
import './istar/app/istarcore/lib/joint.min.js'; */


console.log("joint.shapes");
console.log(joint);

import './istar/app/ui/lib/jscolor/jscolor.min.js';
import './istar/app/ui/lib/bootstrap/bootstrap.min.js';
import './istar/app/ui/lib/bootstrap3-editable/bootstrap-editable.min.js';
import './istar/app/ui/lib/bootbox/bootbox.min.js';
import './istar/app/istarcore/istarFunctions.js';

/* istar core */

import {istar} from './istar/app/istarcore/istarFunctions.js';

import {updateIstarModel} from './istar/app/istarcore/istarFunctions.js';




//import { istarLayout } from 'istar-autolayout';
//instance.method1();
//console.log(instance.property1);

import {istar_ex} from './istar/app/istarcore/istarFunctions.js';

//import './istar/app/istarcore/metamodelManager.js';
//import './istar/app/istarcore/fileManager.js';
//import './istar/app/istarcore/undoManager.js';
//import './istar/app/ui/ui.js';
//import './istar/app/ui/models/addButton.js';
//import './istar/app/ui/views/addButton.js';
//import './istar/app/ui/views/addButtonDropdown.js';
//import './istar/app/ui/views/addButtonDropdownItem.js';
//import './istar/app/ui/controllers/addButton.js';
//import './istar/app/ui/views/propertiesTable.js';
//import './istar/app/ui/istarmodels.js';



/* auto-layout */
/*
import './istar/app/layout/lib/d3-collection.v1.min.js';
import './istar/app/layout/lib/d3-dispatch.v1.min.js';
import './istar/app/layout/lib/d3-quadtree.v1.min.js';
import './istar/app/layout/lib/d3-timer.v1.min.js';
import './istar/app/layout/lib/d3-force.v1.min.js';
import './istar/app/layout/layout.js';
*/
/* language specific */
/*
import './istar/language/shapes.js';
import './istar/language/metamodel.js';
import './istar/language/constraints.js';
import './istar/language/ui.metamodel.js';


import './istar/app/ui/main.js';
*/

const autolayout = require('./bpmn-auto-layout/dist/index.cjs')

var exportcodebpmn = [];
var istarstatement = {}

import {arrayistaractors} from  './generators/javascript.js';
import { forEach, indexOf } from 'underscore';
import {arrayistardependencies} from  './generators/javascript.js';
// Customize categories in toolbox

class CustomCategory extends Blockly.ToolboxCategory {
  /**
   * Constructor for a custom category.
   * @override
   */
  constructor(categoryDef, toolbox, opt_parent) {
    super(categoryDef, toolbox, opt_parent);
  }

  createIconDom_() {
    const img = document.createElement('img');
    img.src = this.toolboxItemDef_['imageName'];
    img.style = "background-color: "+this.toolboxItemDef_['colour'];
    img.alt = '';
    img.width='15';
    img.height='15';
    return img;
  }
}

Blockly.registry.register(
  Blockly.registry.Type.TOOLBOX_ITEM,
  Blockly.ToolboxCategory.registrationName,
  CustomCategory, true);
// end



// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator, generator);
//Chiara added
//Object.assign(pythonGenerator, generator);
//end Chiara added
Blockly.ContextMenuRegistry.registry.unregister('blockComment');
Blockly.ContextMenuRegistry.registry.unregister('blockDisable');

// Import delle librerie per lettura e scrittura UML
require('./generators/uml2-import');
require('./generators/uml2-export');

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('generatedCode').firstChild;
const outputDivUML = document.getElementById('outputClass');
const reportDiv = document.getElementById('txtReport');
const blocklyDiv = document.getElementById('blocklyDiv');
const reader = require('./generators/xmi21-reader'); // Libreria per lettura dell'XMI
//Chiara added
const processDiv = document.getElementById('image');

const ws = Blockly.inject(blocklyDiv, {
  toolbox, 
        grid: {
          spacing: 20, 
          length: 3, 
          colour: 'rgb(219, 212, 201)',
          snap: true
        }, 
        move:{
          scrollbars: {
            horizontal: true,
            vertical: true
          },
        drag: true,
        wheel: true
        },
        zoom:
         {controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
          pinch: true}
});



var xmlText = '<xml xmlns="https://developers.google.com/blockly/xml" id="workspaceBlocks" style="display: none"><block type="info" id="TBgAn^~ir@P9*e=ib?;@" x="350" y="50"></block></xml>';
Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xmlText), ws);
//Chiara added
//var bpmnText = '<?BPMNxml version="1.0" encoding="UTF-8"?> <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="15.1.3"> <process id="Process_1" isExecutable="false"> <startEvent id="StartEvent_1y45yut"> <outgoing>Flow_0nyaqxh</outgoing> </startEvent> <intermediateThrowEvent id="Event_19yih6j"> <incoming>Flow_0nyaqxh</incoming> </intermediateThrowEvent> <sequenceFlow id="Flow_0nyaqxh" sourceRef="StartEvent_1y45yut" targetRef="Event_19yih6j" /> </process> <bpmndi:BPMNDiagram id="BpmnDiagram_1"> <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1"> <bpmndi:BPMNShape id="StartEvent_1y45yut_di" bpmnElement="StartEvent_1y45yut"> <omgdc:Bounds x="152" y="102" width="36" height="36" /> <bpmndi:BPMNLabel> <omgdc:Bounds x="134" y="145" width="73" height="14" /> </bpmndi:BPMNLabel> </bpmndi:BPMNShape> <bpmndi:BPMNShape id="Event_19yih6j_di" bpmnElement="Event_19yih6j"> <omgdc:Bounds x="402" y="102" width="36" height="36" /> </bpmndi:BPMNShape> <bpmndi:BPMNEdge id="Flow_0nyaqxh_di" bpmnElement="Flow_0nyaqxh"> <omgdi:waypoint x="188" y="120" /> <omgdi:waypoint x="402" y="120" /> </bpmndi:BPMNEdge> </bpmndi:BPMNPlane> </bpmndi:BPMNDiagram> </definitions>';
//Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(bpmnText), ws);

function generateID(nomeClasse) {
  nomeClasse = nomeClasse.trim().toLowerCase();
  var id = new String();
  for(let c = 0; c < nomeClasse.length; c++){
    var charCode = nomeClasse.charCodeAt(c);
    id = id + charCode;
  }
  return id;
}


export function removeLastTypedBlock(type){
  let blocks = ws.getBlocksByType(type, true);
  const index = (blocks.length) - 1;
  blocks[index].dispose(true);
}

export function getAllClassBlocksinWs(){
  const className = ['none'];
  let i = 0;
  while(i < nameBlockInWS.length){
    className.push(nameBlockInWS[i]);
    i++;
  }
  

  return className;
}

export function blockAlreadyInWs(new_block_name){
  let blocks = ws.getAllBlocks(true);
  let counter = -1;

  let i = 1;
  while(i < blocks.length){
    if(new_block_name.localeCompare(blocks[i].getFieldValue('NAME').toLowerCase()) == 0){
      counter++;
    }
    i++;
  }

   //un blocco lo trova sempre perchè è se stesso
   if(counter == 0){
    return false;
   }
   else if(counter > 0){
    return true;
   }
}

export function ass_agg_AlreadyInWs(new_ass_name){
  let blocks = ws.getAllBlocks(true);
  let bool = false;

  let i = 1;
  while(i < blocks.length){
    if(new_ass_name.localeCompare(blocks[i].getFieldValue('NAME').toLowerCase()) == 0){
      bool = true;
    }
    i++;
  }
  return bool;
}

export function getAlreadyInWsBlockType(new_block_name){
  let blocks = ws.getAllBlocks(true);
  let i = 1;
  let index = -1;

  while(i < blocks.length){
    if(new_block_name.localeCompare(blocks[i].getFieldValue('NAME').toLowerCase()) == 0){
      index = i;
    }
    i++;
  }
  return blocks[index].type;
}

const textReport = new Map(); //ogni oggetto è il text report di una classe (identificata con l'id -> chiave)
export function setReport(id, text){
  textReport.set(id, text);
  showReport();
}


//CHIARA added/
//const codeBPMN = new Map(); //ogni oggetto è il text report di una classe (identificata con l'id -> chiave)

var bpmnJS = [];

export async function setBPMN(id, diagramXML){
  

  //evita che si creino div per i singoli caratteri dei  nomi dei blocchi 
  if(!nameBlockInWS.includes(id)) {

    return;
  }

  const targetDivBpmnContainerPrev = document.getElementById("processModel_"+id)

  if (targetDivBpmnContainerPrev != null) {

    targetDivBpmnContainerPrev.remove();

  }


  const targetDivBpmnContainer = document.createElement('div');
  targetDivBpmnContainer.id = 'processModel_'+id;
  targetDivBpmnContainer.classList.add("targetBpmn");

  document.getElementById("outputProc").appendChild(targetDivBpmnContainer);


 bpmnJS[id] = new BpmnJS({
  container: '#processModel_'+id
});


console.log("old: "+diagramXML);

var newDiagram = await autolayout.layoutProcess(diagramXML);

// Create a new DOMParser
const parser = new DOMParser();

// Parse the BPMN XML string
const xmlDoc = parser.parseFromString(newDiagram, 'text/xml');

// Find the collaboration element
var collaborationElement = xmlDoc.querySelector("collaboration");

// Get its id attribute value
var collaborationId = collaborationElement.getAttribute("id");

var bpmnPlaneElement = xmlDoc.getElementsByTagName("bpmndi:BPMNDiagram")[0];

// Find the first child element of BPMNPlane
var firstChildElement = bpmnPlaneElement.getElementsByTagName("*")[0];

// Update the value of bpmnElement attribute
firstChildElement.setAttribute("bpmnElement", collaborationId);

// Create new elements
var bpmnShapeElement = xmlDoc.createElementNS("http://www.omg.org/spec/BPMN/20100524/DI", "bpmndi:BPMNShape");
var boundsElement = xmlDoc.createElementNS("http://www.omg.org/spec/DD/20100524/DC", "omgdc:Bounds");
var labelElement = xmlDoc.createElementNS("http://www.omg.org/spec/BPMN/20100524/DI", "bpmndi:BPMNLabel");


// Set attributes for the BPMNShape element
var randomId = "shape_" + Math.random().toString(36).substr(2, 10);

// Find the participant element
var participantElement = xmlDoc.querySelector("participant");

var particpantiId = participantElement.getAttribute("id");

// Set attributes for the BPMNShape element
bpmnShapeElement.setAttribute("id", randomId);
bpmnShapeElement.setAttribute("bpmnElement", particpantiId);
bpmnShapeElement.setAttribute("isHorizontal", "true");


// Find all BPMNShape elements under BPMNDiagram
var bpmnShapes = xmlDoc.getElementsByTagNameNS("http://www.omg.org/spec/BPMN/20100524/DI", "BPMNShape");

// Find the maximum x value among the BPMNShape elements
var maxX = 0;
var widthmaxX = 0;

var maxY = 0;
var heightmaxY = 0;


for (var i = 0; i < bpmnShapes.length; i++) {
  var shape = bpmnShapes[i];
  var bounds = shape.getElementsByTagNameNS("http://www.omg.org/spec/DD/20100524/DC", "Bounds")[0];
  var x = parseInt(bounds.getAttribute("x"), 10);
  if (x > maxX) {
    maxX = x;
    widthmaxX = parseInt(bounds.getAttribute("width"), 10);
  }
  var y = parseInt(bounds.getAttribute("y"), 10);
  if (y > maxY) {
    maxY = y;
    heightmaxY = parseInt(bounds.getAttribute("height"), 10);

  }
}


console.log(maxX);

// Set attributes for the Bounds element
boundsElement.setAttribute("x", "0");
boundsElement.setAttribute("y", "0");
boundsElement.setAttribute("width", maxX + widthmaxX + 20); // Add 20 for some padding
boundsElement.setAttribute("height", maxY + heightmaxY + 40);

// Append Bounds element to BPMNShape element
bpmnShapeElement.appendChild(boundsElement);
bpmnShapeElement.appendChild(labelElement);

// Find the BPMNPlane element
var bpmnPlaneElement = xmlDoc.getElementsByTagName("bpmndi:BPMNPlane")[0];

// Find the first child element of BPMNPlane
var firstChildElement = bpmnPlaneElement.firstElementChild;

// Insert the new BPMNShape element as the first child of BPMNPlane
bpmnPlaneElement.insertBefore(bpmnShapeElement, firstChildElement);


//extract messageFlow from original diagram, then edit the new diagram

// Create a new DOMParser of original diagram
const parserOrig = new DOMParser();

// Parse the BPMN XML string
const xmlOrigDoc = parserOrig.parseFromString(diagramXML, 'text/xml');

// Find the messageFlow element


var messageElements = xmlOrigDoc.querySelectorAll("messageFlow");


if (messageElements !== null && messageElements !== undefined) {

  var arrayProcesses = [];

  messageElements.forEach(function(messageElement) {

    var messageElementSourceAttributeValue = messageElement.getAttribute("sourceRef");


    console.log("messageElement: ", messageElement);
   
  var messageElementIdAttributeValue = messageElement.getAttribute("id");



  var targetRefValue = messageElement.getAttribute('targetRef');
  var messageElId = messageElement.getAttribute('id');

// Check if the value is not null or undefined
if (targetRefValue !== null && targetRefValue !== undefined && targetRefValue !== "NONE") {


  //var messageElementNew =  xmlDoc.querySelector("messageFlow");
  
  //messageElementNew.setAttribute('targetRef',targetRefValue);
 
  //messageElement.setAttribute('targetRef',targetRefValue);

  //copy from xmlDoc orig to new xmlDoc
  var messageElementToUpdate = xmlDoc.querySelector(`[id="${messageElId}"]`);
  messageElementToUpdate.setAttribute('targetRef',targetRefValue);

 
  var allParticipants = xmlDoc.querySelectorAll("process");
  var numParticipants = allParticipants.length;
  console.log(allParticipants);
  console.log("numParticipants: ", numParticipants);

  if (!arrayProcesses.includes(targetRefValue)) {
    arrayProcesses.push(targetRefValue);

    console.log("crea participant per", targetRefValue);
  
  //var bpmnParticipantElement = xmlDoc.createElementNS("participant");
  var bpmnParticipantElement = xmlDoc.createElementNS("http://www.omg.org/spec/BPMN/20100524/MODEL", "bpmn:participant");
  var randomProcessId = "process_" + Math.random().toString(36).substr(2, 10);

  bpmnParticipantElement.setAttribute("id", targetRefValue);
  bpmnParticipantElement.setAttribute("name", targetRefValue);
  bpmnParticipantElement.setAttribute("processRef", randomProcessId);

  var firstChildcollaborationElement = collaborationElement.firstElementChild;

  collaborationElement.insertBefore(bpmnParticipantElement, firstChildcollaborationElement);

  
  
  
//TODO: crea l'elemento se non esiste 
  var bpmnProcessElement = xmlDoc.createElementNS("http://www.omg.org/spec/BPMN/20100524/MODEL", "bpmn:process");
  bpmnProcessElement.setAttribute('id',randomProcessId);
  bpmnProcessElement.setAttribute('targetEl',targetRefValue);

//TODO : cambiare e selezionare id
  var existingProcessElement =  xmlDoc.querySelector("process");

// Append the new element after the existing element
existingProcessElement.parentNode.insertBefore(bpmnProcessElement, existingProcessElement.nextSibling);

  
  var bpmnShapeParticipantElement = xmlDoc.createElementNS("http://www.omg.org/spec/BPMN/20100524/DI", "bpmndi:BPMNShape");

  
  // Set attributes for the BPMNShape element
  //var randomId2 = "Participant_" + Math.random().toString(36).substr(2, 10);

  bpmnShapeParticipantElement.setAttribute("id", "Participant_" + targetRefValue + "_di");
  bpmnShapeParticipantElement.setAttribute("bpmnElement", targetRefValue);
  bpmnShapeParticipantElement.setAttribute("isHorizontal", "true");

  var boundsParticipantElement = xmlDoc.createElementNS("http://www.omg.org/spec/DD/20100524/DC", "omgdc:Bounds");
  var labelParticipantElement = xmlDoc.createElementNS("http://www.omg.org/spec/BPMN/20100524/DI", "bpmndi:BPMNLabel");

  //TODO sostituire maxY con maxY del participant più in alto 
  //TODO2 se ci sono solo 2 shape mettere sopra
  //oppure se ci sono 
 
  // Set attributes for the Bounds element
  boundsParticipantElement.setAttribute("x", 0);
  boundsParticipantElement.setAttribute("y", maxY + heightmaxY + 70 );
  boundsParticipantElement.setAttribute("width", (maxX + widthmaxX + 20)); // Add 20 for some padding
  boundsParticipantElement.setAttribute("height",maxY + heightmaxY);

 

// Append Bounds element to BPMNShape element
bpmnShapeParticipantElement.appendChild(boundsParticipantElement);
bpmnShapeParticipantElement.appendChild(labelParticipantElement);

  bpmnPlaneElement.appendChild(bpmnShapeParticipantElement);

  var allParticipants = xmlDoc.querySelectorAll("process");
  var numParticipants = allParticipants.length -1;

  var count = 0;
  var arrayCentroids = [];

  var divParticipants = Array.from(allParticipants);

  divParticipants.reverse();
  
  divParticipants.forEach(function(participant) {


    console.log("participant:", participant);

    var partTargetId = participant.getAttribute('id');

    console.log(partTargetId);
    console.log(messageElementSourceAttributeValue);

    var currentProcTask = xmlDoc.querySelector(`[id="${messageElementSourceAttributeValue}"]`)

    var currentProc = currentProcTask.parentNode.getAttribute('id');
  
    if(partTargetId != currentProc){


    var processRef = xmlDoc.querySelector(`[processRef="${partTargetId}"]`)
    var partTargetRef = processRef.getAttribute('id');
    console.log("processRef", processRef);

    console.log("cerca", partTargetRef);
    var boundParticipant = xmlDoc.querySelector(`[bpmnElement="${partTargetRef}"]`)
    console.log("trovato", boundParticipant);

    boundParticipant.firstElementChild.setAttribute("width", (maxX + widthmaxX + 20)/numParticipants ); // Add 20 for some padding
    boundParticipant.firstElementChild.setAttribute("x", ((maxX + widthmaxX + 20)/numParticipants) * count ); // Add 20 for some padding

    console.log("width: ", (maxX + widthmaxX + 20)/numParticipants);
    console.log("x: ", boundParticipant.firstElementChild.getAttribute("x"));
    var shapeId = boundParticipant.getAttribute('bpmnElement');

    //array with participants centroids
    //var xPos = parseInt(boundParticipant.firstElementChild.getAttribute('x') + (parseInt(boundParticipant.firstElementChild.getAttribute('width'))/2));
    var xPos = ((maxX + widthmaxX + 20)/numParticipants) * count + ((maxX + widthmaxX + 20)/numParticipants)/2 ;

    arrayCentroids[shapeId] = xPos;
    
    count ++;

 
 
  }
  });

}
else {
  console.log("non crea participant per", targetRefValue);

}

//questo invece si esegue per tutti

console.log("all positions:",arrayCentroids);

//aggiornare tutte le posizioni 

//seleziono tutti i messageflow

var bpmnEdgeElement = xmlDoc.createElementNS("http://www.omg.org/spec/BPMN/20100524/DI", "bpmndi:BPMNEdge");
var bpmnEdgeWaypoint1 = xmlDoc.createElementNS("http://www.omg.org/spec/DD/20100524/DI", "omgdi:waypoint");
var bpmnEdgeWaypoint2 = xmlDoc.createElementNS("http://www.omg.org/spec/DD/20100524/DI", "omgdi:waypoint");


console.log("crea waypoint per", targetRefValue, "source: ", messageElementSourceAttributeValue);

 var elementWithValue = xmlDoc.querySelector(`[bpmnElement="${messageElementSourceAttributeValue}"]`);
 console.log("cerco message flow: ", messageElementSourceAttributeValue);

 var targetShape = xmlDoc.querySelector(`[id="${ messageElementSourceAttributeValue}_di"]`);

 var targetShapeChildX = targetShape.parentElement.getAttribute('x');

if (elementWithValue) {
  var firstChildElement = elementWithValue.firstElementChild;

  if (firstChildElement) {
    var xAttributeValue = firstChildElement.getAttribute("x");
    var widthAttributeValue = firstChildElement.getAttribute("width");
    var yAttributeValue = firstChildElement.getAttribute("y");
    var heightAttributeValue = firstChildElement.getAttribute("height");

      if (xAttributeValue !== null && widthAttributeValue !== null) {
      var xFlowValue = parseInt(xAttributeValue) + (parseInt(widthAttributeValue) / 2);
      var yFlowValue = parseInt(yAttributeValue) + parseInt(heightAttributeValue);

    } 

} 

} 




bpmnEdgeElement.setAttribute("id", messageElementIdAttributeValue+"_di");
bpmnEdgeElement.setAttribute("bpmnElement", messageElementIdAttributeValue);

bpmnEdgeWaypoint1.setAttribute("x", xFlowValue); //
bpmnEdgeWaypoint1.setAttribute("y", yFlowValue );

var centroidEl = xmlDoc.getElementById(messageElementIdAttributeValue);
var targetCentroid = centroidEl.getAttribute('targetRef');
var targetCentroidComple = "Participant_"+targetRefValue+"_di";

bpmnEdgeWaypoint2.setAttribute("x", arrayCentroids[targetRefValue]);

bpmnEdgeWaypoint2.setAttribute("y", maxY + heightmaxY + 70);

bpmnEdgeElement.appendChild(bpmnEdgeWaypoint1);
bpmnEdgeElement.appendChild(bpmnEdgeWaypoint2);

bpmnPlaneElement.appendChild(bpmnEdgeElement);




for (var key in arrayCentroids) {
  if (arrayCentroids.hasOwnProperty(key)) {
      var message = xmlDoc.querySelector(`[targetRef="${key}"]`);
      var messageId = message.getAttribute('id');
      var shape = xmlDoc.querySelector(`[bpmnElement="${messageId}"]`);
      shape.lastElementChild.setAttribute('x', arrayCentroids[key]);
  }
}


} 

});

}




// Serialize the updated XML document back to a string
var updatedXmlString = new XMLSerializer().serializeToString(xmlDoc);


var bpmnexportitem = {}
bpmnexportitem.id = id;
bpmnexportitem.code = updatedXmlString;


let foundIndex = exportcodebpmn.findIndex(obj => obj.id === id);
let foundObject = exportcodebpmn[foundIndex];

if(foundIndex >= 0){
  exportcodebpmn[foundIndex].code = updatedXmlString;

}
else {
  exportcodebpmn.push(bpmnexportitem);

}


try {
  const {
    warnings
  } = await bpmnJS[id].importXML(updatedXmlString);
 //console.log('success!');
  //bpmnJS.get('processModel_'+id).zoom('fit-viewport');
  try {
    
  //console.log('mettere in ' + id);
  var myblurb;
  //check if targetDivSvg already exists
  const targetDivSvg = document.getElementById(id);
  if (targetDivSvg == null) {
    // Element exists
    const targetDivSvg = document.createElement('div');
    targetDivSvg.id = id;
    targetDivSvg.classList.add("targetSvg");
  
  
    const targetContainer = document.getElementById("outputProc");
  
    const firstChild = targetContainer.firstChild.nextSibling;
  
    // Insert the new div before the first child of processDiv
    targetContainer.insertBefore(targetDivSvg, firstChild.nextSibling);
  
  }
  //console.log('messo in ' + targetDivSvg.id);
  myblurb = await bpmnJS[id].saveSVG();
  var svg = await myblurb.svg;
  //console.log('update');
  targetDivSvg.innerHTML = svg;
  
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
}

/*
try {
  const {
    svg
  } = await exportBPMNtoSVG(id);

  console.log('Exported BPMN 2.0 diagram in SVG format', svg);
} catch (err) {

  console.error(err);
}
*/

}

export async function setIstar(id, code){

  istar.clearModel();

  console.log("arrayistaractorssprev ", arrayistaractors );

  istarstatement.actors = updateactorslist(arrayistaractors);
  istarstatement.dependencies = updatedependencieslist(arrayistaractors);

  console.log("arrayistaractorssnext ", istarstatement.actors );
  console.log("istarstatementdependencies ", istarstatement.dependencies );

  

 // if(istarstatement.actors.length >1) return;


  const links = [];

  arrayistaractors.forEach(actor => {

  const actor_activities = actor.nodes;


  console.log("actor_activities", actor_activities);

  actor_activities.forEach(activity => {

    if(activity.type == "istar.Goal"){
      const link = {};
      link.id = activity.id + "_link";
      link.type = "istar.OrRefinementLink";
      link.source = activity.id.substring(0, activity.id.indexOf('_goal'));
      link.target = activity.id;

      links.push(link);

    }

    if(activity.type == "istar.Resource"){
      const link = {};
      link.id = activity.id + "_link";
      link.type = "istar.NeededByLink";
      link.source = activity.id;
      link.target = activity.id.substring(0, activity.id.indexOf('_res'));

      links.push(link);
    }


  });


 });

 arrayistardependencies.forEach(dependency => {

  if(dependency.type == "istar.Goal"){

    const link = {};
    link.id = dependency.id + "_link";
    link.type = "istar.DependencyLink";
    link.source = dependency.id;
    link.target = dependency.target;

    links.push(link);

    const link2 = {};
    link2.id = dependency.id + "_link2";
    link2.type = "istar.DependencyLink";
    link2.source = dependency.source;
    link2.target = dependency.id;

    links.push(link2);

  }
 });

  istarstatement.orphans = [],
  istarstatement.links = links,
  istarstatement.display = {},
  istarstatement.tool = "pistar.2.1.0",
  istarstatement.istar = "2.0",
  istarstatement.saveDate = "Fri, 03 May 2024 21:16:31 GMT",
  istarstatement.diagram = {
    "width": 600,
    "height": 300,
    "customProperties": {
      "Description": ""
    }
  }


var option  = null;

console.log("actorsssstarstatement",istarstatement);
console.log(istarstatement.diagram.width);

updateIstarModel(istarstatement);



//$('#menu-button-auto-layout').trigger('click');

//return istarstatement;
}

//end CHIARA added

const diagramName = document.getElementById('customTitle');
export function generateReport() {

  let i = 0;
  var concatTextReport = new String();
  if(diagramName.value != ''){
    concatTextReport = diagramName.value.toUpperCase() + ' - Diagram entities \n'; 
  }
  else{
    concatTextReport = 'Diagram entities \n'
  }
  const iterator = textReport.values();
  while(i < textReport.size){
    concatTextReport = concatTextReport + iterator.next().value + '\n'; 
    i++;
  }
  return concatTextReport;
}

export function showReport() {
  const text = generateReport();
  reportDiv.innerText = text;
}

//Chiara added -- not used
/*export function generateBPMN(targetDivSvgId) {
  const text = exportBPMNtoSVG(targetDivSvgId);
  processDiv.innerText = text;
  //document.getElementById('image').innerHTML = myblurb.svg;

}
*/

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = () => {
  const code = javascriptGenerator.workspaceToCode(ws);
  //codeDiv.innerText = code;
  var str_apertura = getDataForUml(code);

  if (!str_apertura.includes("BlocklyModel")) {
    var plantumlEncoder = require('plantuml-encoder')
    var encoded = plantumlEncoder.encode(str_apertura);
    var url = 'http://www.plantuml.com/plantuml/img/' + encoded
    var d = document.getElementById('downloadUML');
    d.setAttribute('data-target', url);
    document.getElementById("xmiData").value = code;
    document.getElementById("plantUML").value = str_apertura;
    document.getElementById("generatedCode").src = url;
    //codeDiv.innerText = code;
  }

  outputDivUML.src = '';

};


function getDataForUml(string) {

  var data = reader.formatXMItoObjectJS(string);
  var x = remove_empty(data.ownedElements[0].ownedElements);
  var str_apertura = "";

  x.forEach(element => {

    str_apertura = "@startuml \n";

    if (element.ownedElements != null) {
      element.ownedElements.forEach(e => {

        // SE PRESENTI collegamenti INTERAZIONI - menu a tendina
        if (e.ownedElements != null) {

          let elementGeneral = [];
          let elementColl = [];

          e.ownedElements.forEach(function callback(generalization, index) {
            if (generalization.type != null && generalization.type.$ref == "generalization") {
              elementGeneral.push(generalization);
            } else {
              elementColl.push(generalization);
            }
          });



          if (elementGeneral != null) {
            elementGeneral.forEach(function callback(element, index) {
              str_apertura += e.name.replace(" ", '_') + " <|-- " + element.name.replace(" ", '_') + "\n";
            });

          }

          if (e.operations != null) {


            let nameActor = "";
            let namePadre = "";
            if (elementColl.length > 0) {

              str_apertura += "class " + e.name.replace(" ", '_') + " {  \n";
              if (e.attributes != null) {
                e.attributes.forEach(attr => {
                  str_apertura += attr.name.replace(" ", '_') + "\n";
                });
              }

              e.operations.forEach(function callback(oper, index) {

                let filArray = elementColl.filter((element) => element.name.replace(" ", '_') == oper.name.replace(" ", '_'));
                if (filArray.length == 0) {
                  str_apertura += "" + oper.name.replace(" ", '_') + "() \n";
                }
              });

              str_apertura += "  \n } \n";

              e.operations.forEach(function callback(oper, index) {

                let filArray = elementColl.filter((element) => element.name.replace(" ", '_') == oper.name.replace(" ", '_'));
                if (filArray.length > 0) {

                  nameActor = filArray[0].end2.name.replace(" ", '_');
                  namePadre = filArray[0].end1.name.replace(" ", '_');
                  str_apertura += nameActor + " <-- " + namePadre + " :" + oper.name.replace(" ", '_') + "\n";
                }
              });


              let filArray = elementColl.filter((element) => element.name.replace(" ", '_') == "aggregation_" + e.name.replace(" ", '_'));
              if (filArray.length > 0) {
                let nameActor = "";
                let namePadre = "";
  
                nameActor = filArray[0].end2.name.replace(" ", '_');
                namePadre = filArray[0].end1.name.replace(" ", '_');
                str_apertura += nameActor + " o-- " + namePadre + "\n";
              }


            } else {
              str_apertura += "class " + e.name.replace(" ", '_') + " {  \n";
              e.operations.forEach(function callback(oper, index) {
                str_apertura += "" + oper.name.replace(" ", '_') + "() \n";

                if (e.attributes != null) {
                  e.attributes.forEach(attr => {
                    str_apertura += attr.name.replace(" ", '_') + "\n";
                  });
                }

              });
              str_apertura += "  \n } \n";
            }

          } else {

            if (e.attributes != null) {
              str_apertura += "class " + e.name.replace(" ", '_') + " {  \n";
              e.attributes.forEach(attr => {
                str_apertura += attr.name.replace(" ", '_') + "\n";
              });
              str_apertura += "  \n } \n";
            }

            if (elementColl.length > 0) {
              let nameActor = "";
              let namePadre = "";

              let filArray = elementColl.filter((element) => element.name.replace(" ", '_') == "aggregation_" + e.name.replace(" ", '_'));
              if (filArray.length > 0) {

                nameActor = filArray[0].end2.name.replace(" ", '_');
                namePadre = filArray[0].end1.name.replace(" ", '_');
                str_apertura += nameActor + " o-- " + namePadre + "\n";
              }
            }

          }



        } else {
          str_apertura += "class " + e.name.replace(" ", '_') + " { \n";

          if (e.attributes != null) {
            e.attributes.forEach(attr => {
              str_apertura += attr.name.replace(" ", '_') + "\n";
            });
          }

          if (e.operations != null) {
            e.operations.forEach(function callback(oper, index) {
              str_apertura += "" + oper.name.replace(" ", '_') + "() \n";
            });
          }

          str_apertura += " } \n";
        }


      });

    } else {
      str_apertura += element.name.replace(" ", '_') + "\n";
    }


  });

  str_apertura += "@enduml";
  return str_apertura;

}

var remove_empty = function (target) {
  Object.keys(target).map(function (key) {
    if (target[key] instanceof Object) {
      if (!Object.keys(target[key]).length && typeof target[key].getMonth !== 'function') {
        delete target[key];
      }
      else {
        remove_empty(target[key]);
      }
    }
    else if (target[key] === null) {
      delete target[key];
    }
  });
  return target;
};


// Load the initial state from storage and run the code.
//load(ws);
runCode();

function updateactorslist(code) {

  console.log("actorssda: ",code);
  console.log("actorssnameBlockInWS: ", nameBlockInWS);


  if(code.length > 0) {
    console.log("istarrold", code);

    var istarActors = Array.from(code);
    istarActors.forEach(function(actor,index) {

    if(!nameBlockInWS.includes(actor.text)){
      console.log("eliminare", actor.text);
      istarActors = istarActors.filter(singleactor => singleactor.text !== actor.text);

    }
  


});



istarstatement.actors = istarActors;

  }

  /*
   if(!nameBlockInWS.includes(id)) {
    if(id in bpmnJS) {

      delete bpmnJS[id];
      document.getElementById("processModel_"+id).remove();
      document.getElementById(id).remove();

    }
    return;
  }
  */

  console.log("actorssa: ",istarstatement.actors);

  return istarstatement.actors;
}

function updatedependencieslist(code) {

  console.log("arrayistardependencies: ",arrayistardependencies);
  console.log("actorssnameBlockInWS: ", nameBlockInWS);


  if(code.length > 0) {
    console.log("istarrold", code);

    var istarActors = Array.from(code);
    istarActors.forEach(function(actor,index) {

    if(!nameBlockInWS.includes(actor.text)){
      //console.log("eliminare", actor.text);
      //istarActors = istarActors.filter(singleactor => singleactor.text !== actor.text);
      //arrayistardependencies = arrayistardependencies.filter(singledependency => singledependency.source !== actor.text);
      //arrayistardependencies = arrayistardependencies.filter(singledependency => singledependency.target !== actor.text);

    }

});

istarstatement.dependencies = arrayistardependencies;

  }

  return istarstatement.dependencies;
}

// Every time the workspace changes state, save the changes to storage.
ws.addChangeListener((e) => {
  // UI events are things like scrolling, zooming, etc.
  // No need to save after one of these.
  if (e.isUiEvent) return;
  save(ws);
});



// Whenever the workspace changes meaningfully, run the code again.
ws.addChangeListener((e) => {
  // Don't run the code when the workspace finishes loading; we're
  // already running it once when the application starts.
  // Don't run the code during drags; we might have invalid state.
  if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING ||
    ws.isDragging()) {
    return;
  }
  runCode();
});

const nameBlockInWS = new Array();
ws.addChangeListener((e) => {
  if(e.type == Blockly.Events.BLOCK_DELETE || e.type == Blockly.Events.BLOCK_CHANGE){

    let blocks = ws.getAllBlocks(true);
    let blocksIdInWs = []; 
    
    let i = 0;
    while(i < blocks.length){
      //recupero gli id di tutti i blocchi presenti nel workspace
      blocksIdInWs.push(generateID(String(blocks[i].getFieldValue('NAME'))));
      
      let blockClass = ['default_actor', 'custom_actor', 'field_resource', 'water_resource', 'custom_resource', 'irrigation_tool', 'custom_tool', 'dss_infrastructure', 'custom_digital', 'wsn', 'internet_gateway', 'dss_software', 'custom_digital_component']
      //salvo i nomi dei blocchi presenti nel workspace per mostrarli nel selettore delle associazioni
      if(blockClass.includes(blocks[i].type) && !nameBlockInWS.includes(blocks[i].getFieldValue('NAME')) && blocks[i].getFieldValue('NAME').charCodeAt(0) != 46){
        nameBlockInWS.push(blocks[i].getFieldValue('NAME'));
      }
      i++;
    }
    
    //elimino i nomi dei blocchi non più presenti nel workspace in modo che non vengano mostrarli nel selettore delle associazioni
    nameBlockInWS.forEach((name) => {
      let blocksNow = ws.getAllBlocks(true);
      let nameBlocks = [];
      let blockClass = ['default_actor', 'custom_actor', 'field_resource', 'water_resource', 'custom_resource', 'irrigation_tool', 'custom_tool', 'dss_infrastructure', 'custom_digital', 'wsn', 'internet_gateway', 'dss_software', 'custom_digital_component']
      
      let y = 0;
      while(y < blocksNow.length){
        //salvo i nomi
        if(blockClass.includes(blocksNow[y].type)){
          nameBlocks.push(blocks[y].getFieldValue('NAME'));
        }
        y++;
      }
      if(!nameBlocks.includes(name)){
        nameBlockInWS.splice(nameBlockInWS.indexOf(name), 1);
      }
    })
    
    //elimino da textReport i report dei blocchi non più presenti nel ws
    let j = 0;
    const it = textReport.keys();
    while(j < textReport.size){
      const value = it.next().value;
      if(!blocksIdInWs.includes(value)){
        textReport.delete(value);
      }
      j++;
    }
    showReport();

    //Chiara added

    //elimino da istar i div dei blocchi non più presenti nel ws

    console.log("istarrnew", istarstatement.actors);

    setIstar(null, istarstatement.actors);

  

    //Chiara added
    //generateBPMN();
  //elimino da bpmn i div dei blocchi non più presenti nel ws
  //console.log("blocks "+ nameBlockInWS);

  
  var nodesToRemove = document.querySelectorAll('.targetSvg');

  var nodesArray = Array.from(nodesToRemove);

  nodesArray.forEach(function(node) {

    if(!nameBlockInWS.includes(node.id)){
      node.parentNode.removeChild(node);
      
    }
});

var nodesToRemoveB = document.querySelectorAll('.targetBpmn');

  var nodesArrayB = Array.from(nodesToRemoveB);

  nodesArrayB.forEach(function(node) {

// Split the ID string by underscore
var parts = node.id.split('_');

// Extract the number portion (assuming it's always the second part)
var number = parts[1];
    if(!nameBlockInWS.includes(number)){
      node.parentNode.removeChild(node);
      
    }
});


  

  }
});

/*Chiara not used 
async function initializeBPMN(targetDivSvgId) {

//Chiara added
console.log("ciaooooo");
console.log("ttttt:"+targetDivSvgId);
//var xml = '<?xml version="1.0" encoding="UTF-8"?> <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="15.1.3"> <process id="Process_1" isExecutable="false"> <startEvent id="StartEvent_1y45yut"> <outgoing>Flow_0nyaqxh</outgoing> </startEvent> <intermediateThrowEvent id="Event_19yih6j"> <incoming>Flow_0nyaqxh</incoming> </intermediateThrowEvent> <sequenceFlow id="Flow_0nyaqxh" sourceRef="StartEvent_1y45yut" targetRef="Event_19yih6j" /> </process> <bpmndi:BPMNDiagram id="BpmnDiagram_1"> <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1"> <bpmndi:BPMNShape id="StartEvent_1y45yut_di" bpmnElement="StartEvent_1y45yut"> <omgdc:Bounds x="152" y="102" width="36" height="36" /> <bpmndi:BPMNLabel> <omgdc:Bounds x="134" y="145" width="73" height="14" /> </bpmndi:BPMNLabel> </bpmndi:BPMNShape> <bpmndi:BPMNShape id="Event_19yih6j_di" bpmnElement="Event_19yih6j"> <omgdc:Bounds x="402" y="102" width="36" height="36" /> </bpmndi:BPMNShape> <bpmndi:BPMNEdge id="Flow_0nyaqxh_di" bpmnElement="Flow_0nyaqxh"> <omgdi:waypoint x="188" y="120" /> <omgdi:waypoint x="402" y="120" /> </bpmndi:BPMNEdge> </bpmndi:BPMNPlane> </bpmndi:BPMNDiagram> </definitions>';
const targetDivBpmnContainer = document.getElementById("processModel_"+targetDivSvgId)

if (targetDivBpmnContainer == null) {
  // Element exists
  const targetDivBpmnContainer = document.createElement('div');
  targetDivBpmnContainer.id = 'processModel_'+targetDivSvgId;
  targetDivBpmnContainer.classList.add("targetBpmn");

  document.getElementById("outputProc").appendChild(targetDivBpmnContainer);
}

var bpmnJS = new BpmnJS({
  container: '#processModel_'+targetDivSvgId
});
//bpmnJS.importXML(xml);

//console.log('success!');
bpmnJS.get('processModel').zoom('fit-viewport');

//bpmnJS.get('processModel').zoom(1.0, task);
return bpmnJS;
}
*/


async function exportBPMNtoSVG(targetDivSvgId) {
  //console.log('mettere in ' + targetDivSvgId);
var myblurb;
//check if targetDivSvg already exists
const targetDivSvg = document.getElementById(targetDivSvgId);
if (targetDivSvg == null) {
  // Element exists
  const targetDivSvg = document.createElement('div');
  targetDivSvg.id = targetDivSvgId;
  targetDivSvg.classList.add("targetSvg");


  const targetContainer = document.getElementById("outputProc");

  const firstChild = targetContainer.firstChild.nextSibling;

  // Insert the new div before the first child of processDiv
  targetContainer.insertBefore(targetDivSvg, firstChild.nextSibling);

}
console.log('messo in ' + targetDivSvg.id);
myblurb = await bpmnJS[id].saveSVG();
var svg = await myblurb.svg;
console.log('update');
targetDivSvg.innerHTML = svg;

//const myBlurb = await bpmnJS.saveSVG();

    // Extract SVG content from the resolved promise
    //const svg = myBlurb.svg;

    // Set inner HTML of targetDivSvg after await has completed
    //targetDivSvg.innerHTML = svg;

//return svg;
}

//exportBPMNtoSVG();

//end Chiara added

//funzioni per il salvataggio del workspace e del codice

function saveWs(){

  var downloadWsLink = document.getElementById('exportWs');

  downloadWsLink.addEventListener('click', function() {

    const link = document.createElement("a");

    var state = Blockly.serialization.workspaces.save(ws);

    var stateText = JSON.stringify(state);
    //download('workspace_state.json', stateText);
    const file = new Blob([stateText], { type: 'text/xml' });
    link.href = URL.createObjectURL(file);
    link.download = `workspace_state.json`;
    link.click();
    URL.revokeObjectURL(link.href);
});
}

function importWs(){

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



}


function saveBPMN(){

  var downloadBPMNLink = document.getElementById('downloadButtonBPMN');

  downloadBPMNLink.addEventListener('click', function() {

    const link = document.createElement("a");

    //console.log("exportcodebpmn", exportcodebpmn);

    //todo: vanno presi tutti e va fatto uno zip 
    const JSZip = require("jszip");

    // Create a new instance of JSZip
    const zip = new JSZip();

    //const file = new Blob([element.code], { type: 'text/xml' });
    
    exportcodebpmn.forEach(element => {



      // Add files to the zip
      
      // Generate the zip file asynchronously
     
        
    
    const file = new Blob([element.code], { type: 'text/xml' });
    /*
    link.href = URL.createObjectURL(file);
    link.download = `workspace_state.bpmn`;
    link.click();
    URL.revokeObjectURL(link.href);
    */
    zip.file(element.id+"file.bpmn", file);


    
  });

  zip.generateAsync({type:"blob"})
  .then(function(content) {
      // Save the generated zip file
     // saveAs(content, "example.zip");
      link.href = URL.createObjectURL(content);
  link.download = `workspace_state.zip`;
  link.click();
  URL.revokeObjectURL(link.href);
  });

  

});

}

function saveiStar(){

  var downloadiStarLink = document.getElementById('downloadButtoniStar');

  downloadiStarLink.addEventListener('click', function() {


    const link = document.createElement("a");

    //todo: vanno presi tutti e va fatto uno zip 
    
    const exportcodeiStar = JSON.stringify(istarstatement);

    //download('workspace_state.json', stateText);
    const file = new Blob([exportcodeiStar], { type: 'text/txt' });
    link.href = URL.createObjectURL(file);
    link.download = `workspace_state.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
});

var downloadiStarLinkImage = document.getElementById('downloadButtoniStarImage');

/* TODO
downloadiStarLinkImage.addEventListener('click', function() {

  istar.fileManager.savePng('diagram', joint.util.downloadBlob, filename, 4, $('#modal-input-transparent-background').prop('checked'));

});
*/
}


saveWs();
importWs();
saveiStar();
saveBPMN();




