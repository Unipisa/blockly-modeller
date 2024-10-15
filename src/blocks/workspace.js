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
import { logBlocklyEvent } from "../utils/logger.js";


export const xmlText =
  '<xml xmlns="https://developers.google.com/blockly/xml" id="workspaceBlocks" style="display: none"><block type="info" id="TBgAn^~ir@P9*e=ib?;@" x="350" y="50"></block></xml>';

export const setupBlocklyWorkspace = (blocklyDiv) => {

  //TODO: spostare queste variabili in un modulo

  var blockly = "<div id='codeOutputBlockly' class='outputBox' style='height: 100%; width: 100%'><input id='customTitle' type='text' placeholder='Insert title...' style='font-family: Helvetica'/><div id='blocklyDivInner' style='height: 98%; width: 100%'></div>";

  var outputUML = "<div id='codeOutputUML' class='outputBox'></div>";

  var outputBPMN = "<div id='codeOutputBPMN' class='outputBox style='overflow:auto;'><div id='processModel'></div></div>";

  var outputiStar = '<div id="codeOutputiStar" class="outputBox"><div id="menu-plugin" class="menu-body hidden"><div id="appToolbar"></div> <!-- this div is DEPRECATED. Instead, add elements directly to #menu-plugin --></div><div id="tool"><div id="workspace"><div id="sidepanel"></div><div id="out"><div class="cell-selection" style="display: none;"></div><div id="resize-handle" style="display: none;"></div><div id="diagram" style=""></div></div></div></div></div>';

  var outputReport = "<div id='codeOutputReport' class='outputBox'></div>";


var config = {
  settings:{
    hasHeaders: true,
    constrainDragToContainer: true,
    reorderEnabled: true,
    selectionEnabled: false,
    popoutWholeStack: false,
    blockedPopoutsThrowError: true,
    closePopoutsOnUnload: true,
    showPopoutIcon: false,
    showMaximiseIcon: true,
    showCloseIcon: false
},
dimensions: {
    borderWidth: 10,
    minItemHeight: 10,
    minItemWidth: 10,
    headerHeight: 20,
    dragProxyWidth: 300,
    dragProxyHeight: 200
},
labels: {
    close: 'close',
    maximise: 'maximise',
    minimise: 'minimise',
    popout: 'open in new window'
},
  content: [{
      type: 'row',
      content:[{
          type: 'component',
          componentName: 'Blockly',
          componentState: { label: blockly },
          isClosable: false,
          width: 60  // 60% width
      },{
          type: 'column',
          content:[{
          type: 'component',
          componentName: 'Structure',
          componentState: { label: outputUML },
          isClosable: false,
          width: 40  // 40% width

      },{
              type: 'component',
              componentName: 'Activity',
              componentState: { label: outputBPMN },
              isClosable: false
          },{
              type: 'component',
              componentName: 'Goal',
              componentState: { label: outputiStar },
              isClosable: false
          },{
              type: 'component',
              componentName: 'Report',
              componentState: { label: outputReport },
              isClosable: false
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
      
      myLayout.on('componentCreated', function (component) {
        const container = component.container;
        console.log('Component created:', container);
        logBlocklyEvent(container);    
        // You can also track component size/position changes using `resize` and `drag` events
        container.on('resize', function () {
            console.log('Component resized:', container);
            logBlocklyEvent(container);

        });
    });
    
    

      blocklyInit();

      document.addEventListener('DOMContentLoaded', (event) => {
      
      COMPONENTS.BLOCKLY.addButtonDownload('customTitle', ws);

      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xmlText), ws);

      addBlockDeleteChangeListener(ws);

      //Sostituite con questa sotto
      //addChangeListener(ws);
      //addUiEventListener(ws);


// Event listener for maximized or minimized state change
/* serve?
myLayout.on('stateChanged', function() {
  var isMaximized = myLayout.root.getItemsByType('component').some(function(component) {
      return component.isMaximised;
  });

  if (isMaximized) {
      console.log('Component maximized.');
  } else {
      console.log('Component minimized or restored.');
  }
});
*/
    
      ws.addChangeListener((event) => {

        let wsHasChanged = onWorkspaceChange(event, ws); 
        console.log(event);

       if(wsHasChanged){

        //console.log('hasChanged');

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

       logBlocklyEvent(event);

     });



    });


    document.getElementById('customTitle').addEventListener('input', function(event) {
      logBlocklyEvent(event);
  });

      

    }
    
  });


});


myLayout.registerComponent( 'Structure', function( container, componentState ){

  container.getElement().html(  componentState.label  );

  document.addEventListener('blocklyCodeGeneratedUML', (event) => {
    
    const xmiWS = GENERATORS.XMI.convertToXMI(event.detail);


    //AGGIUNTO
    const umlDiv = document.getElementById('codeOutputUML');
    if (umlDiv) {
        COMPONENTS.UML.view(xmiWS);
      }

  
  });

});

myLayout.registerComponent( 'Activity', function( container, componentState ){

  container.getElement().html(componentState.label);

  document.addEventListener('blocklyCodeGeneratedBPMN', (event) => {
    console.log('Dettagli evento.detail BPMN:', event.detail);
    const bpmnDiv = document.getElementById("codeOutputBPMN");
    if (bpmnDiv) {
      COMPONENTS.BPMN.view(VIEWS.displayBPMN(event.detail));
    }
  
  });

});


myLayout.registerComponent( 'Goal', function( container, componentState ){

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

    //AGGIUNTO:
    const istarDiv = document.getElementById('codeOutputiStar');
    if (istarDiv) {
        COMPONENTS.ISTAR.view(VIEWS.displayISTAR(event.detail)); 
    }


    });

 

});

myLayout.registerComponent( 'Report', function( container, componentState ){
  container.getElement().html(  componentState.label  );

  document.addEventListener('blocklyCodeGeneratedReport', (event) => {
    //TOOD: sostituire DOM_NODES.reportDiv o variabile con il nome del div, al momento DOM_NODES non è ancora stato inizializzato
        
    //AGGIUNTO
        const reportDiv = document.getElementById('codeOutputReport');
        if (reportDiv) { // Controlla se l'elemento esiste
            reportDiv.innerHTML = event.detail;
        }
    });

});


// Add an event listener for component creation and add download buttons and functions
myLayout.on('componentCreated', function(component, ws) {
  //console.log('Component created:', component);

  if (component.config.componentName === 'Structure') {
    COMPONENTS.UML.addButtonDownload('codeOutputUML')
  }
  if (component.config.componentName === 'Activity') {
    COMPONENTS.BPMN.addButtonDownload('codeOutputBPMN')

  }
  if (component.config.componentName === 'Goal') {
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


