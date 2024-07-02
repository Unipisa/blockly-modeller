/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {javascriptGenerator} from 'blockly/javascript';
import {blockAlreadyInWs} from'../index.js';
import {ass_agg_AlreadyInWs} from'../index.js';
import {removeLastTypedBlock} from'../index.js';
import {getAlreadyInWsBlockType} from'../index.js';
import {setReport} from'../index.js';
//Chiara added
import {setBPMN} from'../index.js';

export const generator = Object.create(null);

export var arrayistaractors = []; 

export var arrayistardependencies = []; 


//genera un ID a partire dal nome della classe
function generateID(nomeClasse) {
  nomeClasse = nomeClasse.trim().toLowerCase();
  var id = new String();
  for(let c = 0; c < nomeClasse.length; c++){
    var charCode = nomeClasse.charCodeAt(c);
    id = id + charCode;
  }
  return id;
}

//genera un ID compreso tra 10000 e 99999
function generateRandID() {
  return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
}

//genera il report 
function createReport(blockName, allOperations, allAttributes, allGeneralizations, aggregation){
  const simpleReport = `\n• ${blockName.toUpperCase()} `;
  var allOpReport = new String();
  var allAttrReport = new String();
  var allGenReport = new String();
  var aggReport = new String();

  //se ci sono attributi
  if(allAttributes != ''){
    const attributes = allAttributes.split(",");
    allAttrReport = 'with attribute';
    if(attributes.length > 2) allAttrReport = allAttrReport + 's';
    attributes.forEach((attribute) => {
      if(attribute != ''){
        if(attributes.length > 2 && attributes.indexOf(attribute) == (attributes.length - 3)){
          allAttrReport = allAttrReport + ' ' + attribute.trim() + ' and';
        }
        else{
          allAttrReport = allAttrReport + ' ' + attribute.trim() + ',';
        }
      }
    })
    if(allGeneralizations == '' && aggregation == '' && allOperations == ''){
      allAttrReport = allAttrReport.substring(0, allAttrReport.length - 1);
    }
  }

  //se ci sono generalizzazioni
  if(allGeneralizations != ''){
    const generalizations = allGeneralizations.split(";");
    allGenReport = ' is generalisation of';
    generalizations.forEach((generalization) => {
      if(generalization != ''){
        if(generalizations.length > 2 && generalizations.indexOf(generalization) == (generalizations.length - 3)){
          allGenReport = allGenReport + ' ' + generalization.trim().toLowerCase() + ' and';
        }
        else{
          allGenReport = allGenReport + ' ' + generalization.trim().toLowerCase() + ',';
        }
      }
    })
    if(allOperations == ''){
      allGenReport = allGenReport.substring(0, allGenReport.length - 1);
    }
  }

  if(aggregation.charCodeAt(0) != 46 && aggregation != ''){
    aggReport = ' which is a component of ' + aggregation + ',';
    if(allOperations == ''){
      aggReport = aggReport.substring(0, aggReport.length - 1);
    } 
  }

  //se ci sono operazioni
  if(allOperations != ''){
    const operations = allOperations.split(":");

    if(allGeneralizations != ''){
      allOpReport = ' and';
    }
    if(operations.length > 2){ 
      allOpReport = allOpReport + ' does the actions of: \n';
    }
    else{
      allOpReport = allOpReport + ' does the action of: \n';
    }

    operations.forEach((operation) => {
      if(operation != ''){
        const segment = operation.split(";");
        var op_name = segment[0];
        var ass_name = segment[1];
        var motivation = segment[2];

        var opReport = '\t- ' + op_name;
        if(motivation != '' && motivation[0].charCodeAt(0) != 46 && motivation != ' '){
          opReport = opReport + ' because ' + motivation;
        }

        if(ass_name != 'NONE' && ass_name != ' '){
          opReport = opReport + ', interacting with ' + ass_name.toLowerCase();   
        }

        opReport = opReport + '\n';
        allOpReport = allOpReport + opReport;
      }
    })
  }
  return simpleReport + allAttrReport + allGenReport + aggReport + allOpReport;
}



// ------------------------------------------------------------- SCHEMA ------------------------------------------------------------- //

