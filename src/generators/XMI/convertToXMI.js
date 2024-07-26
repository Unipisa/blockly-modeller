import { generateRandID } from '../../utils/utils.js';
import { createXMIElement } from './xmiElements.js';

export function convertToXMI(json) {
    const xml_data = '<?xml version="1.0" encoding="UTF-8"?>\n';
    const xmi_data = '<xmi:XMI xmi:version="2.1" xmlns:uml="http://schema.omg.org/spec/UML/2.0" xmlns:xmi="http://schema.omg.org/spec/XMI/2.1">\n';
    const doc_data = '\t<xmi:Documentation exporter="StarUML" exporterVersion="2.0"/>\n';
    const model_id = generateRandID();
    const pack_id = generateRandID();
    let model_data = `\t<uml:Model xmi:id="${model_id}" xmi:type="uml:Model" name="RootModel">\n`;
    let pack_data = `\t\t<packagedElement xmi:id="${pack_id}" name="BlocklyModel" visibility="public" xmi:type="uml:Model">\n`;
    const close = '</xmi:XMI>\n';

    // Aggiungi attori
    (json.blocks[0].actors || []).forEach(actor => {
        // const actorNameWithSuffix = actor.name ? actor.name + "_act" : "";
        pack_data += createXMIElement("Class", actor.name, actor.attributes, actor.activities);
    });

    // Aggiungi risorse e componenti digitali
    (json.blocks[0].resources || []).forEach(resource => {
        // const resourceNameWithSuffix = resource.name ? resource.name + "_res" : "";
        const aggregations = resource.aggregation ? [resource.aggregation] : [];
        pack_data += createXMIElement("Class", resource.name, resource.attributes, resource.activities, resource.specialisations, aggregations);
    });

    // Chiudiamo il pacchetto e il modello
    pack_data += '\t\t</packagedElement>\n';
    model_data += pack_data;
    model_data += '\t</uml:Model>\n';

    // Componiamo l'intero documento XMI
    const complete_xmi = xml_data + xmi_data + doc_data + model_data + close;
    return complete_xmi;
}