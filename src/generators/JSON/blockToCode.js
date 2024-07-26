// Questa funzione genera il codice per un singolo blocco.
  // Se il blocco è null o undefined, restituisce una stringa vuota.

export const blockToCode = function (block) {
    if (!block) {
      return "";
    }
    var func = this[block.type];
    if (typeof func !== "function") {
      throw new Error(
        'Language "' + this.name_ + '" does not know how to generate code for block type "' + block.type + '".'
      );
    }
    var code = func.call(this, block);
    console.log('CODE:');
    console.log(code);
    return code;
  };
  