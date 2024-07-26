import {icons} from'../icons.js';

export const OPERATION_BLOCKS = [
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
        }
  ];
  