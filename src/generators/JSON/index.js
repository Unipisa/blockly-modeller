// index.js
import * as Blockly from "blockly";
import { blockToCode } from "./blockToCode";
import { workspaceToCode } from "./workspaceToCode";
import { statementToCode } from "./statementToCode";
import { registerGenerators } from "./generators";

//nuovo oggetto generatore di Blockly chiamato "modeLLer" con funzioni assegnate come metodi del generatore.
const generator = new Blockly.Generator("modeLLer");

generator.blockToCode = blockToCode;  //tradurre i singoli blocchi in JSON.
generator.workspaceToCode = workspaceToCode; //tradurre l'intero workspace in JSON.
generator.statementToCode = statementToCode; //tradurremle catene di statement in JSON.

//registrazione del nuovo generatore
registerGenerators(generator);

export { generator };