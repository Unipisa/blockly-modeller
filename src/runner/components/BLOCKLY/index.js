import * as Blockly from "blockly";
import {icons} from'../../../blocks/icons.js';
import { logBlocklyEvent } from "../../../utils/logger.js";
import { getAllClassBlocksinWs_NEW, getAllAggregationBlocksinWs_NEW } from "../../../listeners/blockDeleteChangeListener.js";
import { nameBlockInWS, nameCustomDigitalInWS } from "../../../blocks/workspace.js"; 




export function addButtonDownload(id, ws) { 

    try {
      var targetDiv = document.getElementById(id);
      if (targetDiv) {
          targetDiv.parentElement.insertAdjacentHTML('afterbegin', `
                  <div id="ieWs"><input id='customTitle' type='text' placeholder='Insert model title...' style='font-family: Helvetica'/><input type="file" id="fileInput" style="display: none;">
                  <div class="btndwnld blockly">
                  <div class="button-13"><img src="${icons.icon_import}" width="20" height="20" id="importWs" alt="upload-link" title="upload from local" /></div>
                  <div class="button-13"><img src="${icons.icon_export}" width="20" height="20" id="exportWs" alt="download-link" title="download workspace" /></div>
                  </div>
                  </div>
              `);
      } 


    var downloadWsLink = document.getElementById('exportWs');
      
        downloadWsLink.addEventListener('click', function(event) {

          const modelTitle = document.getElementById('customTitle').value.trim() || 'workspace_state';

          logBlocklyEvent(event);
      
          const link = document.createElement("a");
      
          var state = Blockly.serialization.workspaces.save(ws);
      
          var stateText = JSON.stringify(state);
          const file = new Blob([stateText], { type: 'text/xml' });
          link.href = URL.createObjectURL(file);
          link.download = modelTitle+'.json';
          link.click();
          URL.revokeObjectURL(link.href);
          
      });
      

  var upladWsLink = document.getElementById('importWs');

  upladWsLink.addEventListener('click', function(event) {

    logBlocklyEvent(event);

    document.getElementById('fileInput').click();

});


document.getElementById('fileInput').addEventListener('change', function(event) {

logBlocklyEvent(event);

var file = event.target.files[0];
var reader = new FileReader();
reader.onload = function(event) {
    var jsonText = event.target.result;
    var jsonImport = JSON.parse(jsonText);
    let savedAssocMap = extractJsonFieldValues(jsonImport, "ASSOCIATIONS");
    let savedAggrMap  = extractJsonFieldValues(jsonImport, "AGGREGATION");
    Blockly.serialization.workspaces.load(jsonImport, ws);
    queueMicrotask(() => {
        rebuildNameIndex(ws);
    rebuildDynamicDropdowns(ws,savedAssocMap,savedAggrMap);
});

};
reader.readAsText(file);


});




function getAllClassBlocksinWs2(ws) {
  const workspace = Blockly.getMainWorkspace();
  if (!workspace) return [];

  const classTypes = [
    "custom_actor",
    "natural_resource",
    "custom_actor",
    "custom_digital_component",
    "custom_digital",
  ];

  return workspace
    .getAllBlocks(false)
    .filter(b => classTypes.includes(b.type))
    .map(b => {
      const name = (b.getFieldValue("NAME") || "").trim();
      if (!name || name.toLowerCase() === "none") return null;

      const typeLabel = b.type;          
      const label     = `${name} (${typeLabel})`;    
      const value     = (`${name} (${typeLabel})`).toUpperCase();    

      return {
        label,
        value          
      };
    })
    .filter(Boolean); // remove nulls
}

function getAllAggregationBlocksinWs(ws) {

  // Block types that can appear inside AGGREGATION dropdown
  //TODO : remove block itself to avoid self-reference
  const aggregationTypes = [
    "custom_digital",             
    "custom_digital_component"    
  ];

  return ws
    .getAllBlocks(false)
    .filter(b => aggregationTypes.includes(b.type))
    .map(b => {
      const name = (b.getFieldValue("NAME") || "").trim();
      if (!name) return null;

      const label     = `${name}`;
      const value     = `${name}`.toUpperCase();

      return { name, label, value };
    })
    .filter(Boolean); // remove null entries
}




function extractAssociationsFromJson(json) {
  const map = {}; // blockId -> saved ASSOCIATIONS value

  function walk(block) {
    if (!block) return;

    if (block.id && block.fields && block.fields.ASSOCIATIONS) {
      map[block.id] = block.fields.ASSOCIATIONS;
    }

    if (block.inputs) {
      Object.values(block.inputs).forEach(inp => walk(inp.block));
    }
    if (block.next?.block) {
      walk(block.next.block);
    }
  }

  json.blocks.blocks.forEach(walk);
  return map;
}

function extractJsonFieldValues(json, fieldName) {
  const map = {}; // blockId → savedValue

  function walk(block) {
    if (!block) return;

    if (block.id && block.fields && block.fields[fieldName]) {
      map[block.id] = block.fields[fieldName];
    }

    if (block.inputs) {
      Object.values(block.inputs).forEach(inp => walk(inp.block));
    }

    if (block.next?.block) walk(block.next.block);
  }

  json.blocks.blocks.forEach(walk);
  return map;
}






      
    } catch (error) {

      console.error("Caught error in Component:", error);

      return error;

    }
  

}



