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
      "name": "ROLE",
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
  "message0": "ACTOR with role: %1 %2 DOES %3 %4 -------------------------------------------------- %5 Advanced settings: %6 What are the actor's attributes? %7 %8",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "ROLE",
      "options": [
        [
          "User",
          "User"
        ],
        [
          "Farmer",
          "Farmer"
        ],
        [
          "Advisor",
          "Advisor"
        ]
      ]
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
  "message0": "username",
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#D5698E',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "password",
  "message0": "password",
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
      "name": "ATTRIBUTE",
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
  "message0": "id",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#D5698E",
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "coords",
  "message0": "coords",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#D5698E",
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "area",
  "message0": "area",
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
      "name": "OPERATION",
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
  "message0": "login",
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
  "message0": "Field %1 DOES %2 %3 -------------------------------------------------- %4 Advanced settings: %5 What are the actor's attributes? %6 %7",
  "args0": [
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
  "message0": "Water %1 DOES %2 %3 -------------------------------------------------- %4 Advanced settings: %5 What are the resource attributes? %6 %7 The resource comes in different forms? %8 If so, which ones? %9 %10",
  "args0": [
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
  "message0": "Irrigation tool %1 DOES %2 %3 -------------------------------------------------- %4 Advanced settings: %5 What are the attributes of the tool? %6 %7 The tool comes in different forms? %8 If so, which ones? %9 %10",
  "args0": [
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
  "message0": "DSS infrastructure %1 DOES %2 %3 -------------------------------------------------- %4 Advaced settings: %5 What are the attributes of the tool? %6 %7",
  "args0": [
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
  "message0": "WSN %1 DOES %2 %3 -------------------------------------------------- %4 Advaced settings: %5 What are the attributes of the tool? %6 %7 Does it compose another item? %8 If so, which one? %9",
  "args0": [
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
  "message0": "Internet gateway %1 DOES %2 %3 -------------------------------------------------- %4 Advaced settings: %5 What are the attributes of the tool? %6 %7 Does it compose another item? %8 If so, which one? %9",
  "args0": [
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
  "message0": "DSS software %1 DOES %2 %3 -------------------------------------------------- %4 Advaced settings: %5 What are the attributes of the tool? %6 %7 Does it compose another item? %8 If so, which one? %9",
  "args0": [
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
      "name": "GENERALIZATION",
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
  "message0": "Dam",
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#D5698E',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "river",
  "message0": "River",
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#D5698E',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "well",
  "message0": "Well",
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#D5698E',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "dripper",
  "message0": "Dripper",
  "previousStatement": null,
  "nextStatement": null,
  "colour": '#D5698E',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "sprinkler",
  "message0": "Sprinkler",
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

