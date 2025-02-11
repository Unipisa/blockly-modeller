import { ws, runCode } from '../runner/runner.js';
import Blockly from 'blockly';
import { generateID } from '../utils/utils.js';
import { removeMissingBlocks } from '../utils/blockUtils.js';
import { showCustomAlert, instructions } from "../utils/alerts.js";

var nameBlockInWS = {};
var nameCustomDigitalInWS = [];

export function getAllClassBlocksinWs() {
  var className = ['none'];
  let blocksArray = Object.values(nameBlockInWS);
  let i = 0;
  while (i < blocksArray.length) {
    const name = String(blocksArray[i].name).trim();
    if (name !== '') 
    className.push(`${String(blocksArray[i].name)} (${String(blocksArray[i].type)})`);
    i++;
  }

  return className;
}

export function getAllCustomDigitalBlocksinWs() {
  const customDigitalNames = ['none'];
  const uniqueNames = {};
  let i = 0;

  while (i < nameCustomDigitalInWS.length) {
    const name = nameCustomDigitalInWS[i];
    if (!uniqueNames[name]) {
      uniqueNames[name] = true;
      customDigitalNames.push(name);
    }
    i++;
  }

  return customDigitalNames;
}

export function addBlockDeleteChangeListener(ws) {
  ws.addChangeListener((e) => {
    if (e.type === Blockly.Events.BLOCK_DELETE || e.type === Blockly.Events.BLOCK_CHANGE) {
      let blocks = ws.getAllBlocks(true);
  
      let blocksIdInWs = [];

      let blockClass = [
        'default_actor', 'custom_actor', 'field_resource', 'water_resource', 'custom_resource',
        'irrigation_tool', 'custom_tool', 'dss_infrastructure', 'custom_digital', 'wsn',
        'internet_gateway', 'dss_software', 'custom_digital_component'
      ];

      nameBlockInWS = {};
      nameCustomDigitalInWS.length = 0;

      for (let i = 0; i < blocks.length; i++) {
        blocksIdInWs.push(generateID(String(blocks[i].getFieldValue('NAME'))));

        let name = blocks[i].getFieldValue('NAME');
        let type = blocks[i].type;
        if (blockClass.includes(type) && name.charCodeAt(0) !== 46) {
          nameBlockInWS[name + ' (' + type + ')'] = { name: name, type: type };
        }

        if (type === 'custom_digital' && !nameCustomDigitalInWS.includes(name) && name.charCodeAt(0) !== 46) {
          nameCustomDigitalInWS.push(name);
        }
      }

      removeMissingBlocks(nameBlockInWS, blockClass, ws);
      removeMissingBlocks(nameCustomDigitalInWS, ['custom_digital'], ws);


      runCode();
    }

      if (e.type === Blockly.Events.TOOLBOX_ITEM_SELECT) {
        const selectedCategoryName = e.newItem; // The name of the selected category
        console.log('Selected toolbox category:', e.newItem);
    

        if (selectedCategoryName === 'USER TASKS') {
  
          showCustomAlert(
            instructions
          );

// Get the Blockly workspace
//const workspace = Blockly.getMainWorkspace();

// Get the toolbox associated with the workspace
const toolbox = ws.getToolbox();


const toolboxItems = Array.from(toolbox.getToolboxItems());

console.log(toolboxItems);
const categoryName = 'USER TASKS';  // Replace with the category name you want to click on

// Find the toolbox item in the toolbox items array
const toolboxItem = toolboxItems.find(item => item.getClickTarget().textContent.trim() === categoryName);

if (toolboxItem) {
  // Get the DOM element associated with this toolbox item (the target element for clicks)
  const clickTarget = toolboxItem.getClickTarget();

  // Ensure the target exists before triggering a click event
  if (clickTarget) {
    // Manually set the selection to simulate user interaction
    toolbox.setSelectedItem(toolboxItem);

    // Trigger a click event programmatically (for UI feedback)
    clickTarget.click();

  } else {
    console.log('No click target found for the toolbox item.');
  }
} else {
  console.log('Toolbox item not found.');
}


            
        }
      }
    
    
  
  
  
  });
}

export function getAllActorsBlocksinWs() {
  var className = [];
  let blocksArray = Object.values(nameBlockInWS);
  let i = 0;
  while (i < blocksArray.length) {
    const name = String(blocksArray[i].name).trim();
    if (name !== '' && blocksArray[i].type == 'custom_actor') 
    className.push(`${String(blocksArray[i].name)}`);
    i++;
  }

  return className;
}

//per Istar
export function getAllActorsAndDigitalActorsInWs() {
  var className = [];
  let blocksArray = Object.values(nameBlockInWS);
  let i = 0;
  while (i < blocksArray.length) {
    const name = String(blocksArray[i].name).trim();
    
    // Includi sia 'custom_actor' che 'custom_digital' e 'custom_digital_component'
    if (name !== '' && 
        (blocksArray[i].type == 'custom_actor' || 
         blocksArray[i].type == 'custom_digital' || 
         blocksArray[i].type == 'custom_digital_component')) {
      className.push(`${String(blocksArray[i].name)}`);
    }
    
    i++;
  }

  return className;
}
