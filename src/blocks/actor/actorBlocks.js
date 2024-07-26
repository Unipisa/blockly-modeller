import {icons} from'../icons.js';

export const ACTOR_BLOCKS = [
  {
  "type": "custom_actor",
  "message0": " %1 ACTOR: %2* %3 What are the activities carried out by the actor? %4 %5 %6 Attributes: %7 %8 %9",
  "args0": [
    {
      "type": "field_image",
      "src": icons.icon_actors,
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
  ];
  