generator['info'] = function(block) {

  block.setDeletable(false);
  var statements_actors = javascriptGenerator.statementToCode(block, 'ACTORS');
  var statements_resources_unit = javascriptGenerator.statementToCode(block, 'RESOURCES_UNIT');
  
  var xml_data = '<?xml version="1.0" encoding="UTF-8"?>\n';
  var xmi_data = '<xmi:XMI xmi:version="2.1" xmlns:uml="http://schema.omg.org/spec/UML/2.0" xmlns:xmi="http://schema.omg.org/spec/XMI/2.1">\n';
  var doc_data = '\t<xmi:Documentation exporter="StarUML" exporterVersion="2.0"/>\n';
  var model_data = `\t<uml:Model xmi:id="${generateRandID()}" xmi:type="uml:Model" name="RootModel">\n`;
  var pack_data = `\t\t<packagedElement xmi:id="${generateRandID()}" name="BlocklyModel" visibility="public" xmi:type="uml:Model">\n`;
  var close_xmi_data = '</xmi:XMI>\n';
  var close_model_data = '\t</uml:Model>\n';
  var close_pack_data = '\t\t</packagedElement>\n';
    
         
         let occurrences = {}; // Object to track occurrences of each name
         let newArray = [];
         arrayistaractors.forEach(item => {
             // Check if the item has occurred before
             if (occurrences[item.text] !== undefined) {
                 // If yes, replace the previous occurrence with the current one
                 newArray[occurrences[item.text]] = item;
             } else {
                 // If not, add the item to the new array
                 newArray.push(item);
             }
             // Update or set the occurrence index of the current item
             occurrences[item.text] = newArray.length - 1;
         });

         arrayistaractors = newArray;



  return `${xml_data}${xmi_data}${doc_data}${model_data}${pack_data}${statements_actors}${statements_resources_unit}${close_pack_data}${close_model_data}${close_xmi_data}`;
};

// ------------------------------------------------------------- ATTORI ------------------------------------------------------------- //


