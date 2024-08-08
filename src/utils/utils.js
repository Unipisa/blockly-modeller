// Funzione per generare un ID casuale compreso tra 10000 e 99999
export const generateRandID = () => {
    return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  }
  
  // Funzione per generare un ID a partire dal nome della classe
  export const generateID = (nomeClasse) => {
    if (nomeClasse != undefined) {
      nomeClasse = nomeClasse.trim().toLowerCase();
      var id = "";
      for (let c = 0; c < nomeClasse.length; c++) {
        var charCode = nomeClasse.charCodeAt(c);
        id += charCode;
      }
      return id;
    }
  }
  
    export const capitalizeFirstLetter = (string) =>  {
      if (string != undefined) {
          return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
      }
  }
  
  
  // Funzione per rimuovere la disambiguazione dai nomi TARGET usata in convertBPMN
  export function cleanName(name) {
    return name.replace(/\s*\(.*?\)$/, '').toLowerCase();
  }
    
  
  // export const processAct = (input) => {
  //     const parts = input.split(':'); // Divide la stringa in base al carattere ':'
  //     const stringElements = parts[0].split(';');
  //     const operations = [];
    
  //     // Crea un oggetto per ogni tripletta
  //     for (let i = 0; i < stringElements.length; i += 3) {
  //         operations.push({
  //             name: stringElements[i],
  //             target_actor: stringElements[i + 1],
  //             motivation: stringElements[i + 2],
  //         });
  //     }
  //     return JSON.stringify(operations, null, 2); // Stampa il JSON formattato con indentazione
  //   }


  export function getTodayDate() {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
    var yyyy = today.getFullYear();
    today = dd + '-' + mm + '-' + yyyy;

    return today;
    }