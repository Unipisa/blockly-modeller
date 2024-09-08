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


  // const titleField = document.getElementById('customTitle');
  // titleField.addEventListener('change', ()=>{ 
  //   let reportDiv = document.getElementById('codeOutputReport');
  //   let title = titleField.innerText;
  //   let newdiv = document.createElement('div');
  //   newdiv.innerHTML = `<u>${title.toUpperCase()} diagram entities:</u><br>`;
  //   reportDiv.prepend(newdiv);
    
  // })
});