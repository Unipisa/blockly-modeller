import * as Blockly from "blockly";
import { VIEWS } from "../../views";
import {icons} from'../../../blocks/icons.js';
import { getTodayDate } from '../../../utils/utils.js';
import { logBlocklyEvent } from "../../../utils/logger.js";
import { displayAISuggestion } from "../../../utils/aiModelTranslation.js";
import { DOM_NODES } from "../../../utils/domElements";
import { debounce } from "../../../utils/utils.js";

let ws = null;
let latestUMLString = "";


export function view() { 


      
      
      document.addEventListener("umlUpdated", (event) => {
        latestUMLString = event.detail.umlString; // cache the latest value
      });
      

      // then use it inside your click handler
      document.getElementById("suggestBtn").onclick = function (event) {
        //console.log("Suggest model improvement clicked", latestUMLString);
      displayAISuggestion(latestUMLString, "suggestionChat"); // wait 1s after last edit
      };


        //return VIEWS.displayChat();
        //return "abc"

        
    

          

}