export function rebuildDynamicDropdowns(ws,savedAssocMap = null,savedAggrMap = null) {
  const workspace = ws || Blockly.getMainWorkspace();
  if (!workspace) {
    console.warn("No workspace in rebuildDynamicDropdowns");
    return;
  }
  const blocks = workspace.getAllBlocks(false);
  const classNames = getAllClassBlocksinWs_NEW(workspace);  // your working function
  console.log("classNames =", classNames);

  const baseAssocOptions =
  classNames.length === 0
    ? [["None", "NONE"]]
    : classNames.map(info => [info.label, info.value]);

const aggInfos = getAllAggregationBlocksinWs_NEW(workspace);

const baseAggOptions =
  aggInfos.length === 0
    ? [["None", "NONE"]]
    : aggInfos.map(info => [info.label, info.value]);


blocks.forEach(block => {
  const field = block.getField("ASSOCIATIONS");
  if (!field) return;

  //console.log("savedAssocMap:",savedAssocMap);

const savedValue =
  (savedAssocMap && savedAssocMap[block.id]) ||
  block.getFieldValue("ASSOCIATIONS");
  
  let options = [...baseAssocOptions];
  
const hasNone = options.some(opt => opt[1] === "NONE");
    if (!hasNone) {
      options.unshift(["none", "NONE"]);
    }
  const allowedValues = options.map(opt => opt[1]);

  if (savedValue && !allowedValues.includes(savedValue)) {
    options.unshift([savedValue, savedValue]);
  }

  field.menuGenerator_ = options;

  if (allowedValues.includes(savedValue)) {
    field.setValue(savedValue);
  } else {
    field.setValue(options[0][1]);
  }
});

blocks.forEach(block => {
  const field = block.getField("AGGREGATION");
  if (!field) return;

  let options = [...baseAggOptions];

  const hasNone = options.some(opt => opt[1] === "NONE");
    if (!hasNone) {
      options.unshift(["none", "NONE"]);
    }

const allowedValues = options.map(opt => opt[1]);

const savedValue =
  (savedAggrMap && savedAggrMap[block.id]) ||
  block.getFieldValue("AGGREGATION");


  if (savedValue && !allowedValues.includes(savedValue)) {
    options.unshift([savedValue, savedValue]);
  }

  field.menuGenerator_ = options;

  if (allowedValues.includes(savedValue)) {
    field.setValue(savedValue);
  } else {
    field.setValue(options[0][1]);
  }
});

}


export function rebuildNameIndex(ws) {
  const blocks = ws.getAllBlocks(false);

  // DO NOT REASSIGN — wipe objects in place
  Object.keys(nameBlockInWS).forEach(k => delete nameBlockInWS[k]);
  nameCustomDigitalInWS.length = 0;

  const classTypes = [
    'default_actor', 'custom_actor', 'field_resource', 'water_resource',
    'natural_resource', 'irrigation_tool', 'custom_tool',
    'dss_infrastructure', 'custom_digital', 'wsn',
    'internet_gateway', 'dss_software', 'custom_digital_component'
  ];

  for (let block of blocks) {
    const name = block.getFieldValue('NAME') || '';
    const type = block.type;

    if (name !== '' && classTypes.includes(type)) {
      nameBlockInWS[name + ' (' + type + ')'] = { name, type };
    }

    if (type === 'custom_digital') {
      nameCustomDigitalInWS.push(name);
    }
  }
}

