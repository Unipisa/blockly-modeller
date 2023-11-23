/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Injected dependencies.  By default these are just (and have the
 * same types as) the corresponding DOM Window properties, but the
 * Node.js wrapper for Blockly (see scripts/package/node/core.js)
 * calls injectDependencies to supply implementations from the jsdom
 * package instead.
 */
declare let DOMParser: {
    new (): DOMParser;
    prototype: DOMParser;
}, XMLSerializer: {
    new (): XMLSerializer;
    prototype: XMLSerializer;
};
/**
 * Inject implementations of document, DOMParser and/or XMLSerializer
 * to use instead of the default ones.
 *
 * Used by the Node.js wrapper for Blockly (see
 * scripts/package/node/core.js) to supply implementations from the
 * jsdom package instead.
 *
 * While they may be set individually, it is normally the case that
 * all three will be sourced from the same JSDOM instance.  They MUST
 * at least come from the same copy of the jsdom package.  (Typically
 * this is hard to avoid satsifying this requirement, but it can be
 * inadvertently violated by using webpack to build multiple bundles
 * containing Blockly and jsdom, and then loading more than one into
 * the same JavaScript runtime.  See
 * https://github.com/google/blockly-samples/pull/1452#issuecomment-1364442135
 * for an example of how this happened.)
 *
 * @param dependencies Options object containing dependencies to set.
 */
export declare function injectDependencies(dependencies: {
    document?: Document;
    DOMParser?: typeof DOMParser;
    XMLSerializer?: typeof XMLSerializer;
}): void;
/**
 * Namespace for Blockly's XML.
 *
 * @alias Blockly.utils.xml.NAME_SPACE
 */
export declare const NAME_SPACE = "https://developers.google.com/blockly/xml";
/**
 * Get the document object to use for XML serialization.
 *
 * @returns The document object.
 * @deprecated No longer provided by Blockly.
 * @alias Blockly.utils.xml.getDocument
 */
export declare function getDocument(): Document;
/**
 * Get the document object to use for XML serialization.
 *
 * @param xmlDocument The document object to use.
 * @deprecated No longer provided by Blockly.
 * @alias Blockly.utils.xml.setDocument
 */
export declare function setDocument(xmlDocument: Document): void;
/**
 * Create DOM element for XML.
 *
 * @param tagName Name of DOM element.
 * @returns New DOM element.
 * @alias Blockly.utils.xml.createElement
 */
export declare function createElement(tagName: string): Element;
/**
 * Create text element for XML.
 *
 * @param text Text content.
 * @returns New DOM text node.
 * @alias Blockly.utils.xml.createTextNode
 */
export declare function createTextNode(text: string): Text;
/**
 * Converts an XML string into a DOM tree.
 *
 * @param text XML string.
 * @returns The DOM document.
 * @throws if XML doesn't parse.
 * @alias Blockly.utils.xml.textToDomDocument
 */
export declare function textToDomDocument(text: string): Document;
/**
 * Converts a DOM structure into plain text.
 * Currently the text format is fairly ugly: all one line with no whitespace.
 *
 * @param dom A tree of XML nodes.
 * @returns Text representation.
 * @alias Blockly.utils.xml.domToText
 */
export declare function domToText(dom: Node): string;
export {};
//# sourceMappingURL=xml.d.ts.map