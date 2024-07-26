import {icons} from'../../icons.js';

export const NATURAL_RESOURCES_BLOCKS = [
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
    }
  ];
  