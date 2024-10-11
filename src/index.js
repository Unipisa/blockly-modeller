import Blockly from 'blockly';
import { addChangeListener, addUiEventListener, addBlockDeleteChangeListener } from './listeners';
import { onTextFieldChange } from './utils/blockUtils.js';
import { xmlText } from './blocks/workspace.js';
import { runCode, ws } from './runner/runner.js';


document.addEventListener('DOMContentLoaded', () => {

  const textField = document.getElementById('textField');
  if (textField) {
    textField.addEventListener('change', onTextFieldChange);
  }


});