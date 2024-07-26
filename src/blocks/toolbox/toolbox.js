/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {icons} from'../icons.js';

export const toolbox = {
  'kind': 'categoryToolbox',
  'contents': [
    {
      'kind': 'category',
      'name': 'USER GUIDE',
      'colour': "#a68c83",
      'imageName': icons.icon_guide,
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
      //'imageName': 'images/icon-actors.svg',
      'imageName': icons.icon_actors,

      'contents': [
        {
          'kind': 'block',
          'type': 'custom_actor',
        },
        /*{
          'kind': 'label',
          'text': '  PRESET BLOCKS:',
        },
        {
          'kind': 'block',
          'type': 'default_actor',
          'collapsed': 'true',
        },*/
      ],
    },
    {
      'kind': 'category',
      'name': 'Activities',
      'colour': "#7C61AC",
      'imageName': icons.icon_activities,

      'contents': [
        {
          'kind': 'block',
          'type': 'custom_operation',
          //'enabled': false,
        },
        /* Chiara added  
        {
        'kind': 'label',
        'text': '  ADVANCED STRUCTURES:',
        },
        {
          'kind': 'block',
          'type': 'sequence',
          //'enabled': false,
        },
        {
          'kind': 'block',
          'type': 'parallel_gateway',
          //'enabled': false,
        },
        {
          'kind': 'block',
          'type': 'exclusive_gateway',
          //'enabled': false,
        },   
        {
          'kind': 'block',
          'type': 'conditional_gateway',
          //'enabled': false,
        },              
        // {
        //  'kind': 'block',
        //  'type': 'parallel_operations',
          //'enabled': false,
        //},       
        Chiara end added */
        /* Chiara commented
        {
          'kind': 'block',
          'type': 'login',
        },
       Chiara end commented */ 
      ],
    },
    {
      'kind': 'category',
      'name': 'Resources',
      'colour': "#6dacd1",
      /*TODO: non si vede*/
      'imageName': icons.icon_resources,
      'expanded' : true,
      'contents': [
        {
          'kind': 'category',
          'name': 'Natural resources',
          'colour': "#90B763",
          'imageName': icons.icon_naturalresource,
          'contents': [
            {
              'kind': 'block',
              'type': 'custom_resource',
            },
            /*{
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
            */
          ],
        },
        {
          'kind': 'category',
          'name': 'Tools',
          'colour': "#dbab27",
          'imageName': icons.icon_tool,
          'contents': [
            {
              'kind': 'block',
              'type': 'custom_tool',
            },
            /*
            {
              'kind': 'label',
              'text': '  PRESET BLOCKS:',
            },
            {
              'kind': 'block',
              'type': 'irrigation_tool',
              'collapsed': 'true',
            },
            */
          ],
        },
        {
          'kind': 'category',
          'name': 'Digital tools',
          'imageName': icons.icon_digitaltool,
          'colour': "#9FC2E9",
          'contents': [
            {
              'kind': 'block',
              'type': 'custom_digital',
            },
            {
              'kind': 'block',
              'type': 'custom_digital_component',
            },
            /*{
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
            */
          ],
        },
      ],
    },
    
    {
      'kind': 'category',
      'name': 'Attributes',
      'colour': "#D5698E",
      'imageName': icons.icon_attributes,
      'contents': [
        {
          'kind': 'block',
          'type': 'custom_attribute',
        },
        /* CHIARA commented
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
        end CHIARA commented */
      ],
    },
    {
      'kind': 'category',
      'name': 'Specialisations',
      'colour': "#D5698E",
      "imageName": icons.icon_specialisations,
      'contents': [
        {
          'kind': 'block',
          'type': 'custom_generalization',
        },
        /*
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
        */
      ],
    },                           
  ],
};

