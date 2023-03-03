/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {javascriptGenerator} from 'blockly/javascript';
import {getBlocksInWS} from'../index.js';

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!


export const generator = Object.create(null);
//const report = new String();

const classSet = new Set(); //insieme delle classi create
  
function insertClass(nomeClasse) {
  nomeClasse = nomeClasse.trim().toLowerCase();
  if(nomeClasse != '...............') classSet.add(nomeClasse);
}

function existClass(nomeClasse) {
  nomeClasse = nomeClasse.trim().toLowerCase();
  return classSet.has(nomeClasse);
}


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



// ------------------------------------------------------------- SCHEMA ------------------------------------------------------------- //

generator['info'] = function(block) {
  var statements_actors = javascriptGenerator.statementToCode(block, 'ACTORS');
  var statements_natural_resources = javascriptGenerator.statementToCode(block, 'NATURAL_RESOURCES');
  var statements_tool = javascriptGenerator.statementToCode(block, 'TOOL');
  var statements_digital_tool = javascriptGenerator.statementToCode(block, 'DIGITAL_TOOL');
  
  var xml_data = '<?xml version="1.0" encoding="UTF-8"?>\n';
  var xmi_data = '<xmi:XMI xmi:version="2.1" xmlns:uml="http://schema.omg.org/spec/UML/2.0" xmlns:xmi="http://schema.omg.org/spec/XMI/2.1">\n';
  var doc_data = '\t<xmi:Documentation exporter="StarUML" exporterVersion="2.0"/>\n';
  var model_data = `\t<uml:Model xmi:id="${generateRandID()}" xmi:type="uml:Model" name="RootModel">\n`;
  var pack_data = `\t\t<packagedElement xmi:id="${generateRandID()}" name="BlocklyModel" visibility="public" xmi:type="uml:Model">\n`;
  var close_xmi_data = '</xmi:XMI>\n';
  var close_model_data = '\t</uml:Model>\n';
  var close_pack_data = '\t\t</packagedElement>\n';


  return `${xml_data}${xmi_data}${doc_data}${model_data}${pack_data}${statements_actors}${statements_natural_resources}${statements_tool}${statements_digital_tool}${close_pack_data}${close_model_data}${close_xmi_data}`;
};



// ------------------------------------------------------------- ATTORI ------------------------------------------------------------- //

generator['default_actor'] = function(block) {
  var dropdown_role = block.getFieldValue('ROLE');
  var id = generateID(dropdown_role);
  insertClass(dropdown_role);

  var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
  var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');

  const operations = statements_operations.split(".");
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
        if(existClass(name) && name.charCodeAt(0) != 46 && name != ''){ 
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
      })
      code_op_ass = code_op_ass + code_op + code_associations;
    }
  })
  
  var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="${dropdown_role}" xmi:type="uml:Class">\n${statements_attributes}`;
  var close_pack_code = `\t\t\t</packagedElement>\n`;
 
  var code = `${pack_code}${code_op_ass}${close_pack_code}`;
  return code;
};

generator['custom_actor'] = function(block) {
  var text_role = block.getFieldValue('ROLE');
  if(!existClass(text_role) && text_role.charCodeAt(0) != 46 && text_role != ''){
    var id = generateID(text_role);
    insertClass(text_role);

    var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
    var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');

    const operations = statements_operations.split(".");
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
          if(existClass(name) && name.charCodeAt(0) != 46 && name != ''){ 
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
        })
        code_op_ass = code_op_ass + code_op + code_associations;
      }
    })

    var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="${text_role}" xmi:type="uml:Class">\n${statements_attributes}`;
    var close_pack_code = `\t\t\t</packagedElement>\n`;
   
    var code = `${pack_code}${code_op_ass}${close_pack_code}`;
    return code;
  }
};



// ------------------------------------------------------------- ATTRIBUTI ------------------------------------------------------------- //

generator['username'] = function(block) {
  var id = generateID('username');
  var code = `\t\t\t\t<ownedAttribute xmi:id="${id}" name="username" xmi:type="uml:Property"/>\n`;
  return code;
};

generator['password'] = function(block) {
  var id = generateID('password');
  var code = `\t\t\t\t<ownedAttribute xmi:id="${id}" name="password" xmi:type="uml:Property"/>\n`;
  return code;
};

generator['custom_attribute'] = function(block) {
  var text_attribute = block.getFieldValue('ATTRIBUTE');
  if(text_attribute.charCodeAt(0) != 46 && text_attribute != ''){
    var id = generateID(text_attribute);
    var code =  `\t\t\t\t<ownedAttribute xmi:id="${id}" name="${text_attribute}" xmi:type="uml:Property"/>\n`;
    return code;
  }
};

generator['id'] = function(block) {
  var id = generateID('id');
  var code = `\t\t\t\t<ownedAttribute xmi:id="${id}" name="id" xmi:type="uml:Property"/>\n`;
  return code;
};

