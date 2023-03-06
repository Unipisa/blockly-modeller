/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

const myBlocks = [
  // ------------------------------------------------------------- SCHEMA ------------------------------------------------------------- // 
  {
  "type": "info",
  "message0": "BUILT YOUR SCHEME! %1 • Who are the actors involved? %2 Actors blocks: %3 %4 • Which are the natural resources? %5 Resources blocks: %6 %7 • Which tools are avabile? %8 Tools blocks: %9 %10 • Which are the digital tools? %11 Digital tools blocks: %12 %13",
  "args0": [
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_statement",
      "name": "ACTORS"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_statement",
      "name": "NATURAL_RESOURCES"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_statement",
      "name": "TOOL"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_statement",
      "name": "DIGITAL_TOOL"
    }
  ],
  "colour": '#a68c83',
  "tooltip": "",
  "helpUrl": ""
  },

  // ------------------------------------------------------------- ATTORI ------------------------------------------------------------- // 
  {
  "type": "custom_actor",
  "message0": "Custom ACTOR with role: %1 %2 DOES %3 %4 -------------------------------------------------- %5 Advanced settings: %6 What are the actor's attributes? %7 %8",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "..............."
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "OPERATIONS"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "ATTRIBUTES"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#D87D2D',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "default_actor",
  "message0": "%1 %2 DOES %3 %4 -------------------------------------------------- %5 Advanced settings: %6 What are the actor's attributes? %7 %8",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "User"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "OPERATIONS"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_statement",
      "name": "ATTRIBUTES"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#D87D2D',
  "tooltip": "",
  "helpUrl": ""
  },

  // ------------------------------------------------------------- ATTRIBUTI ------------------------------------------------------------- // 
  {
  "type": "username",
  "message0": "%1",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "username"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#D5698E',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "password",
  "message0": "%1",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "password"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#D5698E",
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "custom_attribute",
  "message0": "Custom attribute: %1",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "..............."
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#D5698E",
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "id",
  "message0": "%1",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "id"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#D5698E",
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "coords",
  "message0": "%1",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "coords"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#D5698E",
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "area",
  "message0": "%1",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "area"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#D5698E",
  "tooltip": "",
  "helpUrl": ""
  },

  // ------------------------------------------------------------- OPERAZIONI ------------------------------------------------------------- // 
  {
  "type": "custom_operation",
  "message0": "Custom ACTION: %1 %2 • Because to %3 %4 • Interacting with %5  (comma separated list of items) %6",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "..............."
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "MOTIVATION",
      "text": "..............."
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "ASSOCIATIONS",
      "text": "..............."
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#90B763",
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "login",
  "message0": "%1",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "login"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#90B763",
  "tooltip": "",
  "helpUrl": ""
  },

  // ------------------------------------------------------------- RISORSE NATURALI ------------------------------------------------------------- // 
  {
  "type": "field_resource",
  "lastDummyAlign0": "CENTRE",
  "message0": "%1 %2 DOES %3 %4 -------------------------------------------------- %5 Advanced settings: %6 What are the actor's attributes? %7 %8",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "Field"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "OPERATIONS"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "ATTRIBUTES"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#7C61AC',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "water_resource",
  "message0": "%1 %2 DOES %3 %4 -------------------------------------------------- %5 Advanced settings: %6 What are the resource attributes? %7 %8 The resource comes in different forms? %9 If so, which ones? %10 %11",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "Water"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "OPERATIONS"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "ATTRIBUTES"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "GENERALIZATIONS"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#7C61AC',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "custom_resource",
  "message0": "Custom RESOURCE with name: %1 %2 DOES %3 %4 -------------------------------------------------- %5 Advanced settings: %6 What are the resource attributes? %7 %8 The resource comes in different forms? %9 If so, which one? %10 %11",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "..............."
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "OPERATIONS"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "ATTRIBUTES"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "GENERALIZATIONS"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#7C61AC',
  "tooltip": "",
  "helpUrl": ""
  },



  // ------------------------------------------------------------- STRUMENTI ------------------------------------------------------------- // 

  {
  "type": "irrigation_tool",
  "message0": "%1 %2 DOES %3 %4 -------------------------------------------------- %5 Advanced settings: %6 What are the attributes of the tool? %7 %8 The tool comes in different forms? %9 If so, which ones? %10 %11",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "Irrigation tool"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "OPERATIONS"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "ATTRIBUTES"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "GENERALIZATIONS"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#dbab27',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "custom_tool",
  "message0": "Custom TOOL with name: %1 %2 DOES %3 %4 -------------------------------------------------- %5 Advanced settings: %6 What are the attributes of the tool? %7 %8 The tool comes in different forms? %9 If so, which one? %10 %11",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "..............."
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "OPERATIONS"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "ATTRIBUTES"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "GENERALIZATIONS"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#dbab27',
  "tooltip": "",
  "helpUrl": ""
  },



  // ------------------------------------------------------------- STRUMENTI DIGITALI ------------------------------------------------------------- // 

  {
  "type": "dss_infrastructure",
  "message0": "%1 %2 DOES %3 %4 -------------------------------------------------- %5 Advaced settings: %6 What are the attributes of the tool? %7 %8",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "DSS infrastructure"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "OPERATIONS"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "ATTRIBUTES"
    },
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#64b0a9',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "custom_digital",
  "message0": "Custom DIGITAL TOOL with name: %1 %2 DOES %3 %4 -------------------------------------------------- %5 Advaced settings: %6 What are the attributes of the tool? %7 %8",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "..............."
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "OPERATIONS"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "ATTRIBUTES"
    },
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#64b0a9',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "wsn",
  "message0": "%1 %2 DOES %3 %4 -------------------------------------------------- %5 Advaced settings: %6 What are the attributes of the tool? %7 %8 Does it compose another item? %9 If so, which one? %10",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "WSN"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "OPERATIONS"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "ATTRIBUTES"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "AGGREGATION",
      "text": "..............."
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#64b0a9',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "internet_gateway",
  "message0": "%1 %2 DOES %3 %4 -------------------------------------------------- %5 Advaced settings: %6 What are the attributes of the tool? %7 %8 Does it compose another item? %9 If so, which one? %10",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "Internet gateway"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "OPERATIONS"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "ATTRIBUTES"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "AGGREGATION",
      "text": "..............."
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#64b0a9',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "dss_software",
  "message0": "%1 %2 DOES %3 %4 -------------------------------------------------- %5 Advaced settings: %6 What are the attributes of the tool? %7 %8 Does it compose another item? %9 If so, which one? %10",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "DSS software"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "OPERATIONS"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "ATTRIBUTES"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "AGGREGATION",
      "text": "..............."
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#64b0a9',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "custom_digital_component",
  "message0": "Custom DIGITAL COMPONENT with name: %1 %2 DOES %3 %4 -------------------------------------------------- %5 Advaced settings: %6 What are the attributes of the tool? %7 %8 Does it compose another item? %9 If so, which one? %10",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "..............."
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "OPERATIONS"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "ATTRIBUTES"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "AGGREGATION",
      "text": "..............."
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#64b0a9',
  "tooltip": "",
  "helpUrl": ""
  },



  // ------------------------------------------------------------- GENERALIZZAZIONI ------------------------------------------------------------- // 
  {
  "type": "custom_generalization",
  "message0": "Custom item: %1",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "..............."
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#D5698E',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "dam",
  "message0": "%1",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "Dam"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#D5698E',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "river",
  "message0": "%1",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "River"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#D5698E',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "well",
  "message0": "%1",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "Well"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#D5698E',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "dripper",
  "message0": "%1",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "Dripper"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#D5698E',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "sprinkler",
  "message0": "%1",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "Sprinkler"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#D5698E',
  "tooltip": "",
  "helpUrl": ""
  },
];



// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(myBlocks);

