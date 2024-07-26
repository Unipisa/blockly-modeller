import { generator } from "..";
import { generateRandID } from "../../../utils/utils";

export const default_actor = function (block) {
    if (block.getParent() !== null) {
      // if (!block.idField) {
      //   block.idField = generateRandID();
      // }
      // let ID = block.idField;
      let name = block.getFieldValue("NAME");
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
      // if (name && name.trim() !== "" && name !== "...............") {
      //   name += "_act";
      // }
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
  
  