import {generator} from "..";

export const custom_digital = function(block) {
    if(block.getParent() !== null){  
    var statements_attributes = generator.statementToCode(block, 'ATTRIBUTES');
    var statements_operations = generator.statementToCode(block, 'OPERATIONS');
    return {
      type: "custom_digital",
      name: block.getFieldValue("NAME"),
      activities: statements_operations || [],
      attributes: statements_attributes || [],
      
    };
  };
};

export const custom_digital_component = function(block) {
  if(block.getParent() !== null){
    var statements_attributes = generator.statementToCode(block, 'ATTRIBUTES');
    var statements_operations = generator.statementToCode(block, 'OPERATIONS');
    return {
      type: "custom_digital_component",
      name: block.getFieldValue("NAME"),
      activities: statements_operations || [],
      attributes: statements_attributes || [],
      aggregation: block.getFieldValue('AGGREGATION')
      
    };
  };
};
