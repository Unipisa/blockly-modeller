import {generator} from "..";

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
  