generator['custom_actor'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  if(block.getParent() !== null){
    if(text_name.charCodeAt(0) != 46 && text_name != ''){
      if(!blockAlreadyInWs(text_name.toLowerCase())){

        var id = generateID(text_name);
        var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
        var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');
        //Chiara added
        var opentag = `<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="15.1.3">\t\t\t\t<bpmn:collaboration id="Collaboration_00xbjuv">\t\t\t\t<bpmn:participant id="Participant_0om4akc" name="`+ text_name + `" processRef="Process_1ibjsha" />`;
  var messageflow = "";
  var processtart= `</bpmn:collaboration>\t\t\t\t<bpmn:process id="Process_1ibjsha" isExecutable="false">\t\t\t\t<bpmn:startEvent id="StartEvent">\t\t\t\t<bpmn:outgoing>Flow_start</bpmn:outgoing>\t\t\t\t</bpmn:startEvent>`; 
  var closetag = `</bpmn:process></bpmn:definitions>`;
  var bpmnstatement_operations = "";
  

        const operations = statements_operations.split(":");
        var code_op_ass = new String();
        var id_op = new String();
        var flow_prec = "StartEvent";
        var flow_start = "Flow_start";
        var flow_next = "Flow_next";
        var istar_operations = [];

        var i = 80;
        operations.forEach((operation) => {
          if(operation != ''){
            const op = operation.split(";");
            let op_name = op[0].trim();
            id_op = generateID(op_name);

            let op_ass = op[1];
            let blockType = '';

            if(op_ass!='none') {
              blockType = getAlreadyInWsBlockType(op_ass.toLowerCase());
                        }
            const code_op = `\t\t\t\t<ownedOperation xmi:id="${id_op}" name="${op_name}" xmi:type="uml:Operation"/>\n`;
  
            flow_next = `Flow_${id_op}`;
            const code_op_bpmn = `\t\t\t\t<bpmn:task id="Activity_${id_op}" name="${op_name}">\t\t\t\t<bpmn:incoming>${flow_start}</bpmn:incoming>\t\t\t\t<bpmn:outgoing>${flow_next}</bpmn:outgoing>\t\t\t\t</bpmn:task>\t\t\t\t<bpmn:sequenceFlow id="${flow_start}" sourceRef="${flow_prec}" targetRef="Activity_${id_op}" />`;
        
            const istar_operation = {};

            istar_operation.id = id_op;
            istar_operation.text = op_name;
            istar_operation.type = "istar.Task";
            istar_operation.x = i;
            istar_operation.y = 140;
            istar_operation.customProperties = {
                "Description": ""
              }
 

              istar_operations.push(istar_operation);


              let op_goal = op[2].trim();
              console.log("goalll:",op_goal);
  
              if(op_ass!="none"){
                      if(blockType == "custom_resource" || blockType == "custom_tool") {
                        console.log("associationnn"+op_ass);
    
                        const istar_res = {};
                            istar_res.id = id_op + "_res";
                            istar_res.text = op_ass;                 
                            istar_res.type = "istar.Resource";
                            istar_res.x = i;
                            istar_res.y = 200;
                            istar_res.customProperties = {
                              "Description": ""}
                            istar_operations.push(istar_res);
                          }
              
              if(blockType == "custom_actor" || blockType == "custom_digital" || blockType == "custom_digital_component") {
                  const istar_dep = {};
                  istar_dep.id = id_op + "_dep";
                  istar_dep.text = op_name;
                  istar_dep.type = "istar.Task"; 
                  istar_dep.x = i + 50;
                  istar_dep.y = 140;
                  istar_dep.customProperties = {
                    "Description": ""};
                  istar_dep.source = text_name;
                  istar_dep.target = op_ass;
                arrayistardependencies.push(istar_dep);
                  }                       

                             if(op_goal!="..............." && op_goal!=""){                 
                              const istar_goal = {};
                              istar_goal.id = id_op + "_goal";
                              istar_goal.text = op_goal;
                              istar_goal.type = "istar.Goal";
                              istar_goal.x = i;
                              istar_goal.y = 80;
                              istar_goal.customProperties = {
                                "Description": ""
                              }
                              istar_operations.push(istar_goal);
                            }  
                          }
                                                     
               else {

 
                if(op_goal!="..............." && op_goal!=""){
                  const istar_goal = {};
                  istar_goal.id = id_op + "_goal";
                  istar_goal.text = op_goal;
                  istar_goal.type = "istar.Goal";
                  istar_goal.x = i;
                  istar_goal.y = 80;
                  istar_goal.customProperties = {
                    "Description": ""
                  }
                  istar_operations.push(istar_goal);
                }               

              }

               i += 120;   
               
              flow_prec = `Activity_${id_op}`;
              flow_start = `Flow_${id_op}`;
              const ass_names = op_ass.split(',');           
              var code_associations = new String();            
              ass_names.forEach((name) => {              
                if(name.charCodeAt(0) != 46 && name != ''){   
                  
                  
                  if(ass_agg_AlreadyInWs(name.trim().toLowerCase())){
                    console.log('crea associazione');
      
                  var member_code = `\\t\\t\\t\\t<ownedMember name=\"${op_name}\" xmi:id=\"${generateRandID()}\" xmi:type=\"uml:Association\">\\n`;
                  var id_first_end = generateRandID();
                  var first_end_code = `\\t\\t\\t\\t\\t<ownedEnd xmi:id=\"${id_first_end}\" xmi:type=\"uml:Property\" type=\"${id}\" name=\"${text_name}\">\\n`;
                  var ext_code = `\\t\\t\\t\\t\\t\\t<xmi:Extension extender=\"StarUML\">\\n\\t\\t\\t\\t\\t\\t\\t<stereotype value=\"\"/>\\n\\t\\t\\t\\t\\t\\t</xmi:Extension>\\n`;
                  var id_second_end = generateRandID();
                  var id_other_class = generateID(name);
                  var second_end_code = `\\t\\t\\t\\t\\t<ownedEnd xmi:id=\"${id_second_end}\" xmi:type=\"uml:Property\" type=\"${id_other_class}\" name=\"${name.trim()}\">\\n`;
                  var close_end = `\\t\\t\\t\\t\\t</ownedEnd>\\n`;
                  var first_member_end_code = `\\t\\t\\t\\t\\t<memberEnd xmi:idref=\"${id_first_end}\"/>\\n`;
                  var second_member_end_code = `\\t\\t\\t\\t\\t<memberEnd xmi:idref=\"${id_second_end}\"/>\\n`;
                  var close_member_code = `\\t\\t\\t\\t</ownedMember>\\n`;                 
                  var name_ass_code = `${member_code}${first_end_code}${ext_code}${close_end}${second_end_code}${ext_code}${close_end}${first_member_end_code}${second_member_end_code}${close_member_code}`;
                  code_associations = code_associations + name_ass_code;
                  //Chiara added
                  if(blockType == "custom_actor" || blockType == "custom_digital" || blockType == "custom_digital_component" ) {
                    var messageFlowId = generateRandID();
                    messageflow += `\\t\\t\\t\\t<messageFlow id=\"Flow_${messageFlowId}\" name=\"${op_name}\" sourceRef=\"Activity_${id_op}\" targetRef=\"${name}\" />`;
                   }
                   //end Chiara added
                   }
                   
          
                }
                });
                

               code_op_ass = code_op_ass + code_op + code_associations;

               bpmnstatement_operations += code_op_bpmn;
   
          }
              });           
              
            
           
          bpmnstatement_operations +=  `\t\t\t\t<bpmn:intermediateThrowEvent id="Event_1xxqcqf">\t\t\t\t<bpmn:incoming>${flow_next}</bpmn:incoming>\t\t\t\t</bpmn:intermediateThrowEvent>\t\t\t\t<bpmn:sequenceFlow id="${flow_next}" sourceRef="Activity_${id_op}" targetRef="Event_1xxqcqf" />`;



        const attributes = statements_attributes.split(',');
        var code_attributes = new String();
        attributes.forEach((attribute) => {
          if(attribute != ''){
            var id_attr = generateID(attribute);
            var code_att = `\t\t\t\t<ownedAttribute xmi:id="${id_attr}" name="${attribute.trim()}" xmi:type="uml:Property"/>\n`;
            code_attributes = code_attributes + code_att;
          }
        })

        var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="${text_name}" xmi:type="uml:Class">\n${code_attributes}`;
        var close_pack_code = `\t\t\t</packagedElement>\n`;
  
        setReport(id, createReport(text_name, statements_operations, statements_attributes, '', ''));

        var bpmnstatement = `${opentag}${messageflow}${processtart}${bpmnstatement_operations}${closetag}`;
  

        setBPMN(text_name, bpmnstatement);


        var actoritem = {};
        actoritem.id = text_name;
        actoritem.text = text_name;
        actoritem.type = "istar.Actor";
        actoritem.x = 15;
        actoritem.y = 10;
        actoritem.customProperties = { "description" : ""};
        actoritem.nodes = istar_operations;

        console.log("Actors", JSON.stringify(istar_operations));
        console.log("ActorsItem", JSON.stringify(actoritem));


        let isNotInArray = arrayistaractors.every(item => item.name !== actoritem.text);

        if (isNotInArray) {
          arrayistaractors.push(actoritem);
          console.log("arrayistaractors ",arrayistaractors)

        } 



        var code = `${pack_code}${code_op_ass}${close_pack_code}`;

        return code;
      }
      else{
        window.alert('A block with this name already exists');
        let existingBlockType = getAlreadyInWsBlockType(text_name.toLowerCase());
        if(block.type == existingBlockType){
          removeLastTypedBlock(block.type);
        }
        else{
          removeLastTypedBlock(existingBlockType);
        }
      }
      
      }
      else{
        return '';
      }
  }
      else{
        window.alert('Positioning error. Insert the block in the corresponding space');
        block.dispose(true);
      }
  }

// ------------------------------------------------------------- ATTRIBUTI ------------------------------------------------------------- //

generator['custom_attribute'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  if(block.getParent() !== null){
    if(text_name.charCodeAt(0) != 46 && text_name != ''){
      var code =  `${text_name},`;
      return code;
    }
    else{
      return '';
    }
  }
  else{
    window.alert('Positioning error. Insert the block in the corresponding space');
    block.dispose(true);
  }
};




// ------------------------------------------------------------- OPERAZIONI ------------------------------------------------------------- //


generator['custom_operation'] = function(block) {
  if(block.getParent() !== null){
    var text_name = block.getFieldValue('NAME');
    var text_motivation = block.getFieldValue('MOTIVATION'); //da usare nel report
    var text_associations = block.getFieldValue('ASSOCIATIONS');

    if(text_name.charCodeAt(0) != 46 && text_name != ''){
      var code = `${text_name};${text_associations};${text_motivation}:`;
      return code;
    }
    else{
      return '';
    }
  }
  else{
    window.alert('Positioning error. Insert the block in the corresponding space');
    block.dispose(true);
  }
};

/* Chiara added */
/* Disabled 
generator['parallel_gateway'] = function(block) {
  if(block.getParent() !== null){
    var text_name = block.getFieldValue('NAME');
    var text_motivation = block.getFieldValue('MOTIVATION'); //da usare nel report
    var text_associations = block.getFieldValue('ASSOCIATIONS');

    if(text_name.charCodeAt(0) != 46 && text_name != ''){
      var code = `${text_name};${text_associations};${text_motivation}:`;
      return code;
    }
    else{
      return '';
    }
  }
  else{
    window.alert('Positioning error. Insert the block in the corresponding space');
    block.dispose(true);
  }
};

generator['exclusive_gateway'] = function(block) {
  if(block.getParent() !== null){
    var text_name = block.getFieldValue('NAME');
    var text_motivation = block.getFieldValue('MOTIVATION'); //da usare nel report
    var text_associations = block.getFieldValue('ASSOCIATIONS');

    if(text_name.charCodeAt(0) != 46 && text_name != ''){
      var code = `${text_name};${text_associations};${text_motivation}:`;
      return code;
    }
    else{
      return '';
    }
  }
  else{
    window.alert('Positioning error. Insert the block in the corresponding space');
    block.dispose(true);
  }
};

generator['conditional_gateway'] = function(block) {
  if(block.getParent() !== null){
    var text_name = block.getFieldValue('NAME');
    var text_motivation = block.getFieldValue('MOTIVATION'); //da usare nel report
    var text_associations = block.getFieldValue('ASSOCIATIONS');

    if(text_name.charCodeAt(0) != 46 && text_name != ''){
      var code = `${text_name};${text_associations};${text_motivation}:`;
      return code;
    }
    else{
      return '';
    }
  }
  else{
    window.alert('Positioning error. Insert the block in the corresponding space');
    block.dispose(true);
  }
};
end disabled */
/* Chiara end added */


// ------------------------------------------------------------- RISORSE NATURALI ------------------------------------------------------------- //

generator['custom_resource'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  if(block.getParent() !== null){
    if(text_name.charCodeAt(0) != 46 && text_name != ''){
      if(!blockAlreadyInWs(text_name.toLowerCase())){
        var id = generateID(text_name.toLowerCase()); 
        var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
        var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');

        const operations = statements_operations.split(":");
        var code_op_ass = new String();

        operations.forEach((operation) => {
          if(operation != ''){
            const op = operation.split(";");
            let op_name = op[0].trim();
            var id_op = generateID(op_name);

            const code_op = `\t\t\t\t<ownedOperation xmi:id="${id_op}" name="${op_name}" xmi:type="uml:Operation"/>\n`;

            let op_associations = op[1];
            const ass_names = op_associations.split(',');
            var code_associations = new String();

            ass_names.forEach((name) => {
              if(name.charCodeAt(0) != 46 && name != ''){ 
                if(ass_agg_AlreadyInWs(name.trim().toLowerCase())){
                  var member_code = `\t\t\t\t<ownedMember xmi:id="${generateRandID()}" xmi:type="uml:Association">\n`;
                  var id_first_end = generateRandID();
                  var first_end_code = `\t\t\t\t\t<ownedEnd xmi:id="${id_first_end}" xmi:type="uml:Property" type="${id}">\n`;
                  var ext_code = `\t\t\t\t\t\t<xmi:Extension extender="StarUML">\n\t\t\t\t\t\t\t<stereotype value=""/>\n\t\t\t\t\t\t</xmi:Extension>\n`;
                  var id_second_end = generateRandID();
                  var id_other_class = generateID(name);
                  var second_end_code = `\t\t\t\t\t<ownedEnd xmi:id="${id_second_end}" xmi:type="uml:Property" type="${id_other_class}">\n`;
                  var close_end = `\t\t\t\t\t</ownedEnd>\n`;
                  var first_member_end_code = `\t\t\t\t\t<memberEnd xmi:idref="${id_first_end}"/>\n`;
                  var second_member_end_code = `\t\t\t\t\t<memberEnd xmi:idref="${id_second_end}"/>\n`;
                  var close_member_code = `\t\t\t\t</ownedMember>\n`;
                  var name_ass_code = `${member_code}${first_end_code}${ext_code}${close_end}${second_end_code}${ext_code}${close_end}${first_member_end_code}${second_member_end_code}${close_member_code}`;
                  code_associations = code_associations + name_ass_code;
                }
              }  
            })
            code_op_ass = code_op_ass + code_op + code_associations;
          }
        })

        const attributes = statements_attributes.split(',');
        var code_attributes = new String();
        attributes.forEach((attribute) => {
          if(attribute != ''){
            var id_attr = generateID(attribute);
            var code_att = `\t\t\t\t<ownedAttribute xmi:id="${id_attr}" name="${attribute.trim()}" xmi:type="uml:Property"/>\n`;
            code_attributes = code_attributes + code_att;
          }
        })

        var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="${text_name}" xmi:type="uml:Class">\n${code_attributes}`;
        var close_pack_code = `\t\t\t</packagedElement>\n`;

        var statements_generalizations = javascriptGenerator.statementToCode(block, 'GENERALIZATIONS');
        const gen_names = statements_generalizations.split(";"); //nomi delle sottoclassi separati da ';'
        var code_generalizations = new String();

        //per ogni generalizzazione inserita creo la sottoclasse corrispondente legata all'id della super classe
        gen_names.forEach((name) => {
          if(name != ''){
            var id_spec = generateID(name); //id della sotto classe
            var gen = `\t\t\t\t<generalization xmi:id="${generateRandID()}" xmi:type="uml:Generalization" specific="${id_spec}" general="${id}"/>\n`;
            var pack_gen = `\t\t\t<packagedElement xmi:id="${id_spec}" name="${name.trim()}" xmi:type="uml:Class">\n${gen}\t\t\t</packagedElement>\n`;
            code_generalizations = code_generalizations + pack_gen;
          }
        })

        setReport(id, createReport(text_name, statements_operations, statements_attributes, statements_generalizations, ''));

        var code = `${pack_code}${code_op_ass}${close_pack_code}${code_generalizations}`;
        return code;
      }
      else{
        window.alert('A block with this name already exists');
        let existingBlockType = getAlreadyInWsBlockType(text_name.toLowerCase());
        if(block.type == existingBlockType){
          removeLastTypedBlock(block.type);
        }
        else{
          removeLastTypedBlock(existingBlockType);
        }
      }
    }
    else{
      return '';
    }
  }
  else{
    window.alert('Positioning error. Insert the block in the corresponding space');
    block.dispose(true);
  }
};



