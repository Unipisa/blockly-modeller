import {generator} from "..";

export const custom_resource = function (block) {
    if(block.getParent() !== null){
      var statements_operations = generator.statementToCode(block, "OPERATIONS");
      var statements_attributes = generator.statementToCode(block, "ATTRIBUTES");
      var statements_generalizations = generator.statementToCode(block, "GENERALIZATIONS");
      return {
        type: "custom_resource",
        name: block.getFieldValue("NAME"),
        activities: statements_operations || [],
        attributes: statements_attributes || [],
        specialisations: statements_generalizations || []
      };
    };
  };
  
  export const water_resource = function(block) {
    if(block.getParent() !== null){
      var statements_operations = generator.statementToCode(block, "OPERATIONS");
      var statements_attributes = generator.statementToCode(block, "ATTRIBUTES");
      var statements_generalizations = generator.statementToCode(block, "GENERALIZATIONS");
      return {
        type: "water_resource",
        name: block.getFieldValue("NAME"),
        activities: statements_operations || [],
        attributes: statements_attributes || [],
        specialisations: statements_generalizations || []
      };
    };
  };
  
  export const field_resource = function(block) {
    if(block.getParent() !== null){  
      var statements_operations = generator.statementToCode(block, "OPERATIONS");
      var statements_attributes = generator.statementToCode(block, "ATTRIBUTES");
      var statements_generalizations = generator.statementToCode(block, "GENERALIZATIONS");
      return {
        type: "field_resource",
        name: block.getFieldValue("NAME"),
        activities: statements_operations || [],
        attributes: statements_attributes || [],
        specialisations: statements_generalizations || []
      };
    };
  };
  