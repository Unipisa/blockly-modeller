import { generator } from "..";
import { showCustomAlert } from "../../../utils/alerts";
import { defaultBlockAlreadyExists } from "../../../utils/blockUtils";



export const default_actor = function (block) {
    if (block.getParent() !== null) {
    let name = block.getFieldValue("NAME");
      
      // Controlla se esiste già un blocco con il nome "User"
    if (defaultBlockAlreadyExists(name,block)) {
      // Elimina il blocco corrente
      block.dispose(true);
      showCustomAlert(`Il blocco <i>${name}</i> è già stato inserito nel workspace! \nEliminazione del blocco in corso\n`
    );
      return null;
    }
      var statements_operations = generator.statementToCode(block, "OPERATIONS");
      var statements_attributes = generator.statementToCode(block, "ATTRIBUTES");
      return {
        type: "default_actor",
        name: name,
        activities: statements_operations || [],
        attributes: statements_attributes || [],
      };
    }
  };
  
  

  export const custom_actor = function(block) {
    if (block.getParent() !== null) {
      let name = block.getFieldValue("NAME");
      var statements_operations = generator.statementToCode(block, "OPERATIONS");
      var statements_attributes = generator.statementToCode(block, "ATTRIBUTES");
      return {
        type: "custom_actor",
        name: name,
        activities: statements_operations || [],
        attributes: statements_attributes || []
      };
    }
  };
  
  