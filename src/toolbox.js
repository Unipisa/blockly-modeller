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
          'text': '1. .................................................',
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
          'kind': 'block',
          'type': 'default_actor',
        },
      ],
    },
    {
      'kind': 'category',
      'name': 'Operations',
      'colour': "#90B763",
      'contents': [
        {
          'kind': 'block',
          'type': 'custom_operation',
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
            },
            {
              'kind': 'block',
              'type': 'field_resource',
            },
          ],
        },
        {
          'kind': 'category',
          'name': 'Tool',
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
            },
          ],
        },
        {
          'kind': 'category',
          'name': 'Digital tool ',
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
            },
            {
              'kind': 'block',
              'type': 'wsn',
            },
            {
              'kind': 'block',
              'type': 'internet_gateway',
            },
            {
              'kind': 'block',
              'type': 'dss_software',
            },
          ],
        },
      ],
    },
    {
      'kind': 'category',
      'name': 'Advanced settings',
      'colour': "#D5698E",
      'contents': [
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
          'name': 'Generalizations',
          'colour': "#D5698E",
          'contents': [
            {
              'kind': 'block',
              'type': 'custom_generalization',
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
    },     
  ],
};
