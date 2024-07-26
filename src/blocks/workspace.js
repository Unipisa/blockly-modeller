import * as Blockly from "blockly";
import { toolbox } from "./toolbox/toolbox.js";
import { blocklyInit } from './index.js'
import { GENERATORS } from "../generators";
import { VIEWS } from "../runner/views";
import { COMPONENTS } from "../runner/components";
import { onWorkspaceChange } from '../listeners/workspaceChangeListener.js';
//import { registerExtensions } from './extension.js';
import { addBlockDeleteChangeListener } from '../listeners/blockDeleteChangeListener.js';



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

        onWorkspaceChange(event, ws);

        // TODO aggiornare con i relativi sourcecode ed eventi corrispondenti
        var code = GENERATORS.JSON.generator.workspaceToCode(ws);
        //var reportText =   VIEWS.displayReport(VIEWS.displayJSON(ws)); 
        var reportText =   COMPONENTS.REPORT.view(VIEWS.displayJSON(ws)); 

        // Trigger an event to update the code output
        document.dispatchEvent(new CustomEvent('blocklyCodeGeneratedUML', { detail: code }));
        document.dispatchEvent(new CustomEvent('blocklyCodeGeneratedBPMN', { detail: code }));
        document.dispatchEvent(new CustomEvent('blocklyCodeGeneratedISTAR', { detail: code }));
        document.dispatchEvent(new CustomEvent('blocklyCodeGeneratedReport', { detail: reportText }));

     });



    });

      

    }
  });


});


myLayout.registerComponent( 'UML', function( container, componentState ){
  container.getElement().html(  componentState.label  );

  document.addEventListener('blocklyCodeGeneratedUML', (event) => {
    document.getElementById('codeOutputUML').innerText = COMPONENTS.UML.view(JSON.stringify(event.detail))  });

});

myLayout.registerComponent( 'BPMN', function( container, componentState ){


container.getElement().html(componentState.label);


  document.addEventListener('blocklyCodeGeneratedBPMN', (event) => {

          //TODO: sostituire bpmnstatement con event.detail che deve contenere il json in formato XML - BPMN

    var bpmnstatement = `<?xml version="1.0" encoding="UTF-8"?><definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="15.1.3">
    <collaboration id="Collaboration_00xbjuv">
      <participant id="Participant_0om4akc" name="attore" processRef="Process_1ibjsha"/>
    </collaboration>
    <process id="Process_1ibjsha" isExecutable="false">
      <startEvent id="StartEvent">
        <outgoing>Flow_start</outgoing>
      </startEvent>
      <task id="Activity_11111210111497122105111110101" name="operazione">
        <incoming>Flow_start</incoming>
        <outgoing>Flow_11111210111497122105111110101</outgoing>
      </task>
      <sequenceFlow id="Flow_start" sourceRef="StartEvent" targetRef="Activity_11111210111497122105111110101"/>
      <intermediateThrowEvent id="Event_1xxqcqf">
        <incoming>Flow_11111210111497122105111110101</incoming>
      </intermediateThrowEvent>
      <sequenceFlow id="Flow_11111210111497122105111110101" sourceRef="Activity_11111210111497122105111110101" targetRef="Event_1xxqcqf"/>
    </process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_Process_1ibjsha">
      <bpmndi:BPMNPlane id="BPMNPlane_Process_1ibjsha" bpmnElement="Collaboration_00xbjuv">
        <bpmndi:BPMNShape id="shape_e7gdoerspo" bpmnElement="Participant_0om4akc" isHorizontal="true"><omgdc:Bounds x="0" y="0" width="413" height="128"/><bpmndi:BPMNLabel/></bpmndi:BPMNShape><bpmndi:BPMNShape id="StartEvent_di" bpmnElement="StartEvent">
          <omgdc:Bounds x="57" y="52" width="36" height="36"/>
        </bpmndi:BPMNShape>
        <bpmndi:BPMNShape id="Activity_11111210111497122105111110101_di" bpmnElement="Activity_11111210111497122105111110101">
          <omgdc:Bounds x="175" y="30" width="100" height="80"/>
        </bpmndi:BPMNShape>
        <bpmndi:BPMNShape id="Event_1xxqcqf_di" bpmnElement="Event_1xxqcqf">
          <omgdc:Bounds x="357" y="52" width="36" height="36"/>
        </bpmndi:BPMNShape>
        <bpmndi:BPMNEdge id="Flow_start_di" bpmnElement="Flow_start">
          <omgdi:waypoint x="93" y="70"/>
          <omgdi:waypoint x="175" y="70"/>
        </bpmndi:BPMNEdge>
        <bpmndi:BPMNEdge id="Flow_11111210111497122105111110101_di" bpmnElement="Flow_11111210111497122105111110101">
          <omgdi:waypoint x="275" y="70"/>
          <omgdi:waypoint x="357" y="70"/>
        </bpmndi:BPMNEdge>
      </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
  </definitions>`;

    COMPONENTS.BPMN.view(bpmnstatement);

    //document.getElementById('codeOutputBPMN').innerText = COMPONENTS.BPMN.view(JSON.stringify(event.detail));


  
  });

});


myLayout.registerComponent( 'iStar', function( container, componentState ){
  container.getElement().html(  componentState.label  );

    document.addEventListener('blocklyCodeGeneratedISTAR', (event) => {

      //TODO: sostituire istarstatement con event.detail che deve contenere il json in formato iStar
  
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
      
     //COMPONENTS.ISTAR.view(JSON.stringify(event.detail))
     
     COMPONENTS.ISTAR.view(istarstatement)


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
  console.log('Component created:', component);

  if (component.config.componentName === 'UML') {
    COMPONENTS.UML.addButtonDownload('codeOutputUML', ws)
  }
  if (component.config.componentName === 'BPMN') {
    COMPONENTS.BPMN.addButtonDownload('codeOutputBPMN', ws)
  }
  if (component.config.componentName === 'iStar') {
    COMPONENTS.ISTAR.addButtonDownload('codeOutputiStar', ws)
  }
  if (component.config.componentName === 'Report') {
    COMPONENTS.REPORT.addButtonDownload('codeOutputReport', ws)
  }
});

myLayout.init();



// Assume 'layout' is your GoldenLayout instance
myLayout.on('stateChanged', function() {
  console.log('Inspecting all items:', myLayout.root.getItemsByType('component'));
  Blockly.svgResize(ws);


});






};


