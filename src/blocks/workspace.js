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
import { Alert_div,closeCustomAlert } from "../utils/alerts.js"
import {icons} from'./icons.js';
import { debounce } from "../utils/utils.js";
import { rebuildNameIndex, rebuildDynamicDropdowns } from "../runner/components/BLOCKLY/index.js";

export const xmlText =
  '<xml xmlns="https://developers.google.com/blockly/xml" id="workspaceBlocks" style="display: none"><block type="info" id="TBgAn^~ir@P9*e=ib?;@" x="350" y="50"></block></xml>';

export let nameBlockInWS = {};
export let nameCustomDigitalInWS = [];

export const setupBlocklyWorkspace = (blocklyDiv) => {

  //TODO: spostare queste variabili in un modulo

  //var blockly = "<div id='codeOutputBlockly' class='outputBox' style='height: 100%; width: 100%'> <input id='customTitle' type='text' placeholder='Insert title...' style='font-family: Helvetica'/><div id='blocklyDivInner' style='height: 98%; width: 100%'></div>";
  var blockly = "<div id='codeOutputBlockly' class='outputBox' style='height: 100%; width: 100%'><div id='blocklyDivInner' style='height: 98%; width: 100%'></div>";

  var outputUML = "<div id='codeOutputUML' class='outputBox'></div>";

  var outputReader = `<div id="codeOutputCHAT" class="outputBox"><div>Start creating your model — explanations will appear here...</div></div>
  <a id="AIdisclaimer" class="button-13"><img src="${icons.icon_ai}" /></a>
  <div class="slide-panel" id="panelAIdisclaimer">
 Contents in the <img src="${icons.icon_ai_yellow}" width="20px" height="20px" style="background:#000"/> sections are AI generated and might not always be accurate.</div>
</div>`;

  var outputHints = `<h5 id="suggestionChat">Feeling Stuck?</h5><a id="suggestBtn" class="button-13"><img src="${icons.icon_AIsuggest}" width="24" height="24"  alt="" title="" />Ask for hints</a><div id="interactCHAT" class="outputBox"><div id="diagramDivContentId"></div>`;
/*
  var outputInstructions = `<div id="modelAIinstructions" class="input-row">
  <input type="text" id="userInputAskAIModel"
   placeholder="Enter instructions here to modify the diagram... E.g. 'create actor Farmer'" />
   <a id="instructionsBtn" class="button-13"><img src="${icons.icon_submit}" width="24" height="24"  alt="" title="" /></a></div></div><div id="feedbackAI" class="outputBox"></div>`;
*/

var outputInstructions = `
<div id="modelAIinstructions">
<img id="icon_type" src="${icons.icon_typewriter}" width="24" height="24"  alt="" title="" />

    <input type="text" id="userInputAskAIModel" placeholder="Enter instructions here to modify the diagram...">
    <button id="instructionsBtn"><img id="" src="${icons.icon_submit}" width="24" height="24"  alt="" title="submit" />
</button>
</div>
<span id="instructionsHelp">How to use this feature</span>
`
  var outputBPMN = "<div id='codeOutputBPMN' class='outputBox style='overflow:auto;'><div id='processModel'></div></div><div id='layerBPMNtranslation' class='outputBox AIbox'></div>";

  var outputiStar = '<div id="layerISTARtranslation" class="outputBox AIbox"></div><div id="codeOutputiStar" class="outputBox"><div id="menu-plugin" class="menu-body hidden"><div id="appToolbar"></div> <!-- this div is DEPRECATED. Instead, add elements directly to #menu-plugin --></div><div id="tool"><div id="workspace"><div id="sidepanel"></div><div id="out"><div class="cell-selection" style="display: none;"></div><div id="resize-handle" style="display: none;"></div><div id="diagram" style=""></div></div></div></div></div>';

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
      width: 60,  // 60% width
      content:[{
          type: 'column',
          content:[{
          type: 'component',
          componentName: 'Blockly',
          id : 'blockly',
          componentState: { label: blockly },
          isClosable: false,
          height: 85,  // 60% width
      },{
        type: 'row',
      height: 15,  // 60% width
      content:[{
          type: 'component',
          componentName: 'Instructions',
          componentState: { label: outputInstructions },
          isClosable: false,
          width: 70,  // 60% width
       },
        {
              type: 'component',
              componentName: 'Hints',
              title : 'Hints',
              componentState: { label: outputHints },
              isClosable: false,
              width: 30,  // 60% width
            }
      ] }]},{
              type: 'column',
              width: 40, // 40% width
              content:[{/*
            type: 'stack',
          height: 45, // 40% width
          content:[{*/
          type: 'component',
          componentName: 'Structure',
          title : 'Output',
          componentState: { label: outputUML },
          isClosable: false,
          height: 70 // 40% width
      },{
          type: 'component',
              componentName: 'AIReader',
              title : 'Diagram Reader',
              componentState: { label: outputReader },
              isClosable: false,
              height : 30
            },/*,{
              type: 'component',
              componentName: 'Activity',
              id : 'bpmn',
              componentState: { label: outputBPMN },
              isClosable: false,

          },{
              type: 'component',
              componentName: 'Goal',
              id : 'iStar',
              componentState: { label: outputiStar },
              isClosable: false,

          }*//*,{
              type: 'component',
              componentName: 'Report',
              componentState: { label: outputReport },
              isClosable: false
          }]
        },*/
        /* ACTIVATE HINTS PANEL {
              type: 'component',
              componentName: 'Hints',
              title : 'Hints',
              componentState: { label: outputHints },
              isClosable: false,
              height : 15
            }*/]
      }]
  }]
};

