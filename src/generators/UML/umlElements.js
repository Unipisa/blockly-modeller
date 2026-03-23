
export function createUMLClass(element, excludedOperations = []) {
    let umlClass = `class ${element.name.replace(" ", '_')} {\n`;
    //Aggiunta degli Attributi:
    if (element.attributes != null) {
      element.attributes.forEach(attr => {
        umlClass += `${attr.name.replace(" ", '_')}\n`;
      });
    }
    //Aggiunta delle Operazioni:
    if (element.operations != null) {
      element.operations.forEach(oper => {
        if (!excludedOperations.includes(oper.name.replace(" ", '_'))) {
          umlClass += `${oper.name.replace(" ", '_')}()\n`;
        }
      });
    }
  
    umlClass += "}\n";
    return umlClass;
  }
  
    // FRECCE
    
    export function createGeneralizations(e, generalizations) {
      let umlString = "";
      generalizations.forEach(element => {
        umlString += `${e.name.replaceAll(" ", '_')} <|-- ${element.name.replaceAll(" ", '_')}\n`;
      });
      return umlString;
    }
    
    export function createAssociations(e, associations) {
      let umlString = "";
      associations.forEach(association => {
        let nameActor = association.end2.name.replaceAll(" ", '_');
        let namePadre = association.end1.name.replaceAll(" ", '_');
        umlString += `${nameActor} <-- ${namePadre} :${association.name.replaceAll(" ", '_')}\n`;
      });
      return umlString;
    }
    
    export function createAggregations(e, aggregations) {
      let umlString = "";
      let nameActor = "";
      let namePadre = "";
      
      aggregations.forEach(aggregation => {
        nameActor = aggregation.end2.name.replaceAll(" ", '_');
        namePadre = aggregation.end1.name.replaceAll(" ", '_');
        umlString += `${nameActor} o-- ${namePadre}\n`;
      });
    
      return umlString;
    }
    