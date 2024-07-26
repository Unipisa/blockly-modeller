import {icons} from'../icons.js';

export const ATTRIBUTE_BLOCKS = [
  {
    "type": "custom_attribute",
    "message0": "%1 Attribute: %2*",
    "args0": [
      {
        "type": "field_image",
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
  ];
  