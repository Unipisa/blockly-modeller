import * as Blockly from "blockly";
import { ws } from "../runner/runner";
import { blockAlreadyInWs, reset } from "../utils/blockUtils";
import { showCustomAlert } from "../utils/alerts";

var hasChanged = false;
var blockRename = null;

export function onWorkspaceChange(event, ws) {
    if (
      event.type === Blockly.Events.CHANGE &&
      event.element === "field" &&
      event.name === "NAME"
    ) {
      blockRename = ws.getBlockById(event.blockId);
      let newValue = event.newValue.toLowerCase();
      let oldValue = event.oldValue.toLowerCase();
      let type = blockRename.type;
  
      if (newValue !== oldValue) {
        if (
          [
            "custom_actor",
            "custom_resource",
            "custom_tool",
            "custom_digital",
            "custom_digital_component",
          ].includes(type)
        ) {
          reset(oldValue, type, false, ws);
        }
        if (blockAlreadyInWs(newValue, type, ws)) {
          hasChanged = true;
        } else {
          hasChanged = false;
        }
      }
    } else if (event.type === Blockly.Events.BLOCK_DELETE) {
      let block = event.oldXml;
      let oldName = block
        .querySelector('field[name="NAME"]')
        .textContent.toLowerCase();
      let type = block.getAttribute("type");
      reset(oldName, type, true, ws);
    } else if (
      (event.type === Blockly.Events.CLICK ||
        event.type === Blockly.Events.SELECTED) &&
      hasChanged
    ) {
      let blockType = blockRename.type
        .replace("_", " ")
        .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
      showCustomAlert(
        `Il nome scelto è già stato assegnato ad un blocco di tipo <i>${blockType}</i> !\nReset del valore in corso\n`
      );
      blockRename.setFieldValue("...............", "NAME");
      hasChanged = false;
      blockRename = null;
    }
    console.log(hasChanged);
  }