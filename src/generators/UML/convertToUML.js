import reader from '../../libs/xmi21-reader.js';
import plantumlEncoder from 'plantuml-encoder';
import { createUMLClass, createGeneralizations, createAssociations, createAggregations } from './umlElements.js';
import { DOM_NODES } from '../../utils/domElements.js';
import { cleanXmi } from '../../runner/views/umlView.js';


export function convertToUML(xmiString) {
  const data = reader.formatXMItoObjectJS(xmiString);
  let elements = data.ownedElements[0].ownedElements;

  // Pulisce gli elementi rimuovendo quelli senza nome
  elements = cleanXmi(elements);
  if (elements.length === 0) {
    return ""; // Ritorna stringa vuota se non ci sono elementi validi
  }

  let umlString = "@startuml\n";
  
  elements.forEach(element => {
    if (element.ownedElements != null) {
      element.ownedElements.forEach(e => {
        if (e.ownedElements != null && e.name != "" && e.name != '') {
          let generalizations = [];
          let associations = [];
          let aggregations = [];

          e.ownedElements.forEach(subElement => {
            if (subElement.type != null && subElement.type.$ref === "generalization") {
              generalizations.push(subElement);
            } else if (subElement.name.startsWith('aggregation_')) {
              aggregations.push(subElement);
            } else {
              associations.push(subElement);
            }
          });
          //Creazione delle generalizzazioni
          if (generalizations.length > 0) {
            umlString += createGeneralizations(e, generalizations);
          }

          let associationNames = associations.map(assoc => assoc.name.replace(" ", '_'));
          let aggregationNames = aggregations.map(agg => agg.name.replace(" ", '_'));
          let excludedOperations = [...associationNames, ...aggregationNames]; //spread operator (...) combina due array.

          //Creazione delle Classi UML
          if (e.operations != null) {
            umlString += createUMLClass(e, excludedOperations);
          } else {
            umlString += createUMLClass(e);
          }
          //Creazione delle Aggregazioni:
          umlString += createAggregations(e, aggregations);
          //Creazione delle Associazioni:
          umlString += createAssociations(e, associations.filter(assoc => !assoc.name.startsWith('aggregation_')));
        
        } else {
          umlString += createUMLClass(e);
        }
      });
    } else {
      umlString += `${element.name.replace(" ", '_')}\n`;
    }
  });

  umlString += "@enduml";
  return umlString;
}
