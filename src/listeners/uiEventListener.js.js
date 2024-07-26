import { ws } from '../runner/runner.js';
import { onWorkspaceChange } from './workspaceChangeListener.js';

export function addUiEventListener() {
  ws.addChangeListener(onWorkspaceChange);
}
