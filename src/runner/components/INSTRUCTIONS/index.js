import * as Blockly from "blockly";
import { VIEWS } from "../../views";
import {icons} from'../../../blocks/icons.js';
import { getTodayDate } from '../../../utils/utils.js';
import { logBlocklyEvent } from "../../../utils/logger.js";
import { askAIModelSuggestion, provideInstructionsHelp } from "../../../utils/aiModelTranslation.js";
import { DOM_NODES } from "../../../utils/domElements";
import { rebuildDynamicDropdowns } from "../../components/BLOCKLY/index.js";
import { debounce } from "../../../utils/utils.js";


let ws = null;



export function view() { 


    try {

      let latestUMLString = "";

      document.addEventListener("umlUpdated", (event) => {
        latestUMLString = event.detail.umlString; // cache the latest value
      });

      document.addEventListener('blocklyWorkspaceReady', (event) => {
  ws = event.detail.ws || event.detail; // supports both detail shapes
  //console.log("Workspace available:", ws);
  // now you can pass ws to askAIModelSuggestion(ws)
});


    document
            .getElementById("instructionsBtn").onclick = async function (event) { 
            
              const userRequestInput = document.getElementById("userInputAskAIModel").value;

              //console.log("askAIBtn clicked with request:",userRequestInput);

              //document.getElementById("userInputAskAIModel").placeholder = "";
              const allBlocks = ws.getAllBlocks(false);
              //TODO : recuperarla quando si aggiorna il workspace e abbinare con: 
              //for (const id of highlightedBlocks) {
              //const block = workspace.getBlockById(id);
              //block?.pathObject.svgPath.classList.add('blocklyHighlighted');
              //}
              const allBlockIdsPrioAIsuggestion = allBlocks.map(b => b.id);
              if(ws) { var wsState = Blockly.serialization.workspaces.save(ws);
          
              var suggAImodel = await askAIModelSuggestion(userRequestInput);
              var feedbackAImessage = "";
              var inputState = "";
              console.log("suggAImodel",suggAImodel);
              const actions = canDeserializeWorkspace(suggAImodel);
              if(actions) {  
                //feedbackAImessage = "Workspace updated, check new elements added.";
                //console.log("Elaborating user request actions:", actions);
                var feedbackAI = elaborateUserRequest(ws, actions);
                if(feedbackAI === true) {
                  feedbackAImessage = "The diagram has been updated—have a look.";
                  inputState = "stateSuccess"

                } else {
                  feedbackAImessage = "AI could not suggest changes for the model. Please try rephrasing your request.";
                  inputState = "stateFail"

                }
              }
              else { 
                feedbackAImessage = "AI could not suggest changes for the model. Please try rephrasing your request.";
                inputState = "stateFail"
               }

              document.getElementById("userInputAskAIModel").value = "";
              document.getElementById("userInputAskAIModel").placeholder = feedbackAImessage;
              document.getElementById("userInputAskAIModel").className = "";
              document.getElementById("userInputAskAIModel").classList.add(inputState);

            }};


     document
            .getElementById("instructionsHelp").onclick = async function (event) { 
              provideInstructionsHelp();
            }


    const trigger = document.getElementById("AIdisclaimer");
const panel = document.getElementById("panelAIdisclaimer");

// Open when mouse enters trigger
trigger.addEventListener("mouseenter", () => {
  panel.classList.add("active");
});

// Close only when mouse leaves BOTH trigger and panel
trigger.addEventListener("mouseleave", (event) => {
  // If the mouse goes INTO the panel, don't close it
  if (!panel.contains(event.relatedTarget)) {
    panel.classList.remove("active");
  }
});

panel.addEventListener("mouseleave", (event) => {
  // If the mouse goes INTO the trigger, don't close it
  if (!trigger.contains(event.relatedTarget)) {
    panel.classList.remove("active");
  }
});

            

      
    
    } catch (error) {

      console.error("Caught error in Component:", error);

      return error;

    }
  
          

}


function getBlockByName(workspace, name, type = null) {
  const blocks = workspace.getAllBlocks(false);
  return blocks.find(b => {
    const fieldName = b.getFieldValue("NAME");
    if (type && b.type !== type) return false;
    return fieldName === name;
  }) || null;
}

