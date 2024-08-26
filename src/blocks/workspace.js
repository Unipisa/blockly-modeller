import * as Blockly from "blockly";
import { toolbox } from "./toolbox/toolbox.js";
import { blocklyInit } from './index.js'
import { GENERATORS } from "../generators";
import { VIEWS } from "../runner/views";
import { COMPONENTS } from "../runner/components";
import { onWorkspaceChange } from '../listeners/workspaceChangeListener.js';
//import { registerExtensions } from './extension.js';
import { addBlockDeleteChangeListener } from '../listeners/blockDeleteChangeListener.js';
import { has } from "underscore";



export const xmlText =
  '<xml xmlns="https://developers.google.com/blockly/xml" id="workspaceBlocks" style="display: none"><block type="info" id="TBgAn^~ir@P9*e=ib?;@" x="350" y="50"></block></xml>';

export const setupBlocklyWorkspace = (blocklyDiv) => {

  //TODO: spostare queste variabili in un modulo

  var blockly = "<div id='codeOutputBlockly' class='outputBox' style='height: 100%; width: 100%'><input id='customTitle' type='text' placeholder='Insert title...' style='font-family: Helvetica'/><div id='blocklyDivInner' style='height: 98%; width: 100%'></div>";

  var outputUML = "<div id='codeOutputUML' class='outputBox'></div>";

  var outputBPMN = "<div id='codeOutputBPMN' class='outputBox'><div id='processModel'></div></div>";

  var outputiStar = '<div id="codeOutputiStar" class="outputBox"><div id="menu-plugin" class="menu-body hidden"><div id="appToolbar"></div> <!-- this div is DEPRECATED. Instead, add elements directly to #menu-plugin --></div><div id="tool"><div id="workspace"><div id="sidepanel"></div><div id="out"><div class="cell-selection" style="display: none;"></div><div id="resize-handle" style="display: none;"></div><div id="diagram" style=""></div></div></div></div></div>';

  var outputReport = "<div id='codeOutputReport' class='outputBox'></div>";


var config = {
  content: [{
      type: 'row',
      content:[{
          type: 'component',
          componentName: 'Blockly',
          componentState: { label: blockly }
      },{
          type: 'column',
          content:[{
          type: 'component',
          componentName: 'UML',
          componentState: { label: outputUML }
      },{
              type: 'component',
              componentName: 'BPMN',
              componentState: { label: outputBPMN }
          },{
              type: 'component',
              componentName: 'iStar',
              componentState: { label: outputiStar }
          },{
              type: 'component',
              componentName: 'Report',
              componentState: { label: outputReport }
          }]
      }]
  }]
};


var myLayout = new GoldenLayout( config, blocklyDiv );

var ws = "";

myLayout.registerComponent( 'Blockly', function( container, componentState ){
  //var blocklyDivId = 'blocklyDiv-' + Date.now();
  var blocklyDivId = 'blocklyDivInner';

  container.getElement().html(componentState.label);

  container.on('open', function() {

    var blocklyDiv = document.getElementById(blocklyDivId);

    if (blocklyDiv) {

      ws = Blockly.inject(blocklyDiv, {
        toolbox, 
              grid: {
                spacing: 20, 
                length: 3, 
                colour: 'rgb(219, 212, 201)',
                snap: true
              }, 
              move:{
                scrollbars: {
                  horizontal: true,
                  vertical: true
                },
              drag: true,
              wheel: true
              },
              zoom:
               {controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2,
                pinch: true}
      });


      blocklyInit();

      document.addEventListener('DOMContentLoaded', (event) => {
      
      COMPONENTS.BLOCKLY.addButtonDownload('customTitle', ws);

      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xmlText), ws);

      addBlockDeleteChangeListener(ws);

      //Sostituite con questa sotto
      //addChangeListener(ws);
      //addUiEventListener(ws);

    
      ws.addChangeListener((event) => {

        let wsHasChanged = onWorkspaceChange(event, ws); 

       if(wsHasChanged){

        console.log('hasChanged');

        // TODO aggiornare con i relativi sourcecode ed eventi corrispondenti
        var code = GENERATORS.JSON.generator.workspaceToCode(ws);
        //var reportText =   VIEWS.displayReport(VIEWS.displayJSON(ws)); 
        var reportText =   COMPONENTS.REPORT.view(VIEWS.displayJSON(ws)); 

        // Trigger an event to update the code output
        document.dispatchEvent(new CustomEvent('blocklyCodeGeneratedUML', { detail: code }));
        document.dispatchEvent(new CustomEvent('blocklyCodeGeneratedBPMN', { detail: code }));
        document.dispatchEvent(new CustomEvent('blocklyCodeGeneratedISTAR', { detail: code }));
        document.dispatchEvent(new CustomEvent('blocklyCodeGeneratedReport', { detail: reportText }));
       }

     });



    });

      

    }
  });


});


