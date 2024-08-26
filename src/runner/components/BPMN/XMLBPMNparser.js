export function BPMNparser(newDiagram, diagramXML) {


// Create a new DOMParser
const parser = new DOMParser();

// Parse the BPMN XML string
const xmlDoc = parser.parseFromString(newDiagram, 'text/xml');

// Find the collaboration element
var collaborationElement = xmlDoc.querySelector("collaboration");

// Get its id attribute value
var collaborationId = collaborationElement.getAttribute("id");

var bpmnPlaneElement = xmlDoc.getElementsByTagName("bpmndi:BPMNDiagram")[0];

// Find the first child element of BPMNPlane
var firstChildElement = bpmnPlaneElement.getElementsByTagName("*")[0];

// Update the value of bpmnElement attribute
firstChildElement.setAttribute("bpmnElement", collaborationId);

// Create new elements
var bpmnShapeElement = xmlDoc.createElementNS("http://www.omg.org/spec/BPMN/20100524/DI", "bpmndi:BPMNShape");
var boundsElement = xmlDoc.createElementNS("http://www.omg.org/spec/DD/20100524/DC", "omgdc:Bounds");
var labelElement = xmlDoc.createElementNS("http://www.omg.org/spec/BPMN/20100524/DI", "bpmndi:BPMNLabel");


// Set attributes for the BPMNShape element
var randomId = "shape_" + Math.random().toString(36).substr(2, 10);

// Find the participant element
var participantElement = xmlDoc.querySelector("participant");

var particpantiId = participantElement.getAttribute("id");

// Set attributes for the BPMNShape element
bpmnShapeElement.setAttribute("id", randomId);
bpmnShapeElement.setAttribute("bpmnElement", particpantiId);
bpmnShapeElement.setAttribute("isHorizontal", "true");


// Find all BPMNShape elements under BPMNDiagram
var bpmnShapes = xmlDoc.getElementsByTagNameNS("http://www.omg.org/spec/BPMN/20100524/DI", "BPMNShape");

// Find the maximum x value among the BPMNShape elements
var maxX = 0;
var widthmaxX = 0;

var maxY = 0;
var heightmaxY = 0;


for (var i = 0; i < bpmnShapes.length; i++) {
  var shape = bpmnShapes[i];
  var bounds = shape.getElementsByTagNameNS("http://www.omg.org/spec/DD/20100524/DC", "Bounds")[0];
  var x = parseInt(bounds.getAttribute("x"), 10);
  if (x > maxX) {
    maxX = x;
    widthmaxX = parseInt(bounds.getAttribute("width"), 10);
  }
  var y = parseInt(bounds.getAttribute("y"), 10);
  if (y > maxY) {
    maxY = y;
    heightmaxY = parseInt(bounds.getAttribute("height"), 10);

  }
}



// Set attributes for the Bounds element
boundsElement.setAttribute("x", "0");
boundsElement.setAttribute("y", "0");
boundsElement.setAttribute("width", maxX + widthmaxX + 20); // Add 20 for some padding
boundsElement.setAttribute("height", maxY + heightmaxY + 40);

// Append Bounds element to BPMNShape element
bpmnShapeElement.appendChild(boundsElement);
bpmnShapeElement.appendChild(labelElement);

// Find the BPMNPlane element
var bpmnPlaneElement = xmlDoc.getElementsByTagName("bpmndi:BPMNPlane")[0];

// Find the first child element of BPMNPlane
var firstChildElement = bpmnPlaneElement.firstElementChild;

// Insert the new BPMNShape element as the first child of BPMNPlane
bpmnPlaneElement.insertBefore(bpmnShapeElement, firstChildElement);


//extract messageFlow from original diagram, then edit the new diagram

// Create a new DOMParser of original diagram
const parserOrig = new DOMParser();

// Parse the BPMN XML string
const xmlOrigDoc = parserOrig.parseFromString(diagramXML, 'text/xml');

// Find the messageFlow element

/* This is not supported -- deleted namespace in generator 
var namespaceResolver = function(prefix) {
  if (prefix === "bpmn") {
      return "http://www.omg.org/spec/BPMN/20100524/MODEL";
  }
  return null;
};
var xpath = "//bpmn:messageFlow";
var messageElements = xmlOrigDoc.evaluate(xpath, xmlOrigDoc, namespaceResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

console.log("Number of messageFlow elements found:", messageElements.snapshotLength);

if (messageElements.snapshotLength > 0) {

var messageElements = [];

for (var i = 0; i < messageElements.snapshotLength; i++) {
  messageElements.push(messageElements.snapshotItem(i));
}*/

var messageElements = xmlOrigDoc.querySelectorAll("messageFlow");

if (messageElements !== null && messageElements !== undefined) {


  var arrayProcesses = [];

  messageElements.forEach(function(messageElement) {

    var messageElementSourceAttributeValue = messageElement.getAttribute("sourceRef");


   
  var messageElementIdAttributeValue = messageElement.getAttribute("id");



  var targetRefValue = messageElement.getAttribute('targetRef');
  var messageElId = messageElement.getAttribute('id');


// Check if the value is not null or undefined
if (targetRefValue !== null && targetRefValue !== undefined && targetRefValue !== "NONE") {


  //var messageElementNew =  xmlDoc.querySelector("messageFlow");
  
  //messageElementNew.setAttribute('targetRef',targetRefValue);
 
  //messageElement.setAttribute('targetRef',targetRefValue);

  //copy from xmlDoc orig to new xmlDoc
  var messageElementToUpdate = xmlDoc.querySelector(`[id="${messageElId}"]`);
  messageElementToUpdate.setAttribute('targetRef',targetRefValue);

 
  var allParticipants = xmlDoc.querySelectorAll("process");
  var numParticipants = allParticipants.length;

  if (!arrayProcesses.includes(targetRefValue)) {
    arrayProcesses.push(targetRefValue);

  
  //var bpmnParticipantElement = xmlDoc.createElementNS("participant");
  var bpmnParticipantElement = xmlDoc.createElementNS("http://www.omg.org/spec/BPMN/20100524/MODEL", "bpmn:participant");
  var randomProcessId = "process_" + Math.random().toString(36).substr(2, 10);

  bpmnParticipantElement.setAttribute("id", targetRefValue);
  bpmnParticipantElement.setAttribute("name", targetRefValue);
  bpmnParticipantElement.setAttribute("processRef", randomProcessId);

  var firstChildcollaborationElement = collaborationElement.firstElementChild;

  collaborationElement.insertBefore(bpmnParticipantElement, firstChildcollaborationElement);

  
  
  
//TODO: crea l'elemento se non esiste 
  var bpmnProcessElement = xmlDoc.createElementNS("http://www.omg.org/spec/BPMN/20100524/MODEL", "bpmn:process");
  bpmnProcessElement.setAttribute('id',randomProcessId);
  bpmnProcessElement.setAttribute('targetEl',targetRefValue);

//TODO : cambiare e selezionare id
  var existingProcessElement =  xmlDoc.querySelector("process");

// Append the new element after the existing element
existingProcessElement.parentNode.insertBefore(bpmnProcessElement, existingProcessElement.nextSibling);

  
  var bpmnShapeParticipantElement = xmlDoc.createElementNS("http://www.omg.org/spec/BPMN/20100524/DI", "bpmndi:BPMNShape");

  
  // Set attributes for the BPMNShape element
  //var randomId2 = "Participant_" + Math.random().toString(36).substr(2, 10);

  bpmnShapeParticipantElement.setAttribute("id", "Participant_" + targetRefValue + "_di");
  bpmnShapeParticipantElement.setAttribute("bpmnElement", targetRefValue);
  bpmnShapeParticipantElement.setAttribute("isHorizontal", "true");

  var boundsParticipantElement = xmlDoc.createElementNS("http://www.omg.org/spec/DD/20100524/DC", "omgdc:Bounds");
  var labelParticipantElement = xmlDoc.createElementNS("http://www.omg.org/spec/BPMN/20100524/DI", "bpmndi:BPMNLabel");

  //TODO sostituire maxY con maxY del participant più in alto 
  //TODO2 se ci sono solo 2 shape mettere sopra
  //oppure se ci sono 
 
  // Set attributes for the Bounds element
  boundsParticipantElement.setAttribute("x", 0);
  boundsParticipantElement.setAttribute("y", maxY + heightmaxY + 70 );
  boundsParticipantElement.setAttribute("width", (maxX + widthmaxX + 20)); // Add 20 for some padding
  boundsParticipantElement.setAttribute("height",maxY + heightmaxY);

 

// Append Bounds element to BPMNShape element
bpmnShapeParticipantElement.appendChild(boundsParticipantElement);
bpmnShapeParticipantElement.appendChild(labelParticipantElement);

  bpmnPlaneElement.appendChild(bpmnShapeParticipantElement);

  var allParticipants = xmlDoc.querySelectorAll("process");
  var numParticipants = allParticipants.length -1;

  var count = 0;
  var arrayCentroids = [];

  var divParticipants = Array.from(allParticipants);

  divParticipants.reverse();
  
  divParticipants.forEach(function(participant) {



    var partTargetId = participant.getAttribute('id');


    var currentProcTask = xmlDoc.querySelector(`[id="${messageElementSourceAttributeValue}"]`)

    var currentProc = currentProcTask.parentNode.getAttribute('id');
  
    if(partTargetId != currentProc){


    var processRef = xmlDoc.querySelector(`[processRef="${partTargetId}"]`)
    var partTargetRef = processRef.getAttribute('id');

    var boundParticipant = xmlDoc.querySelector(`[bpmnElement="${partTargetRef}"]`)

    boundParticipant.firstElementChild.setAttribute("width", (maxX + widthmaxX + 20)/numParticipants ); // Add 20 for some padding
    boundParticipant.firstElementChild.setAttribute("x", ((maxX + widthmaxX + 20)/numParticipants) * count ); // Add 20 for some padding

    var shapeId = boundParticipant.getAttribute('bpmnElement');

    //array with participants centroids
    //var xPos = parseInt(boundParticipant.firstElementChild.getAttribute('x') + (parseInt(boundParticipant.firstElementChild.getAttribute('width'))/2));
    var xPos = ((maxX + widthmaxX + 20)/numParticipants) * count + ((maxX + widthmaxX + 20)/numParticipants)/2 ;

    arrayCentroids[shapeId] = xPos;
    
    count ++;

 
 
  }
  });

}
else {
  console.log("non crea participant per", targetRefValue);

}


var bpmnEdgeElement = xmlDoc.createElementNS("http://www.omg.org/spec/BPMN/20100524/DI", "bpmndi:BPMNEdge");
var bpmnEdgeWaypoint1 = xmlDoc.createElementNS("http://www.omg.org/spec/DD/20100524/DI", "omgdi:waypoint");
var bpmnEdgeWaypoint2 = xmlDoc.createElementNS("http://www.omg.org/spec/DD/20100524/DI", "omgdi:waypoint");



 var elementWithValue = xmlDoc.querySelector(`[bpmnElement="${messageElementSourceAttributeValue}"]`);

 
 var targetShape = xmlDoc.querySelector(`[id="${ messageElementSourceAttributeValue}_di"]`);

 var targetShapeChildX = targetShape.parentElement.getAttribute('x');

if (elementWithValue) {
  var firstChildElement = elementWithValue.firstElementChild;

  if (firstChildElement) {
    var xAttributeValue = firstChildElement.getAttribute("x");
    var widthAttributeValue = firstChildElement.getAttribute("width");
    var yAttributeValue = firstChildElement.getAttribute("y");
    var heightAttributeValue = firstChildElement.getAttribute("height");

      if (xAttributeValue !== null && widthAttributeValue !== null) {
      var xFlowValue = parseInt(xAttributeValue) + (parseInt(widthAttributeValue) / 2);
      var yFlowValue = parseInt(yAttributeValue) + parseInt(heightAttributeValue);

    } 

} 

} 




bpmnEdgeElement.setAttribute("id", messageElementIdAttributeValue+"_di");
bpmnEdgeElement.setAttribute("bpmnElement", messageElementIdAttributeValue);

bpmnEdgeWaypoint1.setAttribute("x", xFlowValue); //
bpmnEdgeWaypoint1.setAttribute("y", yFlowValue );

var centroidEl = xmlDoc.getElementById(messageElementIdAttributeValue);
var targetCentroid = centroidEl.getAttribute('targetRef');
var targetCentroidComple = "Participant_"+targetRefValue+"_di";

bpmnEdgeWaypoint2.setAttribute("x", arrayCentroids[targetRefValue]);

bpmnEdgeWaypoint2.setAttribute("y", maxY + heightmaxY + 70);

bpmnEdgeElement.appendChild(bpmnEdgeWaypoint1);
bpmnEdgeElement.appendChild(bpmnEdgeWaypoint2);

bpmnPlaneElement.appendChild(bpmnEdgeElement);




for (var key in arrayCentroids) {
  if (arrayCentroids.hasOwnProperty(key)) {
      var message = xmlDoc.querySelector(`[targetRef="${key}"]`);
      var messageId = message.getAttribute('id');
      var shape = xmlDoc.querySelector(`[bpmnElement="${messageId}"]`);
      shape.lastElementChild.setAttribute('x', arrayCentroids[key]);
  }
}


} 

});

}






// Serialize the updated XML document back to a string
var updatedXmlString = new XMLSerializer().serializeToString(xmlDoc);






return updatedXmlString;




}
