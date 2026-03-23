/**
 * Extracts a Blockly metamodel combining toolbox hierarchy and block definitions.
 * Ignores commented lines and image/icon metadata.
 * Works after Blockly and your custom blocks are loaded.
 *
 */

export const metamodel = {"info":{"affects":["custom_actor","natural_resource","custom_tool","custom_digital"]},"custom_actor":{"fields":["NAME"],"contains":["custom_operation","custom_attribute"]},"custom_operation":{"fields":["NAME","MOTIVATION","ASSOCIATIONS"],"contains":["custom_operation"]},"custom_attribute":{"fields":["NAME"]},"natural_resource":{"fields":["NAME"],"contains":["custom_operation","custom_attribute","custom_generalization"]},"custom_tool":{"fields":["NAME"],"contains":["custom_operation","custom_attribute","custom_generalization"]},"custom_digital":{"fields":["NAME"],"contains":["custom_operation","custom_attribute"]},"custom_digital_component":{"fields":["NAME","AGGREGATION"],"contains":["custom_operation","custom_attribute"]},"custom_generalization":{"fields":["NAME"]}};

 const metamodelExtended = {
  "info": {
    "affects": ["custom_actor", "natural_resource", "custom_tool", "custom_digital"]
  },
  "custom_actor": {
    "fields": ["NAME"],
    "contains": ["custom_operation", "custom_attribute"]
  },
  "custom_operation": {
    "fields": ["NAME", "MOTIVATION", "ASSOCIATIONS"],
    "contains": ["custom_operation"]
  },
  "custom_attribute": {
    "fields": ["NAME"]
  },
  "natural_resource": {
    "fields": ["NAME"],
    "contains": ["custom_operation", "custom_attribute", "custom_generalization"]
  },
  "custom_tool": {
    "fields": ["NAME"],
    "contains": ["custom_operation", "custom_attribute", "custom_generalization"]
  },
  "custom_digital": {
    "fields": ["NAME"],
    "contains": ["custom_operation", "custom_attribute"]
  },
  "custom_digital_component": {
    "fields": ["NAME", "AGGREGATION"],
    "contains": ["custom_operation", "custom_attribute"]
  },
  "custom_generalization": {
    "fields": ["NAME"]
  }
}