// ------------------------------------------------------------- STRUMENTI DIGITALI ------------------------------------------------------------- //

generator['custom_digital'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  if(block.getParent() !== null){
    if(text_name.charCodeAt(0) != 46 && text_name != ''){
      if(!blockAlreadyInWs(text_name.toLowerCase())){
        var id = generateID(text_name);
        var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
        var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');

        const operations = statements_operations.split(":");
        var code_op_ass = new String();

        operations.forEach((operation) => {
          if(operation != ''){
            const op = operation.split(";");
            let op_name = op[0].trim();
            var id_op = generateID(op_name);

            const code_op = `\t\t\t\t<ownedOperation xmi:id="${id_op}" name="${op_name}" xmi:type="uml:Operation"/>\n`;

            let op_associations = op[1];
            const ass_names = op_associations.split(',');
            var code_associations = new String();

            ass_names.forEach((name) => {
              if(name.charCodeAt(0) != 46 && name != ''){ 
                if(ass_agg_AlreadyInWs(name.trim().toLowerCase())){
                  var member_code = `\t\t\t\t<ownedMember xmi:id="${generateRandID()}" xmi:type="uml:Association">\n`;
                  var id_first_end = generateRandID();
                  var first_end_code = `\t\t\t\t\t<ownedEnd xmi:id="${id_first_end}" xmi:type="uml:Property" type="${id}">\n`;
                  var ext_code = `\t\t\t\t\t\t<xmi:Extension extender="StarUML">\n\t\t\t\t\t\t\t<stereotype value=""/>\n\t\t\t\t\t\t</xmi:Extension>\n`;
                  var id_second_end = generateRandID();
                  var id_other_class = generateID(name);
                  var second_end_code = `\t\t\t\t\t<ownedEnd xmi:id="${id_second_end}" xmi:type="uml:Property" type="${id_other_class}">\n`;
                  var close_end = `\t\t\t\t\t</ownedEnd>\n`;
                  var first_member_end_code = `\t\t\t\t\t<memberEnd xmi:idref="${id_first_end}"/>\n`;
                  var second_member_end_code = `\t\t\t\t\t<memberEnd xmi:idref="${id_second_end}"/>\n`;
                  var close_member_code = `\t\t\t\t</ownedMember>\n`;
                  var name_ass_code = `${member_code}${first_end_code}${ext_code}${close_end}${second_end_code}${ext_code}${close_end}${first_member_end_code}${second_member_end_code}${close_member_code}`;
                  code_associations = code_associations + name_ass_code;
                }
              }  
            })
            code_op_ass = code_op_ass + code_op + code_associations;
          }
        })

        const attributes = statements_attributes.split(',');
        var code_attributes = new String();
        attributes.forEach((attribute) => {
          if(attribute != ''){
            var id_attr = generateID(attribute);
            var code_att = `\t\t\t\t<ownedAttribute xmi:id="${id_attr}" name="${attribute.trim()}" xmi:type="uml:Property"/>\n`;
            code_attributes = code_attributes + code_att;
          }
        })

        var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="${text_name}" xmi:type="uml:Class">\n${code_attributes}`;
        var close_pack_code = `\t\t\t</packagedElement>\n`;
        
        setReport(id, createReport(text_name, statements_operations, statements_attributes, '', ''));

        var code = `${pack_code}${code_op_ass}${close_pack_code}`;
        return code;
      }
      else{
        window.alert('A block with this name already exists');
        let existingBlockType = getAlreadyInWsBlockType(text_name.toLowerCase());
        if(block.type == existingBlockType){
          removeLastTypedBlock(block.type);
        }
        else{
          removeLastTypedBlock(existingBlockType);
        }
      }
    }
    else{
      return '';
    }
  }
  else{
    window.alert('Positioning error. Insert the block in the corresponding space');
    block.dispose(true);
  }
};

generator['custom_digital_component'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  if(block.getParent() !== null){
    if(text_name.charCodeAt(0) != 46 && text_name != ''){
      if(!blockAlreadyInWs(text_name.toLowerCase())){
        var id = generateID(text_name);
        var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
        var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');

        const operations = statements_operations.split(":");
        var code_op_ass = new String();

        operations.forEach((operation) => {
          if(operation != ''){
            const op = operation.split(";");
            let op_name = op[0].trim();
            var id_op = generateID(op_name);

            const code_op = `\t\t\t\t<ownedOperation xmi:id="${id_op}" name="${op_name}" xmi:type="uml:Operation"/>\n`;

            let op_associations = op[1];
            const ass_names = op_associations.split(',');
            var code_associations = new String();

            ass_names.forEach((name) => {
              if(name.charCodeAt(0) != 46 && name != ''){ 
                if(ass_agg_AlreadyInWs(name.trim().toLowerCase())){
                  var member_code = `\t\t\t\t<ownedMember xmi:id="${generateRandID()}" xmi:type="uml:Association">\n`;
                  var id_first_end = generateRandID();
                  var first_end_code = `\t\t\t\t\t<ownedEnd xmi:id="${id_first_end}" xmi:type="uml:Property" type="${id}">\n`;
                  var ext_code = `\t\t\t\t\t\t<xmi:Extension extender="StarUML">\n\t\t\t\t\t\t\t<stereotype value=""/>\n\t\t\t\t\t\t</xmi:Extension>\n`;
                  var id_second_end = generateRandID();
                  var id_other_class = generateID(name);
                  var second_end_code = `\t\t\t\t\t<ownedEnd xmi:id="${id_second_end}" xmi:type="uml:Property" type="${id_other_class}">\n`;
                  var close_end = `\t\t\t\t\t</ownedEnd>\n`;
                  var first_member_end_code = `\t\t\t\t\t<memberEnd xmi:idref="${id_first_end}"/>\n`;
                  var second_member_end_code = `\t\t\t\t\t<memberEnd xmi:idref="${id_second_end}"/>\n`;
                  var close_member_code = `\t\t\t\t</ownedMember>\n`;
                  var name_ass_code = `${member_code}${first_end_code}${ext_code}${close_end}${second_end_code}${ext_code}${close_end}${first_member_end_code}${second_member_end_code}${close_member_code}`;
                  code_associations = code_associations + name_ass_code;
                }
              }  
            })
            code_op_ass = code_op_ass + code_op + code_associations;
          }
        })

        var text_aggregation = block.getFieldValue('AGGREGATION');
        var code_aggregation = new String();
        if(text_aggregation.charCodeAt(0) != 46 && text_aggregation != '' && ass_agg_AlreadyInWs(text_aggregation.toLowerCase())){
          var member_code = `\t\t\t\t<ownedMember xmi:id="${generateRandID()}" xmi:type="uml:Association">\n`;
          var id_first_end = generateRandID();
          var first_end_code = `\t\t\t\t\t<ownedEnd xmi:id="${id_first_end}" xmi:type="uml:Property" aggregation="shared" type="${id}">\n`;
          var ext_code = `\t\t\t\t\t\t<xmi:Extension extender="StarUML">\n\t\t\t\t\t\t\t<stereotype value=""/>\n\t\t\t\t\t\t</xmi:Extension>\n`;
          var id_second_end = generateRandID();
          var id_other_class = generateID(text_aggregation);
          var second_end_code = `\t\t\t\t\t<ownedEnd xmi:id="${id_second_end}" xmi:type="uml:Property" type="${id_other_class}">\n`;
          var close_end = `\t\t\t\t\t</ownedEnd>\n`;
          var first_member_end_code = `\t\t\t\t\t<memberEnd xmi:idref="${id_first_end}"/>\n`;
          var second_member_end_code = `\t\t\t\t\t<memberEnd xmi:idref="${id_second_end}"/>\n`;
          var close_member_code = `\t\t\t\t</ownedMember>\n`;
          code_aggregation = `${member_code}${first_end_code}${ext_code}${close_end}${second_end_code}${ext_code}${close_end}${first_member_end_code}${second_member_end_code}${close_member_code}`;
          //window.alert('OK! Existing block correctly identified');
        }

        const attributes = statements_attributes.split(',');
        var code_attributes = new String();
        attributes.forEach((attribute) => {
          if(attribute != ''){
            var id_attr = generateID(attribute);
            var code_att = `\t\t\t\t<ownedAttribute xmi:id="${id_attr}" name="${attribute.trim()}" xmi:type="uml:Property"/>\n`;
            code_attributes = code_attributes + code_att;
          }
        })

        var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="${text_name}" xmi:type="uml:Class">\n${code_attributes}`;
        var close_pack_code = `\t\t\t</packagedElement>\n`;

        setReport(id, createReport(text_name, statements_operations, statements_attributes, '', text_aggregation));
       
        var code = `${pack_code}${code_op_ass}${code_aggregation}${close_pack_code}`;
        return code;
      }
      else{
        window.alert('A block with this name already exists');
        let existingBlockType = getAlreadyInWsBlockType(text_name.toLowerCase());
        if(block.type == existingBlockType){
          removeLastTypedBlock(block.type);
        }
        else{
          removeLastTypedBlock(existingBlockType);
        }
      }
    }
    else{
      return '';
    }
  }
  else{
    window.alert('Positioning error. Insert the block in the corresponding space');
    block.dispose(true);
  }
};