//AGGIUNTO PER ALERT
const alertDiv = document.createElement('div');
  alertDiv.id = 'customAlertBox';
  alertDiv.className = 'custom-alert hidden';
  alertDiv.innerHTML = `
    <div class="custom-alert-content">
      <span id="customAlertMessage"></span>
      <button onclick="closeCustomAlert()">Close</button>
    </div>
  `;
  document.body.appendChild(alertDiv);

  Alert_div.alertBox = document.getElementById('customAlertBox');
  Alert_div.alertMessage = document.getElementById('customAlertMessage');

/////////




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
        logBlocklyEvent(container);    
        // You can also track component size/position changes using `resize` and `drag` events
        container.on('resize', function () {
            
            const layoutResizeEvent = { type: "layoutresize", layoutcontainerHeight: container.height, layoutcontainerWidth: container.width, layoutcontainerIsHidden: container.isHidden,  layoutcontainerTitle: container.title };
            logBlocklyEvent( layoutResizeEvent );

        });

    });

    myLayout.on('tabCreated', function(tab) {
  const tabEl = tab.element;                 // jQuery element
  const label = tabEl.find('.lm_title').text().trim();
      console.log('Tab created:', tabEl);

  // Example: add class based on label
  const safeLabel = label.toLowerCase().replace(/\s+/g, '-');

  tabEl.addClass(`tab-${safeLabel}`);
});


  

      blocklyInit();

      document.addEventListener('DOMContentLoaded', (event) => {
      
      COMPONENTS.BLOCKLY.addButtonDownload('blocklyDivInner', ws);

      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xmlText), ws);

      addBlockDeleteChangeListener(ws);

    const recentlyCreated = new Set();

      ws.addChangeListener((event) => {

          if (event.isUiEvent) return;

        // Handle create
        if (event.type === Blockly.Events.CREATE) {
          recentlyCreated.add(event.blockId);
          setTimeout(() => recentlyCreated.delete(event.blockId), 1000); // expire after 1s
          onWorkspaceChange(event, ws);
        }

        // Handle move (only if not just created)
        else if (event.type === Blockly.Events.MOVE) {
          if (recentlyCreated.has(event.blockId)) return;
            onWorkspaceChange(event, ws);
        }


        let wsHasChanged = onWorkspaceChange(event, ws); 

        if(wsHasChanged){

        //console.log('hasChanged',event);

        var code = GENERATORS.JSON.generator.workspaceToCode(ws);
        //var reportText =   COMPONENTS.REPORT.view(VIEWS.displayJSON(ws)); 

        // Trigger an event to update the code output
        document.dispatchEvent(new CustomEvent('blocklyCodeGeneratedUML', { detail: code }));
        document.dispatchEvent(new CustomEvent('blocklyCodeGeneratedBPMN', { detail: code }));
        document.dispatchEvent(new CustomEvent('blocklyCodeGeneratedISTAR', { detail: code }));
        //document.dispatchEvent(new CustomEvent('blocklyCodeGeneratedReport', { detail: reportText }));
        document.dispatchEvent(new CustomEvent('blocklyWorkspaceReady', { detail: ws }));
 
      }

        if (
    event.type === Blockly.Events.BLOCK_CREATE ||
    event.type === Blockly.Events.BLOCK_DELETE ||
    event.type === Blockly.Events.BLOCK_CHANGE
  ) {
    // rebuild index BEFORE dropdowns
    rebuildNameIndex(ws);

    // dropdown rebuild AFTER index update
    queueMicrotask(() => {
      rebuildDynamicDropdowns(ws);
    });
  }

       logBlocklyEvent(event);

     });




    });



