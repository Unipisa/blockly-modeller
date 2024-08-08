
// Questa funzione genera il codice per l'intero workspace.
export const workspaceToCode = function (workspace) {
    var blocksData = [];
    if(!workspace) var blocks = [];
    else var blocks = workspace.getTopBlocks();

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (!block.disabled) {
        var blockData = this.blockToCode(block);
        if (blockData) {
          blocksData.push(blockData);
        }
      }
    }
  
  
    return {
      type: "workspace",
      blocks: blocksData,
    };
  };
  