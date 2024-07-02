/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';
import {getAllClassBlocksinWs} from'../index.js';
import {getAllIcons} from'../icons.js';


const temp = 'Provaaaaa';

const icons = getAllIcons();


const myBlocks = [
  // ------------------------------------------------------------- SCHEMA ------------------------------------------------------------- // 
  {
  "type": "info",
  "message0": "• Who are the actors involved? %1 %2 %3 %4 • Which are the resources? %5 Insert resources: %6 %7 %8",
  "args0": [
    {
      "type": "input_dummy",
      "align": "LEFT"

    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "field_image",
      "src": icons.icon_actors,
      "width": 30,
      "height": 30,
      "alt": "*"
    },
    {
      "type": "input_statement",
      "name": "ACTORS",
      "check": "actor",
    },
    /*{
      "type": "input_statement",
      "name": "OBJECT",
      "check": "object" // Accepts any type of object as input
    },*/
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "field_image",
      //"src": "images/icon-resources.svg",
      "src": icons.icon_resources,
      "width": 30,
      "height": 30,
      "alt": "*"
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
  "message0": " %1 ACTOR: %2* %3 What are the activities carried out by the actor? %4 %5 %6 Attributes: %7 %8 %9",
  "args0": [
    {
      "type": "field_image",
      //"src": "images/icon-actor.svg",
      "src": "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjU2IDBjLTc3LjE5NiAwLTE0MCA2Mi44MDQtMTQwIDE0MHYzMGMwIDc3LjE5NiA2Mi44MDQgMTQwIDE0MCAxNDBzMTQwLTYyLjgwNCAxNDAtMTQwdi0zMEMzOTYgNjIuODA0IDMzMy4xOTYgMCAyNTYgMHptMTEwIDE3MGMwIDYwLjY1NC00OS4zNDYgMTEwLTExMCAxMTBzLTExMC00OS4zNDYtMTEwLTExMHYtMzBjMC02MC42NTQgNDkuMzQ2LTExMCAxMTAtMTEwczExMCA0OS4zNDYgMTEwIDExMHYzMHptLTQyIDE3MEgxODhjLTg2LjU3IDAtMTU3IDcwLjQzLTE1NyAxNTd2MTVoNDUwdi0xNWMwLTg2LjU3LTcwLjQzLTE1Ny0xNTctMTU3em0tMTcuMTc1IDMwYy02LjQ4NyAyMS45NC0yNi44MSAzOC01MC44MjUgMzhzLTQ0LjMzOC0xNi4wNi01MC44MjUtMzhoMTAxLjY1ek02MS44ODEgNDgyYzYuOTIxLTU4LjU2OCA1My44NTktMTA1LjA0NyAxMTIuNjMyLTExMS4yOEMxODEuODgyIDQwOC45OTMgMjE1LjYwOSA0MzggMjU2IDQzOHM3NC4xMTgtMjkuMDA3IDgxLjQ4Ny02Ny4yOGM1OC43NzMgNi4yMzMgMTA1LjcxIDUyLjcxMiAxMTIuNjMyIDExMS4yOEg2MS44ODF6Ii8+PHBhdGggZD0iTTE4NiAxMjVoNTB2MzBoLTUwem05MCAwaDUwdjMwaC01MHoiLz48L3N2Zz4=",
      "width": 30,
      "height": 30,
      "alt": "*"
    },
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
      "type": "field_image",
      //"src": "images/icon-resources.svg",
      "src": icons.icon_activities,
      "width": 30,
      "height": 30,
      "alt": "*"
    },  
    {
      "type": "input_statement",
      "name": "OPERATIONS",
      "check": ["operation","parallel_gateway","exclusive_gateway","conditional_gateway"],
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_image",
      //"src": "images/icon-resources.svg",
      "src": icons.icon_attributes,
      "width": 30,
      "height": 30,
      "alt": "*"
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
  "tooltip": "vvvvvvv",
  "helpUrl": "",
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
      "check": ["operation","parallel_gateway","exclusive_gateway","conditional_gateway"],
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
  "message0": "%1 Attribute: %2*",
  "args0": [
    {
      "type": "field_image",
      //"src": "images/icon-resources.svg",
      "src": icons.icon_attribute,
      "width": 30,
      "height": 30,
      "alt": "*"
    },
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
  "message0": "%1 ACTIVITY: %2* %3 • Motivation %4 %5 • Using resource or interacting %6  with actor %7",
  "args0": [
    {
      "type": "field_image",
      //"src": "images/icon-resources.svg",
      "src": icons.icon_activity,
      "width": 30,
      "height": 30,
      "alt": "*"
    }, 
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
  "colour": "#7C61AC",
  "tooltip": "",
  "helpUrl": ""
  },
  {
    "type": "sequence",
    "message0": " %1 Sequence of activities %2 Insert activities carried out in sequence %3 %4 %5",
    "args0": [
      {
        "type": "field_image",
        //"src": "images/icon-actor.svg",
        "src": icons.icon_sequence,
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_image",
        //"src": "images/icon-resources.svg",
        "src": icons.icon_activities,
        "width": 30,
        "height": 30,
        "alt": "*"
      },  
      {
        "type": "input_statement",
        "name": "OPERATIONS",
        "check": ["operation"],
      }
    ],
    "previousStatement": "operation",
    "nextStatement": "operation",
    "colour": '#6e4773',
    "tooltip": "",
    "helpUrl": ""
    },
  {
  "type": "parallel_gateway",
  "message0": " %1 Parallel activities %2 Insert activities carried out in parallel %3 %4 %5",
  "args0": [
    {
      "type": "field_image",
      //"src": "images/icon-actor.svg",
      "src": icons.icon_parallelgateway,
      "width": 30,
      "height": 30,
      "alt": "*"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_image",
      //"src": "images/icon-resources.svg",
      "src": icons.icon_activities,
      "width": 30,
      "height": 30,
      "alt": "*"
    },  
    {
      "type": "input_statement",
      "name": "OPERATIONS",
      "check": ["operation","sequence","parallel_gateway","exclusive_gateway","conditional_gateway"],
    }
  ],
  "previousStatement": "operation",
  "nextStatement": "operation",
  "colour": '#6e4773',
  "tooltip": "",
  "helpUrl": ""
  },
  {
    "type": "exclusive_gateway",
    "message0": " %1 Optional activity %2 Insert optional activities and conditon %3 %4 %5",
    "args0": [
      {
        "type": "field_image",
        //"src": "images/icon-actor.svg",
        "src": icons.icon_exclusivegateway,
        "width": 30,
        "height": 30,
        "alt": "*"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_image",
        //"src": "images/icon-resources.svg",
        "src": icons.icon_activities,
        "width": 30,
        "height": 30,
        "alt": "*"
      },  
      {
        "type": "input_statement",
        "name": "OPERATIONS",
        "check": ["operation","sequence","parallel_gateway","exclusive_gateway","conditional_gateway"],
      }
    ],
    "previousStatement": "operation",
    "nextStatement": "operation",
    "colour": '#6e4773',
    "tooltip": "",
    "helpUrl": ""
    },
    {
      "type": "conditional_gateway",
      "message0": " %1 Conditional activity %2 Insert optional activities and conditon %3 %4 %5",
      "args0": [
        {
          "type": "field_image",
          //"src": "images/icon-actor.svg",
          "src": icons.icon_exclusivegateway,
          "width": 30,
          "height": 30,
          "alt": "*"
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "field_image",
          //"src": "images/icon-resources.svg",
          "src": icons.icon_activities,
          "width": 30,
          "height": 30,
          "alt": "*"
        },  
        {
          "type": "input_statement",
          "name": "OPERATIONS",
          "check": ["operation","sequence","parallel_gateway","exclusive_gateway","conditional_gateway"],
        }
      ],
      "previousStatement": "operation",
      "nextStatement": "operation",
      "colour": '#6e4773',
      "tooltip": "",
      "helpUrl": ""
      },
  /* Chiara commented 
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
 Chiara end commented */ 

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
  "message0": "%1 NATURAL RESOURCE: %2* %3 Activities: %4 %5 %6 %7 Advanced settings: %8 Attributes: %9 %10 %11 Specialisation: %12 %13 %14",
  "args0": [
    {
      "type": "field_image",
      //"src": "images/icon-natural.svg",
      "src": icons.icon_naturalresource,
      "width": 30,
      "height": 30,
      "alt": "*"
    },
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
      "type": "field_image",
      //"src": "images/icon-resources.svg",
      "src": icons.icon_activities,
      "width": 30,
      "height": 30,
      "alt": "*"
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
      "type": "field_image",
      "src": icons.icon_attributes,
      "width": 30,
      "height": 30,
      "alt": "ATT"
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
      "type": "field_image",
      "src": icons.icon_specialisations,
      "width": 30,
      "height": 30,
      "alt": "ATT"
    },
    {
      "type": "input_statement",
      "name": "GENERALIZATIONS",
      "check": "generalization",
    }
  ],
  "previousStatement": "resource",
  "nextStatement": "resource",
  "colour": '#90B763',
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
  "message0": "%1 TOOL: %2* %3 Activities: %4 %5 %6 %7 Advanced settings: %8 Attributes: %9 %10 %11 Specialisation: %12 %13 %14",
  "args0": [
    {
      "type": "field_image",
      //"src": "images/icon-resources.svg",
      "src": icons.icon_tool,
      "width": 30,
      "height": 30,
      "alt": "*"
    }, 
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
      "type": "field_image",
      //"src": "images/icon-resources.svg",
      "src": icons.icon_activities,
      "width": 30,
      "height": 30,
      "alt": "*"
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
      "type": "field_image",
      //"src": "images/icon-resources.svg",
      "src": icons.icon_attributes,
      "width": 30,
      "height": 30,
      "alt": "*"
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
      "type": "field_image",
      "src": icons.icon_specialisations,
      "width": 30,
      "height": 30,
      "alt": "ATT"
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
  "message0": "%1 DIGITAL TOOL: %2* %3 Activities: %4 %5 %6 %7 Advanced settings: %8 Attributes: %9 %10 %11",
  "args0": [
    {
      "type": "field_image",
      "src": icons.icon_digitaltechnology,
      "width": 30,
      "height": 30,
      "alt": "DT"
    },
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
      "type": "field_image",
      "src": icons.icon_activities,
      "width": 30,
      "height": 30,
      "alt": "DT"
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
      "type": "field_image",
      "src": icons.icon_attributes,
      "width": 30,
      "height": 30,
      "alt": "AT"
    },
    {
      "type": "input_statement",
      "name": "ATTRIBUTES",
      "check": "attribute",
    },
  ],
  "previousStatement": "resource",
  "nextStatement": "resource",
  "colour": '#9FC2E9',
  //64b0a9
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
  "message0": "%1 DIGITAL COMPONENT: %2* %3 Activities: %4 %5 %6 %7 Advanced settings: %8 Attributes: %9 %10 %11 Aggregation: %12",
  "args0": [
    {
      "type": "field_image",
      "src": icons.icon_digitalcomponent,
      "width": 30,
      "height": 30,
      "alt": "DT"
    },
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
      "type": "field_image",
      "src": icons.icon_activities,
      "width": 30,
      "height": 30,
      "alt": "DT"
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
      "type": "field_image",
      "src": icons.icon_attributes,
      "width": 30,
      "height": 30,
      "alt": "DT"
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
  "colour": '#9FC2E9',
  "tooltip": "",
  "helpUrl": ""
  },



  // ------------------------------------------------------------- GENERALIZZAZIONI ------------------------------------------------------------- // 
  {
  "type": "custom_generalization",
  "message0": "%1 Specialisation: %2*",
  "args0": [
    {
      "type": "field_image",
      "src": icons.icon_specialisation,
      "width": 30,
      "height": 30,
      "alt": "ATT"
    },    
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
            options.push([name, name]);
          })
          return options;
        }), 'ASSOCIATIONS');
  });


// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(myBlocks);

