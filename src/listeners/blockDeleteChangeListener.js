import { ws, runCode } from '../runner/runner.js';
import Blockly from 'blockly';
import { generateID } from '../utils/utils.js';
import { removeMissingBlocks } from '../utils/blockUtils.js';

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
