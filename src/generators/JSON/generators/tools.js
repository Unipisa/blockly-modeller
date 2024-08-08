import {generator} from "..";
import { showCustomAlert } from "../../../utils/alerts";
import { defaultBlockAlreadyExists } from "../../../utils/blockUtils";



export const custom_tool = function(block) {
    if(block.getParent() !== null){  
      var statements_attributes = generator.statementToCode(block, 'ATTRIBUTES');
      var statements_operations = generator.statementToCode(block, 'OPERATIONS');
      var statements_generalizations = generator.statementToCode(block, "GENERALIZATIONS");
      return {
        type: "custom_tool",
        name: block.getFieldValue("NAME"),
        activities: statements_operations || [],
        attributes: statements_attributes || [],
        specialisations: statements_generalizations || []
      };
    };
  };
  
  export const irrigation_tool = function(block) {
    if(block.getParent() !== null){ 
      let name = block.getFieldValue("NAME");
      // TEMPORANEO:Controlla e elimina i doppioni default
    if (defaultBlockAlreadyExists(name,block)) {
      block.dispose(true);
      showCustomAlert(`Il blocco <i>${name}</i> è già stato inserito nel workspace! \nEliminazione del blocco in corso\n`
    );
      return null;
    } 
      var statements_attributes = generator.statementToCode(block, 'ATTRIBUTES');
      var statements_operations = generator.statementToCode(block, 'OPERATIONS');
      var statements_generalizations = generator.statementToCode(block, "GENERALIZATIONS");
      return {
        type: "irrigation_tool",
        name: "Irrigation",
        activities: statements_operations || [],
        attributes: statements_attributes || [],
        specialisations: statements_generalizations || []
      };
    };
  };
  