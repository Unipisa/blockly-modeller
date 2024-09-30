import {icons} from'../icons.js';

export const SCHEMA_BLOCK = [
  {
    "type": "info",
    "message0": "• Who are the actors involved? %1 Insert actors: %2 %3 %4 • Which are the resources? %5 Insert resources: %6 %7 %8",
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
      {
        "type": "input_dummy"
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_image",
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
    }
  ];
  