myLayout.registerComponent( 'UML', function( container, componentState ){

  container.getElement().html(  componentState.label  );

  document.addEventListener('blocklyCodeGeneratedUML', (event) => {
    
  // TODO sostituire con viewer plant
    document.getElementById('codeOutputUML').innerText = COMPONENTS.UML.view(JSON.stringify(event.detail))  
  
  });

});

myLayout.registerComponent( 'BPMN', function( container, componentState ){

  container.getElement().html(componentState.label);

  document.addEventListener('blocklyCodeGeneratedBPMN', (event) => {
       
    COMPONENTS.BPMN.view(VIEWS.displayBPMN(event.detail));
 
  });

});


myLayout.registerComponent( 'iStar', function( container, componentState ){

  container.getElement().html(  componentState.label  );

  document.addEventListener('blocklyCodeGeneratedISTAR', (event) => {

  //TODO CANCELLARE: sostituito istarstatement con event.detail che deve contenere il json in formato iStar
  /*
      var istarstatement = {
        "actors": [
            {
                "id": "dddd",
                "text": "actor",
                "type": "istar.Actor",
                "x": 15,
                "y": 10,
                "customProperties": {
                    "description": ""
                },
                "nodes": [
                    {
                        "id": "99999999",
                        "text": "activity",
                        "type": "istar.Task",
                        "x": 80,
                        "y": 140,
                        "customProperties": {
                            "Description": ""
                        }
                    }
                ]
            }
        ],
        "dependencies": [],
        "orphans": [],
        "links": [],
        "display": {},
        "tool": "pistar.2.1.0",
        "istar": "2.0",
        "saveDate": "Fri, 03 May 2024 21:16:31 GMT",
        "diagram": {
            "width": 600,
            "height": 300,
            "customProperties": {
                "Description": ""
            }
        }
    }

    COMPONENTS.ISTAR.view(istarstatement)

    */

    COMPONENTS.ISTAR.view(VIEWS.displayISTAR(event.detail));
    //COMPONENTS.ISTAR.view(event.detail);



    });

 

});

myLayout.registerComponent( 'Report', function( container, componentState ){
  container.getElement().html(  componentState.label  );

  document.addEventListener('blocklyCodeGeneratedReport', (event) => {
        //TOOD: sostituire DOM_NODES.reportDiv o variabile con il nome del div, al momento DOM_NODES non è ancora stato inizializzato
    document.getElementById('codeOutputReport').innerHTML = JSON.stringify(event.detail);

  });

});


// Add an event listener for component creation and add download buttons and functions
myLayout.on('componentCreated', function(component, ws) {
  //console.log('Component created:', component);

  if (component.config.componentName === 'UML') {
    COMPONENTS.UML.addButtonDownload('codeOutputUML')
  }
  if (component.config.componentName === 'BPMN') {
    COMPONENTS.BPMN.addButtonDownload('codeOutputBPMN')

  }
  if (component.config.componentName === 'iStar') {
    COMPONENTS.ISTAR.addButtonDownload('codeOutputiStar')
  }
  if (component.config.componentName === 'Report') {
    COMPONENTS.REPORT.addButtonDownload('codeOutputReport')
  }
});

myLayout.init();



// Assume 'layout' is your GoldenLayout instance
myLayout.on('stateChanged', function() {
  //console.log('Inspecting all items:', myLayout.root.getItemsByType('component'));
  Blockly.svgResize(ws);


});






};


