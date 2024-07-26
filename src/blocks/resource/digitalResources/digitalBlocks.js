import {icons} from'../../icons.js';

export const DIGITAL_TOOLS_BLOCKS = [
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
          "type": "input_dummy",
          "name": "AGGREGATION",
        }
      ],
      "extensions": ["dynamic_aggregation_menu_extension"],
      "previousStatement": "resource",
      "nextStatement": "resource",
      "colour": '#9FC2E9',
      "tooltip": "",
      "helpUrl": ""
      },
  ];
  