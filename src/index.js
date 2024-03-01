/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import { blocks } from './blocks/myblocks';
import { generator } from './generators/javascript';
import { javascriptGenerator } from 'blockly/javascript';
import { save, load } from './serialization';
import { toolbox } from './toolbox';
import * as fs from 'fs/promises';
import './index.css';

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator, generator);
Blockly.ContextMenuRegistry.registry.unregister('blockComment');
Blockly.ContextMenuRegistry.registry.unregister('blockDisable');

// Import delle librerie per lettura e scrittura UML
require('./generators/uml2-import'); 
require('./generators/uml2-export');

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('generatedCode').firstChild;
const outputDiv = document.getElementById('output');
const reportDiv = document.getElementById('txtReport');
const blocklyDiv = document.getElementById('blocklyDiv');
const reader = require('./generators/xmi21-reader'); // Libreria per lettura dell'XMI

const ws = Blockly.inject(blocklyDiv, {
  toolbox,
  grid: {
    spacing: 20,
    length: 3,
    colour: 'rgb(219, 212, 201)',
    snap: true
  },
  move: {
    scrollbars: {
      horizontal: true,
      vertical: true
    },
    drag: true,
    wheel: true
  },
  zoom:
  {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2,
    pinch: true
  }
});

var xmlText = '<xml xmlns="https://developers.google.com/blockly/xml" id="workspaceBlocks" style="display: none"><block type="info" id="TBgAn^~ir@P9*e=ib?;@" x="350" y="50"></block></xml>';
Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xmlText), ws);

function generateID(nomeClasse) {
  nomeClasse = nomeClasse.trim().toLowerCase();
  var id = new String();
  for (let c = 0; c < nomeClasse.length; c++) {
    var charCode = nomeClasse.charCodeAt(c);
    id = id + charCode;
  }
  return id;
}


export function removeLastTypedBlock(type) {
  let blocks = ws.getBlocksByType(type, true);
  const index = (blocks.length) - 1;
  blocks[index].dispose(true);
}

export function getAllClassBlocksinWs() {
  const className = ['none'];
  let i = 0;
  while (i < nameBlockInWS.length) {
    className.push(nameBlockInWS[i]);
    i++;
  }
  return className;
}

export function blockAlreadyInWs(new_block_name) {
  let blocks = ws.getAllBlocks(true);
  let counter = -1;

  let i = 1;
  while (i < blocks.length) {
    if (new_block_name.localeCompare(blocks[i].getFieldValue('NAME').toLowerCase()) == 0) {
      counter++;
    }
    i++;
  }

  //un blocco lo trova sempre perchè è se stesso
  if (counter == 0) {
    return false;
  }
  else if (counter > 0) {
    return true;
  }
}

export function ass_agg_AlreadyInWs(new_ass_name) {
  let blocks = ws.getAllBlocks(true);
  let bool = false;

  let i = 1;
  while (i < blocks.length) {
    if (new_ass_name.localeCompare(blocks[i].getFieldValue('NAME').toLowerCase()) == 0) {
      bool = true;
    }
    i++;
  }
  return bool;
}

export function getAlreadyInWsBlockType(new_block_name) {
  let blocks = ws.getAllBlocks(true);
  let i = 1;
  let index = -1;

  while (i < blocks.length) {
    if (new_block_name.localeCompare(blocks[i].getFieldValue('NAME').toLowerCase()) == 0) {
      index = i;
    }
    i++;
  }
  return blocks[index].type;
}

const textReport = new Map(); //ogni oggetto è il text report di una classe (identificata con l'id -> chiave)
export function setReport(id, text) {
  textReport.set(id, text);
  showReport();
}

const diagramName = document.getElementById('customTitle');
export function generateReport() {
  let i = 0;
  var concatTextReport = new String();
  if (diagramName.value != '') {
    concatTextReport = diagramName.value.toUpperCase() + ' - Diagram entities \n';
  }
  else {
    concatTextReport = 'Diagram entities \n'
  }
  const iterator = textReport.values();
  while (i < textReport.size) {
    concatTextReport = concatTextReport + iterator.next().value + '\n';
    i++;
  }
  return concatTextReport;
}

export function showReport() {
  const text = generateReport();
  reportDiv.innerText = text;
}

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = () => {
  debugger
  const code = javascriptGenerator.workspaceToCode(ws);
  codeDiv.innerText = code;
  outputDiv.innerHTML = '';

  var data = getDataForUml(code);



  //eval(code);
}