generator['coords'] = function(block) {
  var id = generateID('coords');
  var code = `\t\t\t\t<ownedAttribute xmi:id="${id}" name="coords" xmi:type="uml:Property"/>\n`;
  return code;
};

generator['area'] = function(block) {
  var id = generateID('area');
  var code = `\t\t\t\t<ownedAttribute xmi:id="${id}" name="area" xmi:type="uml:Property"/>\n`;
  return code;
};



// ------------------------------------------------------------- OPERAZIONI ------------------------------------------------------------- //

generator['login'] = function(block) {
  var code = `login; .`;
  return code;
};

generator['custom_operation'] = function(block) {
  var text_operation = block.getFieldValue('OPERATION');
  var text_motivation = block.getFieldValue('MOTIVATION'); //da usare nel report
  var text_associations = block.getFieldValue('ASSOCIATIONS');

  if(text_operation.charCodeAt(0) != 46 && text_operation != ''){
    var code = `${text_operation};${text_associations}.`;
    return code;
  }
};



// ------------------------------------------------------------- RISORSE NATURALI ------------------------------------------------------------- //

generator['field_resource'] = function(block) {
  var id = generateID('field'); 
  insertClass('field');

  var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
  var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');

  const operations = statements_operations.split(".");
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
        if(existClass(name) && name.charCodeAt(0) != 46 && name != ''){ 
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
      })
      code_op_ass = code_op_ass + code_op + code_associations;
    }
  })

  var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="Field" xmi:type="uml:Class">\n${statements_attributes}`;
  var close_pack_code = `\t\t\t</packagedElement>\n`;
 
  var code = `${pack_code}${code_op_ass}${close_pack_code}`;
  return code;
};


generator['water_resource'] = function(block) {
  var id = generateID('water'); 
  insertClass('water');

  var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
  var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');

  const operations = statements_operations.split(".");
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
        if(existClass(name) && name.charCodeAt(0) != 46 && name != ''){ 
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
      })
      code_op_ass = code_op_ass + code_op + code_associations;
    }
  })

  var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="Water" xmi:type="uml:Class">\n${statements_attributes}`;
  var close_pack_code = `\t\t\t</packagedElement>\n`;

  var statements_generalizations = javascriptGenerator.statementToCode(block, 'GENERALIZATIONS');
  const gen_names = statements_generalizations.split(";"); //nomi delle sottoclassi separati da ';'
  var code_generalizations = new String();

  //per ogni generalizzazione inserita creo la sottoclasse corrispondente legata all'id della super classe
  gen_names.forEach((name) => {
    if(!existClass(name) && name != ''){
      var id_spec = generateID(name); //id della sotto classe
      var gen = `\t\t\t\t<generalization xmi:id="${generateRandID()}" xmi:type="uml:Generalization" specific="${id_spec}" general="${id}"/>\n`;
      var pack_gen = `\t\t\t<packagedElement xmi:id="${id_spec}" name="${name.trim()}" xmi:type="uml:Class">\n${gen}\t\t\t</packagedElement>\n`;
      code_generalizations = code_generalizations + pack_gen;
      insertClass(name);
    }
  })
 
  var code = `${pack_code}${code_op_ass}${close_pack_code}${code_generalizations}`;
  return code;
};

generator['custom_resource'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  if(text_name.charCodeAt(0) != 46 && text_name != ''){
    var id = generateID(text_name); 
    insertClass(text_name);

    var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
    var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');

    const operations = statements_operations.split(".");
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
          if(existClass(name) && name.charCodeAt(0) != 46 && name != ''){ 
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
        })
        code_op_ass = code_op_ass + code_op + code_associations;
      }
    })

    var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="${text_name}" xmi:type="uml:Class">\n${statements_attributes}`;
    var close_pack_code = `\t\t\t</packagedElement>\n`;

    var statements_generalizations = javascriptGenerator.statementToCode(block, 'GENERALIZATIONS');
    const gen_names = statements_generalizations.split(";"); //nomi delle sottoclassi separati da ';'
    var code_generalizations = new String();

    //per ogni generalizzazione inserita creo la sottoclasse corrispondente legata all'id della super classe
    gen_names.forEach((name) => {
      if(!existClass(name) && name != ''){
        var id_spec = generateID(name); //id della sotto classe
        var gen = `\t\t\t\t<generalization xmi:id="${generateRandID()}" xmi:type="uml:Generalization" specific="${id_spec}" general="${id}"/>\n`;
        var pack_gen = `\t\t\t<packagedElement xmi:id="${id_spec}" name="${name.trim()}" xmi:type="uml:Class">\n${gen}\t\t\t</packagedElement>\n`;
        code_generalizations = code_generalizations + pack_gen;
        insertClass(name);
      }
    })
   
    var code = `${pack_code}${code_op_ass}${close_pack_code}${code_generalizations}`;
    return code;
  }
};



// ------------------------------------------------------------- STRUMENTI DIGITALI ------------------------------------------------------------- //

generator['dss_infrastructure'] = function(block) {
  var id = generateID('dss infrastructure'); 
  insertClass('dss infrastructure');

  var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
  var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');

  const operations = statements_operations.split(".");
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
        if(existClass(name) && name.charCodeAt(0) != 46 && name != ''){ 
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
      })
      code_op_ass = code_op_ass + code_op + code_associations;
    }
  })

  var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="DSS infrastructure" xmi:type="uml:Class">\n${statements_attributes}`;
  var close_pack_code = `\t\t\t</packagedElement>\n`;
 
  var code = `${pack_code}${code_op_ass}${close_pack_code}`;
  return code;
};