/*
    document.getElementById('customTitle').addEventListener('input', function(event) {
      logBlocklyEvent(event);
  });
  */





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

myLayout.registerComponent( 'Hints', function( container, componentState ){

  container.getElement().html(componentState.label);

  container.getElement().addClass('AIbox');



  document.addEventListener('blocklyCodeGeneratedUML', (event) => {

  debounce(COMPONENTS.CHAT.view(), 10000); // wait 1s after last edit

            
  });

  
});

myLayout.registerComponent( 'AIReader', function( container, componentState ){

  container.getElement().html(componentState.label);

  container.getElement().addClass('AIbox');


  document.addEventListener('blocklyCodeGeneratedUML', (event) => {

debounce(COMPONENTS.AIREADER.view((event.detail)), 10000); // wait 1s after last edit

            
  })

  /*document.addEventListener('blocklyCodeGeneratedOZ', (event) => {
    console.log('Dettagli evento.detail OZ:', event.detail);
    const ozDiv = document.getElementById("chat");
    if (ozDiv) {
      COMPONENTS.OZ.view(VIEWS.displayChat(event.detail));
    }
  
  });*/

});


myLayout.registerComponent( 'Instructions', function( container, componentState ){

  container.getElement().html(componentState.label);

  container.getElement().addClass('AIbox');

  document.addEventListener('DOMContentLoaded', (event) => {

debounce(COMPONENTS.INSTRUCTIONS.view(), 1000); // wait 1s after last edit

  })
            

});


myLayout.registerComponent( 'Activity', function( container, componentState ){

  container.getElement().html(componentState.label);

  document.addEventListener('blocklyCodeGeneratedBPMN', (event) => {
    //console.log('Dettagli evento.detail BPMN:', event.detail);
    const bpmnDiv = document.getElementById("codeOutputBPMN");
    if (bpmnDiv) {
      COMPONENTS.BPMN.view(VIEWS.displayBPMN(event.detail));
    }
  
  });

});


myLayout.registerComponent( 'Goal', function( container, componentState ){

  container.getElement().html(  componentState.label  );

  document.addEventListener('blocklyCodeGeneratedISTAR', (event) => {
 
    const istarDiv = document.getElementById('codeOutputiStar');
    if (istarDiv) {
        COMPONENTS.ISTAR.view(VIEWS.displayISTAR(event.detail)); 
    }


    });

 

});

/*
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

});*/


// Add an event listener for component creation and add download buttons and functions
myLayout.on('componentCreated', function(component, ws) {
  //console.log('Component created:', component);

  if (component.config.componentName === 'Structure') {
    COMPONENTS.UML.addButtonDownload('codeOutputUML')
  }
  
  if (component.config.componentName === 'Hints') {
    COMPONENTS.HINTS.listenChat()
  }
  
  if (component.config.componentName === 'Activity') {
    COMPONENTS.BPMN.addButtonDownload('codeOutputBPMN')

  }
  if (component.config.componentName === 'Goal') {
    COMPONENTS.ISTAR.addButtonDownload('codeOutputiStar')
  }
  /*if (component.config.componentName === 'Report') {
    COMPONENTS.REPORT.addButtonDownload('codeOutputReport')
  }
  */
});

myLayout.on( 'itemCreated', function( item ){
  if( item.config.cssClass ){
    item.element.addClass( item.config.cssClass );
  }
});

myLayout.init();



// Assume 'layout' is your GoldenLayout instance
myLayout.on('stateChanged', function() {
  //console.log('Inspecting all items:', myLayout.root.getItemsByType('component'));
  Blockly.svgResize(ws);


});





};


