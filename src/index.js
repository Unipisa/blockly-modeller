import Blockly from 'blockly';
//import { blocklyInit } from './blocks/index.js'
import { addChangeListener, addUiEventListener, addBlockDeleteChangeListener } from './listeners';
import { onTextFieldChange } from './utils/blockUtils.js';
import { xmlText } from './blocks/workspace.js';
import { runCode, ws } from './runner/runner.js';

//blocklyInit()

document.addEventListener('DOMContentLoaded', () => {
  //Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xmlText), ws);
  //runCode();

  //addChangeListener();
  //addUiEventListener();
  //addBlockDeleteChangeListener();

  const textField = document.getElementById('textField');
  if (textField) {
    textField.addEventListener('change', onTextFieldChange);
  }

});