generator['custom_digital'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  if(text_name.charCodeAt(0) != 46 && text_name != ''){
    var id = generateID(text_name);
    insertClass(text_name);

    var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
    var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');

    const operations = statements_operations.split(".");
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
          if(existClass(name) && name.charCodeAt(0) != 46 && name != ''){ 
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
        })
        code_op_ass = code_op_ass + code_op + code_associations;
      }
    })

    var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="${text_name}" xmi:type="uml:Class">\n${statements_attributes}`;
    var close_pack_code = `\t\t\t</packagedElement>\n`;
   
    var code = `${pack_code}${code_op_ass}${close_pack_code}`;
    return code;
  }
};

generator['wsn'] = function(block) {
  var id = generateID('wsn'); 
  insertClass('wsn');

  var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
  var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');

  const operations = statements_operations.split(".");
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
        if(existClass(name) && name.charCodeAt(0) != 46 && name != ''){ 
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
      })
      code_op_ass = code_op_ass + code_op + code_associations;
    }
  })

  var text_aggregation = block.getFieldValue('AGGREGATION');
  var code_aggregation = new String();
  if(existClass(text_aggregation) && text_aggregation != ''){
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
    }

  var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="WSN" xmi:type="uml:Class">\n${statements_attributes}`;
  var close_pack_code = `\t\t\t</packagedElement>\n`;
 
  var code = `${pack_code}${code_op_ass}${code_aggregation}${close_pack_code}`;
  return code;
};

generator['dss_software'] = function(block) {
  var id = generateID('dss software'); 
  insertClass('dss software');

  var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
  var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');

  const operations = statements_operations.split(".");
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
        if(existClass(name) && name.charCodeAt(0) != 46 && name != ''){ 
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
      })
      code_op_ass = code_op_ass + code_op + code_associations;
    }
  })

  var text_aggregation = block.getFieldValue('AGGREGATION');
  var code_aggregation = new String();
  if(existClass(text_aggregation) && text_aggregation != ''){
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
    }

  var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="DSS software" xmi:type="uml:Class">\n${statements_attributes}`;
  var close_pack_code = `\t\t\t</packagedElement>\n`;
 
  var code = `${pack_code}${code_op_ass}${code_aggregation}${close_pack_code}`;
  return code;
};

generator['internet_gateway'] = function(block) {
  var id = generateID('internet gateway'); 
  insertClass('internet gateway');

  var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
  var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');

  const operations = statements_operations.split(".");
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
        if(existClass(name) && name.charCodeAt(0) != 46 && name != ''){ 
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
      })
      code_op_ass = code_op_ass + code_op + code_associations;
    }
  })

  var text_aggregation = block.getFieldValue('AGGREGATION');
  var code_aggregation = new String();
  if(existClass(text_aggregation) && text_aggregation != ''){
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
    }

  var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="Internet gateway" xmi:type="uml:Class">\n${statements_attributes}`;
  var close_pack_code = `\t\t\t</packagedElement>\n`;
 
  var code = `${pack_code}${code_op_ass}${code_aggregation}${close_pack_code}`;
  return code;
};

