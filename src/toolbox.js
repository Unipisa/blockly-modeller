/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export const toolbox = {
  'kind': 'categoryToolbox',
  'contents': [
    {
      'kind': 'category',
      'name': 'USER GUIDE',
      'colour': "#a68c83",
      'contents': [
        {
          'kind': 'label',
          'text': 'Instructions for use',
        },
        {
          'kind': 'label',
          'text': '1. Items marked with * are required fields',
        },
        {
          'kind': 'label',
          'text': '2. .................................................',
        },
        {
          'kind': 'label',
          'text': '3. .................................................',
        },
      ],
    },
    
    {
      'kind': 'category',
      'name': 'Actors',
      'colour': "#D87D2D",
      'contents': [
        {
          'kind': 'block',
          'type': 'custom_actor',
        },
        {
          'kind': 'label',
          'text': '  PRESET BLOCKS:',
        },
        {
          'kind': 'block',
          'type': 'default_actor',
          'collapsed': 'true',
        },
      ],
    },
    {
      'kind': 'category',
      'name': 'Activities',
      'colour': "#90B763",
      'contents': [
        {
          'kind': 'block',
          'type': 'custom_operation',
          //'enabled': false,
        },
        {
          'kind': 'block',
          'type': 'login',
        },
      ],
    },
    {
      'kind': 'category',
      'name': 'Resources',
      'colour': "#6dacd1",
      'contents': [
        {
          'kind': 'category',
          'name': 'Natural resources',
          'colour': "#7C61AC",
          'contents': [
            {
              'kind': 'block',
              'type': 'custom_resource',
            },
            {
              'kind': 'label',
              'text': '  PRESET BLOCKS:',
            },
            {
              'kind': 'block',
              'type': 'water_resource',
              'collapsed': 'true',
            },
            {
              'kind': 'block',
              'type': 'field_resource',
              'collapsed': 'true',
            },
          ],
        },
        {
          'kind': 'category',
          'name': 'Tools',
          'colour': "#dbab27",
          'contents': [
            {
              'kind': 'block',
              'type': 'custom_tool',
            },
            {
              'kind': 'label',
              'text': '  PRESET BLOCKS:',
            },
            {
              'kind': 'block',
              'type': 'irrigation_tool',
              'collapsed': 'true',
            },
          ],
        },
        {
          'kind': 'category',
          'name': 'Digital tools',
          'colour': "#64b0a9",
          'contents': [
            {
              'kind': 'block',
              'type': 'custom_digital',
            },
            {
              'kind': 'block',
              'type': 'custom_digital_component',
            },
            {
              'kind': 'label',
              'text': '  PRESET BLOCKS:',
            },
            {
              'kind': 'block',
              'type': 'dss_infrastructure',
              'collapsed': 'true',
            },
            {
              'kind': 'block',
              'type': 'wsn',
              'collapsed': 'true',
            },
            {
              'kind': 'block',
              'type': 'internet_gateway',
              'collapsed': 'true',
            },
            {
              'kind': 'block',
              'type': 'dss_software',
              'collapsed': 'true',
            },
          ],
        },
      ],
    },
    
    {
      'kind': 'category',
      'name': 'Attributes',
      'colour': "#D5698E",
      'contents': [
        {
          'kind': 'block',
          'type': 'custom_attribute',
        },
         {
          'kind': 'label',
          'text': '  PRESET BLOCKS:',
        },
        {
          'kind': 'block',
          'type': 'username',
        },
        {
          'kind': 'block',
          'type': 'password',
        },
        {
          'kind': 'block',
          'type': 'coords',
        },
        {
          'kind': 'block',
          'type': 'area',
        },
        {
          'kind': 'block',
          'type': 'id',
        },
      ],
    },
    {
      'kind': 'category',
      'name': 'Specialisations',
      'colour': "#D5698E",
      'contents': [
        {
          'kind': 'block',
          'type': 'custom_generalization',
        },
         {
          'kind': 'label',
          'text': '  PRESET BLOCKS:',
        },
        {
          'kind': 'block',
          'type': 'dam',
        },
        {
          'kind': 'block',
          'type': 'river',
        },
        {
          'kind': 'block',
          'type': 'well',
        },
        {
          'kind': 'block',
          'type': 'dripper',
        },
        {
          'kind': 'block',
          'type': 'sprinkler',
        },
      ],
    },                           
  ],
};
