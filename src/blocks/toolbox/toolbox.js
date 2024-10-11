/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {icons} from'../icons.js';

/* sistemare
function wrapText(text, maxLength) {
  const words = text.split(' ');
  let result = '';
  let currentLine = '';

  words.forEach((word) => {
    if ((currentLine + word).length > maxLength) {
      result += currentLine.trim() + '\n';
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  });

  result += currentLine.trim();
  return result;
}

var label_task1 = 'The farm aims to modernize greenhouse farming \n by introducing digital sensors and technology to optimize agricultural practices. Currently, the farm relies on traditional methods, leading to inefficient resource use and lower profits. By incorporating digital tools, the goal is to improve productivity, reduce inputs like water and herbicides, and increase the well-being of farmers through time-saving automation. The process involves installing advanced sensors throughout the greenhouses to monitor critical conditions like temperature, CO2 levels, soil moisture, pH, and light (photosynthetically active radiation). These sensors are connected via a LoRa-based communication system, which allows for real-time data transmission to the AgroSense platform—a digital tool accessible on both mobile devices and computers. The sensors work 24/7, taking readings every hour and sending this data to the platform. Once the data is uploaded to AgroSense, farmers can view the environmental conditions in their greenhouses at any time. This information helps them make more informed decisions about crop management. For example, if the system detects a drop in CO2 levels or an increase in temperature, the farmer can take immediate action to adjust greenhouse conditions, preventing plant stress and potential crop damage. This continuous monitoring also allows farmers to optimize water usage and fertilizer application, minimizing waste and improving sustainability. Advisors, who work closely with the farmers, can also access the data through the same platform, offering tailored recommendations based on real-time conditions. The platform’s historical data and machine learning algorithms further support decision-making by providing insights into long-term trends and potential improvements. This system not only automates some of the more labor-intensive tasks but also ensures that the farmer is notified when sensor maintenance is required, such as a battery replacement. The use of this digital technology is expected to increase yields, reduce production costs, and serve as a model for other farms in the region, encouraging broader adoption of such innovations.';
var wrapped_label1 = wrapText(label_task1, 10);
*/

export const toolbox = {
  'kind': 'categoryToolbox',
  'contents': [
    {
      'kind': 'category',
      'name': 'USER TASKS',
      'colour': "#a68c83",
      'imageName': icons.icon_guide,
      'contents': [
        {
          'kind': 'label',
          'text': 'TASK 1',
        },
        {
          'kind': 'label',
          //'text': wrapped_label1, 
          'text': 'Model the process described in the following text.',

        },  
        {
          'kind': 'label',
          'text': 'Save all available formats and export workspace file',
        },      
        {
          'kind': 'label',
          'text': 'TASK 2',
        },
        {
          'kind': 'label',
          'text': 'Import from local desktop the workspace <test.json>',
        },
        {
          'kind': 'label',
          'text': 'edit the model following instructions provided',
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

