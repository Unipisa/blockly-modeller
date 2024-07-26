import { generateID, generateRandID, capitalizeFirstLetter } from '../../utils/utils.js';
import { removeBlockType } from '../../utils/blockUtils.js';

export function createXMIElement(type, name, attributes = [], operations = [], specialisations = [], aggregations = []) {
    const element_id = generateRandID(name);
    const formattedName = removeBlockType(name).replace(/[^a-zA-Z0-9À-ž_]/g
, ''); // Rimuove i caratteri non validi
    if (formattedName === "") {
        return ""; // Se il nome dell'elemento è vuoto, ritorna una stringa vuota
    }
    let element_code = `\t\t\t<packagedElement xmi:id="${element_id}" name="${formattedName.toLowerCase()}" xmi:type="uml:${type}">\n`;

    // Aggiungi attributi
    attributes.forEach(attribute => {
        const attribute_id = generateID(attribute.name);
        const formattedAtt = removeBlockType(attribute.name).replace(/[^a-zA-Z0-9À-ž_]/g
, '');
        if (formattedAtt.name !== "") {
            element_code += `\t\t\t\t<ownedAttribute xmi:id="${attribute_id}" name="${formattedAtt.toLowerCase()}" xmi:type="uml:Property"/>\n`;
        }        
    });

    // Aggiungi operazioni
    operations.forEach(operation => {
        const operation_id = generateID(operation.name);
        const formattedOperationName = removeBlockType(operation.name).replace(/[^a-zA-Z0-9À-ž_]/g
, ''); // Rimuove i caratteri non validi dall'operazione
        if (formattedOperationName !== "") {
        element_code += `\t\t\t\t<ownedOperation xmi:id="${operation_id}" name="${formattedOperationName.toLowerCase()}" xmi:type="uml:Operation"/>\n`;
        }
        // Aggiungi associazioni se target è presente
        if (operation.target !== "NONE" && operation.target != undefined) {
            const association_id = generateRandID();
            const member_end_1_id = generateRandID();
            const member_end_2_id = generateRandID();
            const formattedTarget = removeBlockType(operation.target).replace(/[^a-zA-Z0-9À-ž_]/g
, ''); // Rimuove i caratteri non validi dal target

            element_code += `\t\t\t\t<ownedMember name="${formattedOperationName.toLowerCase()}" xmi:id="${association_id}" xmi:type="uml:Association">\n`;
            element_code += `\t\t\t\t\t<ownedEnd xmi:id="${member_end_1_id}" xmi:type="uml:Property" type="${element_id}" name="${formattedName.toLowerCase()}">\n`;
            element_code += `\t\t\t\t\t\t<xmi:Extension extender="StarUML">\n\t\t\t\t\t\t\t<stereotype value=""/>\n\t\t\t\t\t\t</xmi:Extension>\n`;
            element_code += `\t\t\t\t\t</ownedEnd>\n`;
            element_code += `\t\t\t\t\t<ownedEnd xmi:id="${member_end_2_id}" xmi:type="uml:Property" type="${generateID(formattedTarget)}" name="${formattedTarget.toLowerCase()}">\n`;
            element_code += `\t\t\t\t\t\t<xmi:Extension extender="StarUML">\n\t\t\t\t\t\t\t<stereotype value=""/>\n\t\t\t\t\t\t</xmi:Extension>\n`;
            element_code += `\t\t\t\t\t</ownedEnd>\n`;
            element_code += `\t\t\t\t\t<memberEnd xmi:idref="${member_end_1_id}"/>\n`;
            element_code += `\t\t\t\t\t<memberEnd xmi:idref="${member_end_2_id}"/>\n`;
            element_code += `\t\t\t\t</ownedMember>\n`;
        }
    });

    // Aggiungi aggregazioni se presenti
    aggregations.forEach(agg => {
        if (agg !== "NONE") {
            const aggregation_id = generateRandID();
            const member_end_1_id = generateRandID();
            const member_end_2_id = generateRandID();
            const formattedAgg = removeBlockType(agg).replace(/[^a-zA-Z0-9À-ž_]/g
, ''); // Rimuove i caratteri non validi dall'aggregazione

            element_code += `\t\t\t\t<ownedMember name="aggregation_${formattedName.toLowerCase()}" xmi:id="${aggregation_id}" xmi:type="uml:Association">\n`;
            element_code += `\t\t\t\t\t<ownedEnd xmi:id="${member_end_1_id}" xmi:type="uml:Property" aggregation="shared" type="${element_id}" name="${formattedName.toLowerCase()}">\n`;
            element_code += `\t\t\t\t\t\t<xmi:Extension extender="StarUML">\n\t\t\t\t\t\t\t<stereotype value=""/>\n\t\t\t\t\t\t</xmi:Extension>\n`;
            element_code += `\t\t\t\t\t</ownedEnd>\n`;
            element_code += `\t\t\t\t\t<ownedEnd xmi:id="${member_end_2_id}" xmi:type="uml:Property" type="${generateID(formattedAgg)}" name="${formattedAgg.toLowerCase()}">\n`;
            element_code += `\t\t\t\t\t\t<xmi:Extension extender="StarUML">\n\t\t\t\t\t\t\t<stereotype value=""/>\n\t\t\t\t\t\t</xmi:Extension>\n`;
            element_code += `\t\t\t\t\t</ownedEnd>\n`;
            element_code += `\t\t\t\t\t<memberEnd xmi:idref="${member_end_1_id}"/>\n`;
            element_code += `\t\t\t\t\t<memberEnd xmi:idref="${member_end_2_id}"/>\n`;
            element_code += `\t\t\t\t</ownedMember>\n`;
        }
    });

    // Aggiungi specializzazioni
    specialisations.forEach(specialisation => {
        const specialisation_id = generateID(specialisation.name);
        const formattedSpecialisation = removeBlockType(specialisation.name).replace(/[^a-zA-Z0-9À-ž_]/g
, ''); // Rimuove i caratteri non validi dalla specializzazione
        if (formattedSpecialisation !== "") {
            element_code += `\t\t\t\t<generalization xmi:id="${specialisation_id}" name="${capitalizeFirstLetter(formattedSpecialisation)}" type="generalization" xmi:type="uml:Property"/>\n`;
        }
    });

    element_code += `\t\t\t</packagedElement>\n`;
    return element_code;
}