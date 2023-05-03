/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';
import {getAllClassBlocksinWs} from'../index.js';

const temp = 'Provaaaaa';

const myBlocks = [
  // ------------------------------------------------------------- SCHEMA ------------------------------------------------------------- // 
  {
  "type": "info",
  "message0": "• Who are the actors involved? %1 Insert actors: %2 %3 • Which are the resources? %4 Insert resources: %5 %6",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "input_statement",
      "name": "ACTORS",
      "check": "actor",
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
      "name": "RESOURCES_UNIT",
      "check": "resource",
    },
    
  ],
  "colour": '#a68c83',
  "tooltip": "",
  "helpUrl": ""
  },

  // ------------------------------------------------------------- ATTORI ------------------------------------------------------------- // 
  {
  "type": "custom_actor",
  "message0": "Custom ACTOR: %1* %2 What are the activities carried out by the actor? %3 %4 Attributes: %5 %6",
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
      "name": "OPERATIONS",
      "check": "operation",
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "ATTRIBUTES",
      "check": "attribute",
    }
  ],
  "previousStatement": "actor",
  "nextStatement": "actor",
  "colour": '#D87D2D',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "default_actor",
  "message0": "%1 %2 What are the activities carried out by the actor? %3 %4 Attributes: %5 %6",
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
      "name": "OPERATIONS",
      "check": "operation",
    },
    {
      "type": "input_dummy",
    },
    {
      "type": "input_statement",
      "name": "ATTRIBUTES",
      "check": "attribute",
    }
  ],
  "previousStatement": "actor",
  "nextStatement": "actor",
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
  "previousStatement": "attribute",
  "nextStatement": "attribute",
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
  "previousStatement": "attribute",
  "nextStatement": "attribute",
  "colour": "#D5698E",
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "custom_attribute",
  "message0": "Custom attribute: %1*",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "..............."
    }
  ],
  "previousStatement": "attribute",
  "nextStatement": "attribute",
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
  "previousStatement": "attribute",
  "nextStatement": "attribute",
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
  "previousStatement": "attribute",
  "nextStatement": "attribute",
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
  "previousStatement": "attribute",
  "nextStatement": "attribute",
  "colour": "#D5698E",
  "tooltip": "",
  "helpUrl": ""
  },

  // ------------------------------------------------------------- OPERAZIONI ------------------------------------------------------------- // 
  {
  "type": "custom_operation",
  "message0": "Custom ACTIVITY: %1* %2 • Motivation %3 %4 • Using resource or interacting %5  with actor %6",
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
      "type": "input_dummy",
      "name": "ASSOCIATIONS",
    }
  ],
  "extensions": ["dynamic_menu_extension"],
  "previousStatement": "operation",
  "nextStatement": "operation",
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
  "previousStatement": "operation",
  "nextStatement": "operation",
  "colour": "#90B763",
  "tooltip": "",
  "helpUrl": ""
  },

  // ------------------------------------------------------------- RISORSE NATURALI ------------------------------------------------------------- // 
  {
  "type": "field_resource",
  "lastDummyAlign0": "CENTRE",
  "message0": "%1 %2 Activities: %3 %4 %5 Advanced settings: %6 Attributes: %7 %8",
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
      "name": "OPERATIONS",
      "check": "operation",
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
      "name": "ATTRIBUTES",
      "check": "attribute",
    }
  ],
  "previousStatement": "resource",
  "nextStatement": "resource",
  "colour": '#7C61AC',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "water_resource",
  "message0": "%1 %2 Activities: %3 %4 %5 Advanced settings: %6 Attributes: %7 %8 Specialisation: %9 %10",
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
      "name": "OPERATIONS",
      "check": "operation",
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
      "name": "ATTRIBUTES",
      "check": "attribute",
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "GENERALIZATIONS",
      "check": "generalization",
    }
  ],
  "previousStatement": "resource",
  "nextStatement": "resource",
  "colour": '#7C61AC',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "custom_resource",
  "message0": "Custom RESOURCE: %1* %2 Activities: %3 %4 %5 Advanced settings: %6 Attributes: %7 %8 Specialisation: %9 %10",
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
      "name": "OPERATIONS",
      "check": "operation",
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
      "name": "ATTRIBUTES",
      "check": "attribute",
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "GENERALIZATIONS",
      "check": "generalization",
    }
  ],
  "previousStatement": "resource",
  "nextStatement": "resource",
  "colour": '#7C61AC',
  "tooltip": "",
  "helpUrl": ""
  },



  // ------------------------------------------------------------- STRUMENTI ------------------------------------------------------------- // 

  {
  "type": "irrigation_tool",
  "message0": "%1 %2 Activities: %3 %4 %5 Advanced settings: %6 Attributes: %7 %8 Specialisation: %9 %10",
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
      "name": "OPERATIONS",
      "check": "operation",
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
      "name": "ATTRIBUTES",
      "check": "attribute",
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "GENERALIZATIONS",
      "check": "generalization",
    }
  ],
  "previousStatement": "resource",
  "nextStatement": "resource",
  "colour": '#dbab27',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "custom_tool",
  "message0": "Custom TOOL: %1* %2 Activities: %3 %4 %5 Advanced settings: %6 Attributes: %7 %8 Specialisation: %9 %10",
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
      "name": "OPERATIONS",
      "check": "operation",
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
      "name": "ATTRIBUTES",
      "check": "attribute",
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "GENERALIZATIONS",
      "check": "generalization",
    }
  ],
  "previousStatement": "resource",
  "nextStatement": "resource",
  "colour": '#dbab27',
  "tooltip": "",
  "helpUrl": ""
  },



  // ------------------------------------------------------------- STRUMENTI DIGITALI ------------------------------------------------------------- // 

  {
  "type": "dss_infrastructure",
  "message0": "%1 %2 Activities: %3 %4 %5 Advanced settings: %6 Attributes: %7 %8",
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
      "name": "OPERATIONS",
      "check": "operation",
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
      "name": "ATTRIBUTES",
      "check": "attribute",
    },
  ],
  "previousStatement": "resource",
  "nextStatement": "resource",
  "colour": '#64b0a9',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "custom_digital",
  "message0": "Custom DIGITAL TOOL: %1* %2 Activities: %3 %4 %5 Advanced settings: %6 Attributes: %7 %8",
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
      "name": "OPERATIONS",
      "check": "operation",
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
      "name": "ATTRIBUTES",
      "check": "attribute",
    },
  ],
  "previousStatement": "resource",
  "nextStatement": "resource",
  "colour": '#64b0a9',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "wsn",
  "message0": "%1 %2 Activities: %3 %4 %5 Advanced settings: %6 Attributes: %7 %8 Aggregation: %9",
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
      "name": "OPERATIONS",
      "check": "operation",
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
      "name": "ATTRIBUTES",
      "check": "attribute",
    },
    {
      "type": "field_input",
      "name": "AGGREGATION",
      "text": "..............."
    }
  ],
  "previousStatement": "resource",
  "nextStatement": "resource",
  "colour": '#64b0a9',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "internet_gateway",
  "message0": "%1 %2 Activities: %3 %4 %5 Advanced settings: %6 Attributes: %7 %8 Aggregation: %9",
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
      "name": "OPERATIONS",
      "check": "operation",
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
      "name": "ATTRIBUTES",
      "check": "attribute",
    },
    {
      "type": "field_input",
      "name": "AGGREGATION",
      "text": "..............."
    }
  ],
  "previousStatement": "resource",
  "nextStatement": "resource",
  "colour": '#64b0a9',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "dss_software",
  "message0": "%1 %2 Activities: %3 %4 %5 Advanced settings: %6 Attributes: %7 %8 Aggregation: %9",
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
      "name": "OPERATIONS",
      "check": "operation",
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
      "name": "ATTRIBUTES",
      "check": "attribute",
    },
    {
      "type": "field_input",
      "name": "AGGREGATION",
      "text": "..............."
    }
  ],
  "previousStatement": "resource",
  "nextStatement": "resource",
  "colour": '#64b0a9',
  "tooltip": "",
  "helpUrl": ""
  },
  {
  "type": "custom_digital_component",
  "message0": "Custom DIGITAL COMPONENT: %1* %2 Activities: %3 %4 %5 Advanced settings: %6 Attributes: %7 %8 Aggregation: %9",
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
      "name": "OPERATIONS",
      "check": "operation",
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
      "name": "ATTRIBUTES",
      "check": "attribute",
    },
    {
      "type": "field_input",
      "name": "AGGREGATION",
      "text": "..............."
    }
  ],
  "previousStatement": "resource",
  "nextStatement": "resource",
  "colour": '#64b0a9',
  "tooltip": "",
  "helpUrl": ""
  },



  // ------------------------------------------------------------- GENERALIZZAZIONI ------------------------------------------------------------- // 
  {
  "type": "custom_generalization",
  "message0": "Custom specialisation: %1*",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "..............."
    }
  ],
  "previousStatement": "generalization",
  "nextStatement": "generalization",
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
  "previousStatement": "generalization",
  "nextStatement": "generalization",
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
  "previousStatement": "generalization",
  "nextStatement": "generalization",
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
  "previousStatement": "generalization",
  "nextStatement": "generalization",
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
  "previousStatement": "generalization",
  "nextStatement": "generalization",
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
  "previousStatement": "generalization",
  "nextStatement": "generalization",
  "colour": '#D5698E',
  "tooltip": "",
  "helpUrl": ""
  },
];


Blockly.Extensions.register('dynamic_menu_extension',
  function() {
    this.getInput('ASSOCIATIONS')
      .appendField(new Blockly.FieldDropdown(
        function() {
          var options = [];
          var classNames = getAllClassBlocksinWs();
          classNames.forEach((name) => {
            options.push([name, name.toUpperCase()]);
          })
          return options;
        }), 'ASSOCIATIONS');
  });


// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(myBlocks);