function getDataForUml(string) {

  var data = reader.formatXMItoObjectJS(string);
  var x = remove_empty(data.ownedElements[0].ownedElements);

  var str_apertura = "@startuml \n";

  x.forEach(element => {
    if (element.ownedElements != null) {
      element.ownedElements.forEach(e => {

        const myArray = e._id.split("_");

        // creazione package esterno
        str_apertura += "package " +  myArray[0]+"_"+myArray[1] + " { \n";

        str_apertura += "object " + e.name + " {\n id = " + myArray[0] + " \n } \n";

        // controllo operation : activity
        // tutto ciò che è commentato all'interno di questo blocco è una prova
        // var elementsArray = []; 
        if (e.operations != null) {
          str_apertura += "package activities_"+myArray[0]+" { \n";
          e.operations.forEach(oper => {
            str_apertura += "object " + oper.name+"_"+oper._id + " {\n id = " + oper._id + " \n name=" + oper.name + "\n } \n";
            str_apertura += oper.name+"_"+oper._id + " --> " + e.name + "\n";
            // elementsArray.push(oper._id);
          });
         /* if (e.ownedElements != null) {
            e.ownedElements.forEach(own => {
              var x=own.end2.type.$ref;
              var y=elementsArray.find((operazione) => operazione == own.end1.type.$ref);
              if (y != null){
                var temp = e.operations.find(prova => prova._id === y);
                str_apertura += temp.name+"_"+ y + " --> " + x + "_actor" + "\n";
              }
            }); 
          } */
          str_apertura += "} \n";
        }

        if (e.attributes != null) {
          str_apertura += "package attributes_"+myArray[0]+" { \n";
          e.attributes.forEach(attr => {
            str_apertura += "object " + attr.name+"_"+myArray[0] + " {\n id=" + attr._id + "\n name=" + attr.name + "\n  } \n";
            str_apertura += attr.name+"_"+myArray[0] + " --> " + e.name + "\n";
          });
          str_apertura += "} \n";
        }
        
       var str_apertura2 = "";
        if (myArray[1] == "customresourcespec") {
          e.ownedElements.forEach(attr => {
           // str_apertura2 = "object " + e.name + " {\n id=" + myArray[0] + "\n } \n";
            str_apertura2 += e.name + " --> " + attr.target.$ref+"_customresource" + "\n";
          });
        }

        if (myArray[1] == "waterspec") {
          e.ownedElements.forEach(attr => {
            //str_apertura2 = "object " + e.name + " {\n id=" + myArray[0] + "\n } \n";
            str_apertura2 += e.name + " --> " + attr.target.$ref+"_waterresource" + "\n";
          });
        }

        if (myArray[1] == "irrigationtoolspec") {
          e.ownedElements.forEach(attr => {
           // str_apertura2 = "object " + e.name + " {\n id=" + myArray[0] + "\n } \n";
            str_apertura2 += e.name + " --> " + attr.target.$ref+"_irrigationtool" + "\n";
          });
        }

        if (myArray[1] == "customtoolspec") {
          e.ownedElements.forEach(attr => {
           // str_apertura2 = "object " + e.name + " {\n id=" + myArray[0] + "\n } \n";
            str_apertura2 += e.name + " --> " + attr.target.$ref+"_customtool" + "\n";
          });
        }
        str_apertura += str_apertura2;

        str_apertura += "} \n";

      });

    } else {
      str_apertura += "object actor {\n name= " + element.name + "\n } \n";
    }

  });
  str_apertura += "@enduml";

  var plantumlEncoder = require('plantuml-encoder')

  var encoded = plantumlEncoder.encode(str_apertura);
  //console.log(encoded) // SrJGjLDmibBmICt9oGS0

  var url = 'http://www.plantuml.com/plantuml/img/' + encoded

  var d = document.getElementById('downloadUML');
  d.href = url;

  return url;

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
  if (e.type == Blockly.Events.BLOCK_DELETE || e.type == Blockly.Events.BLOCK_CHANGE) {

    let blocks = ws.getAllBlocks(true);
    let blocksIdInWs = [];

    let i = 0;
    while (i < blocks.length) {
      //recupero gli id di tutti i blocchi presenti nel workspace
      blocksIdInWs.push(generateID(String(blocks[i].getFieldValue('NAME'))));

      let blockClass = ['default_actor', 'custom_actor', 'field_resource', 'water_resource', 'custom_resource', 'irrigation_tool', 'custom_tool', 'dss_infrastructure', 'custom_digital', 'wsn', 'internet_gateway', 'dss_software', 'custom_digital_component']
      //salvo i nomi dei blocchi presenti nel workspace per mostrarli nel selettore delle associazioni
      if (blockClass.includes(blocks[i].type) && !nameBlockInWS.includes(blocks[i].getFieldValue('NAME')) && blocks[i].getFieldValue('NAME').charCodeAt(0) != 46) {
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
      while (y < blocksNow.length) {
        //salvo i nomi
        if (blockClass.includes(blocksNow[y].type)) {
          nameBlocks.push(blocks[y].getFieldValue('NAME'));
        }
        y++;
      }
      if (!nameBlocks.includes(name)) {
        nameBlockInWS.splice(nameBlockInWS.indexOf(name), 1);
      }
    })

    //elimino da textReport i report dei blocchi non più presenti nel ws
    let j = 0;
    const it = textReport.keys();
    while (j < textReport.size) {
      const value = it.next().value;
      if (!blocksIdInWs.includes(value)) {
        textReport.delete(value);
      }
      j++;
    }
    showReport();
  }
});