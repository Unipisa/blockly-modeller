import {icons} from'../icons.js';


export const SPECIALISATIONS_BLOCKS = [
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
    }
  ];
  