// ------------------------------------------------------------- STRUMENTI ------------------------------------------------------------- //

generator['custom_tool'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  if(block.getParent() !== null){
    if(text_name.charCodeAt(0) != 46 && text_name != ''){
      if(!blockAlreadyInWs(text_name.toLowerCase())){
        var id = generateID(text_name.toLowerCase()); 
        var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
        var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');

        const operations = statements_operations.split(":");
        var code_op_ass = new String();

        operations.forEach((operation) => {
          if(operation != ''){
            const op = operation.split(";");
            let op_name = op[0].trim();
            var id_op = generateID(op_name);

            const code_op = `\t\t\t\t<ownedOperation xmi:id="${id_op}" name="${op_name}" xmi:type="uml:Operation"/>\n`;

            let op_associations = op[1];
            const ass_names = op_associations.split(',');
            var code_associations = new String();

            ass_names.forEach((name) => {
              if(name.charCodeAt(0) != 46 && name != ''){  
                if(ass_agg_AlreadyInWs(name.trim().toLowerCase())){
                  var member_code = `\t\t\t\t<ownedMember xmi:id="${generateRandID()}" xmi:type="uml:Association">\n`;
                  var id_first_end = generateRandID();
                  var first_end_code = `\t\t\t\t\t<ownedEnd xmi:id="${id_first_end}" xmi:type="uml:Property" type="${id}">\n`;
                  var ext_code = `\t\t\t\t\t\t<xmi:Extension extender="StarUML">\n\t\t\t\t\t\t\t<stereotype value=""/>\n\t\t\t\t\t\t</xmi:Extension>\n`;
                  var id_second_end = generateRandID();
                  var id_other_class = generateID(name);
                  var second_end_code = `\t\t\t\t\t<ownedEnd xmi:id="${id_second_end}" xmi:type="uml:Property" type="${id_other_class}">\n`;
                  var close_end = `\t\t\t\t\t</ownedEnd>\n`;
                  var first_member_end_code = `\t\t\t\t\t<memberEnd xmi:idref="${id_first_end}"/>\n`;
                  var second_member_end_code = `\t\t\t\t\t<memberEnd xmi:idref="${id_second_end}"/>\n`;
                  var close_member_code = `\t\t\t\t</ownedMember>\n`;
                  var name_ass_code = `${member_code}${first_end_code}${ext_code}${close_end}${second_end_code}${ext_code}${close_end}${first_member_end_code}${second_member_end_code}${close_member_code}`;
                  code_associations = code_associations + name_ass_code;
                }
              }  
            })
            code_op_ass = code_op_ass + code_op + code_associations;
          }
        })

        const attributes = statements_attributes.split(',');
        var code_attributes = new String();
        attributes.forEach((attribute) => {
          if(attribute != ''){
            var id_attr = generateID(attribute);
            var code_att = `\t\t\t\t<ownedAttribute xmi:id="${id_attr}" name="${attribute.trim()}" xmi:type="uml:Property"/>\n`;
            code_attributes = code_attributes + code_att;
          }
        })

        var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="${text_name}" xmi:type="uml:Class">\n${code_attributes}`;
        var close_pack_code = `\t\t\t</packagedElement>\n`;

        var statements_generalizations = javascriptGenerator.statementToCode(block, 'GENERALIZATIONS');
        const gen_names = statements_generalizations.split(";"); //nomi delle sottoclassi separati da ';'
        var code_generalizations = new String();

        //per ogni generalizzazione inserita creo la sottoclasse corrispondente legata all'id della super classe
        gen_names.forEach((name) => {
          if(name != ''){
            var id_spec = generateID(name); //id della sotto classe
            var gen = `\t\t\t\t<generalization xmi:id="${generateRandID()}" xmi:type="uml:Generalization" specific="${id_spec}" general="${id}"/>\n`;
            var pack_gen = `\t\t\t<packagedElement xmi:id="${id_spec}" name="${name.trim()}" xmi:type="uml:Class">\n${gen}\t\t\t</packagedElement>\n`;
            code_generalizations = code_generalizations + pack_gen;
          }
        })

        setReport(id, createReport(text_name, statements_operations, statements_attributes, statements_generalizations, ''));
       
        var code = `${pack_code}${code_op_ass}${close_pack_code}${code_generalizations}`;
        return code;
      }
      else{
        window.alert('A block with this name already exists');
        let existingBlockType = getAlreadyInWsBlockType(text_name.toLowerCase());
        if(block.type == existingBlockType){
          removeLastTypedBlock(block.type);
        }
        else{
          removeLastTypedBlock(existingBlockType);
        }
      }
    }
    else{
      return '';
    }
  }
  else{
    window.alert('Positioning error. Insert the block in the corresponding space');
    block.dispose(true);
  }
};

// ------------------------------------------------------------- GENERALIZZAZIONI ------------------------------------------------------------- //

// la generalizzazione restituisce solo il nome
generator['custom_generalization'] = function(block) {
  var text_name = block.getFieldValue('NAME');  
  if(block.getParent() !== null){
    if(text_name.charCodeAt(0) != 46 && text_name != ''){
      if(!blockAlreadyInWs(text_name.toLowerCase())){
        var code = `${text_name};`;
        return code;
      }
      else{
        window.alert('A block with this name already exists');
        let existingBlockType = getAlreadyInWsBlockType(text_name.toLowerCase());
        if(block.type == existingBlockType){
          removeLastTypedBlock(block.type);
        }
        else{
          removeLastTypedBlock(existingBlockType);
        }
      }
    }
    else{
      return '';
    }
  }
  else{
    window.alert('Positioning error. Insert the block in the corresponding space');
    block.dispose(true);
  }
};