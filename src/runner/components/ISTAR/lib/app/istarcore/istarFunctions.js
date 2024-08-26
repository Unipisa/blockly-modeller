/*!
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 *
 * If you are going to edit the code, always work from the source-code available for download at
 * https://github.com/jhcp/pistar
 */

import Backbone from "backbone";


/**
 * Construct a new istar object.
 * This is the basic istar class.
 * this object contains the main functionalities for creating istar models
 *
 * @return {object} A new istar object
 * @class istar
 */




//import {setIstar} from'../../../index.js';

var istar = function () {
    'use strict';


    function _setLinkLabel (value) {
        /* jshint validthis: true */
        /* this function is meant to be added to a prototype */

        this.label(0, {attrs: {text: {text: '' + value + ''}}});
        return this;
    }

    //prototype functions
    function _setNodeLabel (content) {
        /* jshint validthis: true */
        /* this function is meant to be added to a prototype */

        var breakWidth = 90;
        if (! this.isKindOfActor()) {
            breakWidth = this.getBBox().width;
        }
        else {
            //actors' width require a different approach, since the regular getBBox refers to the whole actor
            breakWidth = joint.util.getElementBBox($('#'+ this.findView(istar.paper).id +' .actorSymbol')).width;
        }

        content = $.trim(content) || '';
        content = joint.util.breakText(content, {width: breakWidth});//add the line breaks automatically

        this.attr('.content/text', content);//actually change the label
        return this;
    }

    function _updateLineBreak () {
        /* jshint validthis: true */
        /* this function is meant to be added to a prototype */

        this.setNodeLabel(this.prop('name'));
    }

    function _embedNode (node) {
        /* jshint validthis: true */
        /* this function is meant to be added to a prototype */

        if (node !== null) {
            this.embed(node);
            this.updateBoundary();
        }

        return node;
    }

    function _collapse () {
        /* jshint validthis: true */
        /* this function is meant to be added to a prototype */

        var actor = this;//stores 'this' in a named variable so that it can be read by the anonymous function
        if (!this.prop('collapsed')) {
            this.attr('.boundary/display', 'none');//hide the actor's boundary
            _.forEach(this.getEmbeddedCells(), function (innerElement) {
                innerElement.attr('./display', 'none');//hide the actor's inner elements

                //retarget the dependency links, from inner elements to the actor itself
                var connectedLinks = istar.graph.getConnectedLinks(innerElement);
                if (connectedLinks) {
                    _.forEach(connectedLinks, function (connectedLink) {
                        if (connectedLink.isDependencyLink() ) {
                            if (connectedLink.get('source').id === innerElement.id) {
                                connectedLink.prop('elementSource', innerElement.id);
                                connectedLink.set('source', {id: actor.id, selector: '.element'});
                            }
                            else if (connectedLink.get('target').id === innerElement.id) {
                                connectedLink.prop('elementTarget', innerElement.id);
                                connectedLink.set('target', {id: actor.id, selector: '.element'});
                            }
                        }
                    });
                }
            });
            this.prop('collapsed', true);
        }
    }

    function _expand () {
        /* jshint validthis: true */
        /* this function is meant to be added to a prototype */

        var actor = this;//stores 'this' in a named variable so that it can be read by the anonymous function
        if (this.prop('collapsed')) {
            this.attr('.boundary/display', 'block');//display the actor's boundary
            _.forEach(this.getEmbeddedCells(), function (innerElement) {
                innerElement.attr('./display', 'block');//display the actor's inner elements

                //retarget the dependency links, from the actor to the original inner elements (when applicable)
                var connectedLinks = istar.graph.getConnectedLinks(actor);
                if (connectedLinks) {
                    _.forEach(connectedLinks, function (connectedLink) {
                        if (connectedLink.isDependencyLink() ) {
                            if (connectedLink.get('source').id === actor.id) {
                                if (connectedLink.prop('elementSource')) {
                                    connectedLink.set('source', {
                                        id: istar.graph.getCell(connectedLink.prop('elementSource')).id,
                                        selector: 'text'
                                    });
                                }
                            }
                            else if (connectedLink.get('target').id === actor.id) {
                                if (connectedLink.prop('elementTarget')) {
                                    connectedLink.set('target', {
                                        id: istar.graph.getCell(connectedLink.prop('elementTarget')).id,
                                        selector: 'text'
                                    });
                                }
                            }
                        }
                    });
                }
            });
            this.prop('collapsed', false);
        }
    }

    function _toggleCollapse () {
        /* jshint validthis: true */
        /* this function is meant to be added to a prototype */

        if (this.prop('collapsed')) {
            this.expand();
        }
        else {
            this.collapse();
        }
    }

    function _updateActorBoundary () {
        /* jshint validthis: true */
        /* this function is meant to be added to a prototype */

        //update the size of the (parent) actor's boundary based on its contents
        //based on a JointJS tutorial: http://www.jointjs.com/tutorial/hierarchy

        if (!this.get('originalPosition')) {
            this.set('originalPosition', this.get('position'));
        }
        if (!this.get('originalSize')) {
            this.set('originalSize', this.get('size'));
        }

        var originalPosition = this.get('originalPosition');
        var originalSize = this.get('originalSize');

        var newX = originalPosition.x;
        var newY = originalPosition.y;
        var newCornerX = originalPosition.x + originalSize.width;
        var newCornerY = originalPosition.y + originalSize.height;

        _.forEach(this.getEmbeddedCells(), function (child) {
            var childBbox = null;
            // in case we want to keep links inside the boundary
            // if (child.isLink()) {
            //     childBbox = istar.paper.findViewByModel(child).getBBox();
            // }
            // else {
            //     childBbox = child.getBBox();
            // }
            if (! child.isLink()) {
                childBbox = child.getBBox();
                if (childBbox.x < newX) {
                    newX = childBbox.x;
                }
                if (childBbox.y < newY) {
                    newY = childBbox.y;
                }
                if (childBbox.corner().x > newCornerX) {
                    newCornerX = childBbox.corner().x;
                }
                if (childBbox.corner().y > newCornerY) {
                    newCornerY = childBbox.corner().y;
                }
            }
        });

        // Note that we also pass a flag so that we know we shouldn't adjust the
        // `originalPosition` and `originalSize` in our handlers as a reaction
        // on the following `set()` call.
        this.set({
            position: {x: newX, y: newY},
            size: {width: newCornerX - newX, height: newCornerY - newY}
        }, {skipParentHandler: true});

        if (this.attr('.boundary/width')) {
            this.attr({
                '.boundary': {
                    width: newCornerX - newX + 10,
                    height: newCornerY - newY + 10
                }
            });
        }
        else if (this.attr('.boundary/r')) {
            //tempative handling of circular boundaries
            var largerDimension = (newCornerX - newX) >  (newCornerY - newY) ? (newCornerX - newX) : (newCornerY - newY);
            this.attr({
                '.boundary': {
                    cx: largerDimension/2,
                    cy: largerDimension/2,
                    r: largerDimension/2
                }
            });
        }
    }

    //public attributes and functions
    return {
        metamodel: {},
        graph: {},
        paper: {},
        setup: {
            setupModel: function (_graph) {
                var graph = _graph ? graph : createDefaultGraph();
                setupGraphProperties(graph);
                return graph;

                function createDefaultGraph() {
                    //a joint js graph contains all cells (elements and links) of the model
                    return (new joint.dia.Graph());
                }

                function setupGraphProperties(graph) {
                    //create a new JointJS Element to store custom data properties of the
                    // model as a whole
                    graph._modelProperties = (new joint.dia.Element()).prop('name', '');
                    //creates a shortcut for setting up model properties
                    graph.prop = graph._modelProperties.prop;

                    //create is... functions for the graph object
                    //they are useful because, since the model itself can be selected, these functions
                    //can help differentiate it from regular cells
                    graph.isCell = function () {
                        return false;
                    };
                    graph.isElement = function () {
                        return false;
                    };
                    graph.isLink = function () {
                        return false;
                    };
                }
            },
            setupDiagram: function (graph, _paper) {
                var paper = _paper ? paper : createDefaultPaper(graph);
                setupElementLabelFunctions();
                setupAutomaticContainerResizing(graph);
                return paper;

                function createDefaultPaper(graph) {
                    //a joint js paper is the view for a joint js graph
                    return new joint.dia.Paper({
                        el: $('#diagram'), /*DOM container of the SVG image*/
                        width: 2000,
                        height: 1300,
                        model: graph,
                        gridSize: 1,
                        defaultConnector: {
                            name: 'rounded',
                            args: {
                                radius: 10
                            }
                        }
                        // defaultRouter: {
                        //     name: 'metro',
                        //     args: {
                        //         padding: 10
                        //     }
                        // }
                        //,async: true,
                        //linkConnectionPoint: joint.util.shapePerimeterConnectionPoint, //connects links to the nodes' shape, rather than their bounding box. Big toll on performance
                    });
                }

                function setupElementLabelFunctions() {
                    joint.dia.Element.prototype.setNodeLabel = _setNodeLabel;
                    joint.dia.Element.prototype.updateLineBreak = _updateLineBreak;
                }

                function setupAutomaticContainerResizing(graph) {
                    //updates the size of a container boundary when its internal elements are moved
                    //based on JointJS' tutorial: http://jointjs.com/tutorial/hierarchy
                    graph.on('change:position change:size', function (cell, newPosition, opt) {

                        if (opt.skipParentHandler) {
                            return;
                        }

                        if (cell.get('embeds') && cell.get('embeds').length) {
                            // If we're manipulating a parent element, let's store
                            // it's original position to a special property so that
                            // we can shrink the parent element back while manipulating
                            // its children.
                            cell.set('originalPosition', cell.get('position'));
                        }

                        var parentId = cell.get('parent');
                        if (parentId) {
                            var parent = graph.getCell(parentId);
                            parent.updateBoundary();
                        }
                    });
                }
            },
            createContainerFunctions: function (prototype) {
                prototype.collapse = _collapse;
                prototype.uncollapse = _expand; /* @deprecated since version 2.0.0 - use 'expand' instead*/
                prototype.expand = _expand;
                prototype.toggleCollapse = _toggleCollapse;
                prototype.embedNode = _embedNode;
                prototype.updateBoundary = _updateActorBoundary;
            }
        },
        base: {
            /**
             * Adds a new node to the model.
             * Instead of calling this function directly, this function is expected to be called
             * from a specialized 'add' function, such as addActor or addTask.<br />
             * @returns the new node
             * @param {object}  nodeType    type definition of the node to be created
             * @param {string}  content     content of the node
             * @param {object}  options     {id, position: {x, y}}
             */
            addNode: function (nodeType, content, options) {
                var newNode = new nodeType.shapeObject(options);
                //add to the graph before changing properties, so that eventual UI event listeners can start acting at once
                istar.graph.addCell(newNode);

                newNode.prop('name', content || nodeType.name);
                newNode.prop('type', nodeType.name);

                //stores the initial size of the element in order to later be able to restore it to its initial size
                newNode.prop('originalSize', newNode.prop('size'));

                if (newNode.attr('.stereotype')) {
                    if (! newNode.attr('.stereotype/text')) {
                        newNode.attr('.stereotype/text', '<<' + nodeType.name + '>>');
                    }
                }

                return newNode;
            },
        },
        displayInvalidModelMessages: function(messages) {
            messages = messages || [];
            _.forEach(messages, function(message) {
                console.log('INVALID: ' + message);
            });
        },
        /**
         * Returns true if the model is empty (i.e. it does not contain any element).
         * @returns {boolean} isEmpty
         * @example
         *   if (istar.isEmpty()) {...}
         */
        isEmpty: function () {
            return (_.size(istar.graph.getCells()) < 1);
        },

        /**
         * Returns the number of cells in the model (i.e. the number of elements plus the number of links).
         * @returns {number} number of cells (elements + links)
         * @example
         *   istar.getNumberOfCells();
         */
        getNumberOfCells: function () {
            return _.size(istar.graph.getCells());
        },

        /**
         * Returns the number of elements (nodes) in the model. For instance, actors and tasks are elements
         * @returns {number} number of elements (nodes)
         * @example
         *   istar.getNumberOfElements();
         */
        getNumberOfElements: function () {
            //note: the dependum also counts as an element
            return _.size(istar.graph.getElements());
        },

        /**
         * Returns the number of links (connections) in the model. For instance, refinements and contributions are links.
         * Please note that each dependency has 2 links: one from the depender to the dependum, and other from the dependum
         * to the dependee.
         * @returns {number} number of links (connections)
         * @example
         *   istar.getNumberOfLinks();
         */
        getNumberOfLinks: function () {
            //note: each dependency counts as two links: one from the depender to the dependum, and another from the dependum to the dependee
            return _.size(istar.graph.getLinks());
        },
        replaceNode: function (element, typeName) {
            let newType = null;
            if (element.isKindOfActor()) {
                newType = istar.metamodel.containers[typeName];
            }
            else {
                newType =istar.metamodel.nodes[typeName];
            }

            var newNode = this.base.addNode(
                newType,
                element.prop('name'),
                {
                    position: element.prop('position')
                });

            //copy the old node properties to the new node
            newNode.prop('originalSize', newNode.prop('size')); //stores the (default) initial size of the element
            if (element.prop('size') !== element.prop('originalSize')) {
                newNode.prop('size', element.prop('size')); //stores the initial size of the element
            }
            newNode.prop('customProperties', element.prop('customProperties'));
            if (element.getParentCell()) {

                element.getParentCell().embed(newNode);
            }

            istar.graph.addCell(newNode);
            newNode.updateLineBreak();

            if (element.prop('backgroundColor')) {
                ui.changeColorElement(element.prop('backgroundColor'), newNode);
            }

            //change the links from the old node to the new node
            //first verify whether the links would remain valid
            var isValid = {isValid: true};
            let connectedLinks = istar.graph.getConnectedLinks(element);
            _.forEach(connectedLinks, function (link) {
                let source = link.getSourceElement();
                if (source === element) {
                    source = newNode;
                }
                let target = link.getTargetElement();
                if (target === element) {
                    target = newNode;
                }

                if (link.isContainerLink()) {
                    isValid = istar.metamodel.containerLinks[link.prop('type')].isValid(target, source);
                }
            });

            if (isValid.isValid === false) {
                newNode.remove();
                return {ok: false, isValid};
            }

            if (element.isKindOfActor()) {
                _.forEach(element.getEmbeddedCells(), function(child) {
                    element.unembed(child);
                    newNode.embedNode(child);
                });
            }

            var nodeId = element.prop('id');
            _.forEach(connectedLinks, function (link) {
                if (link.prop('source/id') === nodeId) {
                    link.prop('source/id', newNode.prop('id'));
                }
                if (link.prop('target/id') === nodeId) {
                    link.prop('target/id', newNode.prop('id'));
                }
                // beginning of validation code for replacing inner elements
                // if (( ! link.isDependencyLink()) && ( ! newNode.isKindOfActor()) && ( ! newNode.isDependum())) {
                //     var sourceModel = istar.graph.getCell(link.prop('source/id'));
                //     var targetModel = istar.graph.getCell(link.prop('target/id'));
                //     console.log(targetModel);
                //     var isValid = istar.metamodel.nodeLinks[link.prop('type')].isValid(sourceModel, targetModel);
                //     console.log(isValid);
                // }
            });
            if (element.isKindOfActor()) {
                newNode.toBack();
            }

            //remove the old node
            element.remove();

            return newNode;
        },
        /**
         * Adds a link between two containers.
         * @returns the new link
         * @param {object}  linkType    type definition of the link to be created
         * @param {Actor}   source      source of the link (the actual Cell, not just the id)
         * @param {Actor}   target      target of the link (the actual Cell, not just the id)
         */
        addLinkBetweenActors: function (linkType, source, target) {
            var hasShape = istar.metamodel.shapesObject[linkType.name];
            var link = new linkType.shapeObject({
                'source': {id: source.id},
                'target': {id: target.id}
            });
            link.prop('type', linkType.name);

            if (linkType.label) {
                link.attr('label/text', linkType.label);
                link.attr('label-background/text', linkType.label);
            }
            else if (! hasShape) {
                link.attr('label/text', '<<' + linkType.name + '>>');
                link.attr('label-background/text', '<<' + linkType.name + '>>');
            }

            istar.graph.addCell(link);
            return link;

        },
        addDependency: function (depender, dependum, dependee) {
            var shape = joint.shapes.istar.DependencyLink;
            var hasShape = true;
            if (!shape) {
                var shape = joint.shapes.istar.DependencyLink || joint.shapes.istar.DefaultContainerLink;
                hasShape = false;
            }
            var link1 = new shape({
                'source': {id: depender.id, selector: '.element'},
                'target': {id: dependum.id}
            });
            var link2 = new shape({
                'source': {id: dependum.id},
                'target': {id: dependee.id, selector: '.element'}
            });
            istar.graph.addCell(link1);
            istar.graph.addCell(link2);

            if (! hasShape) {
                link1.attr('label/text', '<<DependencyLink>>');
                link1.attr('label-background/text', '<<DependencyLink>>');
                link2.attr('label/text', '<<DependencyLink>>');
                link2.attr('label-background/text', '<<DependencyLink>>');
            }

            //stores a reference from one link to another, in order to be able so remove the other one if
            //any of them is removed, thus preventing dangling dependencies
            link1.prop('otherHalf', link2);
            link2.prop('otherHalf', link1);

            link1.prop('type', 'DependencyLink');
            link2.prop('type', 'DependencyLink');

            dependum.prop('isDependum', true);
            var dependumPosition = {
                x: ((depender.prop('position/x') + dependee.prop('position/x')) / 2),
                y: ((depender.prop('position/y') + dependee.prop('position/y')) / 2)
            };
            dependum.prop('position', dependumPosition);

            //move links to the back, so that they don't appear on top of the element's shape
            link1.toBack();
            link2.toBack();
            //move all the actors even further back, so that they don't impede the visualization of the dependency links
            _.forEach(istar.graph.getElements(), function (element) {
                if (element.isKindOfActor()) {
                    element.toBack();
                }
            });

            return [link1, link2];
        },
        addLinkBetweenNodes: function (linkType, source, target, value) {
            var hasShape = istar.metamodel.shapesObject[linkType.name];
            var link = new linkType.shapeObject({'source': {id: source.id}, 'target': {id: target.id}});
            link.prop('type', linkType.name);
            istar.graph.addCell(link);

            if (linkType.label) {
                link.attr('label/text', linkType.label);
                link.attr('label-background/text', linkType.label);
            }
            else if (! hasShape) {
                link.attr('label/text', '<<' + linkType.name + '>>');
                link.attr('label-background/text', '<<' + linkType.name + '>>');
            }

            //embeds the link on the (parent) actor of its source element, to facilitate collapse/expand
            if (source.get('parent')) {
                istar.graph.getCell(source.get('parent')).embed(link);
            }

            if (linkType.changeableLabel) {
                link.setContributionType = _setLinkLabel;
                link.on('change:value', function(link, newValue) {
                    link.setContributionType(newValue);
                });
            }
            if (value) {
                link.prop('value', value);
            }

            return link;
        },
        clearModel: function () {
            istar.graph.clear();
            istar.graph.prop('name', '');
            istar.graph.prop('customProperties', '');//delete all custom properties
            istar.graph.prop('customProperties/Description', '');//set back the 'Description' property
            istar.undoManager.reset();
        },
        embedNode: function (child, parent) {
            parent.embed(child);
        },
        getElements: function () {
            return this.graph.getElements();
        },
        getCells: function () {
            return this.graph.getCells();
        },
        getLinks: function () {
            return this.graph.getLinks();
        },
        isElementSourceOfType: function (element, typeName) {
            var currentLinksFromElement = istar.graph.getConnectedLinks(element);
            var isSourceOf = false;
            _.forEach(currentLinksFromElement, function (link) {
                isSourceOf = isSourceOf || ((link.getSourceElement() === element) && (link.prop('type') === typeName));
            });
            return isSourceOf;
        },
        isElementTargetOfType: function (element, typeName) {
            var currentLinksFromElement = istar.graph.getConnectedLinks(element);
            var isTargetOf = false;
            _.forEach(currentLinksFromElement, function (link) {
                isTargetOf = isTargetOf || ((link.getTargetElement() === element) && (link.prop('type') === typeName));
            });
            return isTargetOf;
        },
        isThereLinkBetween: function (source, target, typeName) {
            //check for existing links between two elements
            //useful for preventing duplicated links
            //returns true if there is already at least one link between source and target
            var currentLinksFromSource = istar.graph.getConnectedLinks(source);
            var isDuplicated = false;
            if (typeName) {
                _.forEach(currentLinksFromSource, function (link) {
                    isDuplicated = isDuplicated || (link.prop('type') === typeName && (link.getSourceElement() ===
                        target || link.getTargetElement() === target) );
                });
            }
            else {
                _.forEach(currentLinksFromSource, function (link) {
                    isDuplicated = isDuplicated || link.getSourceElement() === target || link.getTargetElement() === target;
                });
            }
            return isDuplicated;
        }
    };
}();

/* Chiara added */
export { istar };

export const updateIstarModel = (newState) => {

    //istar.models.modeller = newState;
    istar.fileManager.loadModel(newState);

    /* Chiara added */
    istar.layout.updateLayout();

};

/*
export const getModelState = () => {
    return modelState;
};
*/

/*!
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 *
 * If you are going to edit the code, always work from the source-code available for download at
 * https://github.com/jhcp/pistar
 */


istar.validateMetamodel = function (metamodel) {
    'use strict';

    //check against names starting with 'node' or 'link', to prevent from overriding
    //methods of the istar object.
    // _.forEach(metamodel.containers, function (element) {
    //     if (element.name && element.name.match(/^(node|link)/i)) {
    //         console.log('this metamodel is invalid. Please check the error message below.');
    //         throw new Error('Invalid container name in the metamodel: ' + element.name +
    //             '. Container names cannot start with "node" nor "link".');
    //     }
    // });
    // _.forEach(metamodel.nodes, function (element) {
    //     if (element.name.match(/^(node|link)/i)) {
    //         console.log('this metamodel is invalid. Please check the error message below.');
    //         throw new Error('Invalid node name in the metamodel: ' + element.name +
    //             '. Node names cannot start with "node" nor "link".');
    //     }
    // });
    // _.forEach(metamodel.containerLinks, function (element) {
    //     if (element.name.match(/^(node|link)/i)) {
    //         console.log('this metamodel is invalid. Please check the error message below.');
    //         throw new Error('Invalid container link name in the metamodel: ' + element.name +
    //             '. Container link names cannot start with "node" nor "link".');
    //     }
    // });
    // _.forEach(metamodel.nodeLinks, function (element) {
    //     if (element.name.match(/^(node|link)/i)) {
    //         console.log('this metamodel is invalid. Please check the error message below.');
    //         throw new Error('Invalid node link name in the metamodel: ' + element.name +
    //             '. Node link names cannot start with "node" nor "link".');
    //     }
    // });

    //check if the metamodel contains at least one kind of element (node or container)
    //if it doesnt them a model couldnt be created
    //console.log(metamodel.containers);

    if ((!metamodel.containers || metamodel.containers.length === 0) &&
        (!metamodel.nodes || metamodel.nodes.length === 0)) {
        console.log('this metamodel is invalid. Please check the error message below.');
        throw new Error('Invalid metamodel. Metamodels must have at least one container or one node.');
    }
};

/*
    This function processes a given metamodel, stores the processed data on the istar global variable,
        and creates additional functions based on the metamodel

    It creates 'add' functions for each element of the metamodel
        For instance, if there is a node type named 'Person', an 'addPerson' function is created
*/
istar.setupMetamodel = function (metamodel) {
    'use strict';
//console.log(metamodel);
    //console.log('validating metamodel');
    istar.validateMetamodel(metamodel);
    //console.log('metamodel is valid');

    createCellNames(metamodel);

    createHelperGetNamesFunctions(metamodel);
    setupCellsSpecificPrototypes(metamodel);
    setupCellsGeneralPrototypes(metamodel);

    //console.log('end of metamodel setup');
    return metamodel;

    function createCellNames(metamodel) {
        //for each Cell Type in the metamodel, create an attribute with their name,
        //allowing to know the name of the Type from within its definition object
        var allCellTypes = _.concat(metamodel.containers, metamodel.nodes, metamodel.containerLinks,
            metamodel.dependencyLinks, metamodel.nodeLinks);
        _.forEach(allCellTypes, function (cellSupertype) {
            _.forEach(_.keys(cellSupertype), function (cellName) {
                cellSupertype[cellName].name = cellName;
            });
        });
    }

    //declaration of locally-scoped functions
    function createHelperGetNamesFunctions(metamodel) {
        //create helper functions that return arrays containing the names of sets of cells in this metamodel
        var getName = function (cellDefinition) {
            return cellDefinition.name;
        };
        metamodel.getContainersNames = function () {
            return _.map(metamodel.containers, getName);
        };
        metamodel.getNodesNames = function () {
            return _.map(metamodel.nodes, getName);
        };
        metamodel.getInnerElementsNames = function () {
            return _.map(
                _.filter(metamodel.nodes, 'canBeInnerElement'),
                getName);
        };
        metamodel.getDependumsNames = function () {
            return _.map(
                _.filter(metamodel.nodes, 'canBeDependum'),
                getName);
        };
        metamodel.getContainerLinksNames = function () {
            return _.map(metamodel.containerLinks, getName);
        };
        metamodel.getDependencyLinksNames = function () {
            return _.map(metamodel.dependencyLinks, getName);
        };
        metamodel.getNodeLinksNames = function () {
            return _.map(metamodel.nodeLinks, getName);
        };
    }

    function setupCellsSpecificPrototypes(metamodel) {
        _.forEach(metamodel.containers, function (cellType) {
            attachShapeObject(cellType, metamodel, 'container');
            createIsCellFunctions(cellType);
            createAddElementFunction(cellType);
            istar.setup.createContainerFunctions(cellType.shapeObject.prototype);
        });
        _.forEach(metamodel.nodes, function (cellType) {
            attachShapeObject(cellType, metamodel, 'node');
            createIsCellFunctions(cellType);
            createAddElementFunction(cellType);
            setupNodeAttributesDefaultValues(cellType);
        });
        _.forEach(metamodel.containerLinks, function (cellType) {
            attachShapeObject(cellType, metamodel, 'containerLink');
            createIsCellFunctions(cellType);
            createAddContainerLinkFunction(cellType);
        });
        _.forEach(metamodel.dependencyLinks, function (cellType) {
            attachShapeObject(cellType, metamodel, 'dependencyLink');
            createIsCellFunctions(cellType);
        });
        _.forEach(metamodel.nodeLinks, function (cellType) {
            attachShapeObject(cellType, metamodel, 'nodeLink');
            createIsCellFunctions(cellType);
            createAddNodeLinkFunction(cellType);
        });
    }

    function attachShapeObject(cellType, metamodel, kindOfCell) {
        //attach to the individual Cell Type definition the shape object that is used to create its view
        if (cellType.name) {
            if ((!cellType.shapeObject) && metamodel.shapesObject) {
                cellType.shapeObject = metamodel.shapesObject[cellType.name];
            }
            if (!cellType.shapeObject) {
                //if no shape is defined, add a default shape, otherwise functions based on visual attributes will fail
                if (kindOfCell === 'node') {
                    cellType.shapeObject = joint.shapes.istar.DefaultNode;
                }
                else if (kindOfCell === 'container') {
                    cellType.shapeObject = joint.shapes.istar.DefaultContainer;
                }
                else if (kindOfCell === 'containerLink') {
                    cellType.shapeObject = joint.shapes.istar.DefaultContainerLink;
                }
                else {
                    cellType.shapeObject = joint.shapes.istar.DefaultNodeLink;
                }
            }
        }
    }

    function createIsCellFunctions(cellType) {
        if (cellType.name) {
            //creates an 'isX' function that can be used to check if a given node is of this type
            //Example: if the cellType is Actor, an isActor() function will be created
            joint.dia.Cell.prototype['is' + cellType.name] = function () {
                return this.prop('type') === cellType.name;
            };

            //if a 'isValid' function has not been defined, create a default
            //function that poses no constraint
            if (! cellType.isValid) {
                cellType.isValid = function () {return {isValid: true, message: ''};};
            }
            // cellType.isValid = function () {return {isValid: true, message: ''};}; //uncomment to remove all constraints
        }
    }

    function createAddElementFunction (elementType) {
        //creates an 'add' function that can be used to create instances of this type
        //Example: if the cellType is Actor, an addActor() function will be created
        if (elementType.name) {
            istar['add' + elementType.name] = function (content, options) {
                return istar.base.addNode(elementType, content, options);
            };
        }
    }

    function createAddContainerLinkFunction (linkType) {
        istar['add' + linkType.name] = function (source, target) {
            if (istar.metamodel.containerLinks[linkType.name].isValid(source, target)) {
                return istar.addLinkBetweenActors(linkType, source, target);
            }
        };
    }

    function createAddNodeLinkFunction (linkType) {
        istar['add' + linkType.name] = function (source, target, label) {
            if (istar.metamodel.nodeLinks[linkType.name].isValid(source, target)) {
                return istar.addLinkBetweenNodes(linkType, source, target, label);
            }
        };
    }

    function setupCellsGeneralPrototypes(metamodel) {
        joint.dia.Cell.prototype.isContainerLink = function () {
            return _.includes(metamodel.getContainerLinksNames(), this.prop('type'));
        };
        joint.dia.Cell.prototype.isActorLink = joint.dia.Cell.prototype.isContainerLink;
        joint.dia.Cell.prototype.isNodeLink = function () {
            return _.includes(metamodel.getNodeLinksNames(), this.prop('type'));
        };
        joint.dia.Cell.prototype.isNode = function () {
            return _.includes(metamodel.getInnerElementsNames(), this.prop('type'));
        };
        joint.dia.Cell.prototype.isDependum = function () {
            //this function does not inform if this type can be dependum.
            // Instead, it informs whether this instance is an actual dependum in the present graph
            return this.prop('isDependum') || false;
        };
        joint.dia.Cell.prototype.isContainer = function () {
            return _.includes(metamodel.getContainersNames(), this.prop('type'));
        };
        joint.dia.Cell.prototype.isKindOfActor = joint.dia.Cell.prototype.isContainer;
        joint.dia.Cell.prototype.isCell = function () {
            return true;
        };
    }

    function setupNodeAttributesDefaultValues (elementType) {
        //canBeInnerElement default value: false
        //canBeDependum default value: false
        //canBeOnPaper default value: true

        if (elementType.canBeOnPaper === undefined) {
            elementType.canBeOnPaper = true;
        }
    }
};

/*definition of globals to prevent undue JSHint warnings*/
/*globals istar:false, joint:false, _:false, console:false *//*definition of globals to prevent undue JSHint warnings*/
/*globals joint:false, $:false, _:false, ui:false, console:false */

/*!
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 *
 * If you are going to edit the code, always work from the source-code available for download at
 * https://github.com/jhcp/pistar
 */

istar.fileManager = function() {
    'use strict';

    var invalidMessages = [];

    function getCustomPropertiesJSON (cell) {
        return cell.prop('customProperties');
    }

    //Polyfill for when the browser does not support canvas.toBlob()
    //From https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
    if (!HTMLCanvasElement.prototype.toBlob) {
        Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
            value: function (callback, type, quality) {
                var canvas = this;
                setTimeout(function () {

                    var binStr = atob(canvas.toDataURL(type, quality).split(',')[1]),
                        len = binStr.length,
                        arr = new Uint8Array(len);

                    for (var i = 0; i < len; i++) {
                        arr[i] = binStr.charCodeAt(i);
                    }

                    callback(new Blob([arr], {type: type || 'image/png'}));

                });
            }
        });
    }

    return {
        saveSvg: function(paper) {

            var data = '{"actors":[{"id":"bda083fe-1fb4-41cf-aea9-449c0d4044b5","text":"Business Analyst","type":"istar.Role","x":50,"y":50,"customProperties":{"Description":"Someone that needs to undestand the goals of an organizations"},"nodes":[{"id":"71c7aeb6-fb99-40a1-bcd1-5a29e5b45252","text":"i* models created","type":"istar.Goal","x":151,"y":68,"customProperties":{"Description":"This tool supports the creation of goal model using the i* 2.0 language (iStar 2.0)"}},{"id":"8d716a61-1ca4-44f4-934c-26166ea44d11","text":"Use the piStar Tool","type":"istar.Task","x":106,"y":250,"customProperties":{"Description":"You can use it for free, without worrying about installations"}},{"id":"e159ce92-b29d-4fdc-a533-ee1e904f9f57","text":"Good visual quality","type":"istar.Quality","x":84,"y":139,"customProperties":{"Description":"- no visual artefacts due to compression or rescaling;\n - aesthetically similar to the diagrams from the i* Wiki guides"}},{"id":"3e732026-ae4c-4038-acb7-bd9f036c5f73","text":"Reliable usage","type":"istar.Quality","x":216,"y":152,"customProperties":{"Description":""}}]},{"id":"fcf67803-5e5a-4bae-8690-1f12af4446d6","text":"piStar tool v2.1.0","type":"istar.Agent","x":357.78511295234557,"y":132.05282671106096,"customProperties":{"ReleaseDate":"November 29th, 2021"},"nodes":[{"id":"339417b8-0430-4ceb-be12-d6cf7b440a35","text":"Prevent data loss","type":"istar.Quality","x":400.78511295234557,"y":177.05282671106096,"customProperties":{"Description":""}},{"id":"3c4eacd1-cc6b-4c1e-8a9e-2260229d831f","text":"Confirm before deleting actors","type":"istar.Task","x":536.7851129523456,"y":287.05282671106096,"customProperties":{"Description":"Only delete an actor after confirmation from the user","Since":"Version 2.1.0"}},{"id":"2904a233-4620-461c-978a-0058a4d3bdc4","text":"Undo deletes","type":"istar.Task","x":586.7851129523456,"y":189.05282671106096,"customProperties":{"Description":"Undo through Ctrl+z, Command+z, or through the \"Undo delete\" button on the menu bar","Since":"Version 2.1.0"}}]}],"orphans":[],"dependencies":[{"id":"7af8ec40-8f4f-4904-8130-f33157427ca9","text":"Prevent data loss","type":"istar.Quality","x":236.97275697129356,"y":329.9119933878281,"customProperties":{"Description":""},"source":"3e732026-ae4c-4038-acb7-bd9f036c5f73","target":"339417b8-0430-4ceb-be12-d6cf7b440a35"}],"links":[{"id":"f834a34d-297c-4e99-9c92-26c6dc41715b","type":"istar.DependencyLink","source":"7af8ec40-8f4f-4904-8130-f33157427ca9","target":"339417b8-0430-4ceb-be12-d6cf7b440a35"},{"id":"25cfda01-9cca-47ab-94cf-b5fff1c53e3a","type":"istar.DependencyLink","source":"3e732026-ae4c-4038-acb7-bd9f036c5f73","target":"7af8ec40-8f4f-4904-8130-f33157427ca9"},{"id":"f86594bb-615f-486a-986f-880112f36801","type":"istar.ContributionLink","source":"8d716a61-1ca4-44f4-934c-26166ea44d11","target":"e159ce92-b29d-4fdc-a533-ee1e904f9f57","label":"help"},{"id":"35617ce5-cf3f-4c1a-8ee5-37482d862ac1","type":"istar.ContributionLink","source":"3c4eacd1-cc6b-4c1e-8a9e-2260229d831f","target":"339417b8-0430-4ceb-be12-d6cf7b440a35","label":"help"},{"id":"6f7ee550-9ecd-42d0-a7c0-1a7f433c106b","type":"istar.ContributionLink","source":"2904a233-4620-461c-978a-0058a4d3bdc4","target":"339417b8-0430-4ceb-be12-d6cf7b440a35","label":"make"},{"id":"d56b6da1-1821-4b65-ad4c-28c650b78eff","type":"istar.QualificationLink","source":"e159ce92-b29d-4fdc-a533-ee1e904f9f57","target":"71c7aeb6-fb99-40a1-bcd1-5a29e5b45252"},{"id":"288f967d-86b6-4318-8728-076fa97046dd","type":"istar.QualificationLink","source":"3e732026-ae4c-4038-acb7-bd9f036c5f73","target":"71c7aeb6-fb99-40a1-bcd1-5a29e5b45252"}],"display":{"fcf67803-5e5a-4bae-8690-1f12af4446d6":{"backgroundColor":"#9AB6FA"},"339417b8-0430-4ceb-be12-d6cf7b440a35":{"width":113.81524658203125,"height":65.8504638671875},"3c4eacd1-cc6b-4c1e-8a9e-2260229d831f":{"backgroundColor":"#9AB6FA","width":104.78125,"height":47.84375},"2904a233-4620-461c-978a-0058a4d3bdc4":{"backgroundColor":"#9AB6FA"},"7af8ec40-8f4f-4904-8130-f33157427ca9":{"width":107.81314086914062,"height":49.848907470703125},"35617ce5-cf3f-4c1a-8ee5-37482d862ac1":{"vertices":[{"x":555.7851129523456,"y":249.05282671106096}]},"6f7ee550-9ecd-42d0-a7c0-1a7f433c106b":{"vertices":[{"x":557.7851129523456,"y":196.05282671106096}]}},"tool":"pistar.2.1.0","istar":"2.0","saveDate":"Sun, 03 Mar 2024 15:58:35 GMT","diagram":{"width":1000,"height":700,"name":"Welcome Model","customProperties":{"Description":"Welcome to the piStar tool version 2.1.0, released on November, 2021! This model describes some of the recent improvements in the tool. Click on the purple elements for further info.\n\nFor help using this tool, please check the Help menu above"}}}';
            ui.resetCellDisplayStates();
                        istar.fileManager.loadModel(data);//do the actual loading
                        ui.selectPaper();//select the model (as a whole)

            //access the SVG element and serialize it
            $('svg').attr('width', istar.paper.getArea().width);
            $('svg').attr('height', istar.paper.getArea().height);
            // console.log(document.getElementById(paperId).childNodes[2]);
            // var text = (new XMLSerializer()).serializeToString(document.getElementById(paperId).childNodes[2]);
            var text = (new XMLSerializer()).serializeToString(paper.$('svg').get(0));//.childNodes[2]);
            $('svg').attr('width', '100%');
            $('svg').attr('height', '100%');

            // 27 august 2024 - Chiara edited: modified for ModeLLEr
            //return "data:image/svg+xml," + encodeURIComponent(text);
            return text;
        },
        savePng: function (paperId, callback, filename, resolutionFactor, transparent) {
            //create a canvas, which is used to convert the SVG to png
            var canvas = document.createElement('canvas');
            var canvasContext = canvas.getContext('2d');

            //create a img (DOM element) with the SVG content from our paper. This element will later be inserted in the canvas for converting to PNG
            var imageElement = new Image();
            $('svg').attr('width', istar.paper.getArea().width);
            $('svg').attr('height', istar.paper.getArea().height);
            var text = (new XMLSerializer()).serializeToString(document.getElementById(paperId).childNodes[2]);
            $('svg').attr('width', '100%');
            $('svg').attr('height', '100%');
            imageElement.src = "data:image/svg+xml," + encodeURIComponent(text);

            imageElement.onload = function () {
                canvas.width = imageElement.width * resolutionFactor; //multiply the width for better resolution
                canvas.height = imageElement.height * resolutionFactor; //multiply the height for better resolution
                if ( !transparent ) {
                    //fill the canvas with a color
                    canvasContext.fillStyle = 'white';
                    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
                }
                canvasContext.drawImage(imageElement, 0, 0, canvas.width, canvas.height);//insert the SVG image into the canvas. This does the actual rasterization of the image

                canvas.toBlob(function (blob) {
                    callback(blob, filename + '.png');
                });

            };

        },
        saveModel: function () {
            var diagram = {width: 1300, height: 1300};
            diagram.width = istar.paper.getArea().width;
            diagram.height = istar.paper.getArea().height;
            if (istar.graph.prop('name')) {
                diagram.name = istar.graph.prop('name');
            }
            var customPropertiesJSON = getCustomPropertiesJSON(istar.graph);
            if (customPropertiesJSON) {
                diagram.customProperties = customPropertiesJSON;
            }

            var date = new Date().toGMTString();

            var modelJSON = {
                'actors': [],
                'orphans': [],
                'dependencies': [],
                'links': [],
                'display': {},
                'tool': 'pistar.2.1.0',
                'istar': '2.0',
                'saveDate': date,
                'diagram': diagram
            };

            var toCollapse = [];
            var vertices = [];

            _.forEach(istar.graph.getElements(), function (element) {
                if (element.isKindOfActor()) {
                    var actorJSON = elementToJSON(element);

                    //it is necessary to expand collapsed actors in order
                    //to get proper sources and targets for any dependency links
                    if (element.prop('collapsed')) {
                        toCollapse.push(element);//stores the actor in order to collapse it again afterwards
                        element.uncollapse();
                    }

                    if (element.prop('backgroundColor')) {
                        modelJSON.display[element.id] = {backgroundColor: element.prop('backgroundColor')};
                    }

                    var children = childrenToJSON(element);
                    $.extend(true, modelJSON.display, children.display);
                    actorJSON.nodes = children.nodes;
                    modelJSON.actors.push(actorJSON);
                }
                else if (element.isDependum()) {
                    var dependency = elementToJSON(element);
                    dependency.source = istar.graph.getConnectedLinks(element, {inbound: true})[0].attributes.source.id;
                    dependency.target = istar.graph.getConnectedLinks(element, {outbound: true})[0].attributes.target.id;

                    // if (element.prop('backgroundColor')) {
                    //   modelJSON.display[element.id] = {backgroundColor: element.prop('backgroundColor')};
                    // }

                    var display = {};
                    var needToSaveDisplay = false;
                    if (element.prop('backgroundColor')) {
                        display.backgroundColor = element.prop('backgroundColor');
                        needToSaveDisplay = true;
                    }
                    if (element.prop('size/width') !== element.prop('originalSize/width')) {
                        display.width = element.prop('size/width');
                        needToSaveDisplay = true;
                    }
                    if (element.prop('size/height') !== element.prop('originalSize/height')) {
                        display.height = element.prop('size/height');
                        needToSaveDisplay = true;
                    }

                    if (needToSaveDisplay === true) {
                        modelJSON.display[[element.id]] = display;
                    }

                    modelJSON.dependencies.push(dependency);
                }
                else if (!element.attributes.parent) {
                    var orphan = elementToJSON(element);
                    var display = {};
                    var needToSaveDisplay = false;
                    if (element.prop('backgroundColor')) {
                        display.backgroundColor = element.prop('backgroundColor');
                        needToSaveDisplay = true;
                    }
                    if (element.prop('size/width') !== element.prop('originalSize/width')) {
                        display.width = element.prop('size/width');
                        needToSaveDisplay = true;
                    }
                    if (element.prop('size/height') !== element.prop('originalSize/height')) {
                        display.height = element.prop('size/height');
                        needToSaveDisplay = true;
                    }

                    if (needToSaveDisplay === true) {
                        modelJSON.display[[element.id]] = display;
                    }

                    modelJSON.orphans.push(orphan);
                }
            });
            _.forEach(istar.graph.getLinks(), function (link) {
                var linkJSON = linkToJSON(link);
                var typeName = link.prop('type');
                if (istar.metamodel.nodeLinks[typeName] && istar.metamodel.nodeLinks[typeName].changeableLabel) {
                    linkJSON.label = link.prop('value');
                }

                var vertices = link.get('vertices');
                if (vertices) {
                    if (vertices.length > 0) {
                        modelJSON.display[link.id] = {vertices: vertices};//add the vertices to the save file
                    }
                }

                modelJSON.links.push(linkJSON);
            });

            _.forEach(toCollapse, function (actor) {
                modelJSON.display[actor.id] = {collapsed: true};//add the collapsing information to the save file
                actor.collapse();//collapses the actor, thus returning it to its original state
            });

            return outputSavedModel(modelJSON);

            function childrenToJSON (element) {
                var result = {nodes: [], display: {}};

                _.forEach(element.getEmbeddedCells(), function (element) {
                    if (element.isNode()) {
                        var node = elementToJSON(element);
                        var display = {};
                        var needToSaveDisplay = false;
                        if (element.prop('backgroundColor')) {
                            display.backgroundColor = element.prop('backgroundColor');
                            needToSaveDisplay = true;
                        }
                        if (element.prop('size/width') !== element.prop('originalSize/width')) {
                            display.width = element.prop('size/width');
                            needToSaveDisplay = true;
                        }
                        if (element.prop('size/height') !== element.prop('originalSize/height')) {
                            display.height = element.prop('size/height');
                            needToSaveDisplay = true;
                        }

                        if (needToSaveDisplay === true) {
                            result.display[[element.id]] = display;
                        }
                        result.nodes.push(node);
                    }
                });

                return result;
            }

            function elementToJSON (element) {
                var text = element.prop('name');
                var result = {
                    'id': element.id,
                    'text': text,
                    'type': istar.metamodel.prefix + '.' + element.prop('type'),
                    'x': element.prop('position/x'),
                    'y': element.prop('position/y')
                };

                var customPropertiesJSON = getCustomPropertiesJSON(element);
                if (customPropertiesJSON) {
                    result.customProperties = customPropertiesJSON;
                }

                return result;
            }

            function linkToJSON (link) {
                var result = {
                    id: link.id,
                    type: istar.metamodel.prefix + '.' + link.prop('type'),
                    source: link.attributes.source.id,
                    target: link.attributes.target.id
                };
                if (link.prop('name')) {
                    result.name = link.prop('name');
                }
                var customPropertiesJSON = getCustomPropertiesJSON(link);
                if (customPropertiesJSON) {
                    result.customProperties = customPropertiesJSON;
                }
                return result;
            }

            function outputSavedModel (modelJson, newTab) {
                var stringifiedModel = JSON.stringify(modelJson, null, 2);
                if (newTab) {
                    window.open("data:text/json;charset=utf-8," + encodeURI(stringifiedModel));//this open the content of the file in a new tab
                }
                return stringifiedModel;
            }
        },
        loadModel: function (inputRaw) {
            if (inputRaw) {
                invalidMessages = [];
                //istar.clearModel();

                try {
                    var inputModel = $.parseJSON(inputRaw);
                } catch (e) {
                    // if failed to parse, consider that the input already is a JSON object
                    var inputModel = inputRaw;
                }

                if (inputModel.diagram) {
                    if (inputModel.diagram.width && inputModel.diagram.height) {
                        istar.paper.setDimensions(inputModel.diagram.width, inputModel.diagram.height);
                    }
                    istar.graph.prop('name', inputModel.diagram.name);
                    if (inputModel.diagram.customProperties) {
                        istar.graph.prop('customProperties', inputModel.diagram.customProperties)
                    }
                }

                var toCollapse = [];

                if (inputModel.orphans) {
                    //create orphan elements
                    _.forEach(inputModel.orphans, function (element) {
                        var orphan = addLoadedElement(element, inputModel.display);

                    });
                }

                if (inputModel.actors) {
                    //create actors and inner elements
                    for (var i = 0; i < inputModel.actors.length; i++) {
                        var actor = inputModel.actors[i];
                        var parent = addLoadedElement(actor, inputModel.display);
                        for (var j = 0; j < actor.nodes.length; j++) {
                            var child = addLoadedElement(actor.nodes[j], inputModel.display);
                            if (child) {
                                parent.embedNode(child);
                            }
                        }
                        if (inputModel.display && inputModel.display[actor.id]) {
                            if (inputModel.display[actor.id].collapsed) {
                                toCollapse.push(parent);
                            }
                            if (inputModel.display[actor.id].backgroundColor) {
                                ui.changeColorElement(inputModel.display[actor.id].backgroundColor, parent);
                            }
                        }
                    }

                    //create dependencies
                    for (i = 0; i < inputModel.dependencies.length; i++) {
                        var element = inputModel.dependencies[i];
                        var depender = istar.graph.getCell(element.source);
                        var dependum = addLoadedElement(element, inputModel.display);
                        var dependee = istar.graph.getCell(element.target);

                        var isValid = istar.metamodel.dependencyLinks['DependencyLink'].isValid(depender, dependee, (dependum.prop('type') + 'DependencyLink'));
                        if (!isValid.isValid) {
                            processInvalidLink('DependencyLink', depender, dependee, isValid);
                        }

                        var links = istar.addDependency(depender, dependum, dependee);
                        links[0].on('change:vertices', ui._toggleSmoothness);
                        links[1].on('change:vertices', ui._toggleSmoothness);

                        for (var j = 0; j < inputModel.links.length; j++) {
                            var linkJSON = inputModel.links[j];
                            if (linkJSON.target === element.id) {
                                if (inputModel.display && inputModel.display[linkJSON.id] && inputModel.display[linkJSON.id].vertices) {
                                    links[0].set('vertices', inputModel.display[linkJSON.id].vertices);
                                }
                                if (linkJSON.name) {
                                    links[0].prop('name', linkJSON.name);
                                }
                                if (linkJSON.customProperties) {
                                    links[0].prop('customProperties', linkJSON.customProperties);
                                }
                            }
                            if (linkJSON.source === element.id) {
                                if (inputModel.display && inputModel.display[linkJSON.id] && inputModel.display[linkJSON.id].vertices) {
                                    links[1].set('vertices', inputModel.display[linkJSON.id].vertices);
                                }
                                if (linkJSON.name) {
                                    links[1].prop('name', linkJSON.name);
                                }
                                if (linkJSON.customProperties) {
                                    links[1].prop('customProperties', linkJSON.customProperties);
                                }
                            }
                        }

                        if (ui) {
                            ui.setupDependencyRemoval(links);
                        }

                        dependum.prop('position/x', element.x);
                        dependum.prop('position/y', element.y);



                    }

                    //create links
                    for (i = 0; i < inputModel.links.length; i++) {
                        var linkJSON = inputModel.links[i];
                        if (! isDependencyLink(linkJSON)) {
                            var newLink = addLoadedLink(linkJSON);
                            if (inputModel.display && inputModel.display[linkJSON.id] && inputModel.display[linkJSON.id].vertices) {
                                newLink.set('vertices', inputModel.display[linkJSON.id].vertices);
                            }
                        }
                    }

                    for (var i = 0; i < toCollapse.length; i++) {
                        toCollapse[i].collapse();
                    }
                }

            }
            if (_.size(invalidMessages)>0) {
                istar.displayInvalidModelMessages(invalidMessages);
            }

            function addLoadedElement (element, display) {
                if (element.id && element.type && element.x && element.y) {
                    element.text = element.text || '';
                    var type = element.type.split('.')[1];
                    if (istar['add' + type]) {
                        var position = {x: element.x, y: element.y};
                        //obs: the id MUST be passed during creation, can't be changed later
                        // console.log(element.text);
                        var newElement = istar['add' + type](element.text, {id: element.id, position: position});

                        if (element.customProperties) {
                            newElement.prop('customProperties', element.customProperties);
                        }

                        if (display && display[element.id]) {
                            var size = {};
                            if (display[element.id].backgroundColor) {
                                ui.changeColorElement(display[element.id].backgroundColor, newElement);
                            }
                            if (display[element.id].width) {
                                size.width = display[element.id].width;
                            }
                            if (display[element.id].height) {
                                size.height = display[element.id].height;
                            }
                            if (size.width || size.height) {
                                size.width = size.width || newElement.prop('size/width');
                                size.height = size.height || newElement.prop('size/height');
                                newElement.resize(size.width, size.height);
                            }
                        }

                        newElement.updateLineBreak();

                        return newElement;
                    } else {
                        var errorMessage = 'Unknown element type: ' + element.type + '. Your model will not load properly';
                        console.log(errorMessage);
                        alert(errorMessage);
                    }
                }
            }

            function addLoadedLink (linkJSON) {
                if (linkJSON.id && linkJSON.type && linkJSON.source && linkJSON.target) {
                    var typeNameWithoutPrefix = linkJSON.type.split('.')[1];
                    if (istar['add' + typeNameWithoutPrefix]) {
                        var sourceObject = istar.graph.getCell(linkJSON.source);
                        var targetObject = istar.graph.getCell(linkJSON.target);
                        if (_.includes(istar.metamodel.getNodeLinksNames(), typeNameWithoutPrefix)) {
                            var isValid = istar.metamodel.nodeLinks[typeNameWithoutPrefix].isValid(sourceObject, targetObject);
                            if (!isValid.isValid) {
                                processInvalidLink(typeNameWithoutPrefix, sourceObject, targetObject, isValid);
                            }
                        } else if (_.includes(istar.metamodel.getContainerLinksNames(), typeNameWithoutPrefix)) {
                            var isValid = istar.metamodel.containerLinks[typeNameWithoutPrefix].isValid(sourceObject, targetObject);
                            if (!isValid.isValid) {
                                processInvalidLink(typeNameWithoutPrefix, sourceObject, targetObject, isValid);
                            }
                        }

                        var newLink = istar['add' + typeNameWithoutPrefix](sourceObject, targetObject, linkJSON.label);

                        if (linkJSON.name) {
                            newLink.prop('name', linkJSON.name);
                        }
                        if (linkJSON.customProperties) {
                            newLink.prop('customProperties', linkJSON.customProperties);
                        }
                        // Update according to https://www.cin.ufpe.br/~jhcp/pistar/tool/app/istarcore/fileManager.js
                        /* var shapeObject = new istar.metamodel.nodeLinks[typeNameWithoutPrefix].shapeObject();
                        if (shapeObject.attr('smooth')) {
                            newLink.on('change:vertices', ui._toggleSmoothness);
                        }*/
                        if (typeNameWithoutPrefix === 'ContributionLink') {
                            newLink.on('change:vertices', ui._toggleSmoothness);
                        }
                        return newLink;
                    } else {
                        var errorMessage = 'Unknown link type: ' + linkJSON.type + '.';
                        console.log(errorMessage);
                        alert(errorMessage);
                    }
                }
            }

            function processInvalidLink (typeName, source, target, isValid) {
                var parent = source.parent();
                var parentText = '';
                if (parent) {
                    parentText = 'In ' + istar.graph.getCell(parent).prop('name') + ', ';
                }
                var message = parentText + typeName + ' from "' + source.prop('name') + '" to "' +
                    target.prop('name') + '": ' + isValid.message;
                invalidMessages.push(message);
            }

            function isDependencyLink (linkJSON) {
                var result = false;
                if (linkJSON.id && linkJSON.type) {
                    if (linkJSON.type.includes('DependencyLink')) {
                        result = true;
                    }
                }
                return result;
            }
        }
    };
}();

istar.undoManager = {
    historyStack: [],
    current: -1,
    callback: function(empty) {},
    undo: function() {
      if (this.current < 0) {
        return;
      }
  
      this.historyStack[this.current]();
      this.current -= 1;
      this.callback(this.current < 0);
    },
    addToHistory: function(undoAction) {
      // Erase the already undone actions before adding a new action to the stack
      if (this.current + 1 < this.historyStack.length) {
        this.historyStack = this.historyStack.slice(0, this.current + 1);
      }
  
      this.historyStack.push(undoAction);
      this.current += 1;
      this.callback(this.current < 0);
    },
    reset: function() {
      this.historyStack = [];
      this.current = -1;
      this.callback(this.current);
    }
  };


  /*!
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 *
 * If you are going to edit the code, always work from the source-code available for download at
 * https://github.com/jhcp/pistar
 */

var ui = function() {
    'use strict';

    var selectedCell = null;

    return {
        states: {
            editor: {
                current: 2,
                ADDING: {
                    ADD_CONTAINER: 101,
                    ADD_NODE: 102,
                    ADD_LINK: 103,
                    data: {
                        button: null, /* the 'add button' that is currently selected */
                        typeNameToAdd: null, /* the name of the type that is to be added */
                        linkSourceView: null,
                        linkTargetView: null,
                        linkValue: null,
                        isLinkSourceUndefined: function () {
                            return this.linkSourceView === null;
                        }
                    }
                },
                VIEWING: 2,
                EDITING_TEXT: 3,
                isAdding: function() {
                    return (this.current === this.ADDING.ADD_CONTAINER || this.current === this.ADDING.ADD_NODE || this.current === this.ADDING.ADD_LINK);
                },
                isAddingContainer: function () {
                    return this.current === this.ADDING.ADD_CONTAINER;
                },
                isAddingNode: function () {
                    return this.current === this.ADDING.ADD_NODE;
                },
                isAddingLink: function () {
                    return this.current === this.ADDING.ADD_LINK;
                },
                isViewing: function () {
                    return this.current === this.VIEWING;
                },
                isEditingText: function () {
                    return this.current === this.EDITING_TEXT;
                },
                transitionTo: function (targetState) {
                    if (this.isAdding()) {
                        //perform some cleanup in the UI when the transition is leaving the ADDING state
                        if (this.ADDING.data.linkSourceView && this.ADDING.data.linkSourceView.unhighlight) {
                            this.ADDING.data.linkSourceView.unhighlight();
                        }
                        ui.changeAddMenuStatus('');
                        ui.resetPointerStyles();

                        //reset the state variables
                        this.ADDING.data.button = null;
                        this.ADDING.data.typeNameToAdd = null;
                        this.ADDING.data.linkSourceView = null;
                        this.ADDING.data.linkTargetView = null;
                        this.ADDING.data.linkValue = null;
                    }

                    //actually change state
                    this.current = targetState;

                    //console.log('editor state changed to ' + targetState);
                }
            },
            cellDisplay: {
                dependencies: {
                    NORMAL: 0,
                    PARTIAL: 1,
                    HIDDEN: 2,
                    currentState: 0
                },
                contributionLinks: {
                    NORMAL: 0,
                    PARTIAL: 1,
                    HIDDEN: 2,
                    currentState: 0
                }
            }
        },

        defaultElementBackgroundColor: '#CCFACD',

        getSelectedCells: function() {
            return [this.selectedCell];
        },
        getSelectedCellsAmount: function() {
            if (! this.getSelectedCells()[0].isCell()) {
                //if the paper is selected
                return 0;
            }
            else {
                return _.size(this.getSelectedCells());
            }
        },
        selectCell: function(cell) {
            if (cell) {
                var toTrigger = false;
                if (this.selectedCell && this.selectedCell !== cell) {
                    this.deselectCell();
                }
                if (this.selectedCell !== cell) {
                    //there is no need to trigger a change:selection event if the same cell is being selected
                    toTrigger = true;
                }

                //actual selection change
                this.selectedCell = cell;

                if (toTrigger) {
                    istar.paper.trigger('change:selection', {selectedCell: cell});
                }
                if (cell.isElement()) {
                    $('#sidepanel-tab-style').show();
                }
                else {
                    $('#sidepanel-tab-style').hide();
                }
            }
        },
        deselectCell: function(_cell) {
            var cell = _cell || ui.selectedCell;
            if (cell) {
                //actual selection change
                this.selectedCell = null;

                istar.paper.trigger('change:selection', {deselectedCell: cell});
            }
        },
        selectPaper: function() {

            if (this.selectedCell !== istar.graph) {
                this.deselectCell();
                this.selectedCell = istar.graph;
                istar.paper.trigger('change:selection', {selectedCell: istar.graph});

                //closes any color picker that may be open
                $('.jscolor').each(function () {
                    this.jscolor.hide();
                });

                $('#sidepanel-tab-style').hide();
                $('#sidepanel-tab-properties a').tab('show');
            }

        },
        hideSelection: function() {
            $('#resize-handle').hide();
            $('.cell-selection').hide();
        },
        showSelection: function(_cell) {
            var cell = _cell || this.selectedCell;
            var cellView = istar.paper.findViewByModel(cell);
            if (cellView) {
                var cellBox = cellView.getBBox();

                //positioning and display of the selection box
                $('.cell-selection').css({
                    left: cellBox.x-6 + 'px',
                    top: cellBox.y-6 + 'px',
                    width: (cellBox.width + 12.5) + 'px',
                    height: (cellBox.height + 12) + 'px'
                });
                $('.cell-selection').show();

                //positioning and display of the resizing handle, when applicable
                if (cellView.model.isElement() && (! cellView.model.isKindOfActor()) ) {
                    $('#resize-handle').css({left: cellBox.x - 2 + cellBox.width, top: cellBox.y - 2 + cellBox.height});
                    $('#resize-handle').show();
                }

            }
        },
        collectActionData: function(a,b,c) {console.log(a,b,c); /* empty function added when deploying */ },
        collectErrorData: function() { /* empty function added when deploying */ }
    };
}();

ui.defineInteractions = function () {
    'use strict';

    //this redefinition was used, instead of on('remove'), because when the 'remove' event is triggered the
    //node has already been removed, thus it would be too late to know whom is the parent
    var originalRemove = joint.dia.Cell.prototype.remove;
    joint.dia.Cell.prototype.remove = function(opt) {
        var parent = this.get('parent');
        originalRemove.call(this, opt);
        if (parent) {
            istar.graph.getCell(parent).updateBoundary();
        }
    };

    istar.graph.on('add', function(cell) {
        if (cell.isElement()) {
            cell.on('change:name', function(node, newValue) {
                node.setNodeLabel(newValue);
            });
        }
        else if (cell.isLink()) {
            var verticesTool = new joint.linkTools.Vertices({snapRadius: 1});
            var toolsView = new joint.dia.ToolsView({tools: [verticesTool]});
            cell.findView(istar.paper).addTools(toolsView).hideTools();
            cell.on('change:vertices', function(linkModel, a, b) {
                if (! b.translateBy) {
                    //this 'if' prevents updating the selection when the link is being translated along with its parent
                    ui.showSelection();
                    ui.selectCell(linkModel);
                }
            });
        }
    });

    istar.paper.on('link:mouseenter', function(linkView) {
        //highlights a hovered link, which indicates to the user that it is interactive
        linkView.showTools();
        linkView.model.attr('connection-wrap/strokeWidth', 30);
        linkView.model.attr('connection-wrap/stroke', 'rgba(190, 190, 190, 1)');
    });

    istar.paper.on('link:pointerdblclick', function(linkView, a, b) {
        //hide link tools when a vertex is removed
        linkView.hideTools();
        linkView.model.attr('connection-wrap/stroke', 'transparent');
    });

    istar.paper.on('link:pointerup', function(linkView) {
        ui.selectCell(linkView.model, linkView);
    });

    istar.paper.on('link:mouseleave', function(linkView) {
        linkView.hideTools();
        linkView.model.attr('connection-wrap/stroke', 'rgba(190, 190, 190, 0)');
    });

    istar.paper.on('change:selection', function(selection) {
        if (selection.selectedCell) {
            ui.table = new ui.components.PropertiesTableView({model: selection.selectedCell}).render();
            if (selection.selectedCellView) {
                ui.showSelection(selection.selectedCell);
            }
        }
        else if (selection.deselectedCell){
            ui.hideSelection();
            ui.table.remove();
            $('#properties-table').find('tbody').html('');
            $('#cell-buttons').html('');
        }
    });

    istar.paper.on('blank:pointerdown', function (evt, x, y) {
        //programatically remove focus from any active input, since JointJS prevents this default behavior
        $('input:focus').blur();

        if (ui.getSelectedCells()) {
            ui.selectPaper();
        }
        if (ui.states.editor.isAddingContainer()) {
            ui.addElementOnPaper({position: {x: x, y: y}});
        }
        if (ui.states.editor.isAddingNode()) {
            //gets a default bbox (first node in the metamodel) to use as bbox for positioning the
            //element in the diagram
            var nodes = _.keys(istar.metamodel.nodes);
            var bbox = (new istar.metamodel.nodes[nodes[0]].shapeObject()).getBBox();
            ui.addElementOnPaper({position: {
                    x: x - bbox.width/2,
                    y: y - bbox.height/2
                }});
        }
    });

    istar.paper.on('cell:mouseover', function (cellView, evt, x, y) {
        //reacts when the mouse is over a given element
        //.css() is used instead of .attr() because the latter is bugged with elements containing a path element
        //moreover, .css() doesn't change the actual atrributes of the element, which prevents mistakenly saving
        //the wrong styles and also makes it easier to restore to its previous style on mouseout
        var containerHighlightStrokeColor = '#1C5052';

        //highlights a container when it is hovered
        if (cellView.model.isKindOfActor()) {
            cellView.$('.boundary').css({stroke: containerHighlightStrokeColor, 'stroke-width': '4', fill: '#ddd'});
            cellView.$('.actorSymbol').css({stroke: containerHighlightStrokeColor, 'stroke-width': '3'});
            cellView.$('.actorDecorator').css({stroke: containerHighlightStrokeColor, 'stroke-width': '2'});
        }
        else {
            //if a node inside a container is hovered, highlight the container
            if (cellView.model.get('parent')) {
                var parentView = istar.paper.findViewByModel(istar.graph.getCell(cellView.model.get('parent')));
                parentView.$('.boundary').css({stroke: containerHighlightStrokeColor, 'stroke-width': '4', fill: '#ddd'});
                parentView.$('.actorSymbol').css({stroke: containerHighlightStrokeColor, 'stroke-width': '3'});
                parentView.$('.actorDecorator').css({stroke: containerHighlightStrokeColor, 'stroke-width': '2'});
            }

            //highlight the hovered element and its neighbors
            // if (cellView.model.isNode()) {
            //     cellView.$('.element').css({fill: 'black'});
            //     cellView.$('.content').css({fill: 'white'});
            //     cellView.$('.stereotype').css({fill: 'white'});
            //
            //     _.forEach(istar.graph.getNeighbors(cellView.model), function (cell) {
            //         cell.findView(istar.paper).$('.element').css({fill: '#FABF6E'});
            //     });
            // }

            //if a dependum is partially hidden, display it and its links normally while hovered
            if (ui.states.cellDisplay.dependencies.currentState === ui.states.cellDisplay.dependencies.PARTIAL && cellView.model.isDependum()) {
                //CSS opacity currently does not work for elements inside an SVG in Chrome
                //thus, model.attr() is used instead of view.css()
                cellView.model.prop('partiallyHiddenOpacity', cellView.model.attr('*/opacity'));
                cellView.model.attr('*/opacity', '1');
                _.forEach(istar.graph.getConnectedLinks(cellView.model), function (link) {
                    link.prop('partiallyHiddenOpacity', link.attr('*/opacity'));
                    link.attr('*/opacity', '1');
                });
            }

            //if contribution links are partially hidden, display the ones linked to this node normally while it is hovered
            if (ui.states.cellDisplay.contributionLinks.currentState === ui.states.cellDisplay.contributionLinks.PARTIAL) {
                //Links are only restored when a connected element is hovered. When the link itself is hovered it is not restored due to flickering
                if (cellView.model.isNode()) {
                    _.forEach(istar.graph.getConnectedLinks(cellView.model), function (link) {
                        //CSS opacity currently does not work for elements inside an SVG in Chrome
                        //thus, model.attr() is used instead of view.css()
                        if (! link.isDependencyLink()) {
                            link.prop('partiallyHiddenOpacity', link.attr('path/opacity'));
                            link.attr('path/opacity', 1);
                            link.attr('.labels/opacity', 1);
                        }
                    });
                }
            }
        }
    });
    istar.paper.on('cell:mouseout', function (cellView, evt, x, y) {
        //by emptying the CSS style, the element returns to its SVG values, thus returning to its style prior to hovering
        if (cellView.model.isKindOfActor()) {
            cellView.$('.boundary').css({stroke: '', 'stroke-width': '', fill: ''});
            cellView.$('.actorSymbol').css({stroke: '', 'stroke-width': ''});
            cellView.$('.actorDecorator').css({stroke: '', 'stroke-width': ''});
        }
        else {
            if (cellView.model.get('parent')) {
                var parentView = istar.paper.findViewByModel(istar.graph.getCell(cellView.model.get('parent')));
                parentView.$('.boundary').css({stroke: '', 'stroke-width': '', fill: ''});
                parentView.$('.actorSymbol').css({stroke: '', 'stroke-width': ''});
            }

            //unhighlight the previously hovered element and its neighbors
            // if (cellView.model.isNode()) {
            //
            //     cellView.$('.element').css({fill: ''});
            //     cellView.$('.content').css({fill: ''});
            //     cellView.$('.stereotype').css({fill: ''});
            //     _.forEach(istar.graph.getNeighbors(cellView.model), function (cell) {
            //         cell.findView(istar.paper).$('.element').css({fill: ''});
            //     });
            // }

            //if the node is supposed to be partially hidden, hide it and its links again
            if (ui.states.cellDisplay.dependencies.currentState === ui.states.cellDisplay.dependencies.PARTIAL && cellView.model.isDependum()) {
                //CSS opacity currently does not work for elements inside an SVG in Chrome
                //thus, model.attr() is used instead of view.css()
                cellView.model.attr('*/opacity', cellView.model.prop('partiallyHiddenOpacity'));
                _.forEach(istar.graph.getConnectedLinks(cellView.model), function (link) {
                    link.attr('*/opacity', link.prop('partiallyHiddenOpacity'));
                    link.prop('partiallyHiddenOpacity', null);
                });
                cellView.model.prop('partiallyHiddenOpacity', null);
            }

            //if contribution links are partially hidden, hide back the ones linked to this node
            if (ui.states.cellDisplay.contributionLinks.currentState === ui.states.cellDisplay.contributionLinks.PARTIAL) {
                if (cellView.model.isNode()) {
                    _.forEach(istar.graph.getConnectedLinks(cellView.model), function (link) {
                        //CSS opacity currently does not work for elements inside an SVG in Chrome
                        //thus, model.attr() is used instead of view.css()
                        if (! link.isDependencyLink()) {
                            link.attr('path/opacity', link.prop('partiallyHiddenOpacity'));
                            link.attr('.labels/opacity', link.prop('partiallyHiddenOpacity'));
                            link.prop('partiallyHiddenOpacity', null);
                        }
                    });
                }
            }
        }
    });
    istar.paper.on('cell:pointerdown', function (cellView, evt, x, y) {
        if (! ui.states.editor.isAdding()) {
            if (!cellView.model.isLink()) {
                ui.selectCell(cellView.model, cellView);
            }

            //programatically remove focus from any active input, since JointJS prevents this default behavior
            $('input:focus').blur();
        }

        //prevents the selection to appear while the element is being moved
        if (ui.getSelectedCells()[0].isElement()) {
            ui.hideSelection();
        }
    });
    istar.paper.on('cell:pointerup', function (cellView, evt, x, y) {
        var currentAddingElement = ui.states.editor.ADDING.data.typeNameToAdd;

        if (ui.states.editor.isAddingNode()) {
            ui.addElementOnContainer(cellView, {position: {x: x, y: y}});

            //if adding a node to a collapsed container, expand the container. Otherwise it would look like
            //the node was added directly to the paper
            if (cellView.model.prop('collapsed')) {
                cellView.model.toggleCollapse();
            }
        }
        else if (ui.states.editor.isAddingLink()) {
            var isContainerLink = _.includes(istar.metamodel.getContainerLinksNames(), currentAddingElement);
            var isNodeLink = _.includes(istar.metamodel.getNodeLinksNames(), currentAddingElement);
            var isDependencyLink = _.includes(currentAddingElement, 'DependencyLink');

            if (isContainerLink) {
                if (cellView.model.isKindOfActor()) {
                    if (ui.states.editor.ADDING.data.isLinkSourceUndefined()) {
                        cellView.highlight();
                        ui.states.editor.ADDING.data.linkSourceView = cellView;
                    } else {
                        ui.states.editor.ADDING.data.linkTargetView = cellView;
                        var isValid = istar.metamodel.containerLinks[currentAddingElement].isValid(ui.states.editor.ADDING.data.linkSourceView.model, ui.states.editor.ADDING.data.linkTargetView.model);
                        if (isValid.isValid) {
                            ui.addLinkBetweenContainers(currentAddingElement, cellView);
                        }
                        else {
                            ui.displayInvalidLinkMessage(isValid.message);
                            ui.states.editor.ADDING.data.linkSourceView.unhighlight();
                            ui.states.editor.ADDING.data.button.end();
                        }
                    }
                }
            }
            else {
                if (ui.states.editor.ADDING.data.isLinkSourceUndefined()) {
                    cellView.highlight();
                    ui.states.editor.ADDING.data.linkSourceView = cellView;
                } else {
                    ui.states.editor.ADDING.data.linkTargetView = cellView;

                    if (isDependencyLink) {
                        var isValid = istar.metamodel.dependencyLinks['DependencyLink'].isValid(ui.states.editor.ADDING.data.linkSourceView.model, ui.states.editor.ADDING.data.linkTargetView.model);
                        if (isValid.isValid) {
                            ui.addDependency(ui.states.editor.ADDING.data.linkSourceView.model, ui.states.editor.ADDING.data.typeNameToAdd, ui.states.editor.ADDING.data.linkTargetView.model);
                        }
                        // else {
                        //     ui.displayInvalidLinkMessage(isValid.message);
                        // }
                    }
                    if (isNodeLink) {
                        var newLink = null;
                        var prettyLinkName = '';
                        var isValid = istar.metamodel.nodeLinks[currentAddingElement].isValid(ui.states.editor.ADDING.data.linkSourceView.model, ui.states.editor.ADDING.data.linkTargetView.model);

                        if (istar.metamodel.nodeLinks[currentAddingElement].tryReversedWhenAdding) {
                            if (!isValid.isValid) {
                                //try with reversed source/targets
                                var isValidReversed = istar.metamodel.nodeLinks[currentAddingElement].isValid(ui.states.editor.ADDING.data.linkTargetView.model, ui.states.editor.ADDING.data.linkSourceView.model);
                                if (isValidReversed) {
                                    var tempSource = ui.states.editor.ADDING.data.linkSourceView;
                                    ui.states.editor.ADDING.data.linkSourceView = ui.states.editor.ADDING.data.linkTargetView;
                                    ui.states.editor.ADDING.data.linkTargetView = tempSource;
                                    isValid = isValidReversed;
                                }
                            }
                        }
                        if (isValid.isValid) {
                            //actually create the link
                            if (istar.metamodel.nodeLinks[currentAddingElement].changeableLabel) {
                                newLink = istar['add' + currentAddingElement](ui.states.editor.ADDING.data.linkSourceView.model, ui.states.editor.ADDING.data.linkTargetView.model, ui.linkValue);
                            }
                            else {
                                newLink = istar['add' + currentAddingElement](ui.states.editor.ADDING.data.linkSourceView.model, ui.states.editor.ADDING.data.linkTargetView.model);
                            }

                            //smoothness setup
                            if (newLink.attr('smooth')) {
                                //do some magic in order to make links smooth when there are vertices, but straight
                                //when there are no vertices defined
                                newLink.on('change:vertices', ui._toggleSmoothness);
                            }
                        }
                    }
                    if (! isValid.isValid) {
                        ui.displayInvalidLinkMessage(isValid.message);
                    }


                    ui.states.editor.ADDING.data.linkSourceView.unhighlight();
                    ui.states.editor.ADDING.data.linkTargetView.unhighlight();
                    ui.states.editor.ADDING.data.button.end();
                }
            }
        }
        else if (ui.states.editor.isViewing()) {
            //collapse/uncollapse actors when alt-clicked
            if (evt.ctrlKey || evt.altKey) {
                if (cellView.model.isKindOfActor()) {
                    ui.hideSelection();//remove the focus from the actor
                    cellView.model.toggleCollapse();
                    ui.showSelection();//give the focus back to actor, now collapsed or expanded
                }
            }

            istar.resizePaperBasedOnCell(cellView);

            ui.showSelection();
        }
    });

    istar.paper.on('cell:pointerdblclick', function (cellView, evt, x, y) {
        if ( ! (evt.ctrlKey || evt.altKey) ) {
            var newText;
            if (cellView.model.isElement()) {
                ui.showSelection();

                ui.prompt({
                    title: 'Edit name',
                    value: cellView.model.prop('name'),
                    callback: function (value) {
                        if (value !== null) {
                            cellView.model.prop('name', value);
                        }
                    }
                });
            }
        }
    });

    istar.paper.on('cell:contextmenu', function (cellView, evt, x, y) {
        //highlight the contextual actions panel when users right clicks a Cell,
        // letting they know where to find such actions
        ui.alert('Contextual actions can be found on the properties panel');
        ui.selectCell(cellView.model);
        ui.showSelection();
        $('#sidepanel-title-actions').addClass('flash-on');
        setTimeout(function () {
            $('#sidepanel-title-actions').removeClass('flash-on');
            $('#sidepanel-title-actions').addClass('flash-off');
            setTimeout(function () {
                $('#sidepanel-title-actions').removeClass('flash-off');
            }, 300);
        }, 50);
    });
};

istar.resizePaperBasedOnCell = function(cellView) {
    //increase the drawing area if there is an element beyond its edges
    //get the Bounding Box from the view, which ignores hidden inner elements
    //In contrast, if we were to get the Bounding Box from the model, the dimensions would be
    //that of a expanded actor even if it were collapsed
    var cellBBox = cellView.getBBox();

    var paperWidth = istar.paper.getArea().width;
    var paperHeight = istar.paper.getArea().height;

    //Round the numbers of the new dimension since:
    // a) Precision is not relevant here
    // b) Int numbers are easier for the user to handle (when manually changing the size)
    if (cellBBox.y + cellBBox.height > paperHeight ) {
        //if the element is beyond the bottom edge
        istar.paper.setDimensions(paperWidth, Math.round(cellBBox.y + cellBBox.height + 40));
    }
    if (cellBBox.x + cellBBox.width > paperWidth ) {
        //if the element is beyond the right edge
        istar.paper.setDimensions(Math.round(cellBBox.x + cellBBox.width + 40));
    }
    if (cellBBox.x < 0 ) {
        //if the element is beyond the left edge
        var delta = Math.round(40 - cellBBox.x);
        istar.paper.setDimensions(paperWidth + delta);
        istar.graph.translate(delta, 0);
    }
    if (cellBBox.y < 0 ) {
        //if the element is beyond the left edge
        var delta = Math.round(40 - cellBBox.y);
        istar.paper.setDimensions(paperWidth, paperHeight + delta);
        istar.graph.translate(0, delta);
    }
}

ui.addElementOnPaper = function (options) {
    'use strict';

    try {
        var currentAddingElement = ui.states.editor.ADDING.data.typeNameToAdd;
        var isValid = {isValid: false};
        if (ui.states.editor.isAddingNode()) {
            if (istar.metamodel.nodes[currentAddingElement]) {
                if (istar.metamodel.nodes[currentAddingElement].canBeOnPaper) {
                    isValid = istar.metamodel.nodes[currentAddingElement].isValid();
                }
                else {
                    isValid = {
                        message: 'a ' + currentAddingElement + ' cannot be added directly to the paper, it must be added <b>inside</b> an Actor.'
                    };
                    if (istar.metamodel.nodes[currentAddingElement].canBeDependum) {
                        isValid.message += '<br><br>If you are trying to add a dependency link, please try the "Dependency..." button';
                    }
                }
            }
        }
        else if (ui.states.editor.isAddingContainer()) {
            if (istar.metamodel.containers[currentAddingElement]) {
                isValid = istar.metamodel.containers[currentAddingElement].isValid();
            }
        }

        if (isValid.isValid) {
            var newActor = istar['add' + currentAddingElement]('', options);
            if (istar.metamodel.nodes[currentAddingElement] && istar.metamodel.nodes[currentAddingElement].customProperties) {
                newActor.prop('customProperties', istar.metamodel.nodes[currentAddingElement].customProperties);
            }
            else if (istar.metamodel.containers[currentAddingElement] && istar.metamodel.containers[currentAddingElement].customProperties) {
                newActor.prop('customProperties', istar.metamodel.containers[currentAddingElement].customProperties);
            }
            newActor.prop('customProperties/Description', '');
            istar.resizePaperBasedOnCell(newActor);
            ui.selectCell(newActor);
        }
        else {
            ui.displayInvalidLinkMessage(isValid.message);
        }
    } catch (e) {
        console.log(e);
    } finally {
        ui.states.editor.ADDING.data.button.end();
    }
};

ui.addElementOnContainer = function (cellView, options) {
    'use strict';

    try {
        var currentAddingElement = ui.states.editor.ADDING.data.typeNameToAdd;
        var isValid = {isValid: false};
        if (istar.metamodel.nodes[currentAddingElement]) {
            if (istar.metamodel.nodes[currentAddingElement].canBeInnerElement) {
                isValid = istar.metamodel.nodes[currentAddingElement].isValid(cellView.model);
            }
            else {
                isValid = {
                    message: 'a ' + currentAddingElement + ' cannot be added inside an actor'
                };
            }
        }

        if (isValid.isValid) {
            //centers the position
            var bbox = (new istar.metamodel.nodes[currentAddingElement].shapeObject()).getBBox();
            options.position.x -= bbox.width/2;
            options.position.y -= bbox.height/2;

            var element = ui.addNodeInPlace(cellView.model, istar['add' + currentAddingElement], options);

            if (istar.metamodel.nodes[currentAddingElement].customProperties) {
                element.prop('customProperties', istar.metamodel.nodes[currentAddingElement].customProperties);
            }
            element.prop('customProperties/Description', '');
            ui.selectCell(element);
        }
        else {
            ui.displayInvalidLinkMessage(isValid.message);
        }
    } catch (e) {
        console.log(e);
        ui.states.editor.transitionTo(ui.states.editor.VIEWING);
    }
};
ui.addLinkBetweenContainers = function (newLink, targetCellView) {
    'use strict';

    try {
        ui.states.editor.ADDING.data.linkTargetView = targetCellView;
        if (istar.metamodel.containerLinks[newLink].isValid(ui.states.editor.ADDING.data.linkSourceView.model, ui.states.editor.ADDING.data.linkTargetView.model)) {
            istar['add' + ui.states.editor.ADDING.data.typeNameToAdd](ui.states.editor.ADDING.data.linkSourceView.model, ui.states.editor.ADDING.data.linkTargetView.model);
        }
    } catch (e) {
        console.log(e);
    } finally {
        ui.states.editor.ADDING.data.linkSourceView.unhighlight();
        ui.states.editor.ADDING.data.button.end();
    }
};

ui.addDependency = function (source, dependencyType, target) {
    'use strict';

    var node = '';
    var position = {x: 10, y: 10};
    var text = 'Dependum';

    var dependumType = dependencyType.replace('DependencyLink', '');
    node = istar['add' + dependumType](text, position);

    var links = istar.addDependency(source, node, target);
    links[0].on('change:vertices', ui._toggleSmoothness);
    links[1].on('change:vertices', ui._toggleSmoothness);

    ui.setupDependencyRemoval(links);

    node.prop('customProperties/Description', '');
    ui.selectCell(node);
}

ui.setupDependencyRemoval = function (links) {
    'use strict';

    //ensure that the entire dependency (two links and dependum) are deleted
    //when any of its links is deleted
    //this is needed when a depender or dependee is deleted, so that
    //the dependency will not be left dangling in the diagram
    links[0].on('remove', function(){
        if (this.getSourceElement() && this.getSourceElement().isDependum()) {
            this.getSourceElement().remove({ disconnectLinks: true });
            this.prop('otherHalf').remove();
        }
        if (this.getTargetElement() && this.getTargetElement().isDependum()) {
            this.getTargetElement().remove({ disconnectLinks: true });
            this.prop('otherHalf').remove();
        }
    });
    links[1].on('remove', function(){
        if (this.getSourceElement() && this.getSourceElement().isDependum()) {
            this.getSourceElement().remove({ disconnectLinks: true });
            this.prop('otherHalf').remove();
        }
        if (this.getTargetElement() && this.getTargetElement().isDependum()) {
            this.getTargetElement().remove({ disconnectLinks: true });
            this.prop('otherHalf').remove();
        }
    });
};

ui.addNodeInPlace = function (clickedNode, callback, options) {
    'use strict';
    ui.states.editor.ADDING.data.button.end();

    //assigns the new node to the correct parent
    //if the user clicked on an actor kind, the parent is the clicked element itself (i.e., the actor)
    //otherwise, if the user clicked on another element (e.g., a goal), then the parent of the new element will be the same parent of the clicked element
    var node;
    if (clickedNode.isKindOfActor()) {
        node = callback('', options);
        clickedNode.embedNode(node);
    }
    else {
        var parent = istar.graph.getCell(clickedNode.attributes.parent);
        if (parent && parent.isKindOfActor()) {
            node = callback('', options);
            istar.graph.getCell(clickedNode.attributes.parent).embedNode(node);
        }
    }
    return node;
};


ui.changeColorBoundaries = function (color) {
    'use strict';

    _.map(istar.getElements(), function (node) {
        if (node.isKindOfActor()) {
            node.attr('.boundary', {fill: color});
        }
    });
};
ui.changeColorElements = function (color) {
    'use strict';

    _.map(istar.getElements(), function (node) {
        node.attr('.element/fill', color);
    });
};
ui.changeColorElement = function (color, element) {
    'use strict';

    element = element || ui.getSelectedCells()[0];
    element.attr('.element', {fill: color});

    //stores the color in a property for use when saving the model
    if (color === ui.defaultElementBackgroundColor) {
        element.prop('backgroundColor', null);
    }
    else {
        element.prop('backgroundColor', color);
    }
};
ui.connectLinksToShape = function () {
    'use strict';

    $('.menu-body *').addClass('waiting');
    //do the processing after a small delay, in order to allow the browser to update the cursor icon
    setTimeout(function () {
        istar.paper.options.linkConnectionPoint = joint.util.shapePerimeterConnectionPoint;
        //this translation is just to force re-rendering of links
        _.forEach(istar.getElements(), function (e) {
            e.translate(1);
            e.translate(-1);
        });
        istar.paper.options.linkConnectionPoint = undefined;
        $('.menu-body *').removeClass('waiting');
        ui.selectPaper();
    }, 100);
};

$('#menu-button-save-model').click(function () {
    'use strict';

    var model = istar.fileManager.saveModel();
    var csvData = 'data:text/json;charset=utf-8,' + (encodeURI(model));
    joint.util.downloadDataUri(csvData, 'goalModel.txt');
});

$('#modal-button-load-model').click(function () {
    'use strict';

    $(this).button('loading');
    //load the model with a small delay, giving time to the browser to display the 'loading' message
    setTimeout(function () {
        //call the actual loading
        try {
            var fileInput = $('#input-file-to-load')[0];
            if (fileInput.files.length === 0) {
                ui.alert('You must select a file to load', 'No file selected');

                $('#modal-load-model').modal('hide');
                $('#modal-button-load-model').button('reset');
            }
            else {
                //else, load model from file
                var file = fileInput.files[0];
                if (file.type === 'text/plain') {
                    if (ui.getSelectedCells()[0]) {
                        ui.hideSelection();
                    }
                    var fileReader = new FileReader();
                    fileReader.onload = function (e) {
                        ui.resetCellDisplayStates();
                        istar.fileManager.loadModel(e.target.result);//do the actual loading
                        ui.selectPaper();//select the model (as a whole)

                        $('#modal-load-model').modal('hide');
                        $('#modal-button-load-model').button('reset');
                    };
                    fileReader.readAsText(file);

                }
                else {
                    ui.alert('Sorry, this kind of file is not valid', 'Error loading file');
                    $('#modal-button-load-model').button('reset');
                    $('#modal-load-model').modal('hide');
                }
            }
        }
        catch (error) {
            $('#modal-button-load-model').button('reset');
            ui.alert('Sorry, the input model is not valid.', 'Error loading file');
            console.log(error.stack);
        }
    }, 20);
});


/*Chiara added */
$('#menu-button-svg').click(function () {
    'use strict';
    var svgData = istar.fileManager.saveSvg(istar.paper);
    $('#output').attr('src',svgData);
    //var csvData = 'data:text/json;charset=utf-8,' + (encodeURI(model));
    //joint.util.downloadDataUri(csvData, 'goalModel.txt');
});
/*end Chiara added*/

ui.setupUi = function () {
    'use strict';

    overrideIstarFunctions();
    this.setupPluginMenu();
    this.setupMetamodelUI();
    this.defineInteractions();
    ui.components.createAddButtons();

    $('#placeholder-save-model').hide();

    this.setupElementResizing();
    this.setupDiagramSizeInputs();
    this.setupLoadExampleButton();
    this.setupMainMenuInteraction();
    this.setupSidepanelInteraction();
    this.setupSaveImageModal();

    ui.selectPaper();

    function overrideIstarFunctions() {
        //extend original iStar functions with UI behavior
        var originalFunction = null;

        originalFunction = istar.clearModel;
        istar.clearModel = function() {
            originalFunction();
            ui.selectPaper();
        };
    }
};

ui.setupSaveImageModal = function() {
    'use strict';

    //save model when Enter is pressed
    $('#modal-save-image-form').on('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('#modal-button-save-image').click();
    });

    $('#input-file-format').change(function () {
        if ($(this).val() === "PNG") {
            $('#save-png-options').removeClass('hidden');
        }
        else {
            $('#save-png-options').addClass('hidden');
        }

    });

    $('#modal-button-save-image').click(function () {
        var $saveButton = $(this);

        //let the user know that sometinh is being done
        $('body *').addClass('waiting');
        $saveButton.button('preparing');//display status information in the save button
        $saveButton.attr('disabled', 'disabled');

        //optionally fix link gaps
        if ($('#modal-input-precise-links').prop('checked')) {
            //this is a time-consuming function. It checks every link connection and make it perfectly fit the
            //shape of the connected element
            ui.connectLinksToShape();
        }

        //hide UI elements before saving
        var $jointMarkers = $('.marker-vertices, .link-tools, .marker-arrowheads, .remove-element');
        $jointMarkers.hide();
        ui.hideSelection();

        //execute the actual saving only after some time has passed, allowing the browser to update the UI
        setTimeout(function () {
            $saveButton.button('save'); //display status information in the save button
            var filename = $('#input-filename').val() || 'goalModel';

            //Adjust the size of the model, to prevent empty spaces in the image
            var originalWidth = istar.paper.getArea().width;
            var originalHeight = istar.paper.getArea().height;
            istar.paper.fitToContent({padding: 10, allowNewOrigin: 'any'});

            if ($('#input-file-format').val() === "SVG") {
                var svgData = istar.fileManager.saveSvg(istar.paper);
                joint.util.downloadDataUri(svgData, filename + '.svg');
            }
            else {
                //save PNG
                var resolutionFactor = 1;
                if ($('#modal-input-hi-res').prop('checked')) {
                    resolutionFactor = 4;
                }
                istar.fileManager.savePng('diagram', joint.util.downloadBlob, filename, resolutionFactor, $('#modal-input-transparent-background').prop('checked'));
            }

            //restore the paper to its initial state
            istar.paper.setDimensions(originalWidth, originalHeight);
            istar.paper.translate(0,0);

            //show the UI elements back again
            $('.marker-vertices, .link-tools, .marker-arrowheads, .remove-element').show();
            ui.showSelection(ui.getSelectedCells()[0]);

            $('body *').removeClass('waiting');
            $saveButton.button('reset');
            $saveButton.removeAttr('disabled');
            $('#modal-save-image').modal('hide');
        }, 100);

    });
};

ui.setupPluginMenu = function () {
    'use strict';

    //listen for changes in the plugin menus, displaying it if some element is added to it
    var targetNode = document.getElementById('menu-plugin');
    var config = {childList: true, subtree: true }; // Options for the observer (which mutations to observe)
    var observer = new MutationObserver(function(mutationsList, observer) {
        $('#menu-item-plugin').show();
        $('#logo').html('piStar plugin');
        $('.menu-bar').addClass('plugged');
        $('.menu-item').addClass('plugged');
        observer.disconnect();//stop observing
    });
    observer.observe(targetNode, config);
};

ui.setupDiagramSizeInputs = function () {
    'use strict';

    //updates the initial values of the diagram's size inputs with the diagram's actual size
    $('#input-diagram-width').val(istar.paper.getArea().width);
    $('#input-diagram-height').val(istar.paper.getArea().height);

    //setup to update the inputs' values whenever the diagram's size is changed
    istar.paper.on('resize', function(width, height) {
        $('#input-diagram-width').val(width);
        $('#input-diagram-height').val(height);
    });

    //setup to update the diagram's size whenever the user leaves (focusout) the input fields or press enter
    $('#input-diagram-width, #input-diagram-height')
        .focusout(function () {
            istar.paper.setDimensions($('#input-diagram-width').val(), $('#input-diagram-height').val());
        })
        .keyup(function (e) {
            if (e.which === 13) {
                istar.paper.setDimensions($('#input-diagram-width').val(), $('#input-diagram-height').val());
                this.blur(); //remove focus from the input field
            }
        });
};

ui.setupLoadExampleButton = function () {
    'use strict';

    $('.modal-button-load-example').click(function () {
        $('.modal *').addClass('waiting');
        var modelToLoad = $(this).data('model');
        //do the processing after a small delay, in order to allow the browser to update the cursor icon
        setTimeout(function () {
            if (ui.getSelectedCells()[0]) {
                ui.hideSelection();
            }
            ui.resetCellDisplayStates();
            istar.fileManager.loadModel(istar.models[modelToLoad]);
            ui.selectPaper();//select the model (as a whole)
            $('.modal *').removeClass('waiting');
            $('#modal-examples').modal('hide');
        }, 100);

        ui.collectActionData('click', 'load example', modelToLoad);
    });
};

ui.setupMainMenuInteraction = function () {
    'use strict';

    // default menu to be displayed when the tool opens
    var currentMenuItem = $('#menu-item-add');

    // set up the click behavior for every menu-item
    $('.menu-items a').each(function () {
        $(this).click(function () {
            var target = $('#' + $(this).data('toggle'));

            if (currentMenuItem === null) {
                //no menu is currently displayed, the clicked one will now be displayed
                currentMenuItem = $(this);
                $(this).addClass('active');

                target.css('display', 'none');
                target.removeClass('hidden');
                target.slideDown(200);

                $('#star').css("-transform","rotate(0deg)");
            }
            else if ($(this).attr('id') !== currentMenuItem.attr('id')) {
                //some menu is already displayed, a different one will be displayed

                //deselect and hide the current menu
                $(currentMenuItem).removeClass('active');
                $('#' + $(currentMenuItem).data('toggle')).addClass('hidden');
                $('#' + $(currentMenuItem).data('toggle')).slideUp(0);

                currentMenuItem = $(this);

                //select and show the clicked menu
                currentMenuItem .addClass('active');
                target.removeClass('hidden');
                target.slideDown(0);

            }
            else {
                //some menu is already displayed, the menu will be hidden
                target.slideUp(200, function () {
                    //only deselect the menu after its body disappear,
                    //for smoother visual animation
                    $(currentMenuItem).removeClass('active');
                    currentMenuItem = null;
                });
                $('#star').css("-transform","rotate(-180deg)");
            }
        });
    });

    $('#' + currentMenuItem.data('toggle')).slideDown(0); //displays the default menu when the tool is loaded

    //change state when focusing on inputs, to prevent accidentally deleting model elements with backspace and del
    $('input')
        .focusin(function () {
            ui.states.editor.transitionTo(ui.states.editor.EDITING_TEXT);
        })
        .focusout(function () {
            ui.states.editor.transitionTo(ui.states.editor.VIEWING);
        });

};

$('#all-actor-boundary-color-picker').on('change', function () {
    'use strict';

    ui.changeColorBoundaries(this.value);
});
$('#all-elements-color-picker').on('change', function () {
    'use strict';

    ui.changeColorElements(this.value);
});

$('#single-element-color-picker').on('change', function () {
    'use strict';

    ui.changeColorElement(this.value);
});

$('#menu-button-precise-links').click(function () {
    'use strict';

    ui.connectLinksToShape();
});

$('#menu-button-toggle-fullscreen').click(function () {
    'use strict';

    joint.util.toggleFullScreen();
});

$('#menu-button-straighten-links').click(function () {
    'use strict';

    ui.confirm({
        message: 'ATTENTION! This action will remove all vertices you may have added to the links in this model. This' +
          ' action is irreversible. Are you sure you want to proceed?',
        callback: function (value) {
            if (value) {
                var selectedCell = ui.getSelectedCells()[0];
                _.forEach(istar.getLinks(), function (link) {
                    link.vertices([]);
                });

                //restore selection to the element that was selected (if any) when the action started
                ui.selectCell(selectedCell);
            }
        }
    });
});

//$('#menu-button-auto-layout').click(function () {
    function updlyt () {
 
'use strict';

    ui.confirm({
        message: 'ATTENTION! This action will change the position of the actors, while also removing every vertex you' +
                 ' may have added to their links. This action is irreversible. Are you sure you want to proceed?',
        callback: function (value) {
            if (value) {
                var selectedCell = ui.getSelectedCells()[0] ? ui.getSelectedCells()[0] : null;
                ui.deselectCell(selectedCell);
                ui.hideSelection();

                istar.layout.updateLayout();

                //restore selection to the element that was selected (if any) when the action started
                ui.selectCell(selectedCell);
                ui.showSelection(selectedCell);
            }
        }
    });
};

ui.changeAddMenuStatus = function (text) {
    'use strict';

    $('#status').html(text);
};

ui.deleteCell = function (cellToDelete) {
    function getDependencyFromDependencyLink(link) {
        let dependum = null;
        if (link.getSourceElement() && link.getSourceElement().isDependum()) {
            dependum = link.getSourceElement();
        }
        else if (link.getTargetElement() && link.getTargetElement().isDependum()) {
            dependum = link.getTargetElement();
        }
        let links = [link, link.prop('otherHalf')];

        return {dependum: dependum, links: links};
    }

    function undoDeleteDependency(cell, links) {
        return function () {
            istar.graph.addCell(cell);
            istar.graph.addCell(links);

            for (let link of links) {
                if ('x' in link.prop('source')) {
                    link.prop('source', cell);
                }
                else if ('x' in link.prop('target')) {
                    link.prop('target', cell);
                }
                istar.paper.findViewByModel(link).hideTools(); // Hide the vertices' handles
            }
        }
    }

    if (cellToDelete.isDependum()) {
        istar.undoManager.addToHistory(
          undoDeleteDependency(cellToDelete, istar.graph.getConnectedLinks(cellToDelete))
        );
    }
    else if (cellToDelete.isDependencyLink()) {
        const {dependum, links} = getDependencyFromDependencyLink(cellToDelete);
        istar.undoManager.addToHistory(
          undoDeleteDependency(dependum, links)
        );
    }
    else if (cellToDelete.isContainerLink()) {
        istar.undoManager.addToHistory(
          function (link) {
              return function () {
                  istar.graph.addCell(link);
                  link.attr('connection-wrap/stroke', 'transparent');  // Hide the link highlight
              }
          }(cellToDelete)
        );
    }
    else if (cellToDelete.isContainer()) {
        let links = istar.graph.getConnectedLinks(cellToDelete);
        let dependencies = [];
        for (let link of links) {
            if (link.isDependencyLink()) {
                dependencies.push(getDependencyFromDependencyLink(link));
            }
        }
        links = _.filter(links, link => {return !link.isDependencyLink();});

        const children = cellToDelete.getEmbeddedCells();
        for (let child of children) {
            let nodeLinks = istar.graph.getConnectedLinks(child);
            for (let link of nodeLinks) {
                if (link.isDependencyLink()) {
                    dependencies.push(getDependencyFromDependencyLink(link));
                }
            }
        }

        istar.undoManager.addToHistory(
          function (cell, links, dependencies, children) {
              return function () {
                  istar.graph.addCell(cell);
                  istar.graph.addCell(links);

                  istar.graph.addCell(children);
                  for (let child of children) {
                      cell.embed(child);
                      if (child.isLink()) {
                          istar.paper.findViewByModel(child).hideTools(); // Hide the vertices' handles
                      }
                  }

                  for (let dependency of dependencies) {
                      undoDeleteDependency(dependency.dependum, dependency.links)();
                  }

                  cell.updateBoundary();
              }
          }(cellToDelete, links, dependencies, children)
        );
    }
    else if (cellToDelete.isNode()) {
        let nodeLinks = istar.graph.getConnectedLinks(cellToDelete);
        let dependencies = [];
        for (let link of nodeLinks) {
            if (link.isDependencyLink()) {
                dependencies.push(getDependencyFromDependencyLink(link));
            }
        }
        nodeLinks = _.filter(nodeLinks, link => {return !link.isDependencyLink();});

        istar.undoManager.addToHistory(
          function (cell, links, parentId, dependencies) {
              return function () {
                  istar.graph.addCell(cell);
                  istar.graph.addCell(links);

                  const parent = istar.graph.getCell(parentId);
                  parent.embed(cell);
                  parent.updateBoundary();

                  for (let link of links) {
                      parent.embed(link);
                      istar.paper.findViewByModel(link).hideTools(); // Hide the vertices' handles
                  }

                  for (let dependency of dependencies) {
                      undoDeleteDependency(dependency.dependum, dependency.links)();
                  }
              }
          }(cellToDelete, nodeLinks, cellToDelete.parent(), dependencies)
        );
    }
    else if (cellToDelete.isNodeLink()) {
        istar.undoManager.addToHistory(
          function (cell, parentId) {
              return function () {
                  istar.graph.addCell(cell);

                  const parent = istar.graph.getCell(parentId);
                  parent.embed(cell);

                  cell.attr('connection-wrap/stroke', 'transparent');  // Hide the link highlight
              }
          }(cellToDelete, cellToDelete.parent())
        );
    }
    ui.getSelectedCells()[0].remove();
    ui.selectPaper();
}
$(document).keyup(function (e) {
    'use strict';

    if (ui.states.editor.isViewing()) {
        if (ui.getSelectedCells()[0] !== null) {
            if (e.which === 8 || e.which === 46) {
                // 8: backspace
                // 46: delete
                // The use of the 'backspace' key, in addition to the 'delete', key aims to improve support for Mac users,
                //    since in that system the key named 'delete' actually is a 'backspace' key
                if (ui.getSelectedCells()[0].isKindOfActor) {
                    // If the selected cell does not have the isKindOfActor function, it means that it's not
                    // really a cell, but the diagram itself. Thus, only delete if it has this function.
                    if (ui.getSelectedCells()[0].isKindOfActor()) {
                        ui.confirm({
                            message: 'ATTENTION! Are you sure you want to delete this entire actor, along with its content?',
                            callback: function (value) {
                                if (value) {
                                    ui.deleteCell(ui.getSelectedCells()[0]);
                                }
                            }
                        });
                    } else {
                        ui.deleteCell(ui.getSelectedCells()[0]);
                    }
                }
            }
            if ((e.ctrlKey || e.metaKey) && e.which === 90) {  //ctrl + z or command + z
                e.preventDefault();
                istar.undoManager.undo();
            }
        }
    }
    if (ui.states.editor.isAdding()) {
        if (e.which === 27) {  //esc
            ui.states.editor.ADDING.data.button.end();
            ui.selectPaper();
        }
    }
});

ui.resetPointerStyles = function () {
    'use strict';

    var $diagram = $('#diagram');
    $diagram.css('cursor', 'auto');
    $diagram.find('g').css('cursor', 'move');
    $diagram.find('.actorKindMain').css('cursor', 'move');
    $('.link-tools g').css('cursor', 'pointer');
};

ui._toggleSmoothness = function (link, vertices, something) {
    'use strict';

    if (vertices.length >= 1) {
        link.set('smooth', true);
    }
    else {
        link.set('smooth', false);
    }
};


ui.changeCustomPropertyValue = function (model, propertyName, propertyValue) {
    'use strict';

    if (propertyValue) {
        propertyValue = $.trim(propertyValue);
    }
    else {
        propertyValue = '';
    }
    model.prop('customProperties/' + propertyName, propertyValue);

    return model;
}






$('#fit-to-content-button').click(function () {
    'use strict';

    istar.paper.fitToContent({padding: 20, allowNewOrigin: 'any', minWidth: 150, minHeight: 150});

    // Update the positioning of the selection
    ui.hideSelection();
    ui.showSelection();
});

$('#reset-all-colors-button').click(function () {
    'use strict';

    $('#all-actor-boundary-color-picker').get(0).jscolor.fromString('E6E6E6');
    ui.changeColorBoundaries('#E6E6E6');
    $('#all-elements-color-picker').get(0).jscolor.fromString(ui.defaultElementBackgroundColor);
    ui.changeColorElements(ui.defaultElementBackgroundColor);
});

$('#reset-element-color-button').click(function () {
    'use strict';

    $('#single-element-color-picker').get(0).jscolor.fromString(ui.defaultElementBackgroundColor);
    ui.changeColorElement(ui.defaultElementBackgroundColor);
});

ui.setupSidepanelInteraction = function () {
    'use strict';

    var sidepanelSizes = ['size1', 'size2', 'size3'];
    var sidepanelCurrentSize = 1;
    ui.expandSidepanel = function () {
        if (sidepanelCurrentSize < (sidepanelSizes.length - 1)) {
            $('#sidepanel').removeClass(sidepanelSizes[sidepanelCurrentSize])
            sidepanelCurrentSize++;
            $('#sidepanel').addClass(sidepanelSizes[sidepanelCurrentSize])

            if (sidepanelCurrentSize === 1) {
                $('#sidepanel').removeClass('collapsed');
            }
            if (sidepanelCurrentSize === (sidepanelSizes.length - 1)) {
                $('#sidepanel').addClass('full');
            }
        }
    };
    ui.collapseSidepanel = function () {
        if (sidepanelCurrentSize > 0) {
            if (sidepanelCurrentSize === (sidepanelSizes.length - 1)) {
                $('#sidepanel').removeClass('full');
            }

            $('#sidepanel').removeClass(sidepanelSizes[sidepanelCurrentSize])
            sidepanelCurrentSize--;
            $('#sidepanel').addClass(sidepanelSizes[sidepanelCurrentSize])

            if (sidepanelCurrentSize === 0) {
                $('#sidepanel').addClass('collapsed');
            }
        }
    };
    $('.collapse-sidepanel-button').click(ui.collapseSidepanel);
    $('.expand-sidepanel-button').click(ui.expandSidepanel);

    $.fn.editable.defaults.mode = 'inline';//x-editable setting
};

ui.setupElementResizing = function () {
    'use strict';

    $('#resize-handle').hide();
    $('.cell-selection').hide();

    ui.resizeElement = function (element, width, height) {
        element.resize(width, height);

        ui.showSelection(ui.getSelectedCells()[0]);

        element.updateLineBreak();  // Update the line break on the element's label
    };

    ui.resizeHandlerOnMouseMove = function (e) {
        var viewBBox = ui.getSelectedCells()[0].findView(istar.paper).getBBox();
        var diagramPosition = $('#out').position();

        var newWidth = e.pageX - viewBBox.x - diagramPosition.left + $('#out').scrollLeft();
        var newHeight = e.pageY - viewBBox.y - diagramPosition.top + $('#out').scrollTop();
        if (newWidth < 20) newWidth = 20;
        if (newHeight < 20) newHeight = 20;

        ui.resizeElement(ui.getSelectedCells()[0], newWidth, newHeight);
    };

    ui.endResize = function (e) {
        istar.resizePaperBasedOnCell(ui.getSelectedCells()[0]);
        $(window).off('mousemove', ui.resizeHandlerOnMouseMove);
        $(window).off('mouseup', ui.endResize);
    };

    $('#resize-handle').mousedown(function (e) {
        e.preventDefault();
        $(window).mousemove(ui.resizeHandlerOnMouseMove);
        $(window).mouseup(ui.endResize);
    });
    $('#resize-handle').dblclick(function (e) {
        e.preventDefault();

        //restore element to a default size
        ui.resizeElement(
            ui.getSelectedCells()[0],
            ui.getSelectedCells()[0].prop('originalSize/width'),
            ui.getSelectedCells()[0].prop('originalSize/height')
        );
        if (ui.getSelectedCells()[0].get('parent')) {
            istar.graph.getCell(ui.getSelectedCells()[0].get('parent')).updateBoundary();
        }
    });
};

ui.alert = function (body, title) {
    'use strict';

    bootbox.alert({
        title: title,
        message: body
    });
};

ui.confirm = function (options) {
    'use strict';
    //change state to prevent accidental deletes
    ui.states.editor.transitionTo(ui.states.editor.EDITING_TEXT);

    var callback = options.callback;
    options.callback = function (value) {
        //change state back to VIEWING after the prompt is dismissed
        ui.states.editor.transitionTo(ui.states.editor.VIEWING);
        callback(value);
    };
    options.swapButtonOrder = true;
    bootbox.confirm(options);
    // .on('shown.bs.modal', function(e){
    //     Automatically select the content of the input, so that the user doesn't have to
    // $(this).find('input').select();
    // });
};

ui.prompt = function (options) {
    'use strict';
    //change state to prevent accidental deletes
    ui.states.editor.transitionTo(ui.states.editor.EDITING_TEXT);

    var callback = options.callback;
    options.callback = function (value) {
        //change state back to VIEWING after the prompt is dismissed
        ui.states.editor.transitionTo(ui.states.editor.VIEWING);
        callback(value);
    };
    options.swapButtonOrder = true;
    bootbox.prompt(options)
        .on('shown.bs.modal', function(e){
            //Automatically select the content of the input, so that the user doesn't have to
            $(this).find('input').select();
        });
};

ui.displayInvalidLinkMessage = function (message) {
    'use strict';

    if (message) {
        ui.alert('INVALID: Sorry, but ' + message, 'Invalid link');
    }
    else {
        ui.alert('INVALID: Sorry, but this link you are trying to create is invalid');
    }
    ui.collectErrorData('error');
};

ui.displayInvalidModelMessage = function (messages) {
    'use strict';

    if (messages) {
        var text = '<div class="alert alert-danger">Hello there! Previous versions of the piStar tool allowed the creation of models that break ' +
            'some rules of the <a href="https://sites.google.com/site/istarlanguage/" target="_blank">iStar 2.0 Language Guide</a>. Please address the issues listed below ' +
            'in order to ensure that your model will continue to open correctly in future versions of the tool.</div>';
        text += '<h4>Errors:</h4><ul>';

        _.forEach(messages, function (message) {
            text += '<li>' + message + '</li>';
            console.log('INVALID: ' + message);
        });
        text += '</ul>';
        ui.alert(text, 'Invalid model');
    }
};

//overrides istar.displayInvalidModelMessages, in order to display the messages in the user interface
istar.displayInvalidModelMessages = ui.displayInvalidModelMessage;

$('#menu-button-new-model').click(function () {
    'use strict';

    ui.confirm({
        message: 'Are you sure you want to create a new model and delete the current model? This action is irreversible.',
        callback: function (result) {
            if (result === true) {
                istar.clearModel();
            }
        }
    });
});

ui.changeDependencyLinksOpacity = function (dependumOpacity, linkOpacity) {
    'use strict';

    var dependencyCells = _.filter(istar.getCells(), function (cell) {
        return (cell.isDependum() || cell.isDependencyLink());
    });

    if (dependumOpacity === 1) {
        _.forEach(dependencyCells, function (cell) {
            cell.attr('*/display', 'visible');
        });
        setTimeout(function () {
            setDependenciesOpacity(dependencyCells, dependumOpacity, linkOpacity);
        }, 30);
    }
    else if (linkOpacity === 0) {
        setDependenciesOpacity(dependencyCells, dependumOpacity, linkOpacity);
        setTimeout(function () {
            _.forEach(dependencyCells, function (cell) {
                cell.attr('*/display', 'none');
            });
        }, 300);
    }
    else {
        setDependenciesOpacity(dependencyCells, dependumOpacity, linkOpacity);
    }

    function setDependenciesOpacity(dependencyCells, dependumOpacity, linkOpacity) {
        _.forEach(dependencyCells, function (cell) {
            if (cell.isDependum()) {
                cell.attr('*/opacity', dependumOpacity);
            }
            else {
                cell.attr('*/opacity', linkOpacity);
            }
        });
    }
};

ui.changeContributionLinksOpacity = function (linkOpacity) {
    'use strict';

    var contributionLinks = _.filter(istar.getLinks(), function (link) {
        return link.isContributionLink();
    });

    if (linkOpacity === 1) {
        _.forEach(contributionLinks, function (link) {
            link.attr('*/display', 'visible');
        });
        setTimeout(function () {
            setContributionsOpacity(contributionLinks, linkOpacity);
        }, 30);
    }
    else if (linkOpacity === 0) {
        setContributionsOpacity(contributionLinks, linkOpacity);
        setTimeout(function () {
            _.forEach(contributionLinks, function (link) {
                link.attr('*/display', 'none');
            });
        }, 300);
    }
    else {
        setContributionsOpacity(contributionLinks, linkOpacity);
    }

    function setContributionsOpacity(contributionLinks, linkOpacity) {
        _.forEach(contributionLinks, function (link) {
            // link.attr('line/opacity', linkOpacity);
            // link.attr('text/opacity', linkOpacity);
            link.attr('path/opacity', linkOpacity);
            link.attr('.labels/opacity', linkOpacity);
        });
    }
};

ui.resetCellDisplayStates = function () {
    'use strict';

    this.states.cellDisplay.dependencies.currentState = 0;
    this.states.cellDisplay.contributionLinks.currentState = 0;
}

$('#menu-button-toggle-dependencies-display').click(function () {
    'use strict';

    if (ui.states.cellDisplay.dependencies.currentState === ui.states.cellDisplay.dependencies.NORMAL) {
        ui.states.cellDisplay.dependencies.currentState = ui.states.cellDisplay.dependencies.PARTIAL;
        //links are darker than dependums. That's why its opacity is smaller
        ui.changeDependencyLinksOpacity(0.4, 0.1);
    }
    else if (ui.states.cellDisplay.dependencies.currentState === ui.states.cellDisplay.dependencies.PARTIAL) {
        ui.states.cellDisplay.dependencies.currentState = ui.states.cellDisplay.dependencies.HIDDEN;
        ui.changeDependencyLinksOpacity(0, 0);
        ui.selectPaper();
    }
    else if (ui.states.cellDisplay.dependencies.currentState === ui.states.cellDisplay.dependencies.HIDDEN) {
        ui.states.cellDisplay.dependencies.currentState = ui.states.cellDisplay.dependencies.NORMAL;
        ui.changeDependencyLinksOpacity(1, 1);
    }
});

$('#menu-button-toggle-contributions-display').click(function () {
    'use strict';

    if (ui.states.cellDisplay.contributionLinks.currentState === ui.states.cellDisplay.contributionLinks.NORMAL) {
        ui.states.cellDisplay.contributionLinks.currentState = ui.states.cellDisplay.contributionLinks.PARTIAL;
        //links are darker than dependums. That's why its opacity is smaller
        ui.changeContributionLinksOpacity(0.3);
    }
    else if (ui.states.cellDisplay.contributionLinks.currentState === ui.states.cellDisplay.contributionLinks.PARTIAL) {
        ui.states.cellDisplay.contributionLinks.currentState = ui.states.cellDisplay.contributionLinks.HIDDEN;
        ui.changeContributionLinksOpacity(0);
        ui.selectPaper();
    }
    else if (ui.states.cellDisplay.contributionLinks.currentState === ui.states.cellDisplay.contributionLinks.HIDDEN) {
        ui.states.cellDisplay.contributionLinks.currentState = ui.states.cellDisplay.contributionLinks.NORMAL;
        ui.changeContributionLinksOpacity(1);
    }
});

$('#menu-item-undo').click(function () {
    'use strict';

    istar.undoManager.undo();
});

// Prevent accidental undos. There's no need to use this button through the keyboard, since the user can use
// its shortcut instead
$('#menu-item-undo').focus(function (e) {this.blur()});

istar.undoManager.callback = function(empty) {
    'use strict';

    if (empty) {
        $('#menu-item-undo').addClass('inactive');
    }
    else {
        $('#menu-item-undo').removeClass('inactive');
    }
}

/*definition of globals to prevent undue JSHint warnings*/
/*globals istar:false, console:false, $:false, _:false, joint:false, uiC:false, bootbox:false */

/*!
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 *
 * If you are going to edit the code, always work from the source-code available for download at
 * https://github.com/jhcp/pistar
 */

ui.components = ui.components || {};  //prevents overriding the variable, while also preventing working with a null variable

ui.components.AddButtonModel = Backbone.Model.extend({
    defaults: {
        action: 'view',
        active: false,
        defaultButtonImage: '',
        label: '',
        name: '',
        statusText: '',
        tooltip: '',
        value: 'none'
    },
    act: function () {
        'use strict';

        ui.selectPaper();

        this.set('active', true);
        // ui.currentState = this.get('action');
        ui.states.editor.transitionTo(this.get('action'))
        ui.states.editor.ADDING.data.typeNameToAdd = this.get('name');
        ui.linkValue = this.get('value');
        ui.states.editor.ADDING.data.button = this;
        if (ui.states.editor.isAddingContainer()) {
            $('#diagram').css('cursor', 'crosshair');
            $('#diagram g').css('cursor', 'no-drop');
            $('#diagram .actorKindMain').css('cursor', 'no-drop');
        } else {
            if (this.get('action') === ui.states.editor.ADDING.ADD_NODE) {
                if (istar.metamodel.nodes[this.get('name')] && (istar.metamodel.nodes[this.get('name')].canBeOnPaper)) {
                    $('#diagram').css('cursor', 'crosshair');
                } else {
                    $('#diagram').css('cursor', 'no-drop');
                }
                if (istar.metamodel.nodes[this.get('name')] && (istar.metamodel.nodes[this.get('name')].canBeInnerElement)) {
                    $('#diagram g').css('cursor', 'crosshair');
                    $('#diagram .actorKindMain').css('cursor', 'crosshair');
                } else {
                    $('#diagram g').css('cursor', 'no-drop');
                    $('#diagram .actorKindMain').css('cursor', 'no-drop');
                }
            } else {
                $('#diagram').css('cursor', 'no-drop');
                $('#diagram g').css('cursor', 'crosshair');
                $('#diagram .actorKindMain').css('cursor', 'crosshair');
            }
        }
    },
    end: function () {
        'use strict';

        this.set('active', false);
        ui.states.editor.transitionTo(ui.states.editor.VIEWING);
    }

});

/*definition of globals to prevent undue JSHint warnings*/
/*globals istar:false, ui:false, uiC:false, console:false, $:false, Backbone: false */

/*!
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 *
 * If you are going to edit the code, always work from the source-code available for download at
 * https://github.com/jhcp/pistar
 */

ui.components = ui.components || {};  //prevents overriding the variable, while also preventing working with a null variable

ui.components.AddButtonView = Backbone.View.extend({
    tagName: 'span',
    className: 'add-button',
    template: _.template($('#add-button-template').html()),

    events: {
        'mousedown button': 'buttonClickHandler'//meaning: when its button is clicked, the buttonClickHandler is called
    },

    initialize: function () {
        if (!this.model.get('name')) {
            this.model.set('name', this.model.get('label'));
        }
        this.listenTo(this.model, 'change:active', this.highlight);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        $('#add-internal-cells-palette').append(this.$el);
        return this;
    },

    buttonClickHandler: function (event) {
        if (ui.states.editor.ADDING.data.button) {
            ui.states.editor.ADDING.data.button.end();
        }
        this.model.act();
        ui.changeAddMenuStatus(this.model.get('statusText'));
    },

    highlight: function (element) {
        this.$('button').toggleClass('buttonHighlight', element.get('active'));
        this.$('button').blur();
    }

});

/*!
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 *
 * If you are going to edit the code, always work from the source-code available for download at
 * https://github.com/jhcp/pistar
 */

ui.components = ui.components || {};  //prevents overriding the variable, while also preventing working with a null variable

ui.components.AddButtonDropdownView = Backbone.View.extend({
    tagName: 'span',
    className: 'add-dropdown-button',
    template: _.template($('#add-dropdown-button-template').html()),

    initialize: function () {
        if (!this.model.get('name')) {
            this.model.set('name', this.model.get('label'));
        }
        this.listenTo(this.model, 'change:active', this.highlight);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        $('#add-internal-cells-palette').append(this.$el);
        return this;
    },

    highlight: function (element) {
        this.$('button').toggleClass('buttonHighlight', element.get('active'));
        this.$('button').blur();
    }

});

/*!
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 *
 * If you are going to edit the code, always work from the source-code available for download at
 * https://github.com/jhcp/pistar
 */

ui.components = ui.components || {};  //prevents overriding the variable, while also preventing working with a null variable

ui.components.AddButtonDropdownItemView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#add-dropdown-item-template').html()),

    events: {
        'mousedown': 'buttonClickHandler'//meaning: when its button is clicked, the buttonClickHandler is called
    },

    initialize: function () {
        if (!this.model.get('name')) {
            this.model.set('name', this.model.get('label'));
        }
        this.listenTo(this.model, 'change:active', this.highlight);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        $(this.attributes.parent).append(this.$el);
        return this;
    },

    buttonClickHandler: function (event) {
        // if (ui.states.editor.ADDING.data.button) {
        //     ui.states.editor.ADDING.data.button.end();
        // }
        this.model.act();
        ui.changeAddMenuStatus(this.model.get('statusText'));
    },

    highlight: function (element) {
        this.$('button').toggleClass('buttonHighlight', element.get('active'));
    }

});

/*!
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 *
 * If you are going to edit the code, always work from the source-code available for download at
 * https://github.com/jhcp/pistar
 */

ui.components = ui.components || {};  //prevents overriding the variable, while also preventing working with a null variable

ui.components.createAddButtons = function() {
    'use strict';

    //create the ADD buttons

    //create Add <<Container>> buttons
    if (istar.metamodel.containers) {
        _.forEach(istar.metamodel.containers, function (elementType) {
            //if specific ui elements are not defined, use default ones
            var label = elementType.buttonLabel || elementType.name;
            var tooltip = elementType.buttonTooltip || ('Add ' + elementType.name);
            var statusText = elementType.buttonStatusText || ('Adding <b>' + elementType.name + '</b>: click on an empty space in the diagram to add a new ' + elementType.name);
            var image = elementType.name;

            new ui.components.AddButtonDropdownItemView({
                attributes: {parent: '#add-actor-dropdown'},
                model: new ui.components.AddButtonModel({
                    action: ui.states.editor.ADDING.ADD_CONTAINER,
                    buttonImage: image,
                    defaultButtonImage: 'DefaultContainer.svg',
                    label: label,
                    name: elementType.name,
                    statusText: statusText,
                    tooltip: tooltip
                })
            }).render();
        });
    }
    else {
        $('#menu-dropdown-actors').hide();
    }

    //create Add <<ContainerLink>> buttons
    if (istar.metamodel.containerLinks) {
        _.forEach(istar.metamodel.containerLinks, function(linkType) {
            //if specific ui elements are not defined, use default ones
            var label = linkType.buttonLabel || (linkType.name);
            var tooltip = linkType.buttonTooltip || ('Add a ' + linkType.name);
            var statusText = linkType.buttonStatusText || ('Adding a <b>' + linkType.name + '</b>');
            var image = linkType.name;

            new ui.components.AddButtonDropdownItemView({
                attributes: {parent: '#add-actor-link-dropdown'},
                model: new ui.components.AddButtonModel({
                    action: ui.states.editor.ADDING.ADD_LINK,
                    buttonImage: image,
                    defaultButtonImage: 'DefaultContainerLink.svg',
                    label: label,
                    name: linkType.name,
                    statusText: statusText,
                    tooltip: tooltip
                })
            }).render();
        });
    }
    else {
        $('#menu-dropdown-actor-links').hide();
    }

    //create Add <<DependencyLink>> buttons
    var hasDependency = false;
    _.forEach(istar.metamodel.nodes, function(elementType) {
        if (elementType.canBeDependum ) {
            hasDependency = true;

            //if specific ui elements are not defined, use default ones
            var label = elementType.buttonLabel || (elementType.name + ' dependency');
            var tooltip = elementType.buttonTooltip || ('Add a ' + elementType.name + ' Dependency link (including its dependum)');
            var statusText = elementType.buttonStatusText || ('Adding <b>' + elementType.name + ' Dependency</b> link');
            var image = elementType.name + 'DependencyLink';

            new ui.components.AddButtonDropdownItemView({
                attributes: {parent: '#add-dependency-dropdown'},
                model: new ui.components.AddButtonModel({
                    action: ui.states.editor.ADDING.ADD_LINK,
                    buttonImage: image,
                    defaultButtonImage: 'DefaultDependencyLink.svg',
                    label: label,
                    name: elementType.name + 'DependencyLink',
                    statusText: statusText,
                    tooltip: tooltip
                })
            }).render();
        }
    });
    if (! hasDependency) {
        $('#menu-dropdown-dependency-links').hide();
    }


    //create Add <<Element>> buttons
    _.forEach(istar.metamodel.nodes, function(elementType) {
        if (elementType.canBeInnerElement || elementType.canBeOnPaper) {

            //if specific ui elements are not defined, use default ones
            var label = elementType.buttonLabel || elementType.name;
            var tooltip = elementType.buttonTooltip || ('Add ' + elementType.name);
            var statusText = elementType.buttonStatusText || ('Adding <b>' + elementType.name + '</b>');

            new ui.components.AddButtonView({
                model: new ui.components.AddButtonModel({
                    action: ui.states.editor.ADDING.ADD_NODE,
                    defaultButtonImage: 'DefaultNode.svg',
                    label: label,
                    name: elementType.name,
                    statusText: statusText,
                    tooltip: tooltip
                })
            }).render();
        }
    });

    //create Add <<NodeLink>> buttons
    _.forEach(istar.metamodel.nodeLinks, function(linkType) {
        if (linkType.canBeManuallyAdded !== false) {
            if (linkType.changeableLabel) {
                //create a dropdown button and then create a dropdown item for each possible value of the label

                //if specific ui elements are not defined, use default ones
                var label = (linkType.buttonLabel && linkType.buttonLabel[0]) || linkType.name;
                var tooltip = (linkType.buttonTooltip && linkType.buttonTooltip[0]) || ('Add ' + linkType.name);
                var image = linkType.name;

                new ui.components.AddButtonDropdownView({
                    model: new ui.components.AddButtonModel({
                        buttonImage: image,
                        defaultButtonImage: 'DefaultContainerLink.svg',
                        label: label,
                        name: linkType.name,
                        tooltip: tooltip
                    })
                }).render();

                //create the dropdown items
                _.forEach(linkType.possibleLabels, function (linkValue, i) {
                    //if specific ui elements are not defined, use default ones
                    var index = i + 1;
                    var label = linkValue
                    if (linkType.buttonLabel && linkType.buttonLabel[index]) {
                        label = linkType.buttonLabel[index];
                    }
                    var tooltip = ('Add a ' + linkValue + ' ' + linkType.name);
                    if (linkType.buttonTooltip && linkType.buttonTooltip[index]) {
                        tooltip = linkType.buttonTooltip[index];
                    }
                    var statusText = 'Adding a <b>' + linkValue + ' ' + linkType.name + '</b>';
                    if (linkType.buttonStatusText && linkType.buttonStatusText[index]) {
                        statusText = linkType.buttonStatusText[index];
                    }
                    var image = linkType.name + '-' + linkValue;
                    if (linkType.buttonImage && linkType.buttonImage[index]) {
                        image = linkType.buttonImage[index];
                    }

                    new ui.components.AddButtonDropdownItemView({
                        attributes: {parent: '#add-' + linkType.name + '-dropdown'},
                        model: new ui.components.AddButtonModel({
                            action: ui.states.editor.ADDING.ADD_LINK,
                            buttonImage: image,
                            defaultButtonImage: 'DefaultContainerLink.svg',
                            label: label,
                            name: linkType.name,
                            statusText: statusText,
                            tooltip: tooltip,
                            value: linkValue
                        })
                    }).render();
                });
            } else {
                //if specific ui elements are not defined, use default ones
                var label = linkType.buttonLabel || linkType.name;
                var tooltip = linkType.buttonTooltip || ('Add ' + linkType.name);
                var statusText = linkType.buttonStatusText || ('Adding <b>' + linkType.name + '</b>');
                var image = linkType.name;

                new ui.components.AddButtonView({
                    model: new ui.components.AddButtonModel({
                        action: ui.states.editor.ADDING.ADD_LINK,
                        buttonImage: image,
                        defaultButtonImage: 'DefaultContainerLink.svg',
                        label: label,
                        name: linkType.name,
                        statusText: statusText,
                        tooltip: tooltip
                    })
                }).render();
            }
        }
    });

}

/*definition of globals to prevent undue JSHint warnings*/
/*globals console:false, istar:false, _:false, ui:false, uiC:false, $:false */

/*!
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 *
 * If you are going to edit the code, always work from the source-code available for download at
 * https://github.com/jhcp/pistar
 */

ui.components = ui.components || {};  //prevents overriding the variable, while also preventing working with a null variable

ui.components.PropertiesTableView = Backbone.View.extend({
    template: _.template($('#property-template').html()),

    initialize: function () {
        'use strict';

        this.$table = $('#properties-table');

        this.listenTo(this.model, 'mouseup', this.render);
        this.listenTo(this.model, 'change:customProperties', this.render);
        this.listenTo(this.model, 'change:name', this.render);
    },

    render: function () {
        'use strict';

        this.renderElementName();
        this.setupElementNameEditing();

        this.renderElementType();
        this.setupElementTypeEditing();

        for (var propertyName in this.model.prop('customProperties')) {
            this.renderCustomProperty(propertyName);
            this.setupCustomPropertyEditing(propertyName);
        }

        this.setupAddPropertyButton();

        this.clearOptionsPanel();
        if (this.model.isElement() || this.model.isLink()) {
            if (this.model.isKindOfActor()) {
                this.setupCollapseExpandButton();
            }
            else if (this.model.isDependum()) {
                this.setupChangeDirectionButton();
            }
            else if (this.model.isLink()) {
                this.setupClearVerticesButton();
            }

            this.setupDeleteButton();

            if (this.model.isDependum()) {
                this.addInfo('TIP: To change the type of this dependency, just click on the current ' +
                  'Type above and choose a new option.');
            }
            else if (this.model.isContributionLink()) {
                this.addInfo('TIP: To change the label of this contribution link, just click on the current ' +
                  'Value above and choose a new option.');
            }
            else if (this.model.isKindOfActor()) {
                this.addInfo('TIP: To change the type of this Actor, just click on the current ' +
                  'Type above and choose a new option.');
            }
        }
        this.setupOptionsPanel();

        if ($.trim($('#cell-actions').html())) {
            $('#sidepanel-title-actions').show();
        }
        else {
            $('#sidepanel-title-actions').hide();
        }

        return this;
    },

    renderElementName: function () {
        'use strict';

        this.$table.find('tbody').html(this.template({
            propertyName: 'Name',
            propertyValue: this.model.prop('name'),
            dataType: 'text'
        }));
    },
    renderElementType: function () {
        'use strict';

        if (this.model.prop('type')) {
            var propertyName = null;
            if (this.model.isDependum && this.model.isDependum()) {
                propertyName = 'type';
            }
            else if (this.model.isKindOfActor && this.model.isKindOfActor()) {
                propertyName = 'type';
            }
            else if (this.model.isContributionLink && this.model.isContributionLink()) {
                propertyName = 'value';
            }
            if (propertyName) {
                this.$table.find('tbody').append(this.template({
                    propertyName: _.capitalize(propertyName),
                    propertyValue: this.model.prop(propertyName),
                    dataType: 'select'
                }));
            }
        }
    },
    setupElementNameEditing: function () {
        'use strict';

        var currentElementModel = this.model;
        this.$table.find('a').editable({
            showbuttons: 'bottom',
            success: function (response, newValue) {
                currentElementModel.prop('name', newValue);
                return {newValue: currentElementModel.prop('name')};
            }
        })
            .on('shown', function () {
                ui.states.editor.transitionTo(ui.states.editor.EDITING_TEXT);
            })
            .on('hidden', function () {
                ui.states.editor.transitionTo(ui.states.editor.VIEWING);
            });
    },
    setupElementTypeEditing: function () {
        'use strict';

        if (this.model.isDependum && this.model.isDependum()) {
            var typeNames = [];
            var currentType = 0;
            var element = this.model;
            _.forEach(istar.metamodel.nodes, function(nodeType, index) {
                typeNames.push({value: index, text: nodeType.name});
                if (nodeType.name === element.prop('type')) {
                    currentType = index;
                }
            }, this);
            this.$table.find('a').editable({
                showbuttons: false,
                source: typeNames,
                success: function (response, newValue) {
                    var updatedElement = ui.getSelectedCells()[0];
                    var newType = istar.metamodel.nodes[newValue].name;
                    updatedElement.prop('type', newType);
                    var newNode = istar.replaceNode(updatedElement, istar.metamodel.nodes[newValue].name)
                        .prop('isDependum', true);
                    ui.selectCell(newNode);
                    ui.showSelection();
                    ui.collectActionData('edit', 'change', 'change dependum type');
                },
                value: currentType
            })
                .on('shown', function () {
                    ui.states.editor.transitionTo(ui.states.editor.EDITING_TEXT);
                })
                .on('hidden', function () {
                    ui.states.editor.transitionTo(ui.states.editor.VIEWING);
                });
        }
        else if (this.model.isKindOfActor && this.model.isKindOfActor()) {
            var typeNames = [];
            var currentType = 0;
            var element = this.model;
            _.forEach(istar.metamodel.containers, function(elementType, index) {
                typeNames.push({value: index, text: elementType.name});
                if (elementType.name === element.prop('type')) {
                    currentType = index;
                }
            }, this);
            this.$table.find('a').editable({
                showbuttons: false,
                source: typeNames,
                success: function (response, newValue) {
                    var updatedElement = ui.getSelectedCells()[0];
                    var newType = istar.metamodel.containers[newValue].name;
                    // updatedElement.prop('type', newType);
                    var result = istar.replaceNode(updatedElement, istar.metamodel.containers[newValue].name);
                    if (result.ok === false) {
                        ui.displayInvalidLinkMessage('it is not possible to change this <b>' +
                            element.prop('type') + '</b> to <b>' + newType +
                            '</b>, because it would violate the following constraint:<br /><br />' +
                            result.isValid.message);
                    }
                    else {
                        ui.selectCell(result);
                        ui.showSelection();
                        ui.collectActionData('edit', 'change', 'change actor type');
                    }
                },
                value: currentType
            })
              .on('shown', function () {
                  ui.states.editor.transitionTo(ui.states.editor.EDITING_TEXT);
              })
              .on('hidden', function () {
                  ui.states.editor.transitionTo(ui.states.editor.VIEWING);
              });
        }
        else if (this.model.isContributionLink && this.model.isContributionLink()) {
            var element = this.model;
            var contributionMetamodel = istar.metamodel.nodeLinks.ContributionLink;
            var valueNames = contributionMetamodel.possibleLabels;
            // var currentType = _.findIndex(valueNames, function(o) { return o === element.prop('value'); });
            this.$table.find('a').editable({
                showbuttons: false,
                source: valueNames,
                success: function (response, newValue) {
                    ui.getSelectedCells()[0].prop('value', newValue);
                    ui.collectActionData('edit', 'change', 'change contribution value');
                },
                value: element.prop('value')
            })
                .on('shown', function () {
                    ui.states.editor.transitionTo(ui.states.editor.EDITING_TEXT);
                })
                .on('hidden', function () {
                    ui.states.editor.transitionTo(ui.states.editor.VIEWING);
                });
        }
        // else {
        //     this.$table.find('a').editable({
        //         disabled: true,
        //     });
        // }
    },
    setupAddPropertyButton: function () {
        'use strict';

        $('#add-property-button-area').html('<a href="#" id="add-property-button" class="property-add" data-type="text" data-pk="1"           data-name="name" data-title="Enter description" data-placeholder="ahhhh" title="Add a new property to this element">        <span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>        Add Property</a>');
        // $('#add-property-button-area').html('<button type="button" id="addPropertyButton">Add Property</button>');
        // $('#cell-buttons').html('<button type="button" id="addPropertyButton">Add Property</button>');
        $('#add-property-button').click(function (e) {
            var newPropertyName = window.prompt('Name of the new custom property:', 'newProperty');
            if (newPropertyName) {
                var isValidName = false;
                var validityMessage = '';
                if (isNaN(newPropertyName)) {
                    var existsPropertyWithSameNameInThisElement = ui.getSelectedCells()[0].prop('customProperties/' + newPropertyName);
                    if (existsPropertyWithSameNameInThisElement === undefined) {
                        newPropertyName = newPropertyName.replace(/\W/g, '');
                        isValidName = true;
                    }
                    else {
                        validityMessage = 'A property with this same name has already been defined; please try again with a different name';
                    }
                }
                else {
                    validityMessage = 'Sorry, the name of a property cannot be a number; please try again with a different name';
                }

                if (isValidName) {
                    ui.getSelectedCells()[0].prop('customProperties/' + newPropertyName, '');
                }
                else {
                    ui.alert(validityMessage, 'Invalid property name');
                }
            }
            ui.collectActionData('click', e.currentTarget.id);
        });
    },
    clearOptionsPanel: function () {
        'use strict';

        $('#cell-actions').html('');
    },
    setupCollapseExpandButton: function () {
        'use strict';

        $('#cell-actions').append(
            '<a id="collapse-expand-actor-button" class="btn btn-default btn-xs button-horizontal" title="Shortcut: alt+click the actor">Collapse/Expand</a><br>'
        );
        $('#collapse-expand-actor-button').click(function (e) {
            if (ui.getSelectedCells()) {
                ui.hideSelection();//remove the focus from the actor
                ui.getSelectedCells()[0].toggleCollapse();
                ui.showSelection();//give the focus back to actor, now collapsed or expanded
            }

            ui.collectActionData('click', e.currentTarget.id);
        });
    },
    setupChangeDirectionButton: function () {
        'use strict';

        if (ui.getSelectedCells()[0].remove) {
            $('#cell-actions').append(
                '<a id="flip-direction-button" class="btn btn-default btn-xs button-horizontal" title="Change the direction of the dependency">Flip direction</a><br>'
            );
            $('#flip-direction-button').click(function (e) {
                var dependum = ui.getSelectedCells()[0];
                if (dependum) {
                    var connectedLinks = istar.graph.getConnectedLinks(dependum);

                    //first verify whether the flipped dependency would be valid
                    var source = connectedLinks[0].getSourceElement();
                    var target = connectedLinks[1].getTargetElement();
                    if (source === dependum) {
                        source = connectedLinks[1].getSourceElement();
                        target = connectedLinks[0].getTargetElement();
                    }
                    var isValid = istar.metamodel.dependencyLinks['DependencyLink'].isValid(target, source);//check with flipped source/target
                    // isValid = istar.types['DependencyLink'].isValid(target, source);//check with flipped source/target

                    if (isValid.isValid) {
                        //If we change the source and target without removing the vertices, the math for creating
                        //the curves may throw exceptions. Thus, we store them in a temp variable, and then re-add
                        //them reversed.
                        //It is reversed because the direction has changed, thus the first vertex is now the last vertex,
                        //and so on.
                        var originalVertices = connectedLinks[0].vertices();
                        var originalSource = connectedLinks[0].prop('source/id');
                        connectedLinks[0].vertices([]);
                        connectedLinks[0].prop('source/id', connectedLinks[0].prop('target/id'));
                        connectedLinks[0].prop('target/id', originalSource);
                        if (istar.graph.getCell(originalSource).isKindOfActor()) {
                            connectedLinks[0].prop('target/selector', 'actorSymbol');
                        } else {
                            connectedLinks[0].prop('target/selector', 'text');
                        }
                        if (istar.graph.getCell(connectedLinks[0].prop('source/id')).isKindOfActor()) {
                            connectedLinks[0].prop('source/selector', 'actorSymbol');
                        } else {
                            connectedLinks[0].prop('source/selector', 'text');
                        }
                        connectedLinks[0].vertices(_.reverse(originalVertices));


                        originalVertices = connectedLinks[1].vertices();
                        connectedLinks[1].vertices([]);
                        originalSource = connectedLinks[1].prop('source/id');
                        connectedLinks[1].prop('source/id', connectedLinks[1].prop('target/id'));
                        connectedLinks[1].prop('target/id', originalSource);
                        if (istar.graph.getCell(originalSource).isKindOfActor()) {
                            connectedLinks[1].prop('target/selector', 'actorSymbol');
                        } else {
                            connectedLinks[1].prop('target/selector', 'text');
                        }
                        if (istar.graph.getCell(connectedLinks[1].prop('source/id')).isKindOfActor()) {
                            connectedLinks[1].prop('source/selector', 'actorSymbol');
                        } else {
                            connectedLinks[1].prop('source/selector', 'text');
                        }
                        connectedLinks[1].vertices(_.reverse(originalVertices));
                        ui.selectCell(dependum);
                    }
                    else {
                        ui.displayInvalidLinkMessage(isValid.message + '. Thus, this Dependency currently cannot be flipped');
                    }
                }
                ui.collectActionData('click', e.currentTarget.id);
            });
        }
    },
    setupClearVerticesButton: function () {
        'use strict';

        $('#cell-actions').append(
            '<a id="clear-vertices-button" class="btn btn-default btn-xs button-horizontal" ' +
            'title="This deletes all vertices in this link. To delete an individual vertex, double click the vertex.">Clear vertices</a><br>'
        );
        $('#clear-vertices-button').click(function (e) {
            if (ui.getSelectedCells()) {
                ui.getSelectedCells()[0].vertices([]);
            }
            ui.collectActionData('click', e.currentTarget.id);
        });
    },
    setupDeleteButton: function () {
        'use strict';

        if (ui.getSelectedCells()[0].remove) {
            $('#cell-actions').append(
                '<a id="delete-element-button" class="btn btn-default btn-xs button-horizontal" title="Shortcut: Delete key">Delete</a><br>'
            );
            $('#delete-element-button').click(function (e) {
                if (ui.getSelectedCells()) {
                    ui.deleteCell(ui.getSelectedCells()[0]);
                }
                ui.collectActionData('click', e.currentTarget.id);
            });
        }
    },
    setupOptionsPanel: function () {
        /*
        'use strict';

        if (this.model.prop('backgroundColor')) {
            $('#single-element-color-picker').get(0).jscolor.fromString(this.model.prop('backgroundColor'));
        }
        else if (ui.getSelectedCells()){
            $('#single-element-color-picker').get(0).jscolor.fromString(ui.defaultElementBackgroundColor);
        }
        */
    },
    addInfo: function (content) {
        'use strict';

        $('#cell-actions').append(
          '<i>' + content + '</i><br>'
        );
    },
    renderCustomProperty: function (propertyName) {
        'use strict';

        this.$table.find('tbody').append(this.template({
            propertyName: propertyName,
            propertyValue: this.model.prop('customProperties/' + propertyName),
            dataType: 'textarea'
        }));
    },
    setupCustomPropertyEditing: function (propertyName) {
        'use strict';

        $('#current' + propertyName).editable({
                showbuttons: 'bottom',
                success: function (response, newValue) {
                    //update backbone model
                    var updatedElement = ui.changeCustomPropertyValue(ui.getSelectedCells()[0], $(this).attr('data-name'), newValue);
                    return {newValue: updatedElement.prop('customProperties/' + propertyName)};
                }
            }
        )
            .on('shown', function () {
                ui.states.editor.transitionTo(ui.states.editor.EDITING_TEXT);
            })
            .on('hidden', function () {
                ui.states.editor.transitionTo(ui.states.editor.VIEWING);
            });
    },
});

''/*!
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 *
 * If you are going to edit the code, always work from the source-code available for download at
 * https://github.com/jhcp/pistar
 */

istar.models = istar.models || {};  //prevents overriding the variable, while also preventing working with a null variable

istar.models.processModelParameter = function () {
    "use strict";

    var modelId = this.getAllUrlParams().m || 'modeller';
    if (! istar.models[modelId]) {
        alert('Sorry, we do not have this model: ' + modelId);
        modelId = 'modeller';
    }

    return istar.models[modelId];
};

istar.models.getAllUrlParams = function () {
    "use strict";
    //this function was adapted from the following tutorial:
    // https://www.sitepoint.com/get-url-parameters-with-javascript/

    // get query string from the window

    var queryString = window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            // paramName = paramName.toLowerCase();
            // if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            // if (paramName.match(/\[(\d+)?\]$/)) {
            //
            //     // create key if it doesn't exist
            //     var key = paramName.replace(/\[(\d+)?\]/, '');
            //     if (!obj[key]) obj[key] = [];
            //
            //     // if it's an indexed array e.g. colors[2]
            //     if (paramName.match(/\[\d+\]$/)) {
            //         // get the index value and add the entry at the appropriate position
            //         var index = /\[(\d+)\]/.exec(paramName)[1];
            //         obj[key][index] = paramValue;
            //     } else {
            //         // otherwise add the value to the end of the array
            //         obj[key].push(paramValue);
            //     }
            // } else {
            // we're dealing with a string
            if (!obj[paramName]) {
                // if it doesn't exist, create property
                obj[paramName] = paramValue;
            } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                // if property does exist and it's a string, convert it to an array
                obj[paramName] = [obj[paramName]];
                obj[paramName].push(paramValue);
            } else {
                // otherwise add the property
                obj[paramName].push(paramValue);
            }
            // }
        }
    }

    return obj;
};

istar.models.loadPistarWelcome = function () {
    istar.fileManager.loadModel(this.pistarWelcome);
};


//console.log(code);

//TODO : aggiornare
//istar.models.modeller = await setIstar();

istar.models.modeller = {};

/*
istar.models.pistarWelcome = {
    "actors": [
        {
            "id": "fcf67803-5e5a-4bae-8690-1f12af4446d6",
            "text": "piStar tool v2.1.0",
            "type": "istar.Agent",
            "x": 530,
            "y": 55,
            "customProperties": {
                "ReleaseDate": "November 29th, 2021"
            },
            "nodes": [
                {
                    "id": "f9035e8c-0294-44a8-a93e-85a349d2f21a",
                    "text": "Change the type of dependums",
                    "type": "istar.Task",
                    "x": 530,
                    "y": 311,
                    "customProperties": {
                        "Description": "Now you can change the type of dependum elements, between Goal, Quality, Resource and Task. In order to do so, select the dependum and then change its type in the Properties panel",
                        "Since": "Version 2.0.0"
                    }
                },
                {
                    "id": "c9d1ae28-8b77-4643-a7ac-7e70903dadb7",
                    "text": "Change the type of actors",
                    "type": "istar.Task",
                    "x": 623,
                    "y": 348,
                    "customProperties": {
                        "Description": "Now you can change the type of existing actors, betwen Actor, Agent and Role. In order to do so, select the actor and then change its type in the Properties panel",
                        "Since": "Version 2.1.0"
                    }
                },
                {
                    "id": "d2d100ae-ba57-424b-864c-dc3ec69cb2fb",
                    "text": "Change the type of contribution links",
                    "type": "istar.Task",
                    "x": 716,
                    "y": 288,
                    "customProperties": {
                        "Description": "Now you can change the type of contribution links (Make, Help, Hurt, Break). In order to do so, select the link and then change its type in the Properties panel",
                        "Since": "Version 2.0.0"
                    }
                },
                {
                    "id": "9250b018-fb16-4b82-b7bf-5f5589b6b259",
                    "text": "Auto-layout",
                    "type": "istar.Task",
                    "x": 547,
                    "y": 396,
                    "customProperties": {
                        "Description": "Auto-layout feature kindly contributed by researchers from the Beijing University of Technology. This is very useful when you want to create SD (Strategic Dependencies) views of your model",
                        "Since": "Version 2.1.0"
                    }
                },
                {
                    "id": "339417b8-0430-4ceb-be12-d6cf7b440a35",
                    "text": "Prevent data loss from accidental deletes",
                    "type": "istar.Quality",
                    "x": 573,
                    "y": 100,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "3c4eacd1-cc6b-4c1e-8a9e-2260229d831f",
                    "text": "Confirm before deleting actors",
                    "type": "istar.Task",
                    "x": 709,
                    "y": 210,
                    "customProperties": {
                        "Description": "Only delete an actor after confirmation from the user",
                        "Since": "Version 2.1.0"
                    }
                },
                {
                    "id": "2904a233-4620-461c-978a-0058a4d3bdc4",
                    "text": "Undo deletes",
                    "type": "istar.Task",
                    "x": 759,
                    "y": 112,
                    "customProperties": {
                        "Description": "Undo through Ctrl+z, Command+z, or through the \"Undo delete\" button on the menu bar",
                        "Since": "Version 2.1.0"
                    }
                },
                {
                    "id": "825269c5-af60-4db1-b55c-316987dcb880",
                    "text": "Modify existing elements",
                    "type": "istar.Task",
                    "x": 585,
                    "y": 223,
                    "customProperties": {
                        "Description": "Be able to modify existing elements"
                    }
                }
            ]
        },
        {
            "id": "bda083fe-1fb4-41cf-aea9-449c0d4044b5",
            "text": "Business Analyst",
            "type": "istar.Role",
            "x": 86,
            "y": 31,
            "customProperties": {
                "Description": "Someone that needs to undestand the goals of an organizations"
            },
            "nodes": [
                {
                    "id": "71c7aeb6-fb99-40a1-bcd1-5a29e5b45252",
                    "text": "i* models created",
                    "type": "istar.Goal",
                    "x": 187,
                    "y": 49,
                    "customProperties": {
                        "Description": "This tool supports the creation of goal model using the i* 2.0 language (iStar 2.0)"
                    }
                },
                {
                    "id": "8d716a61-1ca4-44f4-934c-26166ea44d11",
                    "text": "Use the piStar Tool",
                    "type": "istar.Task",
                    "x": 142,
                    "y": 231,
                    "customProperties": {
                        "Description": "You can use it for free, without worrying about installations"
                    }
                },
                {
                    "id": "e159ce92-b29d-4fdc-a533-ee1e904f9f57",
                    "text": "Good visual quality",
                    "type": "istar.Quality",
                    "x": 120,
                    "y": 120,
                    "customProperties": {
                        "Description": "- no visual artefacts due to compression or rescaling;\n - aesthetically similar to the diagrams from the i* Wiki guides"
                    }
                },
                {
                    "id": "3e732026-ae4c-4038-acb7-bd9f036c5f73",
                    "text": "Reliable usage",
                    "type": "istar.Quality",
                    "x": 252,
                    "y": 133,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "ab3313df-175f-4b2b-9486-c0915a3d1cd4",
                    "text": "Modify the diagram",
                    "type": "istar.Task",
                    "x": 199,
                    "y": 342,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "8cc94931-99dd-441e-bf97-9b08c03ae576",
                    "text": "Organize the layout of the diagram",
                    "type": "istar.Task",
                    "x": 100,
                    "y": 321,
                    "customProperties": {
                        "Description": ""
                    }
                }
            ]
        }
    ],
    "orphans": [],
    "dependencies": [
        {
            "id": "4d80aa30-a36b-4737-9299-056aa7748073",
            "text": "Modify existing elements",
            "type": "istar.Task",
            "x": 271,
            "y": 416,
            "customProperties": {
                "Description": ""
            },
            "source": "ab3313df-175f-4b2b-9486-c0915a3d1cd4",
            "target": "825269c5-af60-4db1-b55c-316987dcb880"
        },
        {
            "id": "76d9cfde-d464-4203-907a-af97c32f7501",
            "text": "Have the actors and dependencies automatically positioned",
            "type": "istar.Goal",
            "x": 62,
            "y": 429,
            "customProperties": {
                "Description": ""
            },
            "source": "8cc94931-99dd-441e-bf97-9b08c03ae576",
            "target": "9250b018-fb16-4b82-b7bf-5f5589b6b259"
        },
        {
            "id": "7af8ec40-8f4f-4904-8130-f33157427ca9",
            "text": "Prevent data loss from accidental deletes",
            "type": "istar.Quality",
            "x": 397,
            "y": 191,
            "customProperties": {
                "Description": ""
            },
            "source": "3e732026-ae4c-4038-acb7-bd9f036c5f73",
            "target": "339417b8-0430-4ceb-be12-d6cf7b440a35"
        }
    ],
    "links": [
        {
            "id": "a6ab1c51-08f5-4abb-beca-7965426da9c9",
            "type": "istar.DependencyLink",
            "source": "7af8ec40-8f4f-4904-8130-f33157427ca9",
            "target": "339417b8-0430-4ceb-be12-d6cf7b440a35"
        },
        {
            "id": "58dea4bb-990d-4a78-a15b-bb40d6b54871",
            "type": "istar.DependencyLink",
            "source": "3e732026-ae4c-4038-acb7-bd9f036c5f73",
            "target": "7af8ec40-8f4f-4904-8130-f33157427ca9"
        },
        {
            "id": "ee36bf97-8ff8-4de3-842b-6ca70175ccac",
            "type": "istar.DependencyLink",
            "source": "76d9cfde-d464-4203-907a-af97c32f7501",
            "target": "9250b018-fb16-4b82-b7bf-5f5589b6b259"
        },
        {
            "id": "022d5fc4-310c-4442-97b4-3502f33112fe",
            "type": "istar.DependencyLink",
            "source": "8cc94931-99dd-441e-bf97-9b08c03ae576",
            "target": "76d9cfde-d464-4203-907a-af97c32f7501"
        },
        {
            "id": "bcb44d19-4d04-4b1c-964d-06cd7a5cf00a",
            "type": "istar.DependencyLink",
            "source": "4d80aa30-a36b-4737-9299-056aa7748073",
            "target": "825269c5-af60-4db1-b55c-316987dcb880"
        },
        {
            "id": "191489fd-e483-4cef-9da7-00cecedca842",
            "type": "istar.DependencyLink",
            "source": "ab3313df-175f-4b2b-9486-c0915a3d1cd4",
            "target": "4d80aa30-a36b-4737-9299-056aa7748073"
        },
        {
            "id": "5c3a554c-5988-48ec-b2c7-293b8e1db746",
            "type": "istar.ContributionLink",
            "source": "8d716a61-1ca4-44f4-934c-26166ea44d11",
            "target": "e159ce92-b29d-4fdc-a533-ee1e904f9f57",
            "label": "help"
        },
        {
            "id": "4cb02d7c-a150-4e81-b340-26fa8fab9894",
            "type": "istar.ContributionLink",
            "source": "3c4eacd1-cc6b-4c1e-8a9e-2260229d831f",
            "target": "339417b8-0430-4ceb-be12-d6cf7b440a35",
            "label": "help"
        },
        {
            "id": "5bc05a64-fcca-4eba-9f8b-f19e43773ffb",
            "type": "istar.ContributionLink",
            "source": "2904a233-4620-461c-978a-0058a4d3bdc4",
            "target": "339417b8-0430-4ceb-be12-d6cf7b440a35",
            "label": "make"
        },
        {
            "id": "39c892a8-07a6-44fb-a2c7-a21257143f74",
            "type": "istar.QualificationLink",
            "source": "e159ce92-b29d-4fdc-a533-ee1e904f9f57",
            "target": "71c7aeb6-fb99-40a1-bcd1-5a29e5b45252"
        },
        {
            "id": "6c57baea-e769-4fa5-a19d-6b12eecdb7cd",
            "type": "istar.OrRefinementLink",
            "source": "f9035e8c-0294-44a8-a93e-85a349d2f21a",
            "target": "825269c5-af60-4db1-b55c-316987dcb880"
        },
        {
            "id": "124b5a38-6a0f-4cad-952f-bd95781d5878",
            "type": "istar.OrRefinementLink",
            "source": "c9d1ae28-8b77-4643-a7ac-7e70903dadb7",
            "target": "825269c5-af60-4db1-b55c-316987dcb880"
        },
        {
            "id": "1d75dbfb-4e92-4ed9-a807-f6ebc525eb8b",
            "type": "istar.OrRefinementLink",
            "source": "d2d100ae-ba57-424b-864c-dc3ec69cb2fb",
            "target": "825269c5-af60-4db1-b55c-316987dcb880"
        },
        {
            "id": "e4daee5e-e8f1-4d15-b3f2-375532357452",
            "type": "istar.OrRefinementLink",
            "source": "8cc94931-99dd-441e-bf97-9b08c03ae576",
            "target": "8d716a61-1ca4-44f4-934c-26166ea44d11"
        },
        {
            "id": "7835d50c-0e9d-4fce-a84a-ecf565a30f10",
            "type": "istar.OrRefinementLink",
            "source": "ab3313df-175f-4b2b-9486-c0915a3d1cd4",
            "target": "8d716a61-1ca4-44f4-934c-26166ea44d11"
        },
        {
            "id": "0823486c-9c6b-4567-a5b2-25959fa4bc2f",
            "type": "istar.QualificationLink",
            "source": "3e732026-ae4c-4038-acb7-bd9f036c5f73",
            "target": "71c7aeb6-fb99-40a1-bcd1-5a29e5b45252"
        }
    ],
    "display": {
        "fcf67803-5e5a-4bae-8690-1f12af4446d6": {
            "backgroundColor": "#9AB6FA"
        },
        "c9d1ae28-8b77-4643-a7ac-7e70903dadb7": {
            "backgroundColor": "#9AB6FA"
        },
        "d2d100ae-ba57-424b-864c-dc3ec69cb2fb": {
            "width": 101.28125,
            "height": 56.84375
        },
        "9250b018-fb16-4b82-b7bf-5f5589b6b259": {
            "backgroundColor": "#9AB6FA"
        },
        "339417b8-0430-4ceb-be12-d6cf7b440a35": {
            "width": 113.81524658203125,
            "height": 65.8504638671875
        },
        "3c4eacd1-cc6b-4c1e-8a9e-2260229d831f": {
            "backgroundColor": "#9AB6FA",
            "width": 104.78125,
            "height": 47.84375
        },
        "2904a233-4620-461c-978a-0058a4d3bdc4": {
            "backgroundColor": "#9AB6FA"
        },
        "4d80aa30-a36b-4737-9299-056aa7748073": {
            "width": 111.78125,
            "height": 42.84375
        },
        "76d9cfde-d464-4203-907a-af97c32f7501": {
            "width": 118.78125,
            "height": 63.84375
        },
        "7af8ec40-8f4f-4904-8130-f33157427ca9": {
            "width": 107.81314086914062,
            "height": 49.848907470703125
        },
        "a6ab1c51-08f5-4abb-beca-7965426da9c9": {
            "vertices": [
                {
                    "x": 546,
                    "y": 195
                }
            ]
        },
        "58dea4bb-990d-4a78-a15b-bb40d6b54871": {
            "vertices": [
                {
                    "x": 348,
                    "y": 214
                }
            ]
        },
        "ee36bf97-8ff8-4de3-842b-6ca70175ccac": {
            "vertices": [
                {
                    "x": 345,
                    "y": 481
                }
            ]
        },
        "022d5fc4-310c-4442-97b4-3502f33112fe": {
            "vertices": [
                {
                    "x": 95,
                    "y": 398
                }
            ]
        },
        "bcb44d19-4d04-4b1c-964d-06cd7a5cf00a": {
            "vertices": [
                {
                    "x": 434,
                    "y": 387
                },
                {
                    "x": 484,
                    "y": 278
                }
            ]
        },
        "191489fd-e483-4cef-9da7-00cecedca842": {
            "vertices": [
                {
                    "x": 229,
                    "y": 433
                }
            ]
        },
        "4cb02d7c-a150-4e81-b340-26fa8fab9894": {
            "vertices": [
                {
                    "x": 728,
                    "y": 172
                }
            ]
        },
        "5bc05a64-fcca-4eba-9f8b-f19e43773ffb": {
            "vertices": [
                {
                    "x": 730,
                    "y": 119
                }
            ]
        }
    },
    "tool": "pistar.2.1.0",
    "istar": "2.0",
    "saveDate": "Sat, 27 Nov 2021 17:12:04 GMT",
    "diagram": {
        "width": 1000,
        "height": 700,
        "name": "Welcome Model",
        "customProperties": {
            "Description": "Welcome to the piStar tool version 2.1.0, released on November, 2021! This model describes some of the recent improvements in the tool. Click on the purple elements for further info.\n\nFor help using this tool, please check the Help menu above"
        }
    }
};
*/



istar.models.smartHome = {
    "actors": [
        {
            "id": "0c7fe3d8-ed88-4bc1-8464-80c769a1b97f",
            "text": "Smart home system",
            "type": "istar.Actor",
            "x": 329,
            "y": 35,
            "customProperties": {
                "Description": ""
            },
            "nodes": [
                {
                    "id": "0f052835-9f3f-491a-a3f0-c70d2001fca5",
                    "text": "Temperature be managed",
                    "type": "istar.Goal",
                    "x": 588,
                    "y": 131,
                    "customProperties": {
                        "Description": "",
                        "Context": "There is someone at the smart home"
                    }
                },
                {
                    "id": "3b1813ea-e6b1-40ec-a11d-49cda0c82324",
                    "text": "Reliability",
                    "type": "istar.Quality",
                    "x": 883,
                    "y": 43,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "b76387a2-ca54-468d-88d1-45227b47ff83",
                    "text": "Energy spent wisely",
                    "type": "istar.Quality",
                    "x": 453,
                    "y": 35,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "834513e9-a5d2-43fa-ae24-3c57f645064a",
                    "text": "Adaptability",
                    "type": "istar.Quality",
                    "x": 1018,
                    "y": 78,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "4692dc12-801f-4174-9afa-8e710f4d722f",
                    "text": "Prevent failures",
                    "type": "istar.Task",
                    "x": 1180,
                    "y": 101,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "e8239026-4607-4acc-a4ed-a771d72fbcbc",
                    "text": "Select best behaviour according to the environment",
                    "type": "istar.Task",
                    "x": 1143,
                    "y": 174,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "490feaca-a7f4-470f-a2db-d5c8073f5f56",
                    "text": "Control windows",
                    "type": "istar.Task",
                    "x": 476,
                    "y": 204,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "3eb43835-be08-42fb-9158-0e1c45d66bbb",
                    "text": "Control fan",
                    "type": "istar.Task",
                    "x": 674,
                    "y": 220,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "e54e1fd2-9c11-4097-b296-35dd65763bda",
                    "text": "Control heating device",
                    "type": "istar.Task",
                    "x": 811,
                    "y": 173,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "bab3e64d-95c4-4e60-b105-8fa38aad0093",
                    "text": "Open window",
                    "type": "istar.Task",
                    "x": 440,
                    "y": 296,
                    "customProperties": {
                        "Description": "",
                        "Context": ""
                    }
                },
                {
                    "id": "b2e93b23-d7f1-48f2-be68-dafef2f9bade",
                    "text": "Close window",
                    "type": "istar.Task",
                    "x": 549,
                    "y": 306,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "5e0579a1-57d6-4de1-ad56-0d7810a5b52d",
                    "text": "Turn on fan",
                    "type": "istar.Task",
                    "x": 651,
                    "y": 302,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "9ddc02f7-59a9-4565-9721-6e60dc66f10c",
                    "text": "Turn off fan",
                    "type": "istar.Task",
                    "x": 747,
                    "y": 352,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "623862d4-6b91-4278-83bf-342e66ef3bda",
                    "text": "Turn on heating device",
                    "type": "istar.Task",
                    "x": 813,
                    "y": 280,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "9d534e15-95a0-44ea-a1b4-8bab3b1fd6c4",
                    "text": "Turn off heating device",
                    "type": "istar.Task",
                    "x": 901,
                    "y": 227,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "add6b9fe-6314-4eab-bb22-61d5717c54ce",
                    "text": "Manage lights",
                    "type": "istar.Task",
                    "x": 1079,
                    "y": 322,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "65524a26-5718-499e-a023-14066a7725d9",
                    "text": "Lights be managed",
                    "type": "istar.Goal",
                    "x": 1008,
                    "y": 249,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "0d89c849-6ee1-4b96-9102-103edf016542",
                    "text": "Select lights policy",
                    "type": "istar.Task",
                    "x": 883,
                    "y": 343,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "ee6f36f2-01db-485d-a304-20f41f90d33b",
                    "text": "Occupancy simulation",
                    "type": "istar.Task",
                    "x": 815,
                    "y": 419,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "93365266-ac6f-48ba-9c2d-c1f110ebb5dc",
                    "text": "Lights on by occupancy",
                    "type": "istar.Task",
                    "x": 910,
                    "y": 429,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "83005b8f-bfe4-4378-995b-78407139c97f",
                    "text": "Control lights",
                    "type": "istar.Task",
                    "x": 1070,
                    "y": 390,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "e3beae74-b939-47d8-89fb-2ed6d446a2e8",
                    "text": "Turn on light",
                    "type": "istar.Task",
                    "x": 1014,
                    "y": 455,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "e1943868-5e88-41f4-9368-f10e48a360ca",
                    "text": "Turn off light",
                    "type": "istar.Task",
                    "x": 1156,
                    "y": 452,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "36f19256-e85f-48c8-a2b1-6b5c68760f93",
                    "text": "Safety",
                    "type": "istar.Quality",
                    "x": 612,
                    "y": 340,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "39e3358a-79c9-4a82-93c9-bc77d26c6610",
                    "text": "Manage fire incident",
                    "type": "istar.Task",
                    "x": 605,
                    "y": 442,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "0e54535c-be18-4ee6-a347-40f0261a6b50",
                    "text": "Control gas valves",
                    "type": "istar.Task",
                    "x": 410,
                    "y": 366,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "62659e86-92a5-4d32-842a-8a44a4646c6d",
                    "text": "Open gas valves",
                    "type": "istar.Task",
                    "x": 368,
                    "y": 482,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "b9db7012-9e2d-4e85-8beb-ad3e93dc312a",
                    "text": "Close gas valves",
                    "type": "istar.Task",
                    "x": 453,
                    "y": 525,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "d8c3d54b-d979-4872-a435-847c5fc11d89",
                    "text": "Unlock doors",
                    "type": "istar.Task",
                    "x": 583,
                    "y": 656,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "2946613f-b8aa-4d2d-afe0-e1a5ee8bea9d",
                    "text": "Lock doors",
                    "type": "istar.Task",
                    "x": 470,
                    "y": 684,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "632c6d4f-632d-4d45-b4a2-5764744184ef",
                    "text": "Control doors lock",
                    "type": "istar.Task",
                    "x": 465,
                    "y": 590,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "9452a1a3-07dc-49a1-9534-3883aea9d55f",
                    "text": "Control power outlet",
                    "type": "istar.Task",
                    "x": 695,
                    "y": 546,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "ca7c6b8c-e155-4c8f-a8d0-ce86cc1c1a02",
                    "text": "Deactivate power outlet",
                    "type": "istar.Task",
                    "x": 673,
                    "y": 631,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "47a0c4b6-9844-4ff3-8ba7-8db7923805bd",
                    "text": "Activate power outlet",
                    "type": "istar.Task",
                    "x": 773,
                    "y": 609,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "336c8a20-26f7-4dc5-a20f-8b5925c7f439",
                    "text": "Control alarm",
                    "type": "istar.Task",
                    "x": 836,
                    "y": 495,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "c0384b04-9745-43a7-ad96-17cc6a83f613",
                    "text": "Activate alarm",
                    "type": "istar.Task",
                    "x": 807,
                    "y": 566,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "6a12bc40-749d-49a3-a70d-84bccca84167",
                    "text": "Deactivate alarm",
                    "type": "istar.Task",
                    "x": 913,
                    "y": 560,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "9126a353-2812-47fe-bfa4-c7b1c3672952",
                    "text": "Entertainment",
                    "type": "istar.Quality",
                    "x": 1051,
                    "y": 517,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "6824c565-ae86-4cf9-ba0a-c6922f343028",
                    "text": "Manage sound system",
                    "type": "istar.Task",
                    "x": 940,
                    "y": 612,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "755356b4-962f-4dcf-8e36-1a4d2816c391",
                    "text": "Schedule social event with a friend",
                    "type": "istar.Task",
                    "x": 1138,
                    "y": 604,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "494a5feb-2f56-4434-832a-534ab061a6b0",
                    "text": "Play music",
                    "type": "istar.Task",
                    "x": 836,
                    "y": 690,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "5af70b15-c536-435e-ad47-1f4aa592dabe",
                    "text": "Customize playlist according to preferences",
                    "type": "istar.Task",
                    "x": 951,
                    "y": 692,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "12ee7e98-5582-493e-bfe5-21996c0659c2",
                    "text": "Direct sound only to occupied rooms",
                    "type": "istar.Task",
                    "x": 1045,
                    "y": 730,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "e929c189-5dd3-4cb3-8be9-c7a1df556170",
                    "text": "Select songs manually",
                    "type": "istar.Task",
                    "x": 911,
                    "y": 800,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "7968c298-1328-4786-b6b2-0a53e38b884f",
                    "text": "Select songs by preferences",
                    "type": "istar.Task",
                    "x": 1038,
                    "y": 797,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "e1ca06c4-f816-4ba4-9b97-fd9b36a54511",
                    "text": "Fast response",
                    "type": "istar.Task",
                    "x": 1090,
                    "y": 671,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "14d4cc03-526b-4506-aefc-c8cc26b49869",
                    "text": "Invite friend",
                    "type": "istar.Task",
                    "x": 1193,
                    "y": 677,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "7a6b97ae-1ad6-4dcc-bff0-173f06ba3db6",
                    "text": "Manage tenant nutrition",
                    "type": "istar.Task",
                    "x": 618,
                    "y": 737,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "ee2ea7fc-93ad-40bc-b11a-b7b87c00e315",
                    "text": "Tenant is well nourished",
                    "type": "istar.Goal",
                    "x": 725,
                    "y": 677,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "f504dbd8-3abe-4543-bb7d-7fcbc7e42c23",
                    "text": "Provide meals",
                    "type": "istar.Goal",
                    "x": 484,
                    "y": 779,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "9a938a9a-d944-48f2-b9a1-d8fc967b1d2a",
                    "text": "Save money",
                    "type": "istar.Quality",
                    "x": 375,
                    "y": 676.5,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "733e013c-e3d5-48f9-b1bb-47f3ba22e850",
                    "text": "Assist the tenant in cooking the meal",
                    "type": "istar.Task",
                    "x": 392,
                    "y": 849,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "5d6d705c-5a25-40fb-922e-6db0e1cc78a4",
                    "text": "Provide recipe",
                    "type": "istar.Task",
                    "x": 365,
                    "y": 960,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "12e93ae7-6ad0-43ed-ac4d-b24266d95cdc",
                    "text": "Request restaurant meal",
                    "type": "istar.Task",
                    "x": 546,
                    "y": 883,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "425f8bb2-519c-4839-8825-85bc3c8645ab",
                    "text": "Suggest daily menu",
                    "type": "istar.Task",
                    "x": 575,
                    "y": 834,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "d5631cc0-865a-4a18-b211-999a9a39037d",
                    "text": "Keep track of consumed food",
                    "type": "istar.Task",
                    "x": 759,
                    "y": 845,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "63c8611d-a4a5-4a2f-a9e2-44d26375cc5f",
                    "text": "Monitor food consumption",
                    "type": "istar.Task",
                    "x": 809,
                    "y": 940,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "fbe79b38-b7ab-4980-897d-d84a67f7350a",
                    "text": "Keep track of consumed medicines",
                    "type": "istar.Task",
                    "x": 872,
                    "y": 856,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "a35d270d-7972-472d-8e26-14a31ba0f74b",
                    "text": "Monitor medicine consumption",
                    "type": "istar.Task",
                    "x": 983,
                    "y": 993,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "1bf4a5a9-e155-427f-8bf2-cf0111dc01bd",
                    "text": "Customization",
                    "type": "istar.Quality",
                    "x": 329,
                    "y": 1063,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "9fece159-1b77-4895-b926-05c4bd762fa2",
                    "text": "Manage food stock supply",
                    "type": "istar.Goal",
                    "x": 602,
                    "y": 936,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "38bf3ed6-d963-4409-8c0b-53b631332c56",
                    "text": "Buy food when required",
                    "type": "istar.Task",
                    "x": 537,
                    "y": 1009,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "c03e227b-b6e2-4a38-a3a2-aaf458d0262b",
                    "text": "Order food",
                    "type": "istar.Task",
                    "x": 585,
                    "y": 1091,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "62e762e3-6560-4860-89fa-66bc6f5e8ad1",
                    "text": "Get food stock status",
                    "type": "istar.Task",
                    "x": 441,
                    "y": 1079,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "1623c785-fe22-4c96-8988-c9eae3b614f9",
                    "text": "Notify tenants",
                    "type": "istar.Task",
                    "x": 482,
                    "y": 430,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "2ce237c5-9027-4ff4-8744-c28ca73f34f2",
                    "text": "Notify fire department",
                    "type": "istar.Task",
                    "x": 743,
                    "y": 459,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "dbb5b65d-49fe-40ef-b241-7d3091f11083",
                    "text": "Make a log of food consumption",
                    "type": "istar.Task",
                    "x": 701,
                    "y": 931,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "81b16c06-1d05-47c3-9412-826ac1915a32",
                    "text": "Make a log of medicine consumption",
                    "type": "istar.Task",
                    "x": 854.5,
                    "y": 993,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "d04a2c15-d39b-4879-963e-a809cb7f64e2",
                    "text": "Get enviroment data",
                    "type": "istar.Task",
                    "x": 1164,
                    "y": 272,
                    "customProperties": {
                        "Description": ""
                    }
                }
            ]
        },
        {
            "id": "397fb3fe-da8d-4a72-a1c2-3bf6f87a1da5",
            "text": "Data storage",
            "type": "istar.Actor",
            "x": 755,
            "y": 1296,
            "customProperties": {
                "Description": ""
            },
            "nodes": []
        },
        {
            "id": "ee9cf1ad-3095-4338-96ad-96547a46e2c1",
            "text": "Communication",
            "type": "istar.Actor",
            "x": 1599,
            "y": 839,
            "customProperties": {
                "Description": ""
            },
            "nodes": []
        },
        {
            "id": "611e34df-7de1-4101-ab76-5b53594cba35",
            "text": "Preference manager",
            "type": "istar.Actor",
            "x": 334,
            "y": 1349,
            "customProperties": {
                "Description": ""
            },
            "nodes": []
        },
        {
            "id": "9d10bc4a-0d76-495d-bb81-3d1af8275ba9",
            "text": "Monitor",
            "type": "istar.Actor",
            "x": 1495,
            "y": 222,
            "customProperties": {
                "Description": ""
            },
            "nodes": []
        },
        {
            "id": "9b3379a4-5245-41e9-87cd-7752297a8ce9",
            "text": "Actuator",
            "type": "istar.Actor",
            "x": 60,
            "y": 533,
            "customProperties": {
                "Description": ""
            },
            "nodes": []
        }
    ],
    "orphans": [],
    "dependencies": [
        {
            "id": "d59528d3-48ca-41c9-91bd-153223b4c543",
            "text": "Send fire notification to fire department",
            "type": "istar.Task",
            "x": 1358,
            "y": 892,
            "customProperties": {
                "Description": ""
            },
            "source": "1623c785-fe22-4c96-8988-c9eae3b614f9",
            "target": "ee9cf1ad-3095-4338-96ad-96547a46e2c1"
        },
        {
            "id": "35136956-b6f6-4876-b10c-513298f53c41",
            "text": "Send fire notification to tenants",
            "type": "istar.Task",
            "x": 1409,
            "y": 681,
            "customProperties": {
                "Description": ""
            },
            "source": "2ce237c5-9027-4ff4-8744-c28ca73f34f2",
            "target": "ee9cf1ad-3095-4338-96ad-96547a46e2c1"
        },
        {
            "id": "9f4992db-9cdd-43d5-bb43-ed6b3b6a7bb1",
            "text": "Food stock status",
            "type": "istar.Resource",
            "x": 514,
            "y": 1231,
            "customProperties": {
                "Description": ""
            },
            "source": "62e762e3-6560-4860-89fa-66bc6f5e8ad1",
            "target": "397fb3fe-da8d-4a72-a1c2-3bf6f87a1da5"
        },
        {
            "id": "4067be93-567f-44b6-b95b-a250ba4a6412",
            "text": "Store food consumption data",
            "type": "istar.Task",
            "x": 646,
            "y": 1181,
            "customProperties": {
                "Description": ""
            },
            "source": "dbb5b65d-49fe-40ef-b241-7d3091f11083",
            "target": "397fb3fe-da8d-4a72-a1c2-3bf6f87a1da5"
        },
        {
            "id": "05017065-0a5a-4a0a-9a38-30a7b1561a73",
            "text": "Request restaurant meal",
            "type": "istar.Task",
            "x": 1372,
            "y": 984,
            "customProperties": {
                "Description": "",
                "Context": "There is an Internet connection available and active at the smart home"
            },
            "source": "12e93ae7-6ad0-43ed-ac4d-b24266d95cdc",
            "target": "ee9cf1ad-3095-4338-96ad-96547a46e2c1"
        },
        {
            "id": "317873f2-af07-4ba2-a3c3-80570d62ec80",
            "text": "Store medicine consumption data",
            "type": "istar.Task",
            "x": 784,
            "y": 1166,
            "customProperties": {
                "Description": ""
            },
            "source": "81b16c06-1d05-47c3-9412-826ac1915a32",
            "target": "397fb3fe-da8d-4a72-a1c2-3bf6f87a1da5"
        },
        {
            "id": "30fa866c-3264-4986-a0b3-842a2a04edbc",
            "text": "Preferences",
            "type": "istar.Resource",
            "x": 520,
            "y": 1330,
            "customProperties": {
                "Description": ""
            },
            "source": "611e34df-7de1-4101-ab76-5b53594cba35",
            "target": "397fb3fe-da8d-4a72-a1c2-3bf6f87a1da5"
        },
        {
            "id": "c4120857-f974-419f-9494-28a05eab42d3",
            "text": "Customization",
            "type": "istar.Quality",
            "x": 333,
            "y": 1213,
            "customProperties": {
                "Description": ""
            },
            "source": "1bf4a5a9-e155-427f-8bf2-cf0111dc01bd",
            "target": "611e34df-7de1-4101-ab76-5b53594cba35"
        },
        {
            "id": "b6b637bf-9f7e-445e-baed-368754d8a00d",
            "text": "Fast response",
            "type": "istar.Quality",
            "x": 1383,
            "y": 819,
            "customProperties": {
                "Description": ""
            },
            "source": "e1ca06c4-f816-4ba4-9b97-fd9b36a54511",
            "target": "ee9cf1ad-3095-4338-96ad-96547a46e2c1"
        },
        {
            "id": "d5db3cc9-b107-40a4-baba-f67cd25aeaa0",
            "text": "Get musical preferences",
            "type": "istar.Task",
            "x": 851,
            "y": 1396,
            "customProperties": {
                "Description": ""
            },
            "source": "7968c298-1328-4786-b6b2-0a53e38b884f",
            "target": "611e34df-7de1-4101-ab76-5b53594cba35"
        },
        {
            "id": "afb6097a-7ea6-49b0-af1a-0f890c1033c6",
            "text": "Invite friend",
            "type": "istar.Task",
            "x": 1392,
            "y": 759,
            "customProperties": {
                "Description": ""
            },
            "source": "14d4cc03-526b-4506-aefc-c8cc26b49869",
            "target": "ee9cf1ad-3095-4338-96ad-96547a46e2c1"
        },
        {
            "id": "def7f0ee-cfd6-4e95-91d5-b3b5fbcdb033",
            "text": "Enviroment monitored",
            "type": "istar.Goal",
            "x": 1333,
            "y": 174,
            "customProperties": {
                "Description": ""
            },
            "source": "d04a2c15-d39b-4879-963e-a809cb7f64e2",
            "target": "9d10bc4a-0d76-495d-bb81-3d1af8275ba9"
        },
        {
            "id": "48f01a3e-a778-4fb9-84a9-4f3ced0ff4f7",
            "text": "Play music",
            "type": "istar.Task",
            "x": 195,
            "y": 1000,
            "customProperties": {
                "Description": ""
            },
            "source": "494a5feb-2f56-4434-832a-534ab061a6b0",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "aae21d1f-fca0-4234-ba11-2a0609b1605a",
            "text": "Turn on light",
            "type": "istar.Task",
            "x": 215,
            "y": 425,
            "customProperties": {
                "Description": ""
            },
            "source": "e3beae74-b939-47d8-89fb-2ed6d446a2e8",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "4625d40a-0454-41e5-9f33-b242fe8977c3",
            "text": "Turn off light",
            "type": "istar.Task",
            "x": 216,
            "y": 477,
            "customProperties": {
                "Description": ""
            },
            "source": "e1943868-5e88-41f4-9368-f10e48a360ca",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "4855d6bc-2d36-4fb7-adaa-81dc2e102496",
            "text": "Direct sound only to occupied rooms",
            "type": "istar.Task",
            "x": 163,
            "y": 1053,
            "customProperties": {
                "Description": ""
            },
            "source": "12ee7e98-5582-493e-bfe5-21996c0659c2",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "f60e5e87-4055-4fca-874b-0771bd505725",
            "text": "Turn on heating device",
            "type": "istar.Task",
            "x": 205,
            "y": 214,
            "customProperties": {
                "Description": ""
            },
            "source": "623862d4-6b91-4278-83bf-342e66ef3bda",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "41771f3f-4edd-48d0-9fd1-7d4b92e2f49e",
            "text": "Turn off heating device",
            "type": "istar.Task",
            "x": 213,
            "y": 268,
            "customProperties": {
                "Description": ""
            },
            "source": "9d534e15-95a0-44ea-a1b4-8bab3b1fd6c4",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "47134848-0da5-451a-b4e6-72e8dda02f92",
            "text": "Turn on fan",
            "type": "istar.Task",
            "x": 197,
            "y": 102,
            "customProperties": {
                "Description": ""
            },
            "source": "5e0579a1-57d6-4de1-ad56-0d7810a5b52d",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "950e2c06-d4c7-48b6-a319-203a715ac444",
            "text": "Turn off fan",
            "type": "istar.Task",
            "x": 203,
            "y": 161,
            "customProperties": {
                "Description": ""
            },
            "source": "9ddc02f7-59a9-4565-9721-6e60dc66f10c",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "e6878da8-adf3-4aee-a145-0da2ed9132ab",
            "text": "Open gas valves",
            "type": "istar.Task",
            "x": 212,
            "y": 529,
            "customProperties": {
                "Description": ""
            },
            "source": "62659e86-92a5-4d32-842a-8a44a4646c6d",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "23ba2393-a82e-46f8-ba89-6b7e6a788779",
            "text": "Close gas valves",
            "type": "istar.Task",
            "x": 214,
            "y": 576,
            "customProperties": {
                "Description": ""
            },
            "source": "b9db7012-9e2d-4e85-8beb-ad3e93dc312a",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "15be861c-4a5d-4d7a-8fda-6e088199d2e9",
            "text": "Open window",
            "type": "istar.Task",
            "x": 214,
            "y": 323,
            "customProperties": {
                "Description": ""
            },
            "source": "bab3e64d-95c4-4e60-b105-8fa38aad0093",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "3f6b99c6-52d4-4232-b4bb-3f494c428a38",
            "text": "Close window",
            "type": "istar.Task",
            "x": 215,
            "y": 373,
            "customProperties": {
                "Description": ""
            },
            "source": "b2e93b23-d7f1-48f2-be68-dafef2f9bade",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "50e1bd14-cc99-48c9-97a5-a7ffd89a2021",
            "text": "Deactivate power outlet",
            "type": "istar.Task",
            "x": 209,
            "y": 803,
            "customProperties": {
                "Description": ""
            },
            "source": "ca7c6b8c-e155-4c8f-a8d0-ce86cc1c1a02",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "f640d638-ffcf-4bb1-ae26-13a0a1ce6d68",
            "text": "Activate power outlet",
            "type": "istar.Task",
            "x": 208,
            "y": 743,
            "customProperties": {
                "Description": ""
            },
            "source": "47a0c4b6-9844-4ff3-8ba7-8db7923805bd",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "016d8920-9fe1-4f69-b55f-b4b357b0b0e6",
            "text": "Lock doors",
            "type": "istar.Task",
            "x": 210,
            "y": 868,
            "customProperties": {
                "Description": ""
            },
            "source": "2946613f-b8aa-4d2d-afe0-e1a5ee8bea9d",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "026c2b9d-d549-4abf-9eb4-acbee09cccbd",
            "text": "Unlock doors",
            "type": "istar.Task",
            "x": 202,
            "y": 938,
            "customProperties": {
                "Description": ""
            },
            "source": "d8c3d54b-d979-4872-a435-847c5fc11d89",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "e2b8dda0-20dc-4ad0-81c9-de5889b19757",
            "text": "Activate alarm",
            "type": "istar.Task",
            "x": 213,
            "y": 626,
            "customProperties": {
                "Description": ""
            },
            "source": "c0384b04-9745-43a7-ad96-17cc6a83f613",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "6850d13e-f6a1-4481-9494-d870a297c57e",
            "text": "Deactivate alarm",
            "type": "istar.Task",
            "x": 212,
            "y": 688,
            "customProperties": {
                "Description": ""
            },
            "source": "6a12bc40-749d-49a3-a70d-84bccca84167",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        }
    ],
    "links": [
        {
            "id": "cc4b92e0-a8ba-4d1b-8d34-32a1fdd1c0a7",
            "type": "istar.DependencyLink",
            "source": "1623c785-fe22-4c96-8988-c9eae3b614f9",
            "target": "d59528d3-48ca-41c9-91bd-153223b4c543"
        },
        {
            "id": "d117bd86-bf88-4b0c-bcb0-8539f1af4f47",
            "type": "istar.DependencyLink",
            "source": "d59528d3-48ca-41c9-91bd-153223b4c543",
            "target": "ee9cf1ad-3095-4338-96ad-96547a46e2c1"
        },
        {
            "id": "e2eed05e-89d5-44a2-ad2d-785cfe81b2bf",
            "type": "istar.DependencyLink",
            "source": "2ce237c5-9027-4ff4-8744-c28ca73f34f2",
            "target": "35136956-b6f6-4876-b10c-513298f53c41"
        },
        {
            "id": "123fd7f2-9279-4698-be17-02f3605d4c18",
            "type": "istar.DependencyLink",
            "source": "35136956-b6f6-4876-b10c-513298f53c41",
            "target": "ee9cf1ad-3095-4338-96ad-96547a46e2c1"
        },
        {
            "id": "6d6e19c6-f4ab-4039-beef-2b26947d2880",
            "type": "istar.DependencyLink",
            "source": "62e762e3-6560-4860-89fa-66bc6f5e8ad1",
            "target": "9f4992db-9cdd-43d5-bb43-ed6b3b6a7bb1"
        },
        {
            "id": "6346b6c1-5555-49c8-a8be-2c4e2308cc53",
            "type": "istar.DependencyLink",
            "source": "9f4992db-9cdd-43d5-bb43-ed6b3b6a7bb1",
            "target": "397fb3fe-da8d-4a72-a1c2-3bf6f87a1da5"
        },
        {
            "id": "af8bde76-5f7c-4531-b614-aa4cf8c1ec95",
            "type": "istar.DependencyLink",
            "source": "dbb5b65d-49fe-40ef-b241-7d3091f11083",
            "target": "4067be93-567f-44b6-b95b-a250ba4a6412"
        },
        {
            "id": "3efab726-5dd1-43e2-b207-724a880138f7",
            "type": "istar.DependencyLink",
            "source": "4067be93-567f-44b6-b95b-a250ba4a6412",
            "target": "397fb3fe-da8d-4a72-a1c2-3bf6f87a1da5"
        },
        {
            "id": "33b48d39-32e9-4bd0-9dd2-7adcb81a9f94",
            "type": "istar.DependencyLink",
            "source": "12e93ae7-6ad0-43ed-ac4d-b24266d95cdc",
            "target": "05017065-0a5a-4a0a-9a38-30a7b1561a73"
        },
        {
            "id": "d942f9f3-b8ef-4a6a-a770-1beef6d0c726",
            "type": "istar.DependencyLink",
            "source": "05017065-0a5a-4a0a-9a38-30a7b1561a73",
            "target": "ee9cf1ad-3095-4338-96ad-96547a46e2c1"
        },
        {
            "id": "860f3aa1-5f4a-4f95-90a6-797bd6fcb1bf",
            "type": "istar.DependencyLink",
            "source": "81b16c06-1d05-47c3-9412-826ac1915a32",
            "target": "317873f2-af07-4ba2-a3c3-80570d62ec80"
        },
        {
            "id": "592e857a-1bea-4027-adec-38f0bb83f9c6",
            "type": "istar.DependencyLink",
            "source": "317873f2-af07-4ba2-a3c3-80570d62ec80",
            "target": "397fb3fe-da8d-4a72-a1c2-3bf6f87a1da5"
        },
        {
            "id": "00ebb131-516a-494c-8c25-62acec91f01f",
            "type": "istar.DependencyLink",
            "source": "611e34df-7de1-4101-ab76-5b53594cba35",
            "target": "30fa866c-3264-4986-a0b3-842a2a04edbc"
        },
        {
            "id": "b8eeb88a-e4c9-464e-9fc5-da02a08dfd40",
            "type": "istar.DependencyLink",
            "source": "30fa866c-3264-4986-a0b3-842a2a04edbc",
            "target": "397fb3fe-da8d-4a72-a1c2-3bf6f87a1da5"
        },
        {
            "id": "4af7408f-4255-4a5a-8ff3-23fe1bac342a",
            "type": "istar.DependencyLink",
            "source": "1bf4a5a9-e155-427f-8bf2-cf0111dc01bd",
            "target": "c4120857-f974-419f-9494-28a05eab42d3"
        },
        {
            "id": "19fb8d79-9078-4e97-a6c3-3bcdd971e30d",
            "type": "istar.DependencyLink",
            "source": "c4120857-f974-419f-9494-28a05eab42d3",
            "target": "611e34df-7de1-4101-ab76-5b53594cba35"
        },
        {
            "id": "4732399d-1af1-4c6e-8e91-76b794ae1a2a",
            "type": "istar.DependencyLink",
            "source": "e1ca06c4-f816-4ba4-9b97-fd9b36a54511",
            "target": "b6b637bf-9f7e-445e-baed-368754d8a00d"
        },
        {
            "id": "b06732d9-5f15-476c-a9f0-e1e8b03bdeb6",
            "type": "istar.DependencyLink",
            "source": "b6b637bf-9f7e-445e-baed-368754d8a00d",
            "target": "ee9cf1ad-3095-4338-96ad-96547a46e2c1"
        },
        {
            "id": "ca2dbe17-8353-434b-9e55-c882e9274508",
            "type": "istar.DependencyLink",
            "source": "7968c298-1328-4786-b6b2-0a53e38b884f",
            "target": "d5db3cc9-b107-40a4-baba-f67cd25aeaa0"
        },
        {
            "id": "54db9812-ffaa-49b5-b47f-60d91c38d2c1",
            "type": "istar.DependencyLink",
            "source": "d5db3cc9-b107-40a4-baba-f67cd25aeaa0",
            "target": "611e34df-7de1-4101-ab76-5b53594cba35"
        },
        {
            "id": "cf798988-7116-40fa-833d-0a54ce55cc2e",
            "type": "istar.DependencyLink",
            "source": "14d4cc03-526b-4506-aefc-c8cc26b49869",
            "target": "afb6097a-7ea6-49b0-af1a-0f890c1033c6"
        },
        {
            "id": "15aa74f7-cbe2-447e-9723-6f2d76709082",
            "type": "istar.DependencyLink",
            "source": "afb6097a-7ea6-49b0-af1a-0f890c1033c6",
            "target": "ee9cf1ad-3095-4338-96ad-96547a46e2c1"
        },
        {
            "id": "9274baa9-1c30-49a8-af07-91928c3e828b",
            "type": "istar.OrRefinementLink",
            "source": "490feaca-a7f4-470f-a2db-d5c8073f5f56",
            "target": "0f052835-9f3f-491a-a3f0-c70d2001fca5"
        },
        {
            "id": "7897cc02-8f54-45c7-be2f-b98b4bda6953",
            "type": "istar.OrRefinementLink",
            "source": "3eb43835-be08-42fb-9158-0e1c45d66bbb",
            "target": "0f052835-9f3f-491a-a3f0-c70d2001fca5"
        },
        {
            "id": "ed6ebe94-e22f-422d-8409-55c9965850fc",
            "type": "istar.OrRefinementLink",
            "source": "e54e1fd2-9c11-4097-b296-35dd65763bda",
            "target": "0f052835-9f3f-491a-a3f0-c70d2001fca5"
        },
        {
            "id": "b0a8fbb6-8815-40f3-8da9-647a31a23a93",
            "type": "istar.ContributionLink",
            "source": "834513e9-a5d2-43fa-ae24-3c57f645064a",
            "target": "3b1813ea-e6b1-40ec-a11d-49cda0c82324",
            "label": "help"
        },
        {
            "id": "c9bc5f32-4622-432e-99fe-57ba1dea5a46",
            "type": "istar.ContributionLink",
            "source": "4692dc12-801f-4174-9afa-8e710f4d722f",
            "target": "834513e9-a5d2-43fa-ae24-3c57f645064a",
            "label": "help"
        },
        {
            "id": "79efe291-8d98-4be8-a516-2d900137a7a3",
            "type": "istar.ContributionLink",
            "source": "e8239026-4607-4acc-a4ed-a771d72fbcbc",
            "target": "834513e9-a5d2-43fa-ae24-3c57f645064a",
            "label": "help"
        },
        {
            "id": "687ae564-ff73-4d20-9bd2-6b21ff78187a",
            "type": "istar.AndRefinementLink",
            "source": "bab3e64d-95c4-4e60-b105-8fa38aad0093",
            "target": "490feaca-a7f4-470f-a2db-d5c8073f5f56",
            "customProperties": {
                "Context": "The temperature at the room is hotter than what would be pleasant for the people within it, the temperature outside is colder than the\ntemperature inside the smart home and, the windows are closed"
            }
        },
        {
            "id": "947a17b5-5ac6-4018-9904-0caa88ba1b3b",
            "type": "istar.AndRefinementLink",
            "source": "b2e93b23-d7f1-48f2-be68-dafef2f9bade",
            "target": "490feaca-a7f4-470f-a2db-d5c8073f5f56",
            "customProperties": {
                "Context": "The temperature at the room is colder than what would be pleasant for the people within it, the temperature outside is colder than the\ntemperature inside the smart home, the smart home is not on fire, and the windows are open"
            }
        },
        {
            "id": "7143e055-0a20-4a5d-b909-1161f9b17a89",
            "type": "istar.AndRefinementLink",
            "source": "5e0579a1-57d6-4de1-ad56-0d7810a5b52d",
            "target": "3eb43835-be08-42fb-9158-0e1c45d66bbb",
            "customProperties": {
                "Context": "The temperature at the room is hotter than what would be pleasant for the people within it and the air ventilator is off"
            }
        },
        {
            "id": "f1d665e3-9360-4662-aa65-b05641d4d8c4",
            "type": "istar.AndRefinementLink",
            "source": "9ddc02f7-59a9-4565-9721-6e60dc66f10c",
            "target": "3eb43835-be08-42fb-9158-0e1c45d66bbb",
            "customProperties": {
                "Context": "The temperature at the room is colder than what would be pleasant for the people within it and the air ventilator is on"
            }
        },
        {
            "id": "d72cf112-22ca-4918-9c7a-0ac7a558b18e",
            "type": "istar.AndRefinementLink",
            "source": "623862d4-6b91-4278-83bf-342e66ef3bda",
            "target": "e54e1fd2-9c11-4097-b296-35dd65763bda",
            "customProperties": {
                "Context": "The temperature at the room is colder than what would be pleasant for the people within it and the heating device is off"
            }
        },
        {
            "id": "161d5ffb-22d5-47a2-aa22-e56e93c7c8bf",
            "type": "istar.AndRefinementLink",
            "source": "9d534e15-95a0-44ea-a1b4-8bab3b1fd6c4",
            "target": "e54e1fd2-9c11-4097-b296-35dd65763bda",
            "customProperties": {
                "Context": "The temperature at the room is hotter than what would be pleasant for the people within it and the heating device is on"
            }
        },
        {
            "id": "e72a1002-9f28-4644-82e8-e075302950c5",
            "type": "istar.OrRefinementLink",
            "source": "add6b9fe-6314-4eab-bb22-61d5717c54ce",
            "target": "65524a26-5718-499e-a023-14066a7725d9"
        },
        {
            "id": "eb451ccf-c5e2-4f70-afa9-84ca8cc18c63",
            "type": "istar.AndRefinementLink",
            "source": "0d89c849-6ee1-4b96-9102-103edf016542",
            "target": "add6b9fe-6314-4eab-bb22-61d5717c54ce"
        },
        {
            "id": "9661a69f-2f2d-4d77-aca0-bf62bf820adc",
            "type": "istar.AndRefinementLink",
            "source": "83005b8f-bfe4-4378-995b-78407139c97f",
            "target": "add6b9fe-6314-4eab-bb22-61d5717c54ce"
        },
        {
            "id": "c86b47c0-9abe-40c1-b109-f40ebe8640e2",
            "type": "istar.AndRefinementLink",
            "source": "ee6f36f2-01db-485d-a304-20f41f90d33b",
            "target": "0d89c849-6ee1-4b96-9102-103edf016542"
        },
        {
            "id": "2b46e6b7-aeb8-4229-a959-7a5621725fe7",
            "type": "istar.AndRefinementLink",
            "source": "93365266-ac6f-48ba-9c2d-c1f110ebb5dc",
            "target": "0d89c849-6ee1-4b96-9102-103edf016542"
        },
        {
            "id": "3966f745-f3a3-4d51-b9fa-1b1052d33d7a",
            "type": "istar.AndRefinementLink",
            "source": "e3beae74-b939-47d8-89fb-2ed6d446a2e8",
            "target": "83005b8f-bfe4-4378-995b-78407139c97f",
            "customProperties": {
                "Context": "There is someone at the room or close to it, the room is dark, and the light is off"
            }
        },
        {
            "id": "55078b46-ebc7-48fb-a125-a8839eb784a5",
            "type": "istar.AndRefinementLink",
            "source": "e1943868-5e88-41f4-9368-f10e48a360ca",
            "target": "83005b8f-bfe4-4378-995b-78407139c97f",
            "customProperties": {
                "Context": "There is no one at the room or close to it, and the light is on"
            }
        },
        {
            "id": "40ba72f5-5de0-4c8b-8f34-f3bb63a57d39",
            "type": "istar.AndRefinementLink",
            "source": "62659e86-92a5-4d32-842a-8a44a4646c6d",
            "target": "0e54535c-be18-4ee6-a347-40f0261a6b50",
            "customProperties": {
                "Context": "There is someone at the smart home, there is no gas leaks, the smart home is not on fire, and the gas valves are closed"
            }
        },
        {
            "id": "03b82967-9161-4801-8ba2-d6336ecf62f6",
            "type": "istar.AndRefinementLink",
            "source": "b9db7012-9e2d-4e85-8beb-ad3e93dc312a",
            "target": "0e54535c-be18-4ee6-a347-40f0261a6b50",
            "customProperties": {
                "Context": "The gas valves are open"
            }
        },
        {
            "id": "29f40daf-d232-45d2-9922-ab6135cf4c8e",
            "type": "istar.AndRefinementLink",
            "source": "2946613f-b8aa-4d2d-afe0-e1a5ee8bea9d",
            "target": "632c6d4f-632d-4d45-b4a2-5764744184ef",
            "customProperties": {
                "Context": "The smart home is not on fire and the door is unlocked"
            }
        },
        {
            "id": "956323e1-cae7-4566-9671-25cc8d2495e6",
            "type": "istar.AndRefinementLink",
            "source": "d8c3d54b-d979-4872-a435-847c5fc11d89",
            "target": "632c6d4f-632d-4d45-b4a2-5764744184ef",
            "customProperties": {
                "Context": "The door is locked"
            }
        },
        {
            "id": "fd2ba13b-e299-4456-b569-eaaf3b6f4130",
            "type": "istar.AndRefinementLink",
            "source": "b9db7012-9e2d-4e85-8beb-ad3e93dc312a",
            "target": "39e3358a-79c9-4a82-93c9-bc77d26c6610"
        },
        {
            "id": "99185b04-4c14-486b-ae71-4bdd87bec92f",
            "type": "istar.AndRefinementLink",
            "source": "d8c3d54b-d979-4872-a435-847c5fc11d89",
            "target": "39e3358a-79c9-4a82-93c9-bc77d26c6610"
        },
        {
            "id": "e458390e-d1e9-424c-8e5d-93788f2a8fb0",
            "type": "istar.AndRefinementLink",
            "source": "bab3e64d-95c4-4e60-b105-8fa38aad0093",
            "target": "39e3358a-79c9-4a82-93c9-bc77d26c6610"
        },
        {
            "id": "f48e6494-07d8-4395-9c96-d93440659763",
            "type": "istar.ContributionLink",
            "source": "39e3358a-79c9-4a82-93c9-bc77d26c6610",
            "target": "36f19256-e85f-48c8-a2b1-6b5c68760f93",
            "label": "help"
        },
        {
            "id": "e08d1651-6644-4e23-be20-359368e0d981",
            "type": "istar.ContributionLink",
            "source": "ee6f36f2-01db-485d-a304-20f41f90d33b",
            "target": "36f19256-e85f-48c8-a2b1-6b5c68760f93",
            "customProperties": {
                "Context": "There is no one at the smart home"
            },
            "label": "help"
        },
        {
            "id": "1a848f7b-09f5-46d1-b8fe-4669d1023837",
            "type": "istar.AndRefinementLink",
            "source": "ca7c6b8c-e155-4c8f-a8d0-ce86cc1c1a02",
            "target": "9452a1a3-07dc-49a1-9534-3883aea9d55f",
            "customProperties": {
                "Context": "The power outlet is on and there is no vital equipment attached to it"
            }
        },
        {
            "id": "4c7e1bfa-646f-420c-a21d-80f3464f2c80",
            "type": "istar.AndRefinementLink",
            "source": "47a0c4b6-9844-4ff3-8ba7-8db7923805bd",
            "target": "9452a1a3-07dc-49a1-9534-3883aea9d55f",
            "customProperties": {
                "Context": "The power outlet is off, the smart home is not on fire, and there is no gas leak detected"
            }
        },
        {
            "id": "de5fa6d3-27b5-4352-9d3f-1b0fb77f0e90",
            "type": "istar.AndRefinementLink",
            "source": "ca7c6b8c-e155-4c8f-a8d0-ce86cc1c1a02",
            "target": "39e3358a-79c9-4a82-93c9-bc77d26c6610"
        },
        {
            "id": "afb79f27-e868-4869-85c9-536534a64952",
            "type": "istar.AndRefinementLink",
            "source": "c0384b04-9745-43a7-ad96-17cc6a83f613",
            "target": "336c8a20-26f7-4dc5-a20f-8b5925c7f439",
            "customProperties": {
                "Context": "The alarm is off"
            }
        },
        {
            "id": "db764ee9-7569-4469-9922-a50d788986f2",
            "type": "istar.AndRefinementLink",
            "source": "6a12bc40-749d-49a3-a70d-84bccca84167",
            "target": "336c8a20-26f7-4dc5-a20f-8b5925c7f439",
            "customProperties": {
                "Context": "The alarm is on"
            }
        },
        {
            "id": "5c3cf396-365c-42f8-9bda-6afe7b1b5e9e",
            "type": "istar.AndRefinementLink",
            "source": "c0384b04-9745-43a7-ad96-17cc6a83f613",
            "target": "39e3358a-79c9-4a82-93c9-bc77d26c6610"
        },
        {
            "id": "da71f16e-e8f0-438f-9f50-23f9d169ffd5",
            "type": "istar.AndRefinementLink",
            "source": "494a5feb-2f56-4434-832a-534ab061a6b0",
            "target": "6824c565-ae86-4cf9-ba0a-c6922f343028"
        },
        {
            "id": "c865a91f-6c5f-4c5d-8fa8-c86a63e1cc56",
            "type": "istar.AndRefinementLink",
            "source": "5af70b15-c536-435e-ad47-1f4aa592dabe",
            "target": "6824c565-ae86-4cf9-ba0a-c6922f343028"
        },
        {
            "id": "a6532228-441c-4c24-8af3-94f33a595b0f",
            "type": "istar.AndRefinementLink",
            "source": "12ee7e98-5582-493e-bfe5-21996c0659c2",
            "target": "6824c565-ae86-4cf9-ba0a-c6922f343028"
        },
        {
            "id": "a8352cf5-f186-475a-aec5-21a8013289e6",
            "type": "istar.AndRefinementLink",
            "source": "e929c189-5dd3-4cb3-8be9-c7a1df556170",
            "target": "5af70b15-c536-435e-ad47-1f4aa592dabe"
        },
        {
            "id": "fe18c50b-876f-422b-b785-9c57d9106235",
            "type": "istar.AndRefinementLink",
            "source": "7968c298-1328-4786-b6b2-0a53e38b884f",
            "target": "5af70b15-c536-435e-ad47-1f4aa592dabe"
        },
        {
            "id": "fc025033-d989-4892-a566-676334dde5d3",
            "type": "istar.ContributionLink",
            "source": "6824c565-ae86-4cf9-ba0a-c6922f343028",
            "target": "9126a353-2812-47fe-bfa4-c7b1c3672952",
            "label": "help"
        },
        {
            "id": "648cb80c-78b8-4a31-bbae-2a0cab3e8785",
            "type": "istar.ContributionLink",
            "source": "755356b4-962f-4dcf-8e36-1a4d2816c391",
            "target": "9126a353-2812-47fe-bfa4-c7b1c3672952",
            "label": "help"
        },
        {
            "id": "2cc35b61-8fb6-41a6-810b-3fe9e1fbb6c1",
            "type": "istar.AndRefinementLink",
            "source": "e1ca06c4-f816-4ba4-9b97-fd9b36a54511",
            "target": "755356b4-962f-4dcf-8e36-1a4d2816c391"
        },
        {
            "id": "22e70d65-a0de-4592-b3a9-6ad4c3dc85ad",
            "type": "istar.AndRefinementLink",
            "source": "14d4cc03-526b-4506-aefc-c8cc26b49869",
            "target": "755356b4-962f-4dcf-8e36-1a4d2816c391"
        },
        {
            "id": "cfddc451-7a9e-42e9-bed0-48f911b517a2",
            "type": "istar.OrRefinementLink",
            "source": "7a6b97ae-1ad6-4dcc-bff0-173f06ba3db6",
            "target": "ee2ea7fc-93ad-40bc-b11a-b7b87c00e315"
        },
        {
            "id": "2b4d5c44-3fd2-427e-825e-023d7defc876",
            "type": "istar.AndRefinementLink",
            "source": "f504dbd8-3abe-4543-bb7d-7fcbc7e42c23",
            "target": "7a6b97ae-1ad6-4dcc-bff0-173f06ba3db6",
            "customProperties": {
                "Context": "The tenant is going to eat at the smart home"
            }
        },
        {
            "id": "0ed0346c-7f19-4d47-b5c7-2737c9330fd3",
            "type": "istar.OrRefinementLink",
            "source": "733e013c-e3d5-48f9-b1bb-47f3ba22e850",
            "target": "f504dbd8-3abe-4543-bb7d-7fcbc7e42c23",
            "customProperties": {
                "Context": "The food in the house’s stock is enough to cook the meal"
            }
        },
        {
            "id": "1bcac623-2db0-4218-994d-f9f4c094cac8",
            "type": "istar.AndRefinementLink",
            "source": "5d6d705c-5a25-40fb-922e-6db0e1cc78a4",
            "target": "733e013c-e3d5-48f9-b1bb-47f3ba22e850"
        },
        {
            "id": "ac2af33e-2700-4d11-9f4f-cad2f67f4799",
            "type": "istar.OrRefinementLink",
            "source": "12e93ae7-6ad0-43ed-ac4d-b24266d95cdc",
            "target": "f504dbd8-3abe-4543-bb7d-7fcbc7e42c23"
        },
        {
            "id": "53647c46-c012-4411-a8e1-a6343eae78b9",
            "type": "istar.AndRefinementLink",
            "source": "425f8bb2-519c-4839-8825-85bc3c8645ab",
            "target": "7a6b97ae-1ad6-4dcc-bff0-173f06ba3db6"
        },
        {
            "id": "18156056-2153-4499-bf7e-ed48f800d9c6",
            "type": "istar.AndRefinementLink",
            "source": "d5631cc0-865a-4a18-b211-999a9a39037d",
            "target": "7a6b97ae-1ad6-4dcc-bff0-173f06ba3db6"
        },
        {
            "id": "82b075d0-515f-4e16-ba72-fb02a00f3898",
            "type": "istar.AndRefinementLink",
            "source": "63c8611d-a4a5-4a2f-a9e2-44d26375cc5f",
            "target": "d5631cc0-865a-4a18-b211-999a9a39037d"
        },
        {
            "id": "d20394b0-2d7b-47ee-979e-bb5fb9551758",
            "type": "istar.AndRefinementLink",
            "source": "fbe79b38-b7ab-4980-897d-d84a67f7350a",
            "target": "7a6b97ae-1ad6-4dcc-bff0-173f06ba3db6"
        },
        {
            "id": "ab774dc7-1287-4c92-bd12-ab6cc541a5e2",
            "type": "istar.AndRefinementLink",
            "source": "a35d270d-7972-472d-8e26-14a31ba0f74b",
            "target": "fbe79b38-b7ab-4980-897d-d84a67f7350a"
        },
        {
            "id": "62298eb2-dab9-4b19-a7e6-faf8a0465871",
            "type": "istar.OrRefinementLink",
            "source": "38bf3ed6-d963-4409-8c0b-53b631332c56",
            "target": "9fece159-1b77-4895-b926-05c4bd762fa2"
        },
        {
            "id": "96619974-e038-4dbc-be22-7a997bd840cc",
            "type": "istar.AndRefinementLink",
            "source": "c03e227b-b6e2-4a38-a3a2-aaf458d0262b",
            "target": "38bf3ed6-d963-4409-8c0b-53b631332c56"
        },
        {
            "id": "d9a25f39-8f22-4489-8e80-2c8ce0cf4045",
            "type": "istar.AndRefinementLink",
            "source": "62e762e3-6560-4860-89fa-66bc6f5e8ad1",
            "target": "733e013c-e3d5-48f9-b1bb-47f3ba22e850"
        },
        {
            "id": "babeb577-02d8-4eb3-b180-0b7005c4ff1e",
            "type": "istar.AndRefinementLink",
            "source": "62e762e3-6560-4860-89fa-66bc6f5e8ad1",
            "target": "38bf3ed6-d963-4409-8c0b-53b631332c56"
        },
        {
            "id": "d98914ed-81ae-4d06-b460-3fbb528f459a",
            "type": "istar.ContributionLink",
            "source": "733e013c-e3d5-48f9-b1bb-47f3ba22e850",
            "target": "9a938a9a-d944-48f2-b9a1-d8fc967b1d2a",
            "label": "help"
        },
        {
            "id": "38684742-f982-409f-91be-c09334def96a",
            "type": "istar.ContributionLink",
            "source": "12e93ae7-6ad0-43ed-ac4d-b24266d95cdc",
            "target": "9a938a9a-d944-48f2-b9a1-d8fc967b1d2a",
            "label": "hurt"
        },
        {
            "id": "f70b71ce-d515-473e-8efb-333ce811d010",
            "type": "istar.ContributionLink",
            "source": "b76387a2-ca54-468d-88d1-45227b47ff83",
            "target": "9a938a9a-d944-48f2-b9a1-d8fc967b1d2a",
            "label": "help"
        },
        {
            "id": "63d1b9fe-535e-47e4-b2e3-f14b8e842a0d",
            "type": "istar.ContributionLink",
            "source": "b2e93b23-d7f1-48f2-be68-dafef2f9bade",
            "target": "b76387a2-ca54-468d-88d1-45227b47ff83",
            "label": "help"
        },
        {
            "id": "99e5c713-89a5-46ad-932f-090b9abff34e",
            "type": "istar.ContributionLink",
            "source": "5e0579a1-57d6-4de1-ad56-0d7810a5b52d",
            "target": "b76387a2-ca54-468d-88d1-45227b47ff83",
            "label": "hurt"
        },
        {
            "id": "b2e1aeb3-f202-4ff5-8f42-a365bec8f5c0",
            "type": "istar.ContributionLink",
            "source": "9ddc02f7-59a9-4565-9721-6e60dc66f10c",
            "target": "b76387a2-ca54-468d-88d1-45227b47ff83",
            "label": "help"
        },
        {
            "id": "04a5ae7c-c28d-475c-bb0c-3df03b0b7e86",
            "type": "istar.ContributionLink",
            "source": "9452a1a3-07dc-49a1-9534-3883aea9d55f",
            "target": "b76387a2-ca54-468d-88d1-45227b47ff83",
            "label": "help"
        },
        {
            "id": "3c8da1e5-de93-4481-9c59-15934fd6f71a",
            "type": "istar.ContributionLink",
            "source": "623862d4-6b91-4278-83bf-342e66ef3bda",
            "target": "b76387a2-ca54-468d-88d1-45227b47ff83",
            "customProperties": {
                "Context": "The heating device is electricity-based"
            },
            "label": "hurt"
        },
        {
            "id": "bb36a4ea-3924-446b-a674-9d9744b4c89d",
            "type": "istar.ContributionLink",
            "source": "9d534e15-95a0-44ea-a1b4-8bab3b1fd6c4",
            "target": "b76387a2-ca54-468d-88d1-45227b47ff83",
            "customProperties": {
                "Context": "The heating device is electricity-based"
            },
            "label": "help"
        },
        {
            "id": "26d1b411-3ef7-46ee-bb9b-52393ae17e22",
            "type": "istar.ContributionLink",
            "source": "add6b9fe-6314-4eab-bb22-61d5717c54ce",
            "target": "b76387a2-ca54-468d-88d1-45227b47ff83",
            "label": "help"
        },
        {
            "id": "83084330-5ced-434b-9c3f-d841a40ac07b",
            "type": "istar.AndRefinementLink",
            "source": "2ce237c5-9027-4ff4-8744-c28ca73f34f2",
            "target": "39e3358a-79c9-4a82-93c9-bc77d26c6610"
        },
        {
            "id": "325b4920-6676-4909-8b74-1dd4b7760dd6",
            "type": "istar.AndRefinementLink",
            "source": "1623c785-fe22-4c96-8988-c9eae3b614f9",
            "target": "39e3358a-79c9-4a82-93c9-bc77d26c6610"
        },
        {
            "id": "7e530449-6f8d-4037-a117-216e673f1476",
            "type": "istar.AndRefinementLink",
            "source": "dbb5b65d-49fe-40ef-b241-7d3091f11083",
            "target": "d5631cc0-865a-4a18-b211-999a9a39037d"
        },
        {
            "id": "45c4a355-2054-4c4e-baed-708103b35044",
            "type": "istar.AndRefinementLink",
            "source": "81b16c06-1d05-47c3-9412-826ac1915a32",
            "target": "fbe79b38-b7ab-4980-897d-d84a67f7350a"
        },
        {
            "id": "0b0f1125-b252-4ded-80d1-951dff41fa65",
            "type": "istar.AndRefinementLink",
            "source": "d04a2c15-d39b-4879-963e-a809cb7f64e2",
            "target": "e8239026-4607-4acc-a4ed-a771d72fbcbc"
        },
        {
            "id": "e8b5ca33-a114-4d31-80cd-6f02c0986dc6",
            "type": "istar.DependencyLink",
            "source": "d04a2c15-d39b-4879-963e-a809cb7f64e2",
            "target": "def7f0ee-cfd6-4e95-91d5-b3b5fbcdb033"
        },
        {
            "id": "b583172e-60c6-4214-8582-b3f38568a5e8",
            "type": "istar.DependencyLink",
            "source": "def7f0ee-cfd6-4e95-91d5-b3b5fbcdb033",
            "target": "9d10bc4a-0d76-495d-bb81-3d1af8275ba9"
        },
        {
            "id": "592372a0-6eac-40df-a431-8687ae83e771",
            "type": "istar.DependencyLink",
            "source": "494a5feb-2f56-4434-832a-534ab061a6b0",
            "target": "48f01a3e-a778-4fb9-84a9-4f3ced0ff4f7"
        },
        {
            "id": "61897952-8657-4096-9962-c2057abb06c8",
            "type": "istar.DependencyLink",
            "source": "48f01a3e-a778-4fb9-84a9-4f3ced0ff4f7",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "b0c66f3f-d891-428a-b276-0b7e309e2399",
            "type": "istar.DependencyLink",
            "source": "e3beae74-b939-47d8-89fb-2ed6d446a2e8",
            "target": "aae21d1f-fca0-4234-ba11-2a0609b1605a"
        },
        {
            "id": "340cee99-6029-41d1-8430-694aae165c5d",
            "type": "istar.DependencyLink",
            "source": "aae21d1f-fca0-4234-ba11-2a0609b1605a",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "68d2b770-f3ca-4f06-a9ff-9ef6ffabcb6e",
            "type": "istar.DependencyLink",
            "source": "e1943868-5e88-41f4-9368-f10e48a360ca",
            "target": "4625d40a-0454-41e5-9f33-b242fe8977c3"
        },
        {
            "id": "5850bca3-6e61-4e94-a89d-a1c32a2929b6",
            "type": "istar.DependencyLink",
            "source": "4625d40a-0454-41e5-9f33-b242fe8977c3",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "35ca34b5-141e-4874-bd16-3a98523427a3",
            "type": "istar.DependencyLink",
            "source": "12ee7e98-5582-493e-bfe5-21996c0659c2",
            "target": "4855d6bc-2d36-4fb7-adaa-81dc2e102496"
        },
        {
            "id": "69e4a4f9-e7e7-4af6-a2a2-bd24360e06f2",
            "type": "istar.DependencyLink",
            "source": "4855d6bc-2d36-4fb7-adaa-81dc2e102496",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "4ee29a1e-43cb-4a14-8b7e-04a70193ab81",
            "type": "istar.DependencyLink",
            "source": "623862d4-6b91-4278-83bf-342e66ef3bda",
            "target": "f60e5e87-4055-4fca-874b-0771bd505725"
        },
        {
            "id": "071b31df-587f-4093-9277-df3da19536f7",
            "type": "istar.DependencyLink",
            "source": "f60e5e87-4055-4fca-874b-0771bd505725",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "3f0cbc01-fa06-4651-8816-127a4072e6ef",
            "type": "istar.DependencyLink",
            "source": "9d534e15-95a0-44ea-a1b4-8bab3b1fd6c4",
            "target": "41771f3f-4edd-48d0-9fd1-7d4b92e2f49e"
        },
        {
            "id": "a21ddf82-397b-454a-8ec1-34cfefa972cc",
            "type": "istar.DependencyLink",
            "source": "41771f3f-4edd-48d0-9fd1-7d4b92e2f49e",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "b21a7c65-71b6-47c7-9b80-9651cf745925",
            "type": "istar.DependencyLink",
            "source": "5e0579a1-57d6-4de1-ad56-0d7810a5b52d",
            "target": "47134848-0da5-451a-b4e6-72e8dda02f92"
        },
        {
            "id": "4274ae7f-599b-4340-a73f-bb70d42dea89",
            "type": "istar.DependencyLink",
            "source": "47134848-0da5-451a-b4e6-72e8dda02f92",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "dc0db07b-a794-443c-ae1e-69af38f9a47f",
            "type": "istar.DependencyLink",
            "source": "9ddc02f7-59a9-4565-9721-6e60dc66f10c",
            "target": "950e2c06-d4c7-48b6-a319-203a715ac444"
        },
        {
            "id": "dc0343c4-88f9-4cec-af7a-0415a5aa3110",
            "type": "istar.DependencyLink",
            "source": "950e2c06-d4c7-48b6-a319-203a715ac444",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "d28a19fa-fc37-43b5-8550-96d478418cfe",
            "type": "istar.DependencyLink",
            "source": "62659e86-92a5-4d32-842a-8a44a4646c6d",
            "target": "e6878da8-adf3-4aee-a145-0da2ed9132ab"
        },
        {
            "id": "d46e3622-4db9-46d7-acf4-07003403184b",
            "type": "istar.DependencyLink",
            "source": "e6878da8-adf3-4aee-a145-0da2ed9132ab",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "76117cbf-73a4-4789-861e-ae6167b70bf9",
            "type": "istar.DependencyLink",
            "source": "b9db7012-9e2d-4e85-8beb-ad3e93dc312a",
            "target": "23ba2393-a82e-46f8-ba89-6b7e6a788779"
        },
        {
            "id": "a178ff61-953b-4d45-afd2-cc954dcc4e72",
            "type": "istar.DependencyLink",
            "source": "23ba2393-a82e-46f8-ba89-6b7e6a788779",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "7aa8c3f1-d1a0-4ca4-8da1-0103e3c04d74",
            "type": "istar.DependencyLink",
            "source": "bab3e64d-95c4-4e60-b105-8fa38aad0093",
            "target": "15be861c-4a5d-4d7a-8fda-6e088199d2e9"
        },
        {
            "id": "240c43ff-50cd-43dd-9752-acf1956a0003",
            "type": "istar.DependencyLink",
            "source": "15be861c-4a5d-4d7a-8fda-6e088199d2e9",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "5d9569bd-fcd5-4089-9193-4813fdb2a03d",
            "type": "istar.DependencyLink",
            "source": "b2e93b23-d7f1-48f2-be68-dafef2f9bade",
            "target": "3f6b99c6-52d4-4232-b4bb-3f494c428a38"
        },
        {
            "id": "9e420a03-c342-4484-b092-8a522cfaced4",
            "type": "istar.DependencyLink",
            "source": "3f6b99c6-52d4-4232-b4bb-3f494c428a38",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "65626afd-ae10-4fbd-8007-80d00586f576",
            "type": "istar.DependencyLink",
            "source": "ca7c6b8c-e155-4c8f-a8d0-ce86cc1c1a02",
            "target": "50e1bd14-cc99-48c9-97a5-a7ffd89a2021"
        },
        {
            "id": "b9481a48-22c0-4e04-8542-e61e334314ff",
            "type": "istar.DependencyLink",
            "source": "50e1bd14-cc99-48c9-97a5-a7ffd89a2021",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "d33f0ea5-d914-493d-8304-68e4d1d17317",
            "type": "istar.DependencyLink",
            "source": "47a0c4b6-9844-4ff3-8ba7-8db7923805bd",
            "target": "f640d638-ffcf-4bb1-ae26-13a0a1ce6d68"
        },
        {
            "id": "e8c7a7ae-55e8-4a50-826a-16cf12fdee6d",
            "type": "istar.DependencyLink",
            "source": "f640d638-ffcf-4bb1-ae26-13a0a1ce6d68",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "5fd76160-6727-4f10-9e2a-83fa17009668",
            "type": "istar.DependencyLink",
            "source": "2946613f-b8aa-4d2d-afe0-e1a5ee8bea9d",
            "target": "016d8920-9fe1-4f69-b55f-b4b357b0b0e6"
        },
        {
            "id": "f1744742-e3b1-4e27-90a7-8e1713df2e14",
            "type": "istar.DependencyLink",
            "source": "016d8920-9fe1-4f69-b55f-b4b357b0b0e6",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "e862edc2-8b80-4b99-91b7-4b3813df2261",
            "type": "istar.DependencyLink",
            "source": "d8c3d54b-d979-4872-a435-847c5fc11d89",
            "target": "026c2b9d-d549-4abf-9eb4-acbee09cccbd"
        },
        {
            "id": "74eff4ef-9304-4dc1-aae9-6b5385a57055",
            "type": "istar.DependencyLink",
            "source": "026c2b9d-d549-4abf-9eb4-acbee09cccbd",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "0c1dbb26-24c7-46fe-bb84-afcea23e1d21",
            "type": "istar.DependencyLink",
            "source": "c0384b04-9745-43a7-ad96-17cc6a83f613",
            "target": "e2b8dda0-20dc-4ad0-81c9-de5889b19757"
        },
        {
            "id": "5e3d9091-46f2-4e35-a24b-7b9ff9e6199d",
            "type": "istar.DependencyLink",
            "source": "e2b8dda0-20dc-4ad0-81c9-de5889b19757",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        },
        {
            "id": "fdff0e9c-d068-4209-8d0a-5738eecb95a8",
            "type": "istar.DependencyLink",
            "source": "6a12bc40-749d-49a3-a70d-84bccca84167",
            "target": "6850d13e-f6a1-4481-9494-d870a297c57e"
        },
        {
            "id": "3857c92d-48a5-4a5d-ae2d-2a595fbbb21c",
            "type": "istar.DependencyLink",
            "source": "6850d13e-f6a1-4481-9494-d870a297c57e",
            "target": "9b3379a4-5245-41e9-87cd-7752297a8ce9"
        }
    ],
    "display": {
        "834513e9-a5d2-43fa-ae24-3c57f645064a": {
            "width": 84.16537475585938,
            "height": 35.175201416015625
        },
        "e8239026-4607-4acc-a4ed-a771d72fbcbc": {
            "width": 115.140625,
            "height": 48.462493896484375
        },
        "755356b4-962f-4dcf-8e36-1a4d2816c391": {
            "width": 119.34375,
            "height": 38.34375
        },
        "5af70b15-c536-435e-ad47-1f4aa592dabe": {
            "width": 95.84375,
            "height": 51.53436279296875
        },
        "12ee7e98-5582-493e-bfe5-21996c0659c2": {
            "width": 135.84375,
            "height": 37.34375
        },
        "733e013c-e3d5-48f9-b1bb-47f3ba22e850": {
            "width": 133.640625,
            "height": 38.34375
        },
        "dbb5b65d-49fe-40ef-b241-7d3091f11083": {
            "width": 108.140625,
            "height": 42.34375
        },
        "d59528d3-48ca-41c9-91bd-153223b4c543": {
            "width": 116.140625,
            "height": 38.34375
        },
        "05017065-0a5a-4a0a-9a38-30a7b1561a73": {
            "backgroundColor": "#76FAE5"
        },
        "317873f2-af07-4ba2-a3c3-80570d62ec80": {
            "width": 110.890625,
            "height": 36.934326171875
        },
        "4855d6bc-2d36-4fb7-adaa-81dc2e102496": {
            "width": 138.8125,
            "height": 30.12499237060547
        },
        "cc4b92e0-a8ba-4d1b-8d34-32a1fdd1c0a7": {
            "vertices": [
                {
                    "x": 799,
                    "y": 795
                }
            ]
        },
        "d117bd86-bf88-4b0c-bcb0-8539f1af4f47": {
            "vertices": [
                {
                    "x": 1515,
                    "y": 899
                }
            ]
        },
        "e2eed05e-89d5-44a2-ad2d-785cfe81b2bf": {
            "vertices": [
                {
                    "x": 1326,
                    "y": 542
                }
            ]
        },
        "123fd7f2-9279-4698-be17-02f3605d4c18": {
            "vertices": [
                {
                    "x": 1479,
                    "y": 744
                },
                {
                    "x": 1528,
                    "y": 782
                }
            ]
        },
        "33b48d39-32e9-4bd0-9dd2-7adcb81a9f94": {
            "vertices": [
                {
                    "x": 1149,
                    "y": 938
                }
            ]
        },
        "d942f9f3-b8ef-4a6a-a770-1beef6d0c726": {
            "vertices": [
                {
                    "x": 1508,
                    "y": 979
                }
            ]
        },
        "4732399d-1af1-4c6e-8e91-76b794ae1a2a": {
            "vertices": [
                {
                    "x": 1332,
                    "y": 815
                }
            ]
        },
        "b06732d9-5f15-476c-a9f0-e1e8b03bdeb6": {
            "vertices": [
                {
                    "x": 1522,
                    "y": 861
                }
            ]
        },
        "ca2dbe17-8353-434b-9e55-c882e9274508": {
            "vertices": [
                {
                    "x": 1104,
                    "y": 1255
                }
            ]
        },
        "cf798988-7116-40fa-833d-0a54ce55cc2e": {
            "vertices": [
                {
                    "x": 1368,
                    "y": 737
                }
            ]
        },
        "15aa74f7-cbe2-447e-9723-6f2d76709082": {
            "vertices": [
                {
                    "x": 1528,
                    "y": 818
                }
            ]
        },
        "f48e6494-07d8-4395-9c96-d93440659763": {
            "vertices": [
                {
                    "x": 660,
                    "y": 422
                }
            ]
        },
        "e08d1651-6644-4e23-be20-359368e0d981": {
            "vertices": [
                {
                    "x": 746,
                    "y": 416
                }
            ]
        },
        "d98914ed-81ae-4d06-b460-3fbb528f459a": {
            "vertices": [
                {
                    "x": 412,
                    "y": 794
                }
            ]
        },
        "38684742-f982-409f-91be-c09334def96a": {
            "vertices": [
                {
                    "x": 528,
                    "y": 974
                }
            ]
        },
        "f70b71ce-d515-473e-8efb-333ce811d010": {
            "vertices": [
                {
                    "x": 386,
                    "y": 210
                }
            ]
        },
        "63d1b9fe-535e-47e4-b2e3-f14b8e842a0d": {
            "vertices": [
                {
                    "x": 600,
                    "y": 252
                }
            ]
        },
        "99e5c713-89a5-46ad-932f-090b9abff34e": {
            "vertices": [
                {
                    "x": 641,
                    "y": 250
                }
            ]
        },
        "b2e1aeb3-f202-4ff5-8f42-a365bec8f5c0": {
            "vertices": [
                {
                    "x": 800,
                    "y": 299
                },
                {
                    "x": 769,
                    "y": 193
                },
                {
                    "x": 656,
                    "y": 117
                }
            ]
        },
        "04a5ae7c-c28d-475c-bb0c-3df03b0b7e86": {
            "vertices": [
                {
                    "x": 419,
                    "y": 422
                }
            ]
        },
        "3c8da1e5-de93-4481-9c59-15934fd6f71a": {
            "vertices": [
                {
                    "x": 751,
                    "y": 147
                }
            ]
        },
        "bb36a4ea-3924-446b-a674-9d9744b4c89d": {
            "vertices": [
                {
                    "x": 855,
                    "y": 107
                }
            ]
        },
        "26d1b411-3ef7-46ee-bb9b-52393ae17e22": {
            "vertices": [
                {
                    "x": 1114,
                    "y": 234
                },
                {
                    "x": 938,
                    "y": 144
                }
            ]
        },
        "e8b5ca33-a114-4d31-80cd-6f02c0986dc6": {
            "vertices": [
                {
                    "x": 1285,
                    "y": 218
                }
            ]
        },
        "b583172e-60c6-4214-8582-b3f38568a5e8": {
            "vertices": [
                {
                    "x": 1454,
                    "y": 208
                }
            ]
        },
        "397fb3fe-da8d-4a72-a1c2-3bf6f87a1da5": {
            "collapsed": true
        },
        "ee9cf1ad-3095-4338-96ad-96547a46e2c1": {
            "collapsed": true
        },
        "611e34df-7de1-4101-ab76-5b53594cba35": {
            "collapsed": true
        },
        "9d10bc4a-0d76-495d-bb81-3d1af8275ba9": {
            "collapsed": true
        },
        "9b3379a4-5245-41e9-87cd-7752297a8ce9": {
            "collapsed": true
        }
    },
    "tool": "pistar.2.0.0",
    "istar": "2.0",
    "saveDate": "Thu, 14 Mar 2019 01:11:45 GMT",
    "diagram": {
        "width": 1784,
        "height": 1475,
        "name": "Contextual Smart Home",
        "customProperties": {
            "Description": "This is a Smart Home system based on the reference below, which itself was based on work by Fabiano Dalpiaz and Raian Ali. \n\nSome elements and links contain contextual annotations, such as the \"Request restaurant meal\" dependum highlighted in blue.",
            "Reference": "Based on João Pimentel, Marcia Lucena, Jaelson Castro, Carla Silva, Fernanda Alencar, Emanuel Santos. Deriving software architectural models from requirements models for adaptive systems: the STREAM-A approach. In: Requirements Engineering Journal, 17, 4, 2012, pp. 259-281. DOI: 10.1007/s00766-011-0126-z"
        }
    }
};

istar.models.everyElementAndLink = {
    "actors": [
        {
            "id": "2b3ba506-1f5b-4b5b-9114-01b1092cd067",
            "text": "Agent A",
            "type": "istar.Agent",
            "x": 56,
            "y": 342,
            "customProperties": {
                "Description": "This is an agent. The idea of the symbol is that it shows the frontal view of a person wearing a hat, with the name of the agent\nappearing on its face",
                "Concept": "Agent is an actor with concrete, physical manifestations, such as a human individual, an organization, or a department"
            },
            "nodes": []
        },
        {
            "id": "ccf83503-3c8f-4886-a30f-8a290499d8b2",
            "text": "Role A",
            "type": "istar.Role",
            "x": 309,
            "y": 447,
            "customProperties": {
                "Description": "This is a role. The idea of the symbol is that it shows the aerial (top-down) view of a person wearing a hat, with the name of the role\nappearing on the hat. Thus, different people may wear the same \"hat\"",
                "Concept": "Role is an abstract characterization of the behavior of a social actor within some specialized context or domain of endeavor"
            },
            "nodes": []
        },
        {
            "id": "9cab7456-727b-4d7e-81dd-af8903718cb3",
            "text": "Actor A",
            "type": "istar.Actor",
            "x": 184,
            "y": 72,
            "customProperties": {
                "Description": "This actor is-a Actor B.\nIt depends on Agent to achieve Dependum A.\nIt depends on Role to satisfy Dependum B.\nIt depends on Role to execute Dependum C.\nIt depends on Actor B to obtain Dependum D.",
                "Tooltip": "This actor is collapsed. You can press 'alt' and click on the actor to expand it, making its inner elements visible",
                "Concept": "Actors are active, autonomous entities that aim at achieving their goals by exercising their know-how, in collaboration with other actors.\n\nActor can be specialized as Role or Agent. Whenever distinguishing the type of actor is not relevant, either because of the scenario-at-hand or the modeling stage, the notion of generic actor—without specialization—can be used in the model."
            },
            "nodes": [
                {
                    "id": "e1acd9b0-c9e9-468b-845c-c7b08db3020f",
                    "text": "Goal X",
                    "type": "istar.Goal",
                    "x": 266,
                    "y": 101,
                    "customProperties": {
                        "Description": "This is a goal of Actor A",
                        "Concept": "A Goal is a state of affairs that the actor wants to achieve and that has clear-cut criteria of achievement"
                    }
                },
                {
                    "id": "b64fbf2b-b55e-4510-b31f-9adef8de5b69",
                    "text": "Task X",
                    "type": "istar.Task",
                    "x": 297,
                    "y": 196,
                    "customProperties": {
                        "Description": "This is a task that, if executed, will also imply the achievement of Goal X",
                        "Concept": "Tasks represent actions that an actor wants to be executed, usually with the purpose of achieving some goal"
                    }
                },
                {
                    "id": "a892b326-dae3-4ce1-8513-0de9ac88d4b5",
                    "text": "Task Y",
                    "type": "istar.Task",
                    "x": 204,
                    "y": 213,
                    "customProperties": {
                        "Description": "This is a task that, if executed, will imply the achievement of Goal X"
                    }
                }
            ]
        },
        {
            "id": "6a76ceb5-f287-462d-bf57-a266cc19c243",
            "text": "Actor B",
            "type": "istar.Actor",
            "x": 572,
            "y": 30,
            "customProperties": {
                "Description": "This is an actor with its boundary expanded",
                "Tooltip": "In order to expand or collapse (hide) the boundary of an actor you can press 'alt' and click on the actor",
                "Concept": "Actors are active, autonomous entities that aim at achieving their goals by exercising their know-how, in collaboration with other actors.\n\nActors’ intentionality is made explicit through the actor boundary, which is a graphical container for their intentional elements together with their interrelationships. The actor boundary is represented by a grey area. An intentional element appearing inside the boundary of an actor denotes something that is desired or wanted by that actor"
            },
            "nodes": [
                {
                    "id": "4c3ba102-6514-47a4-b21c-8a8f8cdae0cc",
                    "text": "Goal A",
                    "type": "istar.Goal",
                    "x": 702,
                    "y": 45,
                    "customProperties": {
                        "Description": "This goal is OR-refined by Task A, meaning that if Task A gets executed the Goal A will ve achieved",
                        "Tooltip": "You can resize an element by dragging the small circle on its bottom-right corner",
                        "Concept": "A Goal is a state of affairs that the actor wants to achieve and that has clear-cut criteria of achievement"
                    }
                },
                {
                    "id": "e1270a5e-3c20-4be9-8097-66f6ed8502cd",
                    "text": "Task A",
                    "type": "istar.Task",
                    "x": 700,
                    "y": 129,
                    "customProperties": {
                        "Description": "This task is a means to achieve Goal A. It is AND-refined by tasks B and C",
                        "Concept": "Tasks represent actions that an actor wants to be executed, usually with the purpose of achieving some goal"
                    }
                },
                {
                    "id": "60d0943c-169e-41ff-85ed-e19360456863",
                    "text": "Task B",
                    "type": "istar.Task",
                    "x": 634,
                    "y": 209,
                    "customProperties": {
                        "Description": "This task is part of the refinement of Task A",
                        "Concept": "Tasks represent actions that an actor wants to be executed, usually with the purpose of achieving some goal"
                    }
                },
                {
                    "id": "0a28f23e-2008-43b3-9e63-025bdfd5f30c",
                    "text": "Task C",
                    "type": "istar.Task",
                    "x": 768,
                    "y": 207,
                    "customProperties": {
                        "Description": "This task is part of the refinement of Task A",
                        "Concept": "Tasks represent actions that an actor wants to be executed, usually with the purpose of achieving some goal"
                    }
                },
                {
                    "id": "df52f053-20a2-4bdf-8e23-e8c53a8ce306",
                    "text": "Quality B",
                    "type": "istar.Quality",
                    "x": 572,
                    "y": 322,
                    "customProperties": {
                        "Description": "Task B provides sufficient positive evidence (make) for the satisfaction of this quality",
                        "Concept": "A quality is an attribute for which an actor desires some level of achievement. For example, the entity could be the system under development and a quality its performance; another entity could be the business being analyzed and a quality the yearly profit. The level of achievement may be defined precisely or kept vague. Qualities can guide the search for ways of achieving goals, and also serve as criteria for evaluating alternative ways of achieving goals"
                    }
                },
                {
                    "id": "3ff6395e-86ec-4661-ba13-c0493331303b",
                    "text": "Quality C",
                    "type": "istar.Quality",
                    "x": 831,
                    "y": 317,
                    "customProperties": {
                        "Description": "Task C provides sufficient evidence against the satisfaction (or for the denial) of this quality",
                        "Concept": "A quality is an attribute for which an actor desires some level of achievement. For example, the entity could be the system under development and a quality its performance; another entity could be the business being analyzed and a quality the yearly profit. The level of achievement may be defined precisely or kept vague. Qualities can guide the search for ways of achieving goals, and also serve as criteria for evaluating alternative ways of achieving goals"
                    }
                },
                {
                    "id": "85940cf3-6d49-4270-9b00-51696b5790f5",
                    "text": "Quality D",
                    "type": "istar.Quality",
                    "x": 699,
                    "y": 455,
                    "customProperties": {
                        "Description": "The satisfaction of Quality B provides weak evidence against the satisfaction (or for the denial) of this quality.\nOn the other hand, the satisfaction of Quality C provides weak positive evidence for the satisfaction of this quality. Quite the pickle, right?",
                        "Concept": "A quality is an attribute for which an actor desires some level of achievement. For example, the entity could be the system under development and a quality its performance; another entity could be the business being analyzed and a quality the yearly profit. The level of achievement may be defined precisely or kept vague. Qualities can guide the search for ways of achieving goals, and also serve as criteria for evaluating alternative ways of achieving goals"
                    }
                },
                {
                    "id": "54c01821-aa4d-4bd0-9fdf-6ddaa25c299f",
                    "text": "Resource A",
                    "type": "istar.Resource",
                    "x": 922,
                    "y": 233,
                    "customProperties": {
                        "Description": "This is resource is needed for the execution of Task C",
                        "Concept": "A Resource is a physical or informational entity that the actor requires in order to perform a task"
                    }
                },
                {
                    "id": "1ecba4f1-f873-466c-8074-092f612d5fed",
                    "text": "Quality A",
                    "type": "istar.Quality",
                    "x": 861,
                    "y": 101,
                    "customProperties": {
                        "Description": "This quality qualifies Task A",
                        "Concept": "A quality is an attribute for which an actor desires some level of achievement. For example, the entity could be the system under development and a quality its performance; another entity could be the business being analyzed and a quality the yearly profit. The level of achievement may be defined precisely or kept vague. Qualities can guide the search for ways of achieving goals, and also serve as criteria for evaluating alternative ways of achieving goals"
                    }
                }
            ]
        }
    ],
    "dependencies": [
        {
            "id": "fd083df6-87fc-4423-b25c-3291a1bf9aa3",
            "text": "Dependum A",
            "type": "istar.Goal",
            "x": 13,
            "y": 177,
            "customProperties": {
                "Description": "This is a dependum in a goal dependency.\n\n– Depender: Actor A\n– dependerElmt: none\n– dependum: Dependum A\n– dependee: Agent A\n– dependeeElmt: none",
                "Tooltip": "You can flip the direction of a dependency by clicking on the button below",
                "Concept": "Dependencies represent social relationships. A goal dependency indicates that the dependee is expected to achieve the goal, and is free to choose how.\n\nDependency relationships should not share the same dependum, as each dependum is a conceptually different element; in some cases, a dependum in one dependency is achieved, but is not achieved in another dependency, even if the dependums may have the same name.\nIn other words, an actor cannot depend on more than one actor for the same dependum, or two actors cannot depend on the same dependum from an actor. Instead, create multiple dependums with the same name"
            },
            "source": "9cab7456-727b-4d7e-81dd-af8903718cb3",
            "target": "2b3ba506-1f5b-4b5b-9114-01b1092cd067"
        },
        {
            "id": "81fe40dc-2380-47c0-92ab-1e7281dc020c",
            "text": "Dependum C",
            "type": "istar.Task",
            "x": 323,
            "y": 309,
            "customProperties": {
                "Description": "This is a dependum in a task dependency.\n\n– Depender: Actor A\n– dependerElmt: Task X (inside Actor A)\n– dependum: Dependum C\n– dependee: Role A\n– dependeeElmt: none",
                "Concept": "Dependencies represent social relationships. A task dependency indicates that the dependee is expected to execute the task in a prescribed way"
            },
            "source": "b64fbf2b-b55e-4510-b31f-9adef8de5b69",
            "target": "ccf83503-3c8f-4886-a30f-8a290499d8b2"
        },
        {
            "id": "7b339194-6020-4c2b-86e5-cd07ab9f725d",
            "text": "Dependum D",
            "type": "istar.Resource",
            "x": 453,
            "y": 169,
            "customProperties": {
                "Description": "This is a dependum in a resource dependency.\n\n– Depender: Actor A\n– dependerElmt: Task X (inside Actor A)\n– dependum: Dependum D\n– dependee: Actor B\n– dependeeElmt: Task B (inside Actor B)",
                "Tooltip": "You can change the type of a dependency (goal, quality, task or resource) by clicking on the type in this table",
                "Concept": "Dependencies represent social relationships. A resource dependency indicates that the dependee is expected to make the resource available to the depender"
            },
            "source": "b64fbf2b-b55e-4510-b31f-9adef8de5b69",
            "target": "60d0943c-169e-41ff-85ed-e19360456863"
        },
        {
            "id": "ad1e6006-2afa-448a-ab76-94be798d1a1e",
            "text": "Dependum A",
            "type": "istar.Goal",
            "x": 95,
            "y": 467,
            "customProperties": {
                "Description": "This is a dependum in a goal dependency.\n\n– Depender: Role A\n– dependerElmt: none\n– dependum: Dependum A\n– dependee: Agent A\n– dependeeElmt: none",
                "Concept": "Dependencies represent social relationships. A goal dependency indicates that the dependee is expected to achieve the goal, and is free to choose how.\n\nDependency relationships should not share the same dependum, as each dependum is a conceptually different element; in some cases, a dependum in one dependency is achieved, but is not achieved in another dependency, even if the dependums may have the same name.\nIn other words, an actor cannot depend on more than one actor for the same dependum, or two actors cannot depend on the same dependum from an actor. Instead, create multiple dependums with the same name"
            },
            "source": "ccf83503-3c8f-4886-a30f-8a290499d8b2",
            "target": "2b3ba506-1f5b-4b5b-9114-01b1092cd067"
        },
        {
            "id": "49ba9425-0de8-4fbf-8ec0-6a384e844ea4",
            "text": "Dependum B",
            "type": "istar.Quality",
            "x": 193,
            "y": 314,
            "customProperties": {
                "Description": "This is a dependum in a quality dependency.\n\n– Depender: Actor A\n– dependerElmt: Goal X (inside Actor A)\n– dependum: Dependum B\n– dependee: Role A\n– dependeeElmt: none",
                "Concept": "Dependencies represent social relationships. A quality dependency indicates that  the dependee is expected to sufficiently satisfy the quality, and is free to choose how"
            },
            "source": "a892b326-dae3-4ce1-8513-0de9ac88d4b5",
            "target": "ccf83503-3c8f-4886-a30f-8a290499d8b2"
        }
    ],
    "links": [
        {
            "id": "c14e7fda-e081-450f-b716-3fc839802fc3",
            "type": "istar.DependencyLink",
            "source": "9cab7456-727b-4d7e-81dd-af8903718cb3",
            "target": "fd083df6-87fc-4423-b25c-3291a1bf9aa3",
            "customProperties": {
                "Concept": "A dependency is defined as a relationship with five arguments:\n– depender is the actor that depends for something (the dependum) to be provided;\n– dependerElmt is the intentional element within the depender’s actor boundary where the dependency starts from, which explains why the dependency exists;\n– dependum is an intentional element that is the object of the dependency;\n– dependee is the actor that should provide the dependum;\n– dependeeElmt is the intentional element that explains how the dependee intends to provide the dependum\n\nDependencies link the dependerElmt within the depender actor to the dependum, outside actor boundaries, to the dependeeElmt within the dependee actor. The link is drawn with a “D” symbol indicating direction, with the D acting as an arrowhead “>”, pointing from dependerElmt to dependum to dependeeElmt.\n\nBoth the dependerElmt and the dependeeElmt can be omitted. This optionality is used when creating an initial Strategic Dependency view, or to support expressing partial knowledge, e.g., when the “why” (dependerElmt) or the “how”; (dependeeElmt) of the dependency are unknown",
                "Description": "This link is part of a goal dependency. The \"D\" is pointing from Actor A to Dependum A"
            }
        },
        {
            "id": "a7ad94ed-b49e-465f-912b-4ea6f86cd976",
            "type": "istar.DependencyLink",
            "source": "fd083df6-87fc-4423-b25c-3291a1bf9aa3",
            "target": "2b3ba506-1f5b-4b5b-9114-01b1092cd067",
            "customProperties": {
                "Description": "This link is part of a goal dependency. The \"D\" is pointing from Dependum A to Agent A",
                "Concept": "A dependency is defined as a relationship with five arguments:\n– depender is the actor that depends for something (the dependum) to be provided;\n– dependerElmt is the intentional element within the depender’s actor boundary where the dependency starts from, which explains why the dependency exists;\n– dependum is an intentional element that is the object of the dependency;\n– dependee is the actor that should provide the dependum;\n– dependeeElmt is the intentional element that explains how the dependee intends to provide the dependum\n\nDependencies link the dependerElmt within the depender actor to the dependum, outside actor boundaries, to the dependeeElmt within the dependee actor. The link is drawn with a “D” symbol indicating direction, with the D acting as an arrowhead “>”, pointing from dependerElmt to dependum to dependeeElmt.\n\nBoth the dependerElmt and the dependeeElmt can be omitted. This optionality is used when creating an initial Strategic Dependency view, or to support expressing partial knowledge, e.g., when the “why” (dependerElmt) or the “how”; (dependeeElmt) of the dependency are unknown"
            }
        },
        {
            "id": "8118839e-ae5e-4755-87ba-c9fb29f10625",
            "type": "istar.DependencyLink",
            "source": "b64fbf2b-b55e-4510-b31f-9adef8de5b69",
            "target": "81fe40dc-2380-47c0-92ab-1e7281dc020c",
            "customProperties": {
                "Description": "This link is part of a task dependency. The \"D\" is pointing from Actor A to Dependum C",
                "Tooltip": "Do you see the gap between the beginning of this link and Actor A? You can remove these gaps by clicking on \"Pixel-perfect links\" in the Options menu",
                "Concept": "A dependency is defined as a relationship with five arguments:\n– depender is the actor that depends for something (the dependum) to be provided;\n– dependerElmt is the intentional element within the depender’s actor boundary where the dependency starts from, which explains why the dependency exists;\n– dependum is an intentional element that is the object of the dependency;\n– dependee is the actor that should provide the dependum;\n– dependeeElmt is the intentional element that explains how the dependee intends to provide the dependum\n\nDependencies link the dependerElmt within the depender actor to the dependum, outside actor boundaries, to the dependeeElmt within the dependee actor. The link is drawn with a “D” symbol indicating direction, with the D acting as an arrowhead “>”, pointing from dependerElmt to dependum to dependeeElmt.\n\nBoth the dependerElmt and the dependeeElmt can be omitted. This optionality is used when creating an initial Strategic Dependency view, or to support expressing partial knowledge, e.g., when the “why” (dependerElmt) or the “how”; (dependeeElmt) of the dependency are unknown"
            }
        },
        {
            "id": "5a65337a-8568-4eaf-b63b-f9256b314015",
            "type": "istar.DependencyLink",
            "source": "81fe40dc-2380-47c0-92ab-1e7281dc020c",
            "target": "ccf83503-3c8f-4886-a30f-8a290499d8b2",
            "customProperties": {
                "Description": "This link is part of a task dependency. The \"D\" is pointing from Dependum C to Role A",
                "Tooltip": "Congratulations, you found this secret tip! You can change the size of the diagram on the Options menu. But if all you want is to enlarge it, you can just drag an element to the bottom or right and the diagram will automatically expand",
                "Concept": "A dependency is defined as a relationship with five arguments:\n– depender is the actor that depends for something (the dependum) to be provided;\n– dependerElmt is the intentional element within the depender’s actor boundary where the dependency starts from, which explains why the dependency exists;\n– dependum is an intentional element that is the object of the dependency;\n– dependee is the actor that should provide the dependum;\n– dependeeElmt is the intentional element that explains how the dependee intends to provide the dependum\n\nDependencies link the dependerElmt within the depender actor to the dependum, outside actor boundaries, to the dependeeElmt within the dependee actor. The link is drawn with a “D” symbol indicating direction, with the D acting as an arrowhead “>”, pointing from dependerElmt to dependum to dependeeElmt.\n\nBoth the dependerElmt and the dependeeElmt can be omitted. This optionality is used when creating an initial Strategic Dependency view, or to support expressing partial knowledge, e.g., when the “why” (dependerElmt) or the “how”; (dependeeElmt) of the dependency are unknown"
            }
        },
        {
            "id": "fa443e67-28f5-4934-a5d6-aae299fd95c3",
            "type": "istar.DependencyLink",
            "source": "b64fbf2b-b55e-4510-b31f-9adef8de5b69",
            "target": "7b339194-6020-4c2b-86e5-cd07ab9f725d",
            "customProperties": {
                "Description": "This link is part of a resource dependency. The \"D\" is pointing from Actor A to Dependum D",
                "Concept": "A dependency is defined as a relationship with five arguments:\n– depender is the actor that depends for something (the dependum) to be provided;\n– dependerElmt is the intentional element within the depender’s actor boundary where the dependency starts from, which explains why the dependency exists;\n– dependum is an intentional element that is the object of the dependency;\n– dependee is the actor that should provide the dependum;\n– dependeeElmt is the intentional element that explains how the dependee intends to provide the dependum\n\nDependencies link the dependerElmt within the depender actor to the dependum, outside actor boundaries, to the dependeeElmt within the dependee actor. The link is drawn with a “D” symbol indicating direction, with the D acting as an arrowhead “>”, pointing from dependerElmt to dependum to dependeeElmt.\n\nBoth the dependerElmt and the dependeeElmt can be omitted. This optionality is used when creating an initial Strategic Dependency view, or to support expressing partial knowledge, e.g., when the “why” (dependerElmt) or the “how”; (dependeeElmt) of the dependency are unknown"
            }
        },
        {
            "id": "fc7573af-3955-4998-b839-ad4dd7649601",
            "type": "istar.DependencyLink",
            "source": "7b339194-6020-4c2b-86e5-cd07ab9f725d",
            "target": "60d0943c-169e-41ff-85ed-e19360456863",
            "customProperties": {
                "Description": "This link is part of a resource dependency. The \"D\" is pointing from Dependum D to Task B (which is inside Actor B)",
                "Concept": "A dependency is defined as a relationship with five arguments:\n– depender is the actor that depends for something (the dependum) to be provided;\n– dependerElmt is the intentional element within the depender’s actor boundary where the dependency starts from, which explains why the dependency exists;\n– dependum is an intentional element that is the object of the dependency;\n– dependee is the actor that should provide the dependum;\n– dependeeElmt is the intentional element that explains how the dependee intends to provide the dependum\n\nDependencies link the dependerElmt within the depender actor to the dependum, outside actor boundaries, to the dependeeElmt within the dependee actor. The link is drawn with a “D” symbol indicating direction, with the D acting as an arrowhead “>”, pointing from dependerElmt to dependum to dependeeElmt.\n\nBoth the dependerElmt and the dependeeElmt can be omitted. This optionality is used when creating an initial Strategic Dependency view, or to support expressing partial knowledge, e.g., when the “why” (dependerElmt) or the “how”; (dependeeElmt) of the dependency are unknown"
            }
        },
        {
            "id": "fd846234-3871-4c3b-bd10-64bdb4621fb5",
            "type": "istar.DependencyLink",
            "source": "ccf83503-3c8f-4886-a30f-8a290499d8b2",
            "target": "ad1e6006-2afa-448a-ab76-94be798d1a1e",
            "customProperties": {
                "Description": "This link is part of a goal dependency. The \"D\" is pointing from Role A to Dependum A",
                "Tooltip": "If you accidentally added to many vertices to an link, you can delete them by clickin on the \"Clear vertices\" button below"
            }
        },
        {
            "id": "b15583b6-46c5-44a3-af48-c53535af7ee9",
            "type": "istar.DependencyLink",
            "source": "ad1e6006-2afa-448a-ab76-94be798d1a1e",
            "target": "2b3ba506-1f5b-4b5b-9114-01b1092cd067",
            "customProperties": {
                "Description": "This link is part of a goal dependency. The \"D\" is pointing from Dependum A to Agent A",
                "Concept": "A dependency is defined as a relationship with five arguments:\n– depender is the actor that depends for something (the dependum) to be provided;\n– dependerElmt is the intentional element within the depender’s actor boundary where the dependency starts from, which explains why the dependency exists;\n– dependum is an intentional element that is the object of the dependency;\n– dependee is the actor that should provide the dependum;\n– dependeeElmt is the intentional element that explains how the dependee intends to provide the dependum\n\nDependencies link the dependerElmt within the depender actor to the dependum, outside actor boundaries, to the dependeeElmt within the dependee actor. The link is drawn with a “D” symbol indicating direction, with the D acting as an arrowhead “>”, pointing from dependerElmt to dependum to dependeeElmt.\n\nBoth the dependerElmt and the dependeeElmt can be omitted. This optionality is used when creating an initial Strategic Dependency view, or to support expressing partial knowledge, e.g., when the “why” (dependerElmt) or the “how”; (dependeeElmt) of the dependency are unknown"
            }
        },
        {
            "id": "bb3a0297-98a5-419a-b2be-1fa7d8386b3a",
            "type": "istar.DependencyLink",
            "source": "a892b326-dae3-4ce1-8513-0de9ac88d4b5",
            "target": "49ba9425-0de8-4fbf-8ec0-6a384e844ea4",
            "customProperties": {
                "Description": "This link is part of a quality dependency. The \"D\" is pointing from Actor A to Dependum B",
                "Concept": "A dependency is defined as a relationship with five arguments:\n– depender is the actor that depends for something (the dependum) to be provided;\n– dependerElmt is the intentional element within the depender’s actor boundary where the dependency starts from, which explains why the dependency exists;\n– dependum is an intentional element that is the object of the dependency;\n– dependee is the actor that should provide the dependum;\n– dependeeElmt is the intentional element that explains how the dependee intends to provide the dependum\n\nDependencies link the dependerElmt within the depender actor to the dependum, outside actor boundaries, to the dependeeElmt within the dependee actor. The link is drawn with a “D” symbol indicating direction, with the D acting as an arrowhead “>”, pointing from dependerElmt to dependum to dependeeElmt.\n\nBoth the dependerElmt and the dependeeElmt can be omitted. This optionality is used when creating an initial Strategic Dependency view, or to support expressing partial knowledge, e.g., when the “why” (dependerElmt) or the “how”; (dependeeElmt) of the dependency are unknown"
            }
        },
        {
            "id": "b092f4ad-f635-4f27-a335-5f2c3874ad8c",
            "type": "istar.DependencyLink",
            "source": "49ba9425-0de8-4fbf-8ec0-6a384e844ea4",
            "target": "ccf83503-3c8f-4886-a30f-8a290499d8b2",
            "customProperties": {
                "Description": "This link is part of a quality dependency. The \"D\" is pointing from Dependum B to Role A",
                "Concept": "A dependency is defined as a relationship with five arguments:\n– depender is the actor that depends for something (the dependum) to be provided;\n– dependerElmt is the intentional element within the depender’s actor boundary where the dependency starts from, which explains why the dependency exists;\n– dependum is an intentional element that is the object of the dependency;\n– dependee is the actor that should provide the dependum;\n– dependeeElmt is the intentional element that explains how the dependee intends to provide the dependum\n\nDependencies link the dependerElmt within the depender actor to the dependum, outside actor boundaries, to the dependeeElmt within the dependee actor. The link is drawn with a “D” symbol indicating direction, with the D acting as an arrowhead “>”, pointing from dependerElmt to dependum to dependeeElmt.\n\nBoth the dependerElmt and the dependeeElmt can be omitted. This optionality is used when creating an initial Strategic Dependency view, or to support expressing partial knowledge, e.g., when the “why” (dependerElmt) or the “how”; (dependeeElmt) of the dependency are unknown"
            }
        },
        {
            "id": "fa92f725-2109-4c53-b8e3-d82da60fc44e",
            "type": "istar.OrRefinementLink",
            "source": "b64fbf2b-b55e-4510-b31f-9adef8de5b69",
            "target": "e1acd9b0-c9e9-468b-845c-c7b08db3020f",
            "customProperties": {
                "Description": "This is an (inclusive) OR-refinement linking Task X to Goal X",
                "Concept": "The black triangle in this link indicates that it is an (inclusive) OR-refinement: the fulfillment of at least one child makes the parent fulfilled"
            }
        },
        {
            "id": "c2cdf0b6-0aba-4b26-affd-4a3ec2da6c67",
            "type": "istar.IsALink",
            "source": "9cab7456-727b-4d7e-81dd-af8903718cb3",
            "target": "6a76ceb5-f287-462d-bf57-a266cc19c243",
            "name": "Usually you DON'T want to define names for links",
            "customProperties": {
                "Concept": "Actors are often interrelated. In iStar 2.0, this is captured via actor links that define/describe these relationships. Actor links are binary, linking a single actor to a single other actor.\n\nA is-a link represents the concept of generalization / specialization in iStar 2.0. Only roles can be specialized into roles, or general actors into general actors. For\ninstance, a PhD student (role) can be defined as a specialization of a Student (another role). Agents cannot be specialized via is-a, as they are concrete instantiations (e.g., a John Smith cannot be another agent).",
                "Description": "This links states that Actor A is a (specialization of) Actor B"
            }
        },
        {
            "id": "8a160047-6059-4688-ad66-1dd02d130fc5",
            "type": "istar.OrRefinementLink",
            "source": "e1270a5e-3c20-4be9-8097-66f6ed8502cd",
            "target": "4c3ba102-6514-47a4-b21c-8a8f8cdae0cc",
            "customProperties": {
                "Concept": "iStar 2.0 features a generic relationship called \"refinement\" that links goals and tasks hierarchically. Refinement is an n-ary relationship relating one parent to one or more children.\nA parent can only be AND-refined or OR-refined, not both simultaneously\n\nThe black triangle in this link indicates that it is an (inclusive) OR-refinement: the fulfillment of at least one child makes the parent fulfilled. This relationship allows for a single child (as is the case here).\n\nDepending on the connected elements, refinement takes different meanings:\n• If the parent is a goal (which is the case here): in the case of OR-refinement, a child task is a particular way (a “means”) for fulfilling the parent goal (the “end”), while a child goal is a sub-goal that can be achieved for fulfilling the parent goal;\n• If the parent is a task: in the case of OR-refinement, a child goal is a goal whose existence that is uncovered by analyzing the parent task which may substitute for the original task, while a child task is a way to execute the parent task.",
                "Description": "This is an OR-refinement linking Task A with Goal A"
            }
        },
        {
            "id": "cb88aba6-9fdf-4f90-9eaa-0b74be5d0edd",
            "type": "istar.AndRefinementLink",
            "source": "60d0943c-169e-41ff-85ed-e19360456863",
            "target": "e1270a5e-3c20-4be9-8097-66f6ed8502cd",
            "customProperties": {
                "Concept": "The small line in the top of this link indicates that it is an AND-refinement: the fulfillment of all the n children (n ≥ 2) makes the parent fulfilled.\n\nDepending on the connected elements, refinement takes different meanings:\n• If the parent is a goal: in the case of AND-refinement, a child goal is a sub-state of affairs that is part of the parent goal, while a child task is a sub-task that must be fulfilled;\n• If the parent is a task (which is the case here): in the case of AND-refinement, a child task is a sub-task that is identified as part of the parent task, while a child goal is a goal that is uncovered by analyzing the parent task"
            }
        },
        {
            "id": "af1ac65b-8480-4c90-a960-e6e9ce239409",
            "type": "istar.AndRefinementLink",
            "source": "0a28f23e-2008-43b3-9e63-025bdfd5f30c",
            "target": "e1270a5e-3c20-4be9-8097-66f6ed8502cd",
            "customProperties": {
                "Concept": "The small line in the top of this link indicates that it is an AND-refinement: the fulfillment of all the n children (n ≥ 2) makes the parent fulfilled.\n\nDepending on the connected elements, refinement takes different meanings:\n• If the parent is a goal: in the case of AND-refinement, a child goal is a sub-state of affairs that is part of the parent goal, while a child task is a sub-task that must be fulfilled;\n• If the parent is a task (which is the case here): in the case of AND-refinement, a child task is a sub-task that is identified as part of the parent task, while a child goal is a goal that is uncovered by analyzing the parent task"
            }
        },
        {
            "id": "ddf9d7ba-47bc-42fb-9ea8-d93ecbed4ec1",
            "type": "istar.QualificationLink",
            "source": "1ecba4f1-f873-466c-8074-092f612d5fed",
            "target": "e1270a5e-3c20-4be9-8097-66f6ed8502cd",
            "customProperties": {
                "Concept": "The qualification relationship relates a quality to its subject: a task, goal, or resource. Placing a qualification relationship expresses a desired quality over the execution of a task, the achievement of the goal, or the provision of the resource. For example, a quality “Quick saving” may refer to the goal “Save model”, qualifying how the operation or function of this goal should be achieved",
                "Tooltip": "You can add vertices to a link by clicking right on top of its line"
            }
        },
        {
            "id": "8621b90b-d6cc-4edf-b7d8-9747292bd4f3",
            "type": "istar.NeededByLink",
            "source": "54c01821-aa4d-4bd0-9fdf-6ddaa25c299f",
            "target": "0a28f23e-2008-43b3-9e63-025bdfd5f30c",
            "customProperties": {
                "Concept": "The Needed-By relationship links a task with a resource and it indicates that the actor needs the resource in order to execute the task. This relationship does not specify what is the reason for this need: consumption, reading, modification, creation, etc."
            }
        },
        {
            "id": "14fc329e-60d2-4d10-8ed2-7aea6bdb0263",
            "type": "istar.ContributionLink",
            "source": "60d0943c-169e-41ff-85ed-e19360456863",
            "target": "df52f053-20a2-4bdf-8e23-e8c53a8ce306",
            "customProperties": {
                "Concept": "Contribution links represent the effects of intentional elements on qualities, and are essential to assist analysts in the decision-making process among alternative goals or tasks. Contribution links lead to the accumulation of evidence for qualities. We talk of qualities being fulfilled or satisfied, having sufficient positive evidence, or being denied, having strong negative evidence.\n\nThis here is a 'make' contribution: The source provides sufficient positive evidence for the satisfaction of the target. In some i* variations this is called a ++ contribution",
                "Tooltip": "You can change the value of a contribution (make, help, hurt or break) by clicking on the value in this table"
            },
            "label": "make"
        },
        {
            "id": "c268c9ad-85db-44aa-b219-995e339e462a",
            "type": "istar.ContributionLink",
            "source": "0a28f23e-2008-43b3-9e63-025bdfd5f30c",
            "target": "3ff6395e-86ec-4661-ba13-c0493331303b",
            "customProperties": {
                "Concept": "Contribution links represent the effects of intentional elements on qualities, and are essential to assist analysts in the decision-making process among alternative goals or tasks. Contribution links lead to the accumulation of evidence for qualities. We talk of qualities being fulfilled or satisfied, having sufficient positive evidence, or being denied, having strong negative evidence.\n\nThis here is a 'break' contribution: The source provides sufficient evidence against the satisfaction (or for the denial) of the target.  In some i* variations this is called a -- contribution"
            },
            "label": "break"
        },
        {
            "id": "80811f20-5b66-4a89-8863-c1319ffa1c3b",
            "type": "istar.ContributionLink",
            "source": "df52f053-20a2-4bdf-8e23-e8c53a8ce306",
            "target": "85940cf3-6d49-4270-9b00-51696b5790f5",
            "customProperties": {
                "Concept": "Contribution links represent the effects of intentional elements on qualities, and are essential to assist analysts in the decision-making process among alternative goals or tasks. Contribution links lead to the accumulation of evidence for qualities. We talk of qualities being fulfilled or satisfied, having sufficient positive evidence, or being denied, having strong negative evidence.\n\nThis here is a 'hurt' contribution: The source provides weak evidence against the satisfaction (or for the denial) of the target.  In some i* variations this is called a - contribution"
            },
            "label": "hurt"
        },
        {
            "id": "0a80971f-4c33-4785-853a-fc6ce0453e61",
            "type": "istar.ContributionLink",
            "source": "3ff6395e-86ec-4661-ba13-c0493331303b",
            "target": "85940cf3-6d49-4270-9b00-51696b5790f5",
            "customProperties": {
                "Concept": "Contribution links represent the effects of intentional elements on qualities, and are essential to assist analysts in the decision-making process among alternative goals or tasks. Contribution links lead to the accumulation of evidence for qualities. We talk of qualities being fulfilled or satisfied, having sufficient positive evidence, or being denied, having strong negative evidence.\n\nThis here is a 'help' contribution:  The source provides weak positive evidence for the satisfaction of the target.  In some i* variations this is called a + contribution"
            },
            "label": "help"
        },
        {
            "id": "f7259dfe-ab11-47ee-bbdc-06a76a0cb145",
            "type": "istar.ParticipatesInLink",
            "source": "2b3ba506-1f5b-4b5b-9114-01b1092cd067",
            "target": "ccf83503-3c8f-4886-a30f-8a290499d8b2",
            "customProperties": {
                "Concept": "Actors are often interrelated. In iStar 2.0, this is captured via actor links that define/describe these relationships. Actor links are binary, linking a single actor to a single other actor.\n\nA participates-in link represents any kind of association, other than generalization/specialization, between two actors. No restriction exists on the type of actors linked by this association. Depending on the connected elements, this link takes different meanings. Two typical situations are the following:\n• When the source is an agent and the target is a role, this represents the plays relationship, i.e., an agent plays a given role. For instance, the agent Smith plays the role of Tool User.\n• When the source and the target are of the same type, this will often represent the part-of relationship. For instance, the Beta Tester role is part of the Tool User role",
                "Description": "This link states that Agent A plays the role Role A"
            }
        },
        {
            "id": "710b0263-0263-4b39-bd9f-26214616ba84",
            "type": "istar.OrRefinementLink",
            "source": "a892b326-dae3-4ce1-8513-0de9ac88d4b5",
            "target": "e1acd9b0-c9e9-468b-845c-c7b08db3020f",
            "customProperties": {
                "Description": "This is an (inclusive) OR-refinement linking Task X to Goal X",
                "Concept": "The black triangle in this link indicates that it is an (inclusive) OR-refinement: the fulfillment of at least one child makes the parent fulfilled"
            }
        }
    ],
    "display": {
        "c14e7fda-e081-450f-b716-3fc839802fc3": {
            "vertices": [
                {
                    "x": 112,
                    "y": 126
                }
            ]
        },
        "a7ad94ed-b49e-465f-912b-4ea6f86cd976": {
            "vertices": [
                {
                    "x": 43,
                    "y": 277
                }
            ]
        },
        "8118839e-ae5e-4755-87ba-c9fb29f10625": {
            "vertices": [
                {
                    "x": 383,
                    "y": 284
                }
            ]
        },
        "5a65337a-8568-4eaf-b63b-f9256b314015": {
            "vertices": [
                {
                    "x": 387,
                    "y": 361
                },
                {
                    "x": 365,
                    "y": 390
                },
                {
                    "x": 345,
                    "y": 413
                }
            ]
        },
        "fa443e67-28f5-4934-a5d6-aae299fd95c3": {
            "vertices": [
                {
                    "x": 388,
                    "y": 180
                }
            ]
        },
        "fc7573af-3955-4998-b839-ad4dd7649601": {
            "vertices": [
                {
                    "x": 568,
                    "y": 195
                }
            ]
        },
        "fd846234-3871-4c3b-bd10-64bdb4621fb5": {
            "vertices": [
                {
                    "x": 319,
                    "y": 526
                },
                {
                    "x": 282,
                    "y": 538
                },
                {
                    "x": 264,
                    "y": 505
                },
                {
                    "x": 223,
                    "y": 551
                },
                {
                    "x": 233,
                    "y": 496
                },
                {
                    "x": 186,
                    "y": 541
                },
                {
                    "x": 138,
                    "y": 521
                }
            ]
        },
        "b15583b6-46c5-44a3-af48-c53535af7ee9": {
            "vertices": [
                {
                    "x": 71,
                    "y": 447
                }
            ]
        },
        "bb3a0297-98a5-419a-b2be-1fa7d8386b3a": {
            "vertices": [
                {
                    "x": 156,
                    "y": 265
                }
            ]
        },
        "b092f4ad-f635-4f27-a335-5f2c3874ad8c": {
            "vertices": [
                {
                    "x": 313,
                    "y": 383
                }
            ]
        },
        "14fc329e-60d2-4d10-8ed2-7aea6bdb0263": {
            "vertices": [
                {
                    "x": 646,
                    "y": 274
                }
            ]
        },
        "c268c9ad-85db-44aa-b219-995e339e462a": {
            "vertices": [
                {
                    "x": 855,
                    "y": 272
                }
            ]
        },
        "80811f20-5b66-4a89-8863-c1319ffa1c3b": {
            "vertices": [
                {
                    "x": 619,
                    "y": 433
                }
            ]
        },
        "0a80971f-4c33-4785-853a-fc6ce0453e61": {
            "vertices": [
                {
                    "x": 865,
                    "y": 434
                }
            ]
        },
        "2b3ba506-1f5b-4b5b-9114-01b1092cd067": {
            "collapsed": true
        },
        "ccf83503-3c8f-4886-a30f-8a290499d8b2": {
            "collapsed": true
        },
        "9cab7456-727b-4d7e-81dd-af8903718cb3": {
            "collapsed": true
        }
    },
    "tool": "pistar.2.0.0",
    "istar": "2.0",
    "saveDate": "Mon, 31 Dec 2018 14:52:34 GMT",
    "diagram": {
        "width": 1100,
        "height": 600,
        "name": "Every iStar 2.0 element and link",
        "customProperties": {
            "Description": "This is an example showing every iStar 2.0 element and link.\n\nKinds of actor:\n - Actor, Agent and Role\n\nDependency links:\n - Goal, Quality, Task and Resource dependency\n\nActor links:\n - Is-A and Participates-In\n\nInner elements:\n - Goal, Quality, Task, Resource\n\nInner element links:\n - And-refinement, Or-refinement, Needed-By, Qualification, and Contribution links (make, help, hurt, break)",
            "Tooltip": "Click on \"Toggle fullscreen\" in the Options menu to facilitate the use of the tool\n\nAlso, click on the elements and links of this model to learn more about the iStar 2.0 language",
            "Origin": "Model created by João Pimentel (UFRPE/Brazil). Concepts copied (with adaptations) from the iStar 2.0 language guide, by Fabiano Dalpiaz , Xavier Franch, and Jennifer Horkoff. You can access the full guide through the Help menu"
        }
    }
};

istar.models.buyerDrivenECommerce = {
    "actors": [
        {
            "id": "09c7354b-25e0-4b59-8fd1-38e5925c0ec5",
            "text": "Customer As Buyer [Service]",
            "type": "istar.Actor",
            "x": 31,
            "y": 56,
            "nodes": [
                {
                    "id": "41f6245a-fe65-4b02-9348-1d2a5aa49b61",
                    "text": "Low Price",
                    "type": "istar.Quality",
                    "x": 31,
                    "y": 193
                },
                {
                    "id": "fd9cb71e-7beb-43b4-8bb3-407b94432adb",
                    "text": "Flexibility [Purchasing]",
                    "type": "istar.Quality",
                    "x": 88,
                    "y": 94
                },
                {
                    "id": "cbb50b38-f83c-4871-b545-3bd72f9aac29",
                    "text": "Service Be Purchased [Service]",
                    "type": "istar.Goal",
                    "x": 203,
                    "y": 66,
                    "customProperties": {
                        "Description": "The customer’s main goal is that Service Be Purchased [Service]. The goal is parameterized on Service so that the graph may be evaluated differently for different services."
                    }
                },
                {
                    "id": "c9731a43-8765-450f-aec1-5450d733a923",
                    "text": "Purchase by Naming My Own Price [Service]",
                    "type": "istar.Task",
                    "x": 199,
                    "y": 159,
                    "customProperties": {
                        "Description": "One possible way to accomplish the Service Be Purchased goal is through the task Purchase By Naming My Own Price [Service]. It is connected to the goal with an or-refinement link. This task has two sub-elements connected to it through and-refinement links – the sub-task Name A Price [Service], and the sub-goal Low Price Service Provider Be Found.\n\nNaming one’s own price contributes positively (Help) to the buyer’s desired quality of Low Price, but negatively (Hurt) to Flexibility [Purchasing] because preferences about schedule, choice of airline, etc., could not be accommodated"
                    }
                },
                {
                    "id": "ed027de5-ce0c-4544-bd6f-13da198dff2a",
                    "text": "Name a Price [Service]",
                    "type": "istar.Task",
                    "x": 115,
                    "y": 304
                },
                {
                    "id": "ced7a959-842e-40db-8214-90bebb537259",
                    "text": "Low Price Service Provider Be Found",
                    "type": "istar.Goal",
                    "x": 251,
                    "y": 297
                },
                {
                    "id": "e9d26ca1-da40-4f0a-a10b-f4e5ddaedcb8",
                    "text": "Good Quality [Service]",
                    "type": "istar.Quality",
                    "x": 372,
                    "y": 267,
                    "customProperties": {
                        "Description": ""
                    }
                }
            ]
        },
        {
            "id": "88bdaa42-a903-4744-a515-55ce9b016442",
            "text": "Middleman As Seller [Service]",
            "type": "istar.Actor",
            "x": 639,
            "y": 35,
            "nodes": [
                {
                    "id": "66b6daf0-c676-46c2-8552-dabd042c4163",
                    "text": "Profitability",
                    "type": "istar.Quality",
                    "x": 784,
                    "y": 48
                },
                {
                    "id": "b389b51d-d8ef-4b7a-9b7c-e48b9fdb528c",
                    "text": "Customer Attraction [Service]",
                    "type": "istar.Quality",
                    "x": 801,
                    "y": 182
                },
                {
                    "id": "5536a6e3-7a22-4f93-afca-d944ad76e682",
                    "text": "Be Middleman [Service]",
                    "type": "istar.Goal",
                    "x": 1034,
                    "y": 50
                },
                {
                    "id": "be1aa6fc-66dd-40f8-af03-a652352793e1",
                    "text": "Sell in Buyer Driven Style [Service]",
                    "type": "istar.Task",
                    "x": 1046,
                    "y": 135
                },
                {
                    "id": "afbabeb8-bf7c-432f-bc12-3cf1d2142ba4",
                    "text": "Accept Purchase Request with Price",
                    "type": "istar.Task",
                    "x": 859,
                    "y": 310
                },
                {
                    "id": "ef62e89b-1bdd-49ed-959c-be64f45d673a",
                    "text": "Send Modified Request to Supplier",
                    "type": "istar.Task",
                    "x": 1122,
                    "y": 232
                },
                {
                    "id": "eaf58ea7-2db6-4ab1-9ed4-6b457ac0661a",
                    "text": "Get Price Agreement From Supplier",
                    "type": "istar.Task",
                    "x": 1075,
                    "y": 322
                },
                {
                    "id": "53516afe-4276-487c-b2f5-62298257e377",
                    "text": "Loyalty",
                    "type": "istar.Quality",
                    "x": 639,
                    "y": 199,
                    "customProperties": {
                        "Description": ""
                    }
                },
                {
                    "id": "05a6b113-d29d-4190-b33e-bf5d7870ba99",
                    "text": "Pay for Purchasing [Service]",
                    "type": "istar.Task",
                    "x": 913,
                    "y": 183,
                    "customProperties": {
                        "Description": ""
                    }
                }
            ]
        },
        {
            "id": "f9b4f95d-861a-4f71-b3d7-1e75c6dda381",
            "text": "Supplier [Service]",
            "type": "istar.Actor",
            "x": 839,
            "y": 563,
            "nodes": []
        }
    ],
    "dependencies": [
        {
            "id": "d4beb38e-13e2-4e69-8540-d6ac5780ad36",
            "text": "Name a Price [Service]",
            "type": "istar.Task",
            "x": 488,
            "y": 232,
            "customProperties": {
                "Description": "In a task dependency, an actor depends on another to perform an activity. The activity description specifies a particular course of action. For example, the task dependency Name a Price [Service] expresses that the customer depends on the middleman to name his own price for the service in need by specifying the standard procedure for naming a price."
            },
            "source": "afbabeb8-bf7c-432f-bc12-3cf1d2142ba4",
            "target": "ed027de5-ce0c-4544-bd6f-13da198dff2a"
        },
        {
            "id": "07e4ea3e-bd43-49e3-b41c-38320942dcfb",
            "text": "Low Price Service Provider Be Found",
            "type": "istar.Goal",
            "x": 477,
            "y": 404,
            "customProperties": {
                "Description": "In a goal dependency, an actor depends on another to make a condition in the world come true. The goal dependency Low Price Service Provider be Found from the customer to the middleman means that it is up to the middleman to decide how to find the low price service provider"
            },
            "source": "ced7a959-842e-40db-8214-90bebb537259",
            "target": "eaf58ea7-2db6-4ab1-9ed4-6b457ac0661a"
        },
        {
            "id": "a77ec4dd-ab7d-463c-82fd-928cf3dde4c6",
            "text": "Acceptable Price [Service]",
            "type": "istar.Quality",
            "x": 172,
            "y": 536,
            "source": "f9b4f95d-861a-4f71-b3d7-1e75c6dda381",
            "target": "ed027de5-ce0c-4544-bd6f-13da198dff2a"
        },
        {
            "id": "4cff68b2-92bf-4e1c-b802-44daaadfdadd",
            "text": "Attract More Customers [Service]",
            "type": "istar.Quality",
            "x": 643,
            "y": 468,
            "source": "f9b4f95d-861a-4f71-b3d7-1e75c6dda381",
            "target": "b389b51d-d8ef-4b7a-9b7c-e48b9fdb528c"
        },
        {
            "id": "4407a764-eef0-409e-90da-668fa688b17f",
            "text": "Agreement on Price [P]",
            "type": "istar.Resource",
            "x": 991,
            "y": 458,
            "customProperties": {
                "Description": "In a resource dependency, an actor depends on another for the availability of an entity. The depender takes the availability of the resource to be unproblematic. In this example, the customer’s dependency on the supplier for agreement on price is modelled as a resource dependency"
            },
            "source": "eaf58ea7-2db6-4ab1-9ed4-6b457ac0661a",
            "target": "f9b4f95d-861a-4f71-b3d7-1e75c6dda381"
        },
        {
            "id": "7c51a553-16a7-4e5d-883d-0aa0ee9ae4cf",
            "text": "Good Quality [Service]",
            "type": "istar.Quality",
            "x": 307,
            "y": 476,
            "customProperties": {
                "Description": "The customer’s dependency on the supplier for good quality service can be achieved in different ways. The desired degree of how good the quality should be is ultimately decided by the depender"
            },
            "source": "e9d26ca1-da40-4f0a-a10b-f4e5ddaedcb8",
            "target": "f9b4f95d-861a-4f71-b3d7-1e75c6dda381"
        },
        {
            "id": "62b11734-5a57-4b75-843c-6e1aa99bc8a5",
            "text": "Loyalty",
            "type": "istar.Quality",
            "x": 495,
            "y": 147,
            "customProperties": {
                "Description": ""
            },
            "source": "53516afe-4276-487c-b2f5-62298257e377",
            "target": "c9731a43-8765-450f-aec1-5450d733a923"
        },
        {
            "id": "cf0b6aaa-a607-4e88-9065-b030e98c18f0",
            "text": "Pay for Purchasing [Service]",
            "type": "istar.Task",
            "x": 490,
            "y": 86,
            "customProperties": {
                "Description": ""
            },
            "source": "05a6b113-d29d-4190-b33e-bf5d7870ba99",
            "target": "c9731a43-8765-450f-aec1-5450d733a923"
        }
    ],
    "links": [
        {
            "id": "9bc7f0d0-59e0-4889-94e8-0f26c8e7a557",
            "type": "istar.DependencyLink",
            "source": "afbabeb8-bf7c-432f-bc12-3cf1d2142ba4",
            "target": "d4beb38e-13e2-4e69-8540-d6ac5780ad36"
        },
        {
            "id": "c92f63ad-90a8-4323-a1c4-eabd803e6a6c",
            "type": "istar.DependencyLink",
            "source": "d4beb38e-13e2-4e69-8540-d6ac5780ad36",
            "target": "ed027de5-ce0c-4544-bd6f-13da198dff2a"
        },
        {
            "id": "cacaaf61-5a24-436a-96a8-7c91e5dc2e0a",
            "type": "istar.DependencyLink",
            "source": "ced7a959-842e-40db-8214-90bebb537259",
            "target": "07e4ea3e-bd43-49e3-b41c-38320942dcfb"
        },
        {
            "id": "bf177ac0-0e58-42f9-b34d-ea5273310e94",
            "type": "istar.DependencyLink",
            "source": "07e4ea3e-bd43-49e3-b41c-38320942dcfb",
            "target": "eaf58ea7-2db6-4ab1-9ed4-6b457ac0661a"
        },
        {
            "id": "1818b2db-f879-4462-a411-82a14ae3c861",
            "type": "istar.DependencyLink",
            "source": "f9b4f95d-861a-4f71-b3d7-1e75c6dda381",
            "target": "a77ec4dd-ab7d-463c-82fd-928cf3dde4c6"
        },
        {
            "id": "85440206-b98a-4290-9244-2b49198a0205",
            "type": "istar.DependencyLink",
            "source": "a77ec4dd-ab7d-463c-82fd-928cf3dde4c6",
            "target": "ed027de5-ce0c-4544-bd6f-13da198dff2a"
        },
        {
            "id": "f2b0cbc9-4165-4818-95b8-ebdb2bcdf682",
            "type": "istar.DependencyLink",
            "source": "f9b4f95d-861a-4f71-b3d7-1e75c6dda381",
            "target": "4cff68b2-92bf-4e1c-b802-44daaadfdadd"
        },
        {
            "id": "797ae0a0-b147-4e44-aba6-2b54582d8d91",
            "type": "istar.DependencyLink",
            "source": "4cff68b2-92bf-4e1c-b802-44daaadfdadd",
            "target": "b389b51d-d8ef-4b7a-9b7c-e48b9fdb528c"
        },
        {
            "id": "e16dab80-7af1-489e-9dbc-73c93f656b79",
            "type": "istar.DependencyLink",
            "source": "eaf58ea7-2db6-4ab1-9ed4-6b457ac0661a",
            "target": "4407a764-eef0-409e-90da-668fa688b17f"
        },
        {
            "id": "391d982a-a069-4dd6-bb5b-aeaf66be365a",
            "type": "istar.DependencyLink",
            "source": "4407a764-eef0-409e-90da-668fa688b17f",
            "target": "f9b4f95d-861a-4f71-b3d7-1e75c6dda381"
        },
        {
            "id": "195ffcdc-8884-4321-932a-00e5dec79f73",
            "type": "istar.OrRefinementLink",
            "source": "c9731a43-8765-450f-aec1-5450d733a923",
            "target": "cbb50b38-f83c-4871-b545-3bd72f9aac29"
        },
        {
            "id": "87f9cad7-b9cc-49fe-ab58-896acbf19d2a",
            "type": "istar.AndRefinementLink",
            "source": "ed027de5-ce0c-4544-bd6f-13da198dff2a",
            "target": "c9731a43-8765-450f-aec1-5450d733a923"
        },
        {
            "id": "416f468d-2df4-4778-b9c1-fe8834287722",
            "type": "istar.OrRefinementLink",
            "source": "be1aa6fc-66dd-40f8-af03-a652352793e1",
            "target": "5536a6e3-7a22-4f93-afca-d944ad76e682"
        },
        {
            "id": "20119a89-b236-4164-96d2-f98c76a67261",
            "type": "istar.AndRefinementLink",
            "source": "afbabeb8-bf7c-432f-bc12-3cf1d2142ba4",
            "target": "be1aa6fc-66dd-40f8-af03-a652352793e1"
        },
        {
            "id": "f18a4b6e-11a1-409a-8ad8-893cd2230891",
            "type": "istar.AndRefinementLink",
            "source": "ef62e89b-1bdd-49ed-959c-be64f45d673a",
            "target": "be1aa6fc-66dd-40f8-af03-a652352793e1"
        },
        {
            "id": "cc31d1cb-8436-43cb-a9f7-752752173dbc",
            "type": "istar.AndRefinementLink",
            "source": "eaf58ea7-2db6-4ab1-9ed4-6b457ac0661a",
            "target": "be1aa6fc-66dd-40f8-af03-a652352793e1"
        },
        {
            "id": "df755fd9-b1c4-4427-8735-04fd6c039873",
            "type": "istar.ContributionLink",
            "source": "b389b51d-d8ef-4b7a-9b7c-e48b9fdb528c",
            "target": "66b6daf0-c676-46c2-8552-dabd042c4163",
            "label": "help"
        },
        {
            "id": "5ad03ad3-8757-49a5-9dfc-cd3e63ad526e",
            "type": "istar.AndRefinementLink",
            "source": "ced7a959-842e-40db-8214-90bebb537259",
            "target": "c9731a43-8765-450f-aec1-5450d733a923"
        },
        {
            "id": "bf722f05-ed86-4b51-950f-53c88fa55b93",
            "type": "istar.ContributionLink",
            "source": "ed027de5-ce0c-4544-bd6f-13da198dff2a",
            "target": "41f6245a-fe65-4b02-9348-1d2a5aa49b61",
            "label": "help"
        },
        {
            "id": "3808903f-e1c0-48e3-a43f-e728336661c4",
            "type": "istar.ContributionLink",
            "source": "ced7a959-842e-40db-8214-90bebb537259",
            "target": "fd9cb71e-7beb-43b4-8bb3-407b94432adb",
            "label": "hurt"
        },
        {
            "id": "5988ab20-38da-46fe-9ef0-eb471a5c4e97",
            "type": "istar.ContributionLink",
            "source": "afbabeb8-bf7c-432f-bc12-3cf1d2142ba4",
            "target": "66b6daf0-c676-46c2-8552-dabd042c4163",
            "label": "hurt"
        },
        {
            "id": "ff4cbf2d-2167-4618-838c-e6c48fd75181",
            "type": "istar.ContributionLink",
            "source": "afbabeb8-bf7c-432f-bc12-3cf1d2142ba4",
            "target": "b389b51d-d8ef-4b7a-9b7c-e48b9fdb528c",
            "label": "help"
        },
        {
            "id": "1cbae22c-e5f0-4e06-9b72-503c72d83222",
            "type": "istar.ContributionLink",
            "source": "eaf58ea7-2db6-4ab1-9ed4-6b457ac0661a",
            "target": "b389b51d-d8ef-4b7a-9b7c-e48b9fdb528c",
            "label": "help"
        },
        {
            "id": "50e90f9a-58cb-4f52-82f7-754c9e50683c",
            "type": "istar.QualificationLink",
            "source": "e9d26ca1-da40-4f0a-a10b-f4e5ddaedcb8",
            "target": "c9731a43-8765-450f-aec1-5450d733a923"
        },
        {
            "id": "80cc9d57-b599-4a73-bdab-2813d316f95d",
            "type": "istar.DependencyLink",
            "source": "e9d26ca1-da40-4f0a-a10b-f4e5ddaedcb8",
            "target": "7c51a553-16a7-4e5d-883d-0aa0ee9ae4cf"
        },
        {
            "id": "97d9f275-e3ec-43da-b139-fd8fb54c2834",
            "type": "istar.DependencyLink",
            "source": "7c51a553-16a7-4e5d-883d-0aa0ee9ae4cf",
            "target": "f9b4f95d-861a-4f71-b3d7-1e75c6dda381"
        },
        {
            "id": "55d7d74e-7fc9-46cd-b6dd-045b597dded5",
            "type": "istar.DependencyLink",
            "source": "53516afe-4276-487c-b2f5-62298257e377",
            "target": "62b11734-5a57-4b75-843c-6e1aa99bc8a5"
        },
        {
            "id": "089059b7-d33b-4fbe-a5fc-e7ff04cd77fd",
            "type": "istar.DependencyLink",
            "source": "62b11734-5a57-4b75-843c-6e1aa99bc8a5",
            "target": "c9731a43-8765-450f-aec1-5450d733a923"
        },
        {
            "id": "d9efb91f-199f-4278-814c-ced8684080c9",
            "type": "istar.ContributionLink",
            "source": "53516afe-4276-487c-b2f5-62298257e377",
            "target": "b389b51d-d8ef-4b7a-9b7c-e48b9fdb528c",
            "label": "help"
        },
        {
            "id": "abf948ac-9690-437f-b06f-55a74876b189",
            "type": "istar.DependencyLink",
            "source": "05a6b113-d29d-4190-b33e-bf5d7870ba99",
            "target": "cf0b6aaa-a607-4e88-9065-b030e98c18f0"
        },
        {
            "id": "a945654d-4862-4939-9af9-ebed458498f4",
            "type": "istar.DependencyLink",
            "source": "cf0b6aaa-a607-4e88-9065-b030e98c18f0",
            "target": "c9731a43-8765-450f-aec1-5450d733a923"
        },
        {
            "id": "73f4c938-3650-4262-9f62-a45c3b35577c",
            "type": "istar.AndRefinementLink",
            "source": "05a6b113-d29d-4190-b33e-bf5d7870ba99",
            "target": "be1aa6fc-66dd-40f8-af03-a652352793e1"
        }
    ],
    "display": {
        "cbb50b38-f83c-4871-b545-3bd72f9aac29": {
            "backgroundColor": "#FADF71"
        },
        "c9731a43-8765-450f-aec1-5450d733a923": {
            "backgroundColor": "#FADF71",
            "width": 106.85000610351562,
            "height": 45.90000915527344
        },
        "ced7a959-842e-40db-8214-90bebb537259": {
            "width": 91.85000610351562,
            "height": 51.600006103515625
        },
        "b389b51d-d8ef-4b7a-9b7c-e48b9fdb528c": {
            "width": 85.6348876953125,
            "height": 53.16175842285156
        },
        "afbabeb8-bf7c-432f-bc12-3cf1d2142ba4": {
            "width": 128.03334045410156,
            "height": 40.600006103515625
        },
        "ef62e89b-1bdd-49ed-959c-be64f45d673a": {
            "width": 107.03334045410156,
            "height": 38.20001220703125
        },
        "eaf58ea7-2db6-4ab1-9ed4-6b457ac0661a": {
            "width": 102.03334045410156,
            "height": 44.600006103515625
        },
        "d4beb38e-13e2-4e69-8540-d6ac5780ad36": {
            "backgroundColor": "#FADF71"
        },
        "07e4ea3e-bd43-49e3-b41c-38320942dcfb": {
            "backgroundColor": "#FADF71",
            "width": 99.85000610351562,
            "height": 46.600006103515625
        },
        "4cff68b2-92bf-4e1c-b802-44daaadfdadd": {
            "width": 89.636962890625,
            "height": 55.161956787109375
        },
        "4407a764-eef0-409e-90da-668fa688b17f": {
            "backgroundColor": "#FADF71"
        },
        "7c51a553-16a7-4e5d-883d-0aa0ee9ae4cf": {
            "backgroundColor": "#FADF71"
        },
        "9bc7f0d0-59e0-4889-94e8-0f26c8e7a557": {
            "vertices": [
                {
                    "x": 688,
                    "y": 271
                }
            ]
        },
        "c92f63ad-90a8-4323-a1c4-eabd803e6a6c": {
            "vertices": [
                {
                    "x": 296,
                    "y": 262
                }
            ]
        },
        "cacaaf61-5a24-436a-96a8-7c91e5dc2e0a": {
            "vertices": [
                {
                    "x": 372,
                    "y": 370
                }
            ]
        },
        "bf177ac0-0e58-42f9-b34d-ea5273310e94": {
            "vertices": [
                {
                    "x": 947,
                    "y": 407
                }
            ]
        },
        "1818b2db-f879-4462-a411-82a14ae3c861": {
            "vertices": [
                {
                    "x": 509,
                    "y": 595
                }
            ]
        },
        "85440206-b98a-4290-9244-2b49198a0205": {
            "vertices": [
                {
                    "x": 159,
                    "y": 444
                }
            ]
        },
        "f2b0cbc9-4165-4818-95b8-ebdb2bcdf682": {
            "vertices": [
                {
                    "x": 721,
                    "y": 556
                }
            ]
        },
        "797ae0a0-b147-4e44-aba6-2b54582d8d91": {
            "vertices": [
                {
                    "x": 697,
                    "y": 443
                },
                {
                    "x": 746,
                    "y": 328
                }
            ]
        },
        "e16dab80-7af1-489e-9dbc-73c93f656b79": {
            "vertices": [
                {
                    "x": 1080,
                    "y": 372
                }
            ]
        },
        "391d982a-a069-4dd6-bb5b-aeaf66be365a": {
            "vertices": [
                {
                    "x": 960,
                    "y": 543
                }
            ]
        },
        "df755fd9-b1c4-4427-8735-04fd6c039873": {
            "vertices": [
                {
                    "x": 863,
                    "y": 150
                }
            ]
        },
        "bf722f05-ed86-4b51-950f-53c88fa55b93": {
            "vertices": [
                {
                    "x": 81,
                    "y": 275
                }
            ]
        },
        "3808903f-e1c0-48e3-a43f-e728336661c4": {
            "vertices": [
                {
                    "x": 131,
                    "y": 195
                }
            ]
        },
        "5988ab20-38da-46fe-9ef0-eb471a5c4e97": {
            "vertices": [
                {
                    "x": 775,
                    "y": 231
                }
            ]
        },
        "1cbae22c-e5f0-4e06-9b72-503c72d83222": {
            "vertices": [
                {
                    "x": 1024,
                    "y": 270
                }
            ]
        },
        "80cc9d57-b599-4a73-bdab-2813d316f95d": {
            "vertices": [
                {
                    "x": 343,
                    "y": 406
                }
            ]
        },
        "97d9f275-e3ec-43da-b139-fd8fb54c2834": {
            "vertices": [
                {
                    "x": 547,
                    "y": 561
                }
            ]
        },
        "55d7d74e-7fc9-46cd-b6dd-045b597dded5": {
            "vertices": [
                {
                    "x": 605,
                    "y": 227
                }
            ]
        },
        "089059b7-d33b-4fbe-a5fc-e7ff04cd77fd": {
            "vertices": [
                {
                    "x": 386,
                    "y": 164
                }
            ]
        },
        "d9efb91f-199f-4278-814c-ced8684080c9": {
            "vertices": [
                {
                    "x": 748,
                    "y": 201
                }
            ]
        },
        "abf948ac-9690-437f-b06f-55a74876b189": {
            "vertices": [
                {
                    "x": 748,
                    "y": 134
                }
            ]
        },
        "a945654d-4862-4939-9af9-ebed458498f4": {
            "vertices": [
                {
                    "x": 425,
                    "y": 116
                }
            ]
        },
        "f9b4f95d-861a-4f71-b3d7-1e75c6dda381": {
            "collapsed": true
        }
    },
    "tool": "pistar.2.0.0",
    "istar": "2.0",
    "saveDate": "Thu, 14 Mar 2019 14:17:02 GMT",
    "diagram": {
        "width": 1244,
        "height": 700,
        "name": "Buyer-driven e-commerce system",
        "customProperties": {
            "Description": "Example of a buyer-driven e-commerce system. In such a system, the customer depends on a middleman to find a service provider who is willing to accept a price set by the customer. The customer submits a priced request to a middleman. The middleman forwards the request to suppliers. If a supplier decides to accept the request, it makes an agreement with the middleman. The middleman expects the customer to pay for the purchase in time.",
            "Colors": "Checkout the yellow elements, they have textual descriptions",
            "About": "When you collapse every actor, the model becomes a *Strategic Dependency* (SD) model, consisting of a set of nodes and links. Each node represents an actor, and each link between two actors indicates that one actor depends on the other for something in order that the former may attain some goal. We call the depending actor the depender, and the actor who is depended upon the dependee. The object around which the\ndependency relationship centers is called the dependum. By depending on another actor for a dependum, an actor (the depender) is able to achieve goals that it was not able to without the dependency, or not as easily or as well. At the same time, the depender becomes vulnerable. If the dependee fails to deliver the dependum, the depender would be adversely affected in its ability to achieve its goals.\n\nWhen actors are expanded, you have a *Strategic Rationale* (SR) model, which provides a more detailed level of modelling by looking “inside” actors to model internal intentional relationships. Intentional elements (goals, tasks, resources, and qualities) appear in SR models not only as external dependencies, but also as internal elements arranged into (mostly hierarchical) structures of or-refinements, and-refinements, contribution, needed-by and qualification relationships.",
            "Origin": "Model and text based on Eric Yu, Lin Liu, and Ying Li. \"Modelling strategic actor relationships to support intellectual property management.\" International Conference on Conceptual Modeling, 2001. It was adapted to conform to the iStar 2.0 standard, thus it is not an exact copy of the original model."
        }
    }
};

/*!
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 *
 * If you are going to edit the code, always work from the source-code available for download at
 * https://github.com/jhcp/pistar
 */

/* this file contains default shapes that are used when a Cell defined in the metamodel
   does not have a custom shape.
   DO NOT CHANGE THIS SHAPE to customize the visuals of your language. Instead,
   create new shapes in the tool/language/shapes.js file.
 */



   joint.shapes.istar = {};

   joint.shapes.istar.DefaultContainer = joint.dia.Element.extend({
       markup: '<g><rect class="boundary" /><circle class="element actorSymbol" /><path /><text class="stereotype"/><text class="content"/></g>',
       defaults: joint.util.deepSupplement({
           type: 'Container',
           size: {width: 200, height: 120},
           attrs: {
               '.element': {
                   cx: 40,
                   cy: 40,
                   fill: 'white',
                   r: 40,
                   stroke: 'black',
                   'stroke-width': 2,
                   'stroke-dasharray': '8, 4',
                   transform: 'translate(-20, -20)',  //displaces the actual actor symbol a little bit
               },
               '.stereotype': {
                   fill: '#000000',
                   'font-family': 'Arial, helvetica, sans-serif',
                   'font-size': 12,
                   'font-style': 'italic',
                   ref: '.content',//makes the position of the text relative to content label
                   'ref-x': 0.5,
                   'ref-y': -6,
                   // text: '<<ElementType>>',
                   'text-anchor': 'middle',
                   'y-alignment': 'middle'
               },
               '.content': {
                   fill: '#000000',
                   'font-family': 'Arial, helvetica, sans-serif',
                   'font-size': 12,
                   'font-weight': 'bold',
                   ref: '.element',//makes the position of the text relative to the actual actor symbol
                   'ref-x': 0.5,
                   'ref-y': 0.5,
                   text: 'ElementType',
                   'text-anchor': 'middle',
                   'y-alignment': 'middle'
               },
               '.boundary': {
                   fill: 'rgb(242,242,242)',
                   height: 120,
                   rx: 100,
                   ry: 40,
                   stroke: 'black',
                   'stroke-dasharray': '10,5,4,4',
                   'stroke-width': 2,
                   width: 200
               },
           }
       }, joint.dia.Element.prototype.defaults)
   });
   
   joint.shapes.istar.DefaultNode = joint.shapes.basic.Rect.extend({
       markup: '<g class="scalable"><rect class="element"/></g><text class="stereotype"/><text class="content"/>',
       defaults: joint.util.deepSupplement({
           size: {width: 90, height: 35},
           attrs: {
               '.element': {
                   fill: 'rgb(255,255,255)',
                   height: 30,
                   rx: 0,
                   stroke: 'black',
                   'stroke-dasharray': '8, 4',
                   'stroke-width': 2,
                   'vector-effect': 'non-scaling-stroke', /* prevents stroke distortion when the element is resized */
                   width: 130
               },
               '.stereotype': {
                   'font-size': 12,
                   'font-style': 'italic',
                   'ref': '.element',
                   'ref-y': '10',
                   // 'text': '<<ElementType>>'
               },
               '.content': {
                   'font-size': 12,
                   'font-weight': 'bold',
                   'ref': '.element',
                   'ref-y': '5',
                   'refY2': '0.5',
                   text: 'ElementType'
               }
           }
       }, joint.shapes.basic.Rect.prototype.defaults)
   });
   
   joint.shapes.istar.DefaultContainerLink = joint.dia.Link.define('DefaultContainerLink',
       {
           attrs: {
               line: {
                   connection: true,
                   fill: 'none',
                   stroke: 'black',
                   'stroke-dasharray': '2,4',
                   'stroke-width': 1,
                   targetMarker: {
                       'd': 'm 10,-6 l -10,6 10,6',
                       fill: 'none',
                       'stroke-width': 1.2,
                       'type': 'path',
                   }
               },
               'connection-wrap': {
                   connection: true,
                   fill: 'none',
                   stroke: 'transparent',
                   'stroke-linecap': 'round',
                   'stroke-width': 20
               },
               label: {
                   atConnectionRatio: 0.45,
                   'font-size': 14,
                   'font-weight': 400,
                   text: '<<ContainerLinkType>>',
                   x: -20,
                   y: 4,
               },
               'label-background': {
                   atConnectionRatio: 0.45,
                   'font-size': 14,
                   'font-weight': 400,
                   stroke: 'white',
                   'stroke-width': '0.35em',
                   text: '<<ContainerLinkType>>',
                   x: -20,
                   y: 4,
               }
           },
           source: {selector: '.actorSymbol'},
           target: {selector: '.actorSymbol'}
       },
       {
           markup: [
               {
                   className: 'c-connection-wrap',
                   selector: 'connection-wrap',
                   tagName: 'path'
               },
               {
                   selector: 'line',
                   tagName: 'path'
               },
               {
                   selector: 'label-background',
                   tagName: 'text'
               },
               {
                   selector: 'label',
                   tagName: 'text'
               }
           ]
       }
   );
   
   joint.shapes.istar.DefaultNodeLink = joint.dia.Link.define('DefaultNodeLink',
       {
           attrs: {
               line: {
                   connection: true,
                   fill: 'none',
                   stroke: 'black',
                   'stroke-dasharray': '2,4',
                   'stroke-width': 1,
                   targetMarker: {
                       'd': 'm 10,-6 l -10,6 10,6',
                       fill: 'none',
                       'stroke-width': 1.2,
                       'type': 'path',
                   }
               },
               'connection-wrap': {
                   connection: true,
                   fill: 'none',
                   stroke: 'transparent',
                   'stroke-linecap': 'round',
                   'stroke-width': 20
               },
               label: {
                   atConnectionRatio: 0.45,
                   'font-size': 14,
                   'font-weight': 400,
                   text: '<<NodeLinkType>>',
                   x: -20,
                   y: 4,
               },
               'label-background': {
                   atConnectionRatio: 0.45,
                   'font-size': 14,
                   'font-weight': 400,
                   stroke: 'rgb(242,242,242)',
                   'stroke-width': '0.35em',
                   text: '<<NodeLinkType>>',
                   x: -20,
                   y: 4,
               }
           },
           source: {selector: '.element'},
           target: {selector: '.element'}
       },
       {
           markup: [
               {
                   className: 'c-connection-wrap',
                   selector: 'connection-wrap',
                   tagName: 'path'
               },
               {
                   selector: 'line',
                   tagName: 'path'
               },
               {
                   selector: 'label-background',
                   tagName: 'text'
               },
               {
                   selector: 'label',
                   tagName: 'text'
               }
           ]
       }
   );

   /*!
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 *
 * If you are going to edit the code, always work from the source-code available for download at
 * https://github.com/jhcp/pistar
 */

jQuery(document).ready(function () {
    
    'use strict';

    istar.graph = istar.setup.setupModel();
    istar.paper = istar.setup.setupDiagram(istar.graph);
    //console.log(istar.metamodel);

    istar.setupMetamodel(istar.metamodel);
    ui.setupUi();

    //wait the ui finish loading before loading a model
    jQuery(document).ready(function () {
        setTimeout(function () {
            istar.fileManager.loadModel(istar.models.processModelParameter());
            ui.selectPaper();//clear selection
            }, 5);
    });

    // ui.alert('Hi there, this is a beta version of the tool, currently under testing. Please send us your feedback at <a href="https://goo.gl/forms/SaJlelSfkTkp819t2">https://goo.gl/forms/SaJlelSfkTkp819t2</a>',
    //     'Beta version');
});

/*definition of globals to prevent undue JSHint warnings*/
/*globals istar:false, ui:false, console:false, $:false */


/*!
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 *
 * If you are going to edit the code, always work from the source-code available for download at
 * https://github.com/jhcp/pistar
 */

/**
 * An object that defines the metamodel to be used.
 * By default, each Cell (Element or Link) is valid. However,
 *  you can define your own isValid functions to constrain the addition of elements in a model.
 *  For examples, see the nodeLink definitions;
 *
 * @typedef metamodel
 * @type {object}
 * @property {string} prefix
 * @property {string} version - written in the format 'a.b'
 * @property {object} containers
 * @property {object} nodes
 * @property {object} containerLinks
 * @property {object} dependencyLinks
 * @property {object} nodeLinks
 *
 * @type {metamodel}
 */
istar.metamodel = {
    /** A prefix to use when loading and saving the model */
    /** @type {string} */
    "prefix": "istar",

    /**
     * Identify the version of the metamodel
     * @example
     * version: '0.1'
     @type {string}
     */
    "version": "0.2",

    /** An object containing the definition of the shapes that are used in this metamodel
     *  You probably don't want to change this */
    /** @type {Object} */
    "shapesObject": joint.shapes.istar,

    //Add here the elements of your language that behave like actors, in the sense that they are containers
    // onto which inner elements (nodes) are added
    //Constraints for the validity of a Container type can be defined in the constraints file
    /** @type {Object} */
    "containers": {
        "Actor": { },
        "Agent": { },
        "Role": { }
    },

    //Add here the elements of your language that do not behave like actors, i.e., they are not containers;
    //If they can be added to containers (such as actors), 'canBeInnerElement' must be set to true (default value: false)
    //If they can be dependums in a dependency link, 'canBeDependum' must be set to true (default value: false)
    //If they can be added directly to the paper, without being part of a dependency link, "canBeOnPaper" (default value: false)
    //Further constraints can be defined in the constraints file
    /** @type {Object} */
    "nodes": {
        "Goal": {
            "canBeInnerElement": true,
            "canBeDependum": true,
            "canBeOnPaper": false
        },
        "Quality": {
            "canBeInnerElement": true,
            "canBeDependum": true,
            "canBeOnPaper": false
        },
        "Resource": {
            "canBeInnerElement": true,
            "canBeDependum": true,
            "canBeOnPaper": false
        },
        "Task": {
            "canBeInnerElement": true,
            "canBeDependum": true,
            "canBeOnPaper": false
        }
    },

    //Add here the links of your language that directly relate a container with another container
    //  (e.g., an Actor to another actor).
    //Constraints for the validity of a Link type can be defined in the constraints file
    /** @type {Object} */
    "containerLinks": {
        "IsALink": {
            "label": "is-a"
        },
        "ParticipatesInLink": {
            "label": "participates-in"
        }
    },

    //Add here the links of your language that *behave like* a Dependency link: they link a container with
    // another container while having a node in the middle
    //New types of dependency links are *NOT* created here.
    //Constraints for the validity of a Dependency link type can be defined in the constraints file
    "dependencyLinks": {
        "DependencyLink": { }
    },

    //Add here the links of your language that relate a node with another node
    //Constraints for the validity of a Link type can be defined in the constraints file
    /** @type {Object} */
    "nodeLinks": {
        "AndRefinementLink": { },
        "OrRefinementLink": { },
        "NeededByLink": {
            "tryReversedWhenAdding": true
        },
        "QualificationLink": {
            "tryReversedWhenAdding": true
        },
        "ContributionLink": {
            "changeableLabel": true,
            "possibleLabels": ["make", "help", "hurt", "break"]
        }
    }
};

/*definition of globals to prevent undue JSHint warnings*/
/*globals istar:false, joint:false, console:false, _:false */


/*!
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 *
 * If you are going to edit the code, always work from the source-code available for download at
 * https://github.com/jhcp/pistar
 */

/**
 * An object that defines the constrains of the metamodel to be used.
 * By default, each Cell (Element or Link) is valid. However,
 *  you can define your own isValid functions to constrain the addition of elements in a model.
 *  For examples, see the nodeLink definitions;
 *
 * @typedef metamodel
 * @type {object}
 * @property {object} containers
 * @property {object} nodes
 * @property {object} containerLinks
 * @property {object} dependencyLinks
 * @property {object} nodeLinks
 *
 * @type {metamodel}
 */

//CONTAINER
//Constraints for the addition of a Container type can be defined through a optional 'isValid' function
//      it must return a object in the format {message, isValid}, where
//      message is an optional string that explains the error to the user (if any)
//      isValid is a boolean that should be true if the addition is valid
//      if unspecified, it will always be valid to add that container

//NODES
//Some constraints can be defined in the metamodel itself
//Further constraints can be defined through a optional 'isValid' function
//      this function may receive as argument the container (parent) that it is going to be added to
//      it must return a object in the format {message, isValid}, where
//      message is an optional string that explains the error to the user (if any)
//      isValid is a boolean that should be true if the addition is valid
//      this function (isValid) does not apply to dependency links
//      if unspecified, it will always be valid to add that node


istar.metamodel.containerLinks.IsALink.isValid = function (source, target) {
    'use strict';

    // role->role; actor->actor;
    // - Only roles can be specialized into roles, or general actors into general actors (page 6)
    // - There should be no is-a cycles (page 14) (ignored)
    // - A pair of actors can be linked by at most one actor link: it is not possible to
    //   connect two actors via both is-a and participates-in (page 14)

    var result = {};
    var isValid = true;
    if ( isValid && (source.get('type') !== target.get('type')) ) {
        isValid = false;
        result.message = 'the source and target of Is-A links must be of the same type - Actor and Actor, or Role and Role (iStar 2.0 Guide, Page 6).' +
            '<br><br><img src="language/images/errors/isATypes.svg" alt="You cannot add make an Is-A link from a type to a different type"/>';
    }
    if ( ! (source.isActor() || source.isRole()) ) {
        isValid = false;
        result.message = 'the source of Is-A links must be a Role or a general Actor (iStar 2.0 Guide, Page 6).' +
            '<br><br><img src="language/images/errors/isATypes.svg" alt="Is-A links must originate from a general Actor or a Role"/>';
    }
    if ( isValid && ! (target.isActor() || target.isRole()) ) {
        isValid = false;
        result.message = 'the target of Is-A links must be a Role or a general Actor (iStar 2.0 Guide, Page 6).' +
            '<br><br><img src="language/images/errors/isATypes.svg" alt="Is-A links must target a general Actor or a Role"/>';
    }
    if ( isValid && (source === target) ) {
        isValid = false;
        result.message = 'you cannot make Is-A links from an actor onto itself.' +
            '<br><br><img src="language/images/errors/isASelfLink.svg" alt="No self-links allowed"/>';
    }
    if ( isValid && istar.isThereLinkBetween(source, target)) {
        isValid = false;
        result.message = 'there can only be one Actor link between the same two actors (iStar 2.0 Guide, Page 14).' +
            '<br><br><img src="language/images/errors/isAMultipleLinks.svg" alt="You cannot add multiple Is-A links to the same two actors"/>';
    }

    result.isValid = isValid;
    return result;
};

istar.metamodel.containerLinks.ParticipatesInLink.isValid = function (source, target) {
    'use strict';

    // actor->actor; actor->role; actor->agent;
    // role->actor; role->role; role->agent;
    // agent->actor; agent->role; agent->agent;
    // - represents any kind of association, other than generalization /
    //   specialization, between two actors. No restriction exists on the type of actors
    //   linked by this association (page 6)
    // - Every actor can participate-in multiple other actors (page 6)
    // - There should be no participates-in cycles (page 14) (ignored)
    // - A pair of actors can be linked by at most one actor link: it is not possible to
    //   connect two actors via both is-a and participates-in (page 14)

    var result = {};
    var isValid = true;
    if ( ! source.isKindOfActor() ) {
        isValid = false;
        result.message = 'the source of a Participates-In link must be some kind of actor (iStar 2.0 Guide, Page 6)';
    }
    if ( isValid && ! target.isKindOfActor() ) {
        isValid = false;
        result.message = 'the target of a Participates-In link must be some kind of actor (iStar 2.0 Guide, Page 6)';
    }
    if ( isValid && (source === target) ) {
        isValid = false;
        result.message = 'you cannot make a Participates-In link from an actor onto itself.' +
            '<br><br><img src="language/images/errors/participatesInSelfLink.svg" alt="No self-links allowed"/>';
    }
    if ( isValid && istar.isThereLinkBetween(source, target)) {
        isValid = false;
        result.message = 'there can only be one Actor link between the same two actors (iStar 2.0 Guide, Page 14).' +
            '<br><br><img src="language/images/errors/participatesInMultipleLinks.svg" alt="You cannot add multiple Participates-In links to the same two actors"/>';
    }

    result.isValid = isValid;
    return result;
};

istar.metamodel.dependencyLinks.DependencyLink.isValid = function (source, target, dependumTypeName) {
    'use strict';

    //istar 2.0:
    //- When a depender depends on the dependee for its dependerElmt, the depender
    //  cannot or chooses not to satisfy/perform/have the dependerElmt on its own.
    //  Thus, the dependerElmt cannot be refined or contributed to (page 9)
    //- Dependency relationships should not share the same dependum, as each dependum is
    //  a conceptually different element (page 9)

    var result = {};
    var isValid = true;

    //identify who is the actor - the elements themselves, or their parents
    var sourceParentId;
    var targetParentId;
    if (source.isKindOfActor()) {
        sourceParentId = source.id;
    } else if (source.isNode()) {
        sourceParentId = source.attributes.parent;
    }

    if (target.isKindOfActor()) {
        targetParentId = target.id;
    } else if (target.isNode()) {
        targetParentId = target.attributes.parent;
    }

    if (source.isLink()) {
        isValid = false;
        result.message = 'the source of a Dependency link cannot be a link';
    }
    if (isValid && target.isLink()) {
        isValid = false;
        result.message = 'the target of a Dependency link cannot be a link';
    }
    if (isValid && (source === target)) {
        isValid = false;
        result.message = 'a Dependency link cannot link an element onto itself';
    }
    if (isValid && source.isDependum()) {
        isValid = false;
        result.message = 'a Dependency link cannot start from a dependum';
    }
    if (isValid && target.isDependum()) {
        isValid = false;
        result.message = 'a Dependency link cannot end in a dependum';
    }
    if (isValid && sourceParentId === targetParentId) {
        isValid = false;
        result.message = 'a Dependency link must involve two different actors (iStar 2.0 Guide, Page 14)';
    }
    if (isValid && (istar.isElementTargetOfType(source, 'OrRefinementLink') || istar.isElementTargetOfType(source, 'AndRefinementLink'))) {
        isValid = false;
        result.message = 'a refined element cannot be the Depender Element in a Dependency link (iStar 2.0 Guide, Page 14)' +
            '. Instead, you can try to add the Dependency originating from a child, as shown in the example below.' +
            '<br><br><img src="language/images/errors/dependerElementRefined.svg" alt="You cannot add a dependency from a element that is already refined"/>';
    }
    if (isValid && istar.isElementTargetOfType(source, 'ContributionLink')) {
        isValid = false;
        result.message = 'a contributed element cannot be the Depender Element in a Dependency link (iStar 2.0 Guide, Page 14)' +
            '. Instead, you can try to add the Dependency originating from a child, as shown in the example below.' +
            '<br><br><img src="language/images/errors/dependerElementContributedTo.svg" alt="You cannot add a dependency from a element that is the target of a Contribution link"/>';
    }

    result.isValid = isValid;
    return result;
};

istar.metamodel.nodeLinks.AndRefinementLink.isValid = function (source, target) {
    'use strict';

    //istar 2.0:
    //- goal->goal; goal->task; task->task; task->goal (table 1)
    //- ...the fulfillment of all the n children (n ≥ 2)(page 10) (ignored)
    //- A parent can only be AND-refined or OR-refined, not both simultaneously (page 10)
    // - The relationships between intentional elements (contributesTo, qualifies, neededBy, refines)
    //  apply only to elements that are wanted by the same actor (page 14)
    //- For a dependency, if a dependerElmt x exists, then x cannot be refined or
    //   contributed to (page 14)
    //- The refinement relationship should not lead to refinement cycles
    //  (e.g., G ORrefined to G1 and G1 OR-refined to G, G OR-refined to G, etc.) (page 14)  (ignored)

    var result = {};
    var isValid = true;
    if ( !(source.isTask() || source.isGoal()) ) {
        isValid = false;
        result.message = 'the source of an AND-refinement link must be a Goal or a Task (iStar 2.0 Guide, Table 1)';
    }
    if ( isValid && !(target.isTask() || target.isGoal()) ) {
        isValid = false;
        result.message = 'the target of an AND-refinement link must be a Goal or a Task (iStar 2.0 Guide, Table 1)';
    }
    if ( isValid && (source === target) ) {
        isValid = false;
        result.message = 'you cannot make an AND-refinement link from an element onto itself';
    }
    if ( isValid && (source.isDependum() || target.isDependum()) ) {
        isValid = false;
        result.message = 'you cannot make an AND-refinement link with a dependum (iStar 2.0 Guide, Page 14)';
    }
    if ( isValid && (source.attributes.parent !== target.attributes.parent) ) {
        isValid = false;
        result.message = 'the source and target of an AND-refinement link must pertain to the same actor (iStar 2.0 Guide, Page 14)';
    }
    if ( isValid && istar.isThereLinkBetween(source, target)) {
        isValid = false;
        result.message = 'there can only be one refinement link between the same two elements' +
            '<br><br><img src="language/images/errors/duplicatedRefinement.svg" alt="You cannot have duplicated links"/>';
    }
    if ( isValid && istar.isElementSourceOfType(target, 'DependencyLink')) {
        isValid = false;
        result.message = 'you cannot refine a Depender Element; that is, an element that is the source of a Dependency (iStar 2.0 Guide, Page 14)' +
            '. Instead, you can try to move the dependency to the sub-element, as shown in the example below.' +
            '<br><br><img src="language/images/errors/refinementToDependerELement.svg" alt="You cannot add a Refinement link targeting a Depender Element"/>';
    }
    if ( isValid && istar.isElementTargetOfType(target, 'OrRefinementLink')) {
        isValid = false;
        result.message = 'you cannot mix AND-refinements with OR-refinements targeting the same element ' +
            '(iStar 2.0 Guide, Page 10).<br><br>' +
            '<img src="language/images/errors/mixAndAndOr.svg" alt="An element may be AND-refined or OR-refined, but not both"/>';
    }

    result.isValid = isValid;
    return result;
};

istar.metamodel.nodeLinks.OrRefinementLink.isValid = function (source, target) {
    'use strict';

    //istar 2.0:
    //goal->goal; goal->task; task->task; task->goal (table 1)
    //- A parent can only be AND-refined or OR-refined, not both simultaneously (page 10)
    //- The relationships between intentional elements (contributesTo, qualifies, neededBy, refines)
    //  apply only to elements that are wanted by the same actor (page 14)
    //- For a dependency, if a dependerElmt x exists, then x cannot be refined or
    //   contributed to (page 14)
    //- The refinement relationship should not lead to refinement cycles
    //  (e.g., G OR-refined to G1 and G1 OR-refined to G, G OR-refined to G, etc.) (page 14) (ignored)

    var result = {};
    var isValid = true;
    if ( !(source.isTask() || source.isGoal()) ) {
        isValid = false;
        result.message = 'the source of an OR-refinement link must be a Goal or a Task (iStar 2.0 Guide, Table 1)';
    }
    if ( isValid && !(target.isTask() || target.isGoal()) ) {
        isValid = false;
        result.message = 'the target of an OR-refinement link must be a Goal or a Task (iStar 2.0 Guide, Table 1)';
    }
    if ( isValid && (source === target) ) {
        isValid = false;
        result.message = 'you cannot make an OR-refinement link from an element onto itself';
    }
    if ( isValid && (source.isDependum() || target.isDependum()) ) {
        isValid = false;
        result.message = 'you cannot make an OR-refinement link with a dependum (iStar 2.0 Guide, Page 14)';
    }
    if ( isValid && (source.attributes.parent !== target.attributes.parent) ) {
        isValid = false;
        result.message = 'the source and target of an OR-refinement link must pertain to the same actor (iStar 2.0 Guide, Page 14)';
    }
    if ( isValid && istar.isThereLinkBetween(source, target)) {
        isValid = false;
        result.message = 'there can only be one refinement link between the same two elements' +
            '<br><br><img src="language/images/errors/duplicatedRefinement.svg" alt="You cannot have duplicated links"/>';
    }
    if ( isValid && istar.isElementSourceOfType(target, 'DependencyLink')) {
        isValid = false;
        result.message = 'you cannot refine a Depender Element; that is, an element that is the source of a Dependency (iStar 2.0 Guide, Page 14)' +
            '. Instead, you can try to move the dependency to the sub-element, as shown in the example below.' +
            '<br><br><img src="language/images/errors/refinementToDependerELement.svg" alt="You cannot add a Refinement link targeting a Depender Element"/>';
    }
    if ( isValid && istar.isElementTargetOfType(target, 'AndRefinementLink')) {
        isValid = false;
        result.message = 'you cannot mix OR-refinements with AND-refinements targeting the same element ' +
            '(iStar 2.0 Guide, Page 10).<br><br>' +
            '<img src="language/images/errors/mixAndAndOr.svg" alt="An element may be AND-refined or OR-refined, but not both"/>';
    }

    result.isValid = isValid;
    return result;
};

istar.metamodel.nodeLinks.NeededByLink.isValid = function (source, target) {
    'use strict';

    //istar 2.0
    //resource->task (table 1)
    //The NeededBy relationship links a task with a resource (page 11)
    //- The relationships between intentional elements (contributesTo, qualifies, neededBy, refines)
    //  apply only to elements that are wanted by the same actor (page 14)

    var result = {};
    var isValid = true;
    if ( !source.isResource() ) {
        isValid = false;
        result.message = 'the source of a Needed-By link must be a Resource (iStar 2.0 Guide, Table 1)';
    }
    if ( isValid && !target.isTask() ) {
        isValid = false;
        result.message = 'the target of a Needed-By link must be a Task (iStar 2.0 Guide, Table 1)';
    }
    if ( isValid && (source === target) ) {
        isValid = false;
        result.message = 'you cannot make a Needed-By link from an element onto itself';
    }
    if ( isValid && (source.isDependum() || target.isDependum()) ) {
        isValid = false;
        result.message = 'you cannot make a Needed-By link with a dependum (iStar 2.0 Guide, Page 14)';
    }
    if ( isValid && (source.attributes.parent !== target.attributes.parent) ) {
        isValid = false;
        result.message = 'the source and target of a Needed-By link must pertain to the same actor (iStar 2.0 Guide, Page 14)';
    }
    if ( isValid && istar.isThereLinkBetween(source, target)) {
        isValid = false;
        result.message = 'there can only be one Needed-By link between the same two elements' +
            '<br><br><img src="language/images/errors/duplicatedNeededBy.svg" alt="you cannot have duplicated Needed-By links"/>';
    }
    result.isValid = isValid;
    return result;
};

istar.metamodel.nodeLinks.ContributionLink.isValid = function (source, target) {
    'use strict';

    //istar 2.0
    //goal->quality; quality->quality; task->quality; resource->quality (table 1)
    //- While the examples show contributions starting from goals
    //  and tasks, it is also possible to initiate contributions
    //  from resources and qualities (page 11)
    //- The relationships between intentional elements (contributesTo, qualifies, neededBy, refines)
    //  apply only to elements that are wanted by the same actor (page 14)
    //– An intentional element and a quality can be linked by either a contributesTo
    //  relationship or a qualifies relationship, but not by both (page 15)
    //– It is not possible for a quality to contribute to itself (page 15)

    var result = {};
    var isValid = true;
    if ( !(source.isGoal() || source.isQuality() || source.isTask() || source.isResource()) ) {
        isValid = false;
        result.message = 'the source of a Contribution link must be a Goal, a Quality, a Task or a Resource (iStar 2.0 Guide, Table 1)';
    }
    if ( isValid && !(target.isQuality()) ) {
        isValid = false;
        result.message = 'the target of a Contribution link must be a Quality (iStar 2.0 Guide, Table 1)';
    }
    if ( isValid && (source === target) ) {
        isValid = false;
        result.message = 'you cannot make a Contribution link from an element onto itself (iStar 2.0 Guide, Page 15)';
    }
    if ( isValid && (source.isDependum() || target.isDependum()) ) {
        isValid = false;
        result.message = 'you cannot make a Contribution link with a dependum (iStar 2.0 Guide, Page 14)';
    }
    if ( isValid && (source.attributes.parent !== target.attributes.parent) ) {
        isValid = false;
        result.message = 'the source and target of an a Contribution link must pertain to the same actor (iStar 2.0 Guide, Page 14)';
    }
    if ( isValid && istar.isThereLinkBetween(source, target, 'ContributionLink')) {
        isValid = false;
        result.message = 'there can only be one Contribution link between the same two elements' +
            '<br><br><img src="language/images/errors/duplicatedContributions.svg" alt="you cannot have duplicated Contribution links"/>';
    }
    if ( isValid && istar.isThereLinkBetween(source, target, 'QualificationLink')) {
        isValid = false;
        result.message = 'you cannot have Contribution and Qualification links between the same two elements (iStar 2.0 Guide, Page 15)';
    }
    if ( isValid && istar.isElementSourceOfType(target, 'DependencyLink')) {
        isValid = false;
        result.message = 'you cannot contribute to a Depender Element; that is, an element that is the source of a Dependency (iStar 2.0 Guide, Page 14)' +
            '. Instead, you can try to move the dependency to the sub-quality, as shown in the example below.' +
            '<br><br><img src="language/images/errors/contributionToDependerELement.svg" alt="You cannot add a Contribution link to a Depender Element"/>';
    }

    result.isValid = isValid;
    return result;
};

istar.metamodel.nodeLinks.QualificationLink.isValid = function (source, target) {
    'use strict';

    //istar 2.0
    //quality->goal, quality->task, quality->resource (table 1)
    //The qualification relationship relates a quality to its
    //subject: a task, goal, or resource.
    //- The relationships between intentional elements (contributesTo, qualifies, neededBy, refines)
    //  apply only to elements that are wanted by the same actor (page 14)
    //– An intentional element and a quality can be linked by either a contributesTo
    //  relationship or a qualifies relationship, but not by both (page 15)

    var result = {};
    var isValid = true;
    if ( !(source.isQuality()) ) {
        isValid = false;
        result.message = 'the source of a Qualification link must be a Quality (iStar 2.0 Guide, Table 1)';
    }
    if ( isValid && !(target.isGoal() || target.isTask() || target.isResource()) ) {
        isValid = false;
        result.message = 'the target of a Qualification link must be a Goal, a Task or a Resource (iStar 2.0 Guide, Table 1)';
    }
    if ( isValid && (source === target) ) {
        isValid = false;
        result.message = 'you cannot make a Qualification link from an element onto itself';
    }
    if ( isValid && (source.isDependum() || target.isDependum()) ) {
        isValid = false;
        result.message = 'you cannot make a Qualification link with a dependum (iStar 2.0 Guide, Page 14)';
    }
    if ( isValid && (source.attributes.parent !== target.attributes.parent) ) {
        isValid = false;
        result.message = 'the source and target of an a Qualification link must pertain to the same actor (iStar 2.0 Guide, Page 14)';
    }
    if ( isValid && istar.isThereLinkBetween(source, target, 'QualificationLink')) {
        isValid = false;
        result.message = 'there can only be one Qualification link between the same two elements';
    }
    if ( isValid && istar.isThereLinkBetween(source, target, 'ContributionLink')) {
        isValid = false;
        result.message = 'you cannot have Qualification and Contribution links between the same two elements (iStar 2.0 Guide, Page 15)';
    }

    result.isValid = isValid;
    return result;
};

/*definition of globals to prevent undue JSHint warnings*/
/*globals istar:false, joint:false, console:false, _:false */

/*
* The Actor, Role, and Agent shapes are structured as follows:
	.element: the circle that represents the actor when collapsed
	text: the text inside the circle, usually representing the name of the actor
	.boundary: the container for the elements that go inside the actor

	Additionally, Agent and Role also contain a path that distinguishes then from the generic Actor element

	A rectangular boundary is used instead of the original circular boundary, to maximize the space available for drawing
*/

joint.shapes.istar.Actor = joint.dia.Element.extend({
    markup: '<g><rect class="boundary" /><circle class="element actorSymbol" /><path /><text class="content"/></g>',
    defaults: joint.util.deepSupplement({
        type: 'Container',
        size: {width: 200, height: 120},
        attrs: {
            '.element': {
                cx: 40,
                cy: 40,
                fill: 'rgb(205,254,205)',
                r: 40,
                stroke: 'black',
                'stroke-width': 2,
                transform: 'translate(-20, -20)'  //displaces the circle a little bit
            },
            text: {
                fill: '#000000',
                'font-family': 'Arial, helvetica, sans-serif',
                'font-size': 12,
                ref: 'circle',//makes the position of the text relative to the circle
                'ref-x': 0.5,
                'ref-y': 0.5,
                text: 'Actor',
                'text-anchor': 'middle',
                'y-alignment': 'middle'
            },
            '.boundary': {
                fill: 'rgb(242,242,242)',
                height: 120,
                rx: 100,
                ry: 40,
                stroke: 'black',
                'stroke-dasharray': '10,5,4,4',
                'stroke-width': 2,
                width: 200
            },
        }
    }, joint.dia.Element.prototype.defaults)
});

joint.shapes.istar.Role = joint.dia.Element.extend({
    markup: '<g><rect class="boundary" /><circle class="element actorSymbol" /><path class="actorDecorator"/><text class="content"/></g>',
    defaults: joint.util.deepSupplement({
        type: 'Container',
        size: {width: 200, height: 120},
        attrs: {
            '.element': {
                cx: 40,
                cy: 40,
                fill: 'rgb(205,254,205)',
                r: 40,
                stroke: 'black',
                'stroke-width': 2,
                transform: 'translate(-20, -20)'  //displaces the circle a little bit
            },
            text: {
                fill: '#000000',
                'font-family': 'Arial, helvetica, sans-serif',
                'font-size': 12,
                ref: 'circle',//makes the position of the text relative to the circle
                'ref-x': 0.5,
                'ref-y': 0.5,
                text: 'Role',
                'text-anchor': 'middle',
                'y-alignment': 'middle'
            },
            '.boundary': {
                fill: 'rgb(242,242,242)',
                height: 120,
                rx: 100,
                ry: 40,
                stroke: 'black',
                'stroke-dasharray': '10,5,4,4',
                'stroke-width': 2,
                width: 200
            },
            path: {
                d: 'm -11 45 q 30 15 62 0',
                fill: 'none',
                stroke: 'black',
                'stroke-width': 1.5
            }
        }
    }, joint.dia.Element.prototype.defaults)
});

joint.shapes.istar.Agent = joint.dia.Element.extend({
    markup: '<g><rect class="boundary"/><circle class="element actorSymbol"/><path class="actorDecorator"/><text class="content"/></g>',
    defaults: joint.util.deepSupplement({
        type: 'Container',
        size: {width: 200, height: 120},
        attrs: {
            '.element': {
                cx: 40,
                cy: 40,
                fill: 'rgb(205,254,205)',
                r: 40,
                stroke: 'black',
                'stroke-width': 2,
                transform: 'translate(-20, -20)'  //displaces the circle a little bit

            },
            text: {
                fill: '#000000',
                'font-family': 'Arial, helvetica, sans-serif',
                'font-size': 12,
                ref: 'circle',//makes the position of the text relative to the circle
                'ref-x': 0.5,
                'ref-y': 0.5,
                text: 'Agent',
                'text-anchor': 'middle',
                'y-alignment': 'middle'
            },
            '.boundary': {
                fill: 'rgb(242,242,242)',
                height: 120,
                rx: 100,
                ry: 40,
                stroke: 'black',
                'stroke-dasharray': '10,5,4,4', //'10,5'
                'stroke-width': 2,
                width: 200
            },
            path: {
                d: 'm -11 -5 62 0',
                fill: 'none',
                stroke: 'black',
                'stroke-width': 1.5
            }
        }
    }, joint.dia.Element.prototype.defaults)
});



joint.shapes.istar.Goal = joint.shapes.basic.Rect.extend({
    markup: '<g class="scalable"><rect class="element"/></g><text class="content"/>',
    defaults: joint.util.deepSupplement({
        type: 'Goal',
        size: {width: 90, height: 35},
        attrs: {
            rect: {
                fill: 'rgb(205,254,205)',
                height: 30,
                rx: 20,
                stroke: 'black',
                'stroke-width': 2,
                'vector-effect': 'non-scaling-stroke', /* prevents stroke distortion when the element is resized */
                width: 130
            },
            text: {
                'font-size': 12,
                'font-weight': 'bold',
                text: 'Goal'
            }
        }
    }, joint.shapes.basic.Rect.prototype.defaults)
});

joint.shapes.istar.Resource = joint.shapes.basic.Rect.extend({
    markup: '<g class="scalable"><rect class="element"/></g><text class="content"/>',
    defaults: joint.util.deepSupplement({
        type: 'Resource',
        size: {width: 90, height: 35},
        attrs: {
            rect: {
                fill: 'rgb(205,254,205)',
                height: 30,
                rx: 0,
                stroke: 'black',
                'stroke-width': 2,
                'vector-effect': 'non-scaling-stroke', /* prevents stroke distortion when the element is resized */
                width: 130
            },
            text: {
                'font-size': 12,
                'font-weight': 'bold',
                text: 'Resource'
            }
        }
    }, joint.shapes.basic.Rect.prototype.defaults)
});

joint.shapes.istar.Task = joint.shapes.basic.Polygon.extend({
    markup: '<g class="scalable"><polygon class="element"/></g><text class="content"/>',
    defaults: joint.util.deepSupplement({
        type: 'Task',
        size: {width: 95, height: 36},
        attrs: {
            'polygon': {
                fill: 'rgb(205,254,205)',
                height: 36,
                points: '0,18 15,0 115,0 130,18 115,36 15,36',
                stroke: 'black',
                'stroke-width': 2,
                'vector-effect': 'non-scaling-stroke', /* prevents stroke distortion when the element is resized */
                width: 130
            },
            text: {
                text: 'Task',
                'font-size': 12,
                'font-weight': 'bold',
                'ref-dy': '-50%',
            }
        }
    }, joint.shapes.basic.Polygon.prototype.defaults)
});

joint.shapes.istar.Quality = joint.shapes.basic.Path.extend({
    markup: '<g class="scalable"><path class="element"/></g><text class="content"/>',
    defaults: joint.util.deepSupplement({
        type: 'Quality',
        size: {width: 90, height: 55},
        attrs: {
            'path': {
                d: 'm 60.637955,-4.0358 c 17.5174,2.2042 29.9953,-10.69554 41.892705,-4.7858 22.34142,10.8714 11.2203,43.7743 -2.25,47.7322 -8.276505,2.9084 -13.960205,5.1934 -46.142805,-2.1786 -6.7454,-2.2317 -28.2652,6.0799 -35.4643,4.7143 C 9.072156,39.4809 6.491756,33.7693 3.744956,28.482 c -6.3069,-15.1266 -2.5738,-28.0439 7.981099,-34.7856 10.5549,-6.74179 27.9316,-7.30796 48.9119,2.2678 z',
                // d: 'M ' + 0 + ' ' + 0 + ' a 26.1831 26.1831 0 0 1 25 -3 a 18.8816 18.8816 0 0 1 27 -5 a 15.2684 15.2684 0 0 1 17.4999 3.25 a 19.182 19.182 0 0 1 24 -5 a 11.2361 11.2361 0 0 1 14.5 6.5 a 7.5085 7.5085 0 0 1 7 9 a 6.51159 6.51159 0 0 1 2.5 9.99998 a 7.67717 7.67717 0 0 1 -9 9.5 a 18.0487 18.0487 0 0 1 -17.25 3.625 a 41.1115 41.1115 0 0 1 -50.25 4.25 a 20.8059 20.8059 0 0 1 -22.25 0.25 a 28.5345 28.5345 0 0 1 -19.75 -6 a 12.0307 12.0307 0 0 1 -2.75 -21.75 a 6.06009 6.06009 0 0 1 3.74945 -5.62563 Z', //cloud shape
                fill: 'rgb(205,254,205)',
                resetOffset: true,
                stroke: 'black',
                'stroke-width': 2,
                'vector-effect': 'non-scaling-stroke' /* prevents stroke distortion when the element is resized */
            },
            text: {
                'font-size': 12,
                'font-weight': 'bold',
                'ref-y': '-65%',
                text: 'Quality',
                'y-alignment': 'middle'
            },
        }
    }, joint.shapes.basic.Path.prototype.defaults)
});

joint.shapes.istar.ParticipatesInLink = joint.dia.Link.define('ParticipatesInLink',
    {
        attrs: {
            line: {
                connection: true,
                fill: 'none',
                stroke: 'black',
                'stroke-width': 1,
                targetMarker: {
                    'd': 'm 10,-6 l -10,6 10,6',
                    fill: 'none',
                    'stroke-width': 1.2,
                    'type': 'path',
                }
            },
            'connection-wrap': {
                connection: true,
                fill: 'none',
                stroke: 'transparent',
                'stroke-linecap': 'round',
                'stroke-width': 20
            },
            label: {
                atConnectionRatio: 0.5,
                'font-size': 13,
                'font-weight': 400,
                x: -40,
                y: 4,
                // textPath: {   /* used if we want the text to follow along the line */
                //     selector: 'line',
                //     startOffset: '50%'
                // },
            },
            'label-background': {
                atConnectionRatio: 0.5,
                'font-size': 13,
                'font-weight': 400,
                stroke: 'white',
                'stroke-width': '0.35em',
                x: -40,
                y: 4,
                // textPath: {  /* used if we want the text to follow along the line */
                //     selector: 'line',
                //     startOffset: '50%'
                // },
            }
        },
        source: {selector: '.actorSymbol'},
        target: {selector: '.actorSymbol'}
    },
    {
        markup: [
            {
                className: 'c-connection-wrap',
                selector: 'connection-wrap',
                tagName: 'path'
            },
            {
                selector: 'line',
                tagName: 'path'
            },
            {
                selector: 'label-background',
                tagName: 'text'
            },
            {
                selector: 'label',
                tagName: 'text'
            }
        ]
    }
);

joint.shapes.istar.IsALink = joint.dia.Link.define('IsALink',
    {
        attrs: {
            line: {
                connection: true,
                fill: 'none',
                stroke: 'black',
                'stroke-width': 1,
                targetMarker: {
                    'd': 'm 10,-6 l -10,6 10,6',
                    fill: 'none',
                    'stroke-width': 1.2,
                    'type': 'path',
                }
            },
            'connection-wrap': {
                connection: true,
                fill: 'none',
                stroke: 'transparent',
                'stroke-linecap': 'round',
                'stroke-width': 20
            },
            label: {
                atConnectionRatio: 0.5,
                'font-size': 13,
                'font-weight': 400,
                x: -20,
                y: 4,
            },
            'label-background': {
                atConnectionRatio: 0.5,
                'font-size': 13,
                'font-weight': 400,
                stroke: 'white',
                'stroke-width': '0.35em',
                x: -20,
                y: 4,
            }
        },
        source: {selector: '.actorSymbol'},
        target: {selector: '.actorSymbol'}
    },
    {
        markup: [
            {
                className: 'c-connection-wrap',
                selector: 'connection-wrap',
                tagName: 'path'
            },
            {
                selector: 'line',
                tagName: 'path'
            },
            {
                selector: 'label-background',
                tagName: 'text'
            },
            {
                selector: 'label',
                tagName: 'text'
            }
        ]
    }
);

joint.shapes.istar.DependencyLink = joint.dia.Link.define('DependencyLink',
{
    attrs: {
        line: {
            connection: true,
            fill: 'none',
            stroke: 'black',
            'stroke-width': 1
        },
        'connection-wrap': {
            connection: true,
            fill: 'none',
            stroke: 'transparent',
            'stroke-linecap': 'round',
            'stroke-width': 20
        },
        label: {
            atConnectionRatio: 0.5,
            d: 'm 0,-10 l 0,20 4,0 c 10,0, 10 -20, 0,-20 l -4,0',
            // d: 'm 0,-10 l 0,20 c 15,2, 15 -22, 0,-20',
            // d: 'm 0,-10 l 0,20 q 15 -10, 0,-20',
            fill: 'white',
            // fill: 'none',
            stroke: 'black',
            'stroke-width': 2,
        }
    },
    source: {selector: 'text'},
    target: {selector: 'text'}
},
{
    markup: [
        {
            className: 'c-connection-wrap',
            selector: 'connection-wrap',
            tagName: 'path'
        },
        {
            selector: 'line',
            tagName: 'path'
        },
        {
            selector: 'label',
            tagName: 'path'
        }]
}
);

joint.shapes.istar.AndRefinementLink = joint.dia.Link.define('AndRefinementLink',
    {
        attrs: {
            line: {
                connection: true,
                fill: 'none',
                stroke: 'black',
                'stroke-width': 1,
                'targetMarker': {
                    'd': 'm 10,-6 l 0,12',
                    fill: 'none',
                    'stroke-width': 1.2,
                    'type': 'path',
                }
            },
            'connection-wrap': {
                connection: true,
                fill: 'none',
                stroke: 'transparent',
                'stroke-linecap': 'round',
                'stroke-width': 20
            }
        }
    },
    {
        markup: [
            {
                className: 'c-connection-wrap',
                selector: 'connection-wrap',
                tagName: 'path'
            },
            {
                selector: 'line',
                tagName: 'path'
            }
        ]
    }
);

joint.shapes.istar.OrRefinementLink = joint.dia.Link.define('OrRefinementLink',
    {
        attrs: {
            line: {
                connection: true,
                fill: 'none',
                stroke: 'black',
                'stroke-width': 1,
                targetMarker: {
                    'd': 'm 12,-6 l -12,6 12,6 z',
                     fill: 'black',
                    'stroke-width': 1.2,
                    'type': 'path',
                }
            },
            'connection-wrap': {
                connection: true,
                fill: 'none',
                stroke: 'transparent',
                'stroke-linecap': 'round',
                'stroke-width': 20
            }
        }
    },
    {
        markup: [
            {
                className: 'c-connection-wrap',
                selector: 'connection-wrap',
                tagName: 'path'
            },
            {
                selector: 'line',
                tagName: 'path'
            }
        ]
    }
);

joint.shapes.istar.NeededByLink = joint.dia.Link.define('NeededByLink',
    {
        attrs: {
            line: {
                connection: true,
                fill: 'none',
                stroke: 'black',
                'stroke-width': 1,
                targetMarker: {
                    d:    'm 1, 0         a 4,4 0 1,0 8,0         a 4,4 0 1,0 -8,0',
                    // d: 'M cx - r, cy   a r,r 0 1,0 (r * 2),0   a r,r 0 1,0 -(r * 2),0', from https://codepen.io/jakob-e/pen/bgBegJ
                    fill: 'black',
                    stroke: 'black',
                    type: 'path', //using path instead of circle to correctly position the circle
                }
                // targetMarker: {
                //     r: 4,
                //     fill: 'black',
                //     stroke: 'black',
                //     'type': 'circle',
                //     x: -10,
                //     y: 10
                // }
            },
            'connection-wrap': {
                connection: true,
                fill: 'none',
                stroke: 'transparent',
                'stroke-linecap': 'round',
                'stroke-width': 20
            }
        }
    },
    {
        markup: [
            {
                className: 'c-connection-wrap',
                selector: 'connection-wrap',
                tagName: 'path'
            },
            {
                selector: 'line',
                tagName: 'path'
            }
        ]
    }
);

joint.shapes.istar.ContributionLink = joint.dia.Link.define('ContributionLink',
    {
        attrs: {
            line: {
                connection: true,
                fill: 'none',
                stroke: 'black',
                'stroke-width': 1,
                targetMarker: {
                    'd': 'm 10,-6 l -10,6 10,6',
                    fill: 'none',
                    'stroke-width': 1.2,
                    'type': 'path',
                }
            },
            'connection-wrap': {
                connection: true,
                fill: 'none',
                stroke: 'transparent',
                'stroke-linecap': 'round',
                'stroke-width': 20
            },
            smooth: true
        },
        labels: [
            {
                position: 0.4,
                attrs: {
                    text: {
                        'font-family': 'sans-serif',
                        'font-size': 12,
                        'font-weight': 'bold'
                    },
                    rect: {
                        fill: 'rgb(242,242,242)',
                    }
                }
            }
        ],
        source: {selector: 'circle'},
        target: {selector: 'circle'}
    },
    {
        markup: [
            {
                className: 'c-connection-wrap',
                selector: 'connection-wrap',
                tagName: 'path'
            },
            {
                selector: 'line',
                tagName: 'path'
            }
        ]
    }
);

joint.shapes.istar.QualificationLink = joint.dia.Link.define('QualificationLink',
    {
        attrs: {
            line: {
                connection: true,
                fill: 'none',
                stroke: 'black',
                'stroke-dasharray': '10,5',
                'stroke-width': 1
            },
            'connection-wrap': {
                connection: true,
                fill: 'none',
                stroke: 'transparent',
                'stroke-linecap': 'round',
                'stroke-width': 20
            }
        }
    },
    {
        markup: [
            {
                className: 'c-connection-wrap',
                selector: 'connection-wrap',
                tagName: 'path'
            },
            {
                selector: 'line',
                tagName: 'path'
            }
        ]
    }
);

/*definition of globals to prevent undue JSHint warnings*/
/*globals joint:false */

/*!
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 *
 * If you are going to edit the code, always work from the source-code available for download at
 * https://github.com/jhcp/pistar
 */

/* this function defines additional information that can be used in the UI, regarding elements and links of the metamodel
*
*  you can define the following attributes for elements (containers and nodes).
*  If these are not defined, default values based on the node name
*  are adopted.
*    - label (label for its add element button)
*    - tooltip (appears when the add element button is hovered)
*    - statusText (instructions that appear when the add element button is pressed)
*
* */
ui.setupMetamodelUI = function () {
    'use strict';

    if (istar.metamodel.nodes.Goal) {
        istar.metamodel.nodes.Goal.buttonStatusText = 'Adding <b>Goal</b>: Click on an actor/role/agent to add a Goal';
    }
    if (istar.metamodel.nodes.Quality) {
        istar.metamodel.nodes.Quality.buttonStatusText = 'Adding <b>Quality</b>: Click on an actor/role/agent to add a Quality';
    }
    if (istar.metamodel.nodes.Task) {
        istar.metamodel.nodes.Task.buttonStatusText = 'Adding <b>Task</b>: Click on an actor/role/agent to add a Task';
    }
    if (istar.metamodel.nodes.Resource) {
        istar.metamodel.nodes.Resource.buttonStatusText = 'Adding <b>Resource</b>: Click on an actor/role/agent to add a Resource';
    }

    if (istar.metamodel.containerLinks.IsALink) {
        istar.metamodel.containerLinks.IsALink.buttonLabel = 'Is A Link';
        istar.metamodel.containerLinks.IsALink.buttonTooltip = 'Add an Is-A link between an Actor and another Actor, or between a Role and another Role';
        istar.metamodel.containerLinks.IsALink.buttonStatusText = 'Adding <b>Is A</b> link: Click on the sub-actor/sub-role and then on the super-actor/super-role';
    }
    if (istar.metamodel.containerLinks.ParticipatesInLink) {
        istar.metamodel.containerLinks.ParticipatesInLink.buttonLabel = 'Participates-In link';
        istar.metamodel.containerLinks.ParticipatesInLink.buttonTooltip = 'Add a Participates-In link between any Actors, Roles, or Agents';
        istar.metamodel.containerLinks.ParticipatesInLink.buttonStatusText = 'Adding <b>Participates-In</b> link: click on the source, and then on the target';
    }

    if (istar.metamodel.nodeLinks.AndRefinementLink) {
        istar.metamodel.nodeLinks.AndRefinementLink.buttonLabel = 'And';
        istar.metamodel.nodeLinks.AndRefinementLink.buttonTooltip = 'Add And-Refinement link';
        istar.metamodel.nodeLinks.AndRefinementLink.buttonStatusText = 'Adding <b>And-Refinement</b> link: click first on the child, and then on the parent. It can only be applied to goals or tasks.';
    }
    if (istar.metamodel.nodeLinks.OrRefinementLink) {
        istar.metamodel.nodeLinks.OrRefinementLink.buttonLabel = 'Or';
        istar.metamodel.nodeLinks.OrRefinementLink.buttonTooltip = 'Add Or-Refinement link';
        istar.metamodel.nodeLinks.OrRefinementLink.buttonStatusText = 'Adding <b>Or-Refinement</b> link: click first on the child, and then on the parent. It can only be applied to goals or tasks.';
    }
    if (istar.metamodel.nodeLinks.NeededByLink) {
        istar.metamodel.nodeLinks.NeededByLink.buttonLabel = 'Needed-By';
        istar.metamodel.nodeLinks.NeededByLink.buttonTooltip = 'Add Needed-By link';
        istar.metamodel.nodeLinks.NeededByLink.buttonStatusText = 'Adding <b>Needed-By</b> link: click on the Resource that is needed and on the Task that needs it.';
    }
    if (istar.metamodel.nodeLinks.QualificationLink) {
        istar.metamodel.nodeLinks.QualificationLink.buttonLabel = 'Qualification';
        istar.metamodel.nodeLinks.QualificationLink.buttonTooltip = 'Add Qualification link';
        istar.metamodel.nodeLinks.QualificationLink.buttonStatusText = 'Adding <b>Qualification</b> link: click on the Quality and on the element it qualifies (Goal, Task or Resource).';
    }

    if (istar.metamodel.nodeLinks.ContributionLink) {
        istar.metamodel.nodeLinks.ContributionLink.buttonLabel = ['Contribution', 'Make (++)', 'Help (+)', 'Hurt (-)', 'Break (--)'];
        istar.metamodel.nodeLinks.ContributionLink.buttonTooltip = [
            'Add Contribution link (Make, Help, Hurt or Break',
            'Add a Make (++) Contribution link',
            'Add a Help (+) Contribution link',
            'Add a Hurt (-) Contribution link',
            'Add a Break (--) Contribution link'];
        istar.metamodel.nodeLinks.ContributionLink.buttonStatusText = [
            '',
            'Adding <b>Make (++) Contribution</b> link: click first on an element and then on the Quality it contributes to',
            'Adding <b>Help (+) Contribution</b> link: click first on an element and then on the Quality it contributes to',
            'Adding <b>Hurt (-) Contribution</b> link: click first on an element and then on the Quality it contributes to',
            'Adding <b>Break (--) Contribution</b> link: click first on an element and then on the Quality it contributes to'];
    }
}

/*definition of globals to prevent undue JSHint warnings*/
/*globals istar:false, ui:false */


istar.layout = {
    /**
     * Using auto-layout method to get position results and update the diagram
     */
    updateLayout: function () {
        const [width, height] = [istar.paper.getArea().width, istar.paper.getArea().height]
        const {current, nodes, links} = this.layout()

        // straighten-links
        _.forEach(istar.getLinks(), function (link) {
            if (!link.isNodeLink()) {
                link.vertices([]);
            }
        });

        // Get the origin point position, rather than center position
        const findX = function (item, leftMost = 0) {
            return item.x - item.width * 0.5 - leftMost
        }
        const findY = function (item, topMost = 0) {
            return item.y - item.height * 0.5 - topMost
        }

        // Bleeding Area
        let leftMost = (nodes.length !== 0) ? nodes[0].x : 0
        let topMost = (nodes.length !== 0) ? nodes[0].y : 0

        _.forEach(nodes, function (item) {
            if (findX(item, leftMost) < 0)
                leftMost = findX(item)
            if (findY(item, topMost) < 0)
                topMost = findY(item)
        })
        // radius bleed
        leftMost = leftMost - 50
        topMost = topMost - 50

        // Update the position
        _.forEach(nodes, function (item) {
            let elem = _.find(istar.getElements(), {id: item.id})

            if (elem) {
                // Get the position delta
                let dx = findX(item, leftMost) - elem.position().x,
                  dy = findY(item, topMost) - elem.position().y
                elem.position(findX(item, leftMost), findY(item, topMost))
                elem.set('originalPosition', elem.get('position'))
                // Apply the delta to its children
                if (elem.isKindOfActor()) {
                    // Update the position of the nodes within an actor
                    _.forEach(_.filter(elem.getEmbeddedCells(),
                      item => item.isElement()), child => {
                        let cx = child.position().x,
                          cy = child.position().y
                        child.position(cx + dx, cy + dy)
                    })
                    // Update the position of the vertices of links within an actor
                    _.forEach(_.filter(elem.getEmbeddedCells(),
                      item => item.isLink()), child => {
                        if (child.vertices().length > 0) {
                            let updatedVertices = [];

                            _.forEach(child.vertices(), vertex => {
                                updatedVertices.push({x: vertex.x + dx, y: vertex.y + dy});
                            })

                            child.vertices(updatedVertices);
                        }
                    });
                    elem.updateBoundary()
                }
            }
        })

        // Fit contents to the paper
        istar.paper.fitToContent(null, null, null,
          {minWidth: width, minHeight: height})

    },


    /**
     * Main entrypoint for layout handling
     * @param data {object | null} - a piStar-format JSON
     * @param options {object | null} - the options collection
     *
     * @param options.mode {string} - layout return data format, usually 'generator', 'array', 'first' or 'last'
     * @param options.tickPerEpoch {number} - ticks per iteration epoch
     * @param options.assureEpoch {number} - assure at least iterate epochs
     * @param options.stopWhenStable {boolean} - do not stop until stable (alpha value under a threshold)
     *
     * @return { (function(): Generator<{current: number, nodes: [], links: []}, void, *>) |
     *          {current: number, nodes: [], links: []} | {current: number, nodes: [], links: []}[] }
     */
    layout: function (data = null, options = null) {
        const mode = options?.mode ?? 'last'
        const tick = options?.tickPerEpoch ?? 50
        const epoch = options?.assureEpoch ?? 20
        const stable = options?.stopWhenStable ?? true

        const jsonData = this.convert(data)

        const {
            simulation,
            nodes,
            links
        } = this.force(_.cloneDeep(jsonData.graph.node), _.cloneDeep(jsonData.graph.link))

        let current = 0

        /**
         * Simulate an epoch
         * @param tick {number} - ticks per iteration epoch
         */
        function simulationEpoch(tick) {
            for (let i = 0; i < tick; i++) {
                simulation.tick()
            }
        }

        /**
         * Check if the iteration keep going
         * @param current {number} - current iteration epoch
         * @param atLeastEpoch {number} - assure at least iterate epochs
         * @param needStable {boolean} - do not stop until stable (alpha value under a threshold)
         * @param simulation {object} - d3-force simulation object
         * @return {boolean} - keep iterate
         */
        function keep(current, atLeastEpoch, needStable, simulation) {
            return ((current < atLeastEpoch) || (needStable && simulation.alpha() >= 0.001))
        }

        /**
         * A Generator factory for output
         * @return { Generator<{current: number, nodes: [], links: []}, void, *> }
         */
        function* generator() {
            while (keep(current, epoch, stable, simulation)) {
                simulationEpoch(tick)
                current += 1
                yield {current, nodes, links}
            }
        }

        /**
         * Gather the position data for output
         * @param mode {string} - 'array', 'first' or 'last'
         * @return { {current: number, nodes: [], links: []} | [] }
         */
        function generalOutput(mode) {
            if (mode === 'first') {
                return {current: 0, nodes, links}
            }
            const results = []
            while (keep(current, epoch, stable, simulation)) {
                simulationEpoch(tick)
                current += 1
                if (mode === 'array') {
                    results.push(_.cloneDeep({current, nodes, links}))
                }
            }
            if (mode === 'array') {
                return results
            } else if (mode === 'last') {
                return _.cloneDeep({current, nodes, links})
            }
        }

        if (mode === 'generator') {
            return generator
        } else if (mode === 'array' || mode === 'last' || mode === 'first') {
            return generalOutput(mode)
        } else {
            throw Error('Illegal result format ' + mode)
        }
    },


    /**
     * Use d3-force to implement the force layout algorithm
     * @param nodes {[object]} - an object with ordered node list
     * @param links {[object]} - an object with ordered link list
     * @param radius {number} - force value, 50 by default
     * @return { {simulation: object, nodes: [], links: []} }
     */
    force: function (nodes, links, radius = 50) {
        const [width, height] = [istar.paper.getArea().width, istar.paper.getArea().height]

        const simulation = d3.forceSimulation(nodes)
          .force('link', d3.forceLink(links).id(d => d.id).distance(l => (l.source.r + l.target.r)))
          .force('charge', d3.forceManyBody()
            .distanceMin(radius * 2)
            .distanceMax(radius * 10)
            .strength(-radius * 20))
          .force('radius', d3.forceCollide()
            .radius(d => d.r * 1.2))
          .force('center', d3.forceCenter(width / 2, height / 2))
          .stop()

        return {simulation, nodes, links}
    },

    dictionary: {
        nodeName: {
            'istar.Actor': 'actor',
            'istar.Agent': 'agent',
            'istar.Resource': 'resource',
            'istar.Quality': 'softgoal',
            'istar.Role': 'role',
            'istar.Task': 'task',
            'istar.Goal': 'goal'
        },
        nodeSize: {
            // from shape.js
            actor: [80, 80],
            agent: [80, 80],
            role: [80, 80],
            goal: [90, 35],
            resource: [90, 35],
            task: [95, 36],
            softgoal: [90, 55]
        },
        linkName: {
            'istar.IsALink': 'ISA',
            'istar.ParticipatesInLink': 'P',
            'istar.DependencyLink': 'd',
            'istar.AndRefinementLink': 'and-d',
            'istar.OrRefinementLink': 'or-d',
            'istar.ContributionLink': 'contribution'
        }
    },

    /**
     * Convert different format JSON into ordered nodes and links list.
     * @param data {object} - a piStar-format or d3-format JSON, depending on the value of options.mode
     * @returns { {width, graph: {node: [object], link: [object]}, height} }
     */
    convert: function (data) {
        data = _.cloneDeep(data ? data : JSON.parse(istar.fileManager.saveModel()))
        const graph = {node: [], link: []}

        /**
         * Push the content into container when valid
         * @param container
         * @param content
         */
        function insert(container, content) {
            if (content) {
                container.push(content)
            }
        }

        /**
         * Handle various element based on its type
         * @param obj {Object} - the source element item
         * @param type {String} - element type, usually 'link' or 'node'
         * @return { {r: number, name: string, x: number, y: number,
         *           id: string, type: string, width: number, height: number} |
         *         {name: string, id: string, type: string, source: string, target: string} |
         *         null }
         */
        function assign(obj, type) {
            if (type === 'link') {
                const id = obj.id
                const sid = reverse[obj.source]
                const tid = reverse[obj.target]

                if (!sid || !tid) {
                    throw Error('Cannot find source or target about ' + obj.id)
                }
                if (sid === tid) {
                    return null
                }

                let name = ''
                let desc = istar.layout.dictionary.linkName[obj.type]
                if (desc === undefined) {
                    throw Error('Illegal link name ' + obj.type + ' of ' + obj.id)
                }

                // According to https://www.cin.ufpe.br/~if716/arquivos20161/Overview-iStar-20-Language-Guide.pdf
                if (desc === 'P') {
                    desc = 'contribution'
                    const sty = _.find(graph.node, {id: sid}).type
                    const tty = _.find(graph.node, {id: tid}).type
                    if (sty === tty) {
                        name = 'Is part of'
                    } else {
                        name = 'Plays'
                    }
                }
                return {id: id, type: desc, name: name, source: sid, target: tid}
            } else if (type === 'node') {
                const desc = istar.layout.dictionary.nodeName[obj.type]
                if (desc === undefined) {
                    throw Error('Illegal node name ' + obj.type + ' of ' + obj.id)
                }
                const id = obj.id
                const name = obj.text
                const x = obj.x
                const y = obj.y

                const size = _.find(istar.graph.getElements(), {id: id}).get("size")
                if (!size)
                    throw Error('Illegal node size ' + obj.id)
                let [width, height] = [size.width, size.height]

                reverse[id] = id
                if (obj.nodes) {
                    _.forEach(obj.nodes, item => (reverse[item.id] = id))
                }
                if (data.display && data.display[id] && data.display[id].collapsed) {
                    const normalSize = istar.layout.dictionary.nodeSize[desc]
                    if (normalSize) {
                        width = normalSize[0]
                        height = normalSize[1]
                    }
                }

                const r = (height > width ? height : width) / 2

                return {
                    id: id,
                    name: name,
                    type: desc,
                    x: x,
                    y: y,
                    r: r,
                    width: width,
                    height: height
                }
            } else {
                throw Error('Unexpected assign procedure ' + type)
            }
        }

        const reverse = {}
        const width = data.diagram.width
        const height = data.diagram.height

        for (const d in data.dependencies) {
            insert(graph.node, assign(data.dependencies[d], 'node'))
        }
        for (const a in data.actors) {
            insert(graph.node, assign(data.actors[a], 'node'))
        }
        for (const o in data.orphans) {
            insert(graph.node, assign(data.orphans[o], 'node'))
        }
        for (const l in data.links) {
            insert(graph.link, assign(data.links[l], 'link'))
        }

        return {graph: graph, width: width, height: height}
    }
}

