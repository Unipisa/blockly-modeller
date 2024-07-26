// Questa funzione raccoglie e genera il codice per una catena di blocchi.
// Inizia con il primo blocco nella catena del statement e poi raccoglie ricorsivamente tutti gli output dei blocchi.

export const statementToCode = function (block, name) {
    var targetBlock = block.getInputTargetBlock(name);
    if (!targetBlock) {
      return [];
    }
  
    const collectBlockObjects = (block) => {
      if (!block) {
        return [];
      }
      var blockObject = this.blockToCode(block);
      if (!blockObject) {
        return [];
      }
      var nextBlockObjects = collectBlockObjects(block.getNextBlock());
      return [blockObject].concat(nextBlockObjects);
    };
  
    return collectBlockObjects(targetBlock);
  };
  