generator['custom_digital_component'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  if(text_name.charCodeAt(0) != 46 && text_name != ''){
    var id = generateID(text_name);
    insertClass(text_name);

    var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
    var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');

    const operations = statements_operations.split(".");
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
          if(existClass(name) && name.charCodeAt(0) != 46 && name != ''){ 
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
        })
        code_op_ass = code_op_ass + code_op + code_associations;
      }
    })

    var text_aggregation = block.getFieldValue('AGGREGATION');
    var code_aggregation = new String();
    if(existClass(text_aggregation) && text_aggregation != ''){
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
      }

    var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="${text_name}" xmi:type="uml:Class">\n${statements_attributes}`;
    var close_pack_code = `\t\t\t</packagedElement>\n`;
   
    var code = `${pack_code}${code_op_ass}${code_aggregation}${close_pack_code}`;
    return code;
  }
};




// ------------------------------------------------------------- STRUMENTI ------------------------------------------------------------- //

generator['irrigation_tool'] = function(block) {
 var id = generateID('irrigation tool'); 
  insertClass('irrigation tool');

  var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
  var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');

  const operations = statements_operations.split(".");
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
        if(existClass(name) && name.charCodeAt(0) != 46 && name != ''){  
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
      })
      code_op_ass = code_op_ass + code_op + code_associations;
    }
  })

  var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="Irrigation tool" xmi:type="uml:Class">\n${statements_attributes}`;
  var close_pack_code = `\t\t\t</packagedElement>\n`;

  var statements_generalizations = javascriptGenerator.statementToCode(block, 'GENERALIZATIONS');
  const gen_names = statements_generalizations.split(";"); //nomi delle sottoclassi separati da ';'
  var code_generalizations = new String();

  //per ogni generalizzazione inserita creo la sottoclasse corrispondente legata all'id della super classe
  gen_names.forEach((name) => {
    if(!existClass(name) && name != ''){
      var id_spec = generateID(name); //id della sotto classe
      var gen = `\t\t\t\t<generalization xmi:id="${generateRandID()}" xmi:type="uml:Generalization" specific="${id_spec}" general="${id}"/>\n`;
      var pack_gen = `\t\t\t<packagedElement xmi:id="${id_spec}" name="${name.trim()}" xmi:type="uml:Class">\n${gen}\t\t\t</packagedElement>\n`;
      code_generalizations = code_generalizations + pack_gen;
      insertClass(name);
    }
  })
 
  var code = `${pack_code}${code_op_ass}${close_pack_code}${code_generalizations}`;
  return code;
};

generator['custom_tool'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  if(text_name.charCodeAt(0) != 46 && text_name != ''){
    var id = generateID('irrigation tool'); 
    insertClass('irrigation tool');

    var statements_attributes = javascriptGenerator.statementToCode(block, 'ATTRIBUTES');
    var statements_operations = javascriptGenerator.statementToCode(block, 'OPERATIONS');

    const operations = statements_operations.split(".");
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
          if(existClass(name) && name.charCodeAt(0) != 46 && name != ''){  
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
        })
        code_op_ass = code_op_ass + code_op + code_associations;
      }
    })

    var pack_code = `\t\t\t<packagedElement xmi:id="${id}" name="${text_name}" xmi:type="uml:Class">\n${statements_attributes}`;
    var close_pack_code = `\t\t\t</packagedElement>\n`;

    var statements_generalizations = javascriptGenerator.statementToCode(block, 'GENERALIZATIONS');
    const gen_names = statements_generalizations.split(";"); //nomi delle sottoclassi separati da ';'
    var code_generalizations = new String();

    //per ogni generalizzazione inserita creo la sottoclasse corrispondente legata all'id della super classe
    gen_names.forEach((name) => {
      if(!existClass(name) && name != ''){
        var id_spec = generateID(name); //id della sotto classe
        var gen = `\t\t\t\t<generalization xmi:id="${generateRandID()}" xmi:type="uml:Generalization" specific="${id_spec}" general="${id}"/>\n`;
        var pack_gen = `\t\t\t<packagedElement xmi:id="${id_spec}" name="${name.trim()}" xmi:type="uml:Class">\n${gen}\t\t\t</packagedElement>\n`;
        code_generalizations = code_generalizations + pack_gen;
        insertClass(name);
      }
    })
   
    var code = `${pack_code}${code_op_ass}${close_pack_code}${code_generalizations}`;
    return code;
  }
};



// ------------------------------------------------------------- GENERALIZZAZIONI ------------------------------------------------------------- //

// la generalizzazione restituisce solo il nome
generator['dam'] = function(block) {
  insertClass(dam);
  var code = `Dam;`;
  return code;
};

// la generalizzazione restituisce solo il nome
generator['river'] = function(block) {
  insertClass('river');
  var code = `River;`;
  return code;
};

// la generalizzazione restituisce solo il nome
generator['well'] = function(block) {
  insertClass('well');
  var code = `Well;`;
  return code;
};

// la generalizzazione restituisce solo il nome
generator['dripper'] = function(block) {
  insertClass('dripper');
  var code = `Dripper;`;
  return code;
};

// la generalizzazione restituisce solo il nome
generator['Sprinkler'] = function(block) {
  insertClass('sprinkler');
  var code = `Sprinkler;`;
  return code;
};


// la generalizzazione restituisce solo il nome
generator['custom_generalization'] = function(block) {
  var text_generalization = block.getFieldValue('GENERALIZATION');  
  if(text_generalization.charCodeAt(0) != 46 && text_generalization != ''){
    insertClass(text_generalization);
    var code = `${text_generalization};`;
    return code;
  }
};


