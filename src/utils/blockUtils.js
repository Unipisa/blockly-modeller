import { ws } from "../runner/runner.js";
import { showCustomAlert } from "./alerts.js";
import { getAllActorsBlocksinWs } from "../listeners/index.js";
import { rebuildDynamicDropdowns } from "../runner/components/BLOCKLY/index.js";

export const removeBlockType = (name) => {
  return name.replace(/\s*\(.*?\)\s*/g, "");
};

//trova target e restituisce 
export const foundTargetEl = (target) => {
  const index = target.indexOf('('); // Trova l'indice della prima parentesi
  if (index !== -1) {
      // Rimuove tutto ciò che è tra parentesi
      return target.substring(0, index).trim();
  }
  return target.trim(); // Ritorna il target ripulito se non ci sono parentesi
};

export const blockAlreadyInWs = (new_block_name, blockType, ws) => {
  if (
    ["custom_attribute", "custom_operation", "custom_generalization"].includes(
      blockType
    )
  ) {
    return false;
  }
  let blocks = ws.getAllBlocks(true);
  let counter = 0;

  for (let i = 0; i < blocks.length; i++) {
    const blockName = blocks[i].getFieldValue("NAME");

    if (blockName !== null && blockName !== "..............." && blockName !== "") {
      //console.log(`Comparing: ${new_block_name} with ${blockName.toLowerCase()}`);
      if (new_block_name.localeCompare(blockName.toLowerCase()) === 0 &&
          !["custom_attribute", "custom_operation", "custom_generalization"].includes(blocks[i].type)) {
        counter++;
      }
    }
  }
  return counter > 1; // Return true if there is more than one block with the same name
};


// Funzione TEMPORANEA vincolo sui doppi DEFAULT BLOCKS
export const defaultBlockAlreadyExists = (name, currentBlock) => {
  let blocks = ws.getAllBlocks(true); // Ottieni tutti i blocchi nel workspace
  for (let i = 0; i < blocks.length; i++) {
    const blockName = blocks[i].getFieldValue("NAME");
    if (blocks[i] !== currentBlock && blockName && blockName.toLowerCase() === name.toLowerCase()) {
      return true;
    }
  }
  return false;
};


export const reset = (blockId,blockName, type, isDeleted = false, ws) => {
  let blocks = ws.getAllBlocks(true);
  rebuildDynamicDropdowns(ws);

//manage all ASSOCIATIONS
  blocks.forEach((block) => {
    const fields = ["ASSOCIATIONS","AGGREGATION"];
    fields.forEach((field) => {
      const fieldValue = block.getFieldValue(field)?.toLowerCase();
      if (
        fieldValue &&
        (fieldValue === blockName.toLowerCase() ||
          fieldValue ===
            (blockName.toLowerCase() + " (" + type + ")").toLowerCase())
      ) {
          console.log("Resetting associations for block:", blockName, "of type:", type, "in ws:", ws);

        let action = isDeleted ? "eliminato" : "modificato";

        if(action === "eliminato") {
          block.setFieldValue("NONE", field);
        }
        else {
        const blockRenamed = ws.getBlockById(blockId);
        const newName = blockRenamed.getFieldValue("NAME");
        //block.setFieldValue("NONE", field);

        let activityName = block.getFieldValue("NAME");
        let blockType = type
          .replace("_", " ")
          .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
        let containerBlockType = block.type
          .replaceAll("_", " ")
          .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
        let containerName =
          containerBlockType === "Custom Operation"
            ? "attività"
            : containerBlockType;

        const mfield = block.getField('ASSOCIATIONS') || block.getField('AGGREGATION'); 
        const options = mfield.getOptions();   // ← HERE 
        
        const blockTypeStripped = blockType.replaceAll(" ", "_");

        if (block.getField('ASSOCIATIONS')) var target = (`${newName} (${blockTypeStripped})`).toLowerCase()
          else  var target = newName;
        console.log(`Resetting field ${field} of block id ${block} with ${newName}`);
        console.log(`Resetting target ${target}`);

        let foundValue = null;

        for (const [label, value] of options) {
          console.log(`Checking option label: ${label} and value: ${value}`);
        if (label.toLowerCase() === target || value.toLowerCase() === target ) {
            console.log(`cfr ${label.toLowerCase()} with ${target}`);
            console.log(`setValue ${value} to ${field}`);

            //block.setFieldValue(value, field); 
            foundValue = value;
            break       
        }
        //else {
        //    block.setFieldValue(`NONE`, field);
        //}
      }

      if (foundValue) {
  console.log(`Setting ${field} to matched value: ${foundValue}`);
  block.setFieldValue(foundValue, field);
} else {
  console.log(`No match found — setting ${field} to NONE`);
  block.setFieldValue("NONE", field);
}

      }

      }
    });
  });


};


// Funzione per gestire il cambiamento del campo di testo
//TODO: quando viene invocata?
export function onTextFieldChange(event) {


    const newValue = event.target.value;
    const matches = newValue.match(/(.*?)\s+\((.*?)\)/);
    if (matches) {
      const name = matches[1];
      const type = matches[2];
      reset(name, type);
    }
  }
  
  // Funzione per rimuovere i blocchi mancanti
  export function removeMissingBlocks(nameArray, blockClass, ws) {
    if(!ws) return;
    //console.log('Tutti i blocchi nella workspace:', ws.getAllBlocks(true));
    let blocksNow = ws.getAllBlocks(true);
    let nameBlocks = [];
  
    for (let y = 0; y < blocksNow.length; y++) {
      //console.log('Tipo di blocco:', blocksNow[y].type);
      if (blockClass.includes(blocksNow[y].type)) {
        let name = blocksNow[y].getFieldValue("NAME");
        //console.log('Nome del blocco:', name);
        if (blockClass[0] === "custom_digital") {
          nameBlocks.push(name);
        } else {
          nameBlocks.push(`${name} (${blocksNow[y].type})`);
        }
      }
    }

    //console.log('Blocchi attuali nella workspace:', nameBlocks);
  
    if (Array.isArray(nameArray)) {
      for (let i = nameArray.length - 1; i >= 0; i--) {
        if (!nameBlocks.includes(nameArray[i])) {
          //console.log(`Rimuovo blocco mancante dall'array: ${nameArray[i]}`);
          nameArray.splice(i, 1);
        }
      }
    } else {
      for (let key in nameArray) {
        if (!nameBlocks.includes(key)) {
          //console.log(`Rimuovo blocco mancante da object: ${key}`);
          delete nameArray[key];
        }
      }
    }
  }