function elaborateUserRequest(ws, input) {

  var msg = false;

  if (!ws) {
    console.error("❌ Workspace not provided");
    return false;
  }

  // 1️⃣ Normalize and parse input
  let actions = [];
  try {
    if (input && typeof input === "object" && typeof input.content === "string") {
      actions = JSON.parse(input.content);
    } else if (Array.isArray(input)) {
      actions = input;
    } else if (typeof input === "string") {
      actions = JSON.parse(input);
    } else {
      console.error("❌ Invalid input format. Expected array, string, or {content:'...'} object.");
      return false;
    }
  } catch (e) {
    console.error("❌ Failed to parse input:", e.message);
    return false;

  }

  if (!Array.isArray(actions)) {
    console.error("❌ Expected an array of actions.");
    return false;
  }

  //console.log("🧩 Processing actions:", actions);



  // 3️⃣ Execute each action
  for (const action of actions) {
    const { action_type, block_name, block_type, field_name, field_value, association } = action;

    switch (action_type) {
      /* --- CREATE --- */
      case "block_create": {
        if (!block_name || !block_type) {
          console.warn("⚠️ Missing block_name or block_type:", action);
          continue;
        }

        const target = ws
          .getAllBlocks(false)
          .find(b => b.getFieldValue("NAME") === block_name);
        if (target) {
          console.warn(`⚠️ Block '${block_name}' already exists, skipping creation.`);
          continue;
        }

        const block = ws.newBlock(block_type);
        block.initSvg();
        block.render();
        block.moveBy(100, 100);
        block.setFieldValue(block_name, "NAME");
        ws.highlightBlock(block.id);
        console.log(`✅ Created ${block_type} named '${block_name}'`);
        // 🔗 Auto-position and connect
        connectToParent(ws, block, block_type);
        rebuildDynamicDropdowns(ws);
        //if(association && block_type === "custom_operation") associateBlock(ws, association,block);
  if (association && block.type === "custom_operation") { 
  setTimeout(() => {
    associateBlock(ws, association, block);
  }, 1000);
}
        msg = true;
        break;
      }

      /* --- UPDATE --- */
      case "block_update": {
        if (!block_name || !field_name) {
          console.warn("⚠️ Missing field_name or block_name in update:", action);
          continue;
        }

        if(!field_name === "ASSOCIATIONS" || !field_name === "NAME" || !field_name === "MOTIVATION"){
          console.warn("⚠️ Field_name does not exist:", action);
          continue;
        }

        const upperFieldName = field_name.toUpperCase();

        const target = ws
          .getAllBlocks(false)
          .find(b => b.getFieldValue("NAME") === block_name);

        if (!target) {
          console.warn(`⚠️ Block '${block_name}' not found for update`);
          continue;
        }
        rebuildDynamicDropdowns(ws);
        if(!field_name === "ASSOCIATIONS" && b.type === "custom_operation") associateBlock(ws,field_value,b);
        else target.setFieldValue(field_value || "", upperFieldName);
        ws.highlightBlock(target.id);
        console.log(`✏️ Updated '${block_name}': ${upperFieldName} = ${field_value}`);
        break;
      }

      /* --- DELETE --- */
      case "block_delete": {
        if (!block_name) {
          console.warn("⚠️ Missing block_name in delete:", action);
          continue;
        }

        const target = ws
          .getAllBlocks(false)
          .find(b => b.getFieldValue("NAME") === block_name);

        if (target) {
          ws.highlightBlock(target.id);
          setTimeout(() => target.dispose(), 300);
          console.log(`🗑️ Deleted block '${block_name}'`);
          rebuildDynamicDropdowns(ws);
        } else {
          console.warn(`⚠️ Block '${block_name}' not found for deletion`);
        }
        break;
      }

      default:
        console.warn("⚠️ Unknown action type:", action_type);
        break;
    }
    
  }
  return msg;
}

  // 2️⃣ Helper: connect new block to best parent based on block type
  function connectToParent(ws, block, block_type) {


    const allBlocks = ws.getAllBlocks(false);
    const prevConn = block.previousConnection;

    console.log("conn",prevConn);

    // --- Case 1: top-level info block ---
    const infoBlock = allBlocks.find(b => b.type === "info");
    const updateConfirmation = `The workspace has been updated—have a look.`;
    if (infoBlock) {
      if (block_type.includes("custom_actor")) {
    console.log("block",block);
    console.log("bloc typek",block_type);
        const conn = infoBlock.getInput("ACTORS")?.connection;
        //if (conn && prevConn && !conn.isConnected()) {
          conn.connect(prevConn);
          console.log(`🔗 Connected '${block_type}' to info.ACTORS`);
          return updateConfirmation;
        //}
      }
      else {
      if (
        block_type.includes("natural_resource") ||
        block_type.includes("custom_tool") ||
        block_type.includes("custom_digital")
      ) {
        const conn = infoBlock.getInput("RESOURCES_UNIT")?.connection;
        //if (conn && prevConn && !conn.isConnected()) {
          conn.connect(prevConn);
          console.log(`🔗 Connected '${block_type}' to info.RESOURCES_UNIT`);
          return;
        //}
      }
    }
  }

    // --- Case 2: nested in actor / resource / tool / digital ---
    for (const parent of allBlocks) {
      if (
        ["custom_actor", "natural_resource", "custom_tool", "custom_digital"].includes(parent.type)
      ) {
        if (block_type.includes("operation")) {
          const conn = parent.getInput("OPERATIONS")?.connection;
          if (conn && prevConn && !conn.isConnected()) {
            conn.connect(prevConn);
            console.log(`🔗 Connected '${block_type}' to ${parent.type}.OPERATIONS`);
            return;
          }
        }
        if (block_type.includes("attribute")) {
          const conn = parent.getInput("ATTRIBUTES")?.connection;
          if (conn && prevConn && !conn.isConnected()) {
            conn.connect(prevConn);
            console.log(`🔗 Connected '${block_type}' to ${parent.type}.ATTRIBUTES`);
            return;
          }
        }
        if (block_type.includes("generalization")) {
          const conn = parent.getInput("GENERALIZATIONS")?.connection;
          if (conn && prevConn && !conn.isConnected()) {
            conn.connect(prevConn);
            console.log(`🔗 Connected '${block_type}' to ${parent.type}.GENERALIZATIONS`);
            return;
          }
        }
      }
    }

    // --- Case 3: nested in operation ---
    for (const parent of allBlocks) {
      if (
        [
          "custom_operation",
          "sequence",
        ].includes(parent.type)
      ) {
        const conn = parent.getInput("OPERATIONS")?.connection;
        if (conn && prevConn && !conn.isConnected()) {
          conn.connect(prevConn);
          console.log(`🔗 Connected '${block_type}' under ${parent.type}.OPERATIONS`);
          return;
        }
      }
    }

    console.log(`ℹ️ No suitable parent found for '${block_type}' — left unconnected`);
  }

  function associateBlock(ws, associationName,blockOrigin) {
        const allBlocks = ws.getAllBlocks(false);
        const associatedBlock = allBlocks.find(b => b.getFieldValue("NAME") == associationName);
        console.log("found associatdBlock: ",associatedBlock.getFieldValue("NAME"));
        const associatedValue = associationName.toUpperCase();  
        const associatedValueComplete = `${associationName} (${associatedBlock.type})`.toUpperCase();
        //blockOrigin.setFieldValue(associatedValueComplete, "ASSOCIATIONS");
        const field = blockOrigin.getField("ASSOCIATIONS");
        field.setValue(associatedValueComplete);
       // `${name} (${type})`.toUpperCase();  
  }

//function elaborateUserRequest(jsonStr) {

    //const actorBlock = getBlockByName(ws,"Farmer");
//const newValue = document.getElementById("actorNameInput").value.trim();
//const newValue = "Pippo";
//if (actorBlock && newValue) {
 // actorBlock.setFieldValue(newValue, "NAME");
//}
//actorBlock.dispose()
/*
const actor = ws.newBlock("custom_actor");
actor.initSvg();
actor.render();
actor.moveBy(50, 50);
actor.setFieldValue("Farmer", "NAME");
const infoBlock = ws.getAllBlocks(false).find(b => b.type === "info");
const actorBlock = ws.getAllBlocks(false).find(b => b.type === "custom_actor");
ws.highlightBlock(actor.id)
// Connect the actor to the ACTORS input of the info block
if (infoBlock && actorBlock) {
  const inputConn = infoBlock.getInput("ACTORS")?.connection;
  const actorConn = actorBlock.previousConnection;

  if (inputConn && actorConn) {
    inputConn.connect(actorConn);
  }
}
  */

//}


function canDeserializeWorkspace(jsonStr) {
  let obj = jsonStr;

  // 1️⃣ Handle Promises
  if (obj instanceof Promise) {
    console.error("⚠️ Received a Promise, not data. Await it first!");
    return false;
  }

  // 2️⃣ Parse outer JSON if it's a string
  if (typeof obj === "string") {
    try {
      obj = JSON.parse(obj);
    } catch (e) {
      console.error("❌ Invalid JSON syntax:", e.message);
      return false;
    }
  }

  // 3️⃣ Handle wrapped { content: "..." } structure
  if (obj && typeof obj === "object" && typeof obj.content === "string") {
    try {
      obj = JSON.parse(obj.content);
    } catch (e) {
      console.error("❌ Invalid 'content' JSON:", e.message);
      return false;
    }
  }

  // 4️⃣ Transform raw array strings (edge case)
  // Sometimes obj itself is a stringified array
  if (typeof obj === "string") {
    try {
      obj = JSON.parse(obj);
    } catch (e) {
      console.error("❌ Could not parse array string:", e.message);
      return false;
    }
  }

  // 5️⃣ Validate that obj is an array of actions
  if (!Array.isArray(obj)) {
    console.error("❌ Expected an array of actions.");
    return false;
  }

  // 6️⃣ Validate each action
  for (const action of obj) {
    if (typeof action.action_type !== "string" || typeof action.block_name !== "string") {
      console.error("❌ Invalid action format:", action);
      return false;
    }

    if (action.action_type === "block_create" && typeof action.block_type !== "string") {
      console.error("❌ Missing block_type for create action:", action);
      return false;
    }

    if (
      action.action_type === "block_update" &&
      (!action.field_name || !action.field_value)
    ) {
      console.error("❌ Missing field_name/field_value for update action:", action);
      return false;
    }
  }

  // ✅ If all checks pass, return the parsed array
  return obj;
}

