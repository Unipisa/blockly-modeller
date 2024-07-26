import { ws, runCode } from '../runner/runner.js';
import Blockly from 'blockly';

export function addChangeListener(ws) {
  ws.addChangeListener((e) => {
    if (!e.isUiEvent) {
      if (e.type !== Blockly.Events.FINISHED_LOADING && !ws.isDragging()) {
        runCode();
      }
    }
  });
}
