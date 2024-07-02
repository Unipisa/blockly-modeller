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
            //access the SVG element and serialize it
            $('svg').attr('width', istar.paper.getArea().width);
            $('svg').attr('height', istar.paper.getArea().height);
            // console.log(document.getElementById(paperId).childNodes[2]);
            // var text = (new XMLSerializer()).serializeToString(document.getElementById(paperId).childNodes[2]);
            var text = (new XMLSerializer()).serializeToString(paper.$('svg').get(0));//.childNodes[2]);
            $('svg').attr('width', '100%');
            $('svg').attr('height', '100%');

            return "data:image/svg+xml," + encodeURIComponent(text);
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
                console.log(stringifiedModel);

                return stringifiedModel;
            }
        },
        loadModel: function (inputRaw) {
            if (inputRaw) {
                invalidMessages = [];
                istar.clearModel();

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
        },
        loadsvg: function () {
            var data = '{
                "actors": [
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
                  },
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
                    "id": "536ae298-2a07-4178-ab8e-e069046f9f9d",
                    "type": "istar.DependencyLink",
                    "source": "7af8ec40-8f4f-4904-8130-f33157427ca9",
                    "target": "339417b8-0430-4ceb-be12-d6cf7b440a35"
                  },
                  {
                    "id": "d8a3db62-397f-4ffe-bcfa-5ba92dfcaba0",
                    "type": "istar.DependencyLink",
                    "source": "3e732026-ae4c-4038-acb7-bd9f036c5f73",
                    "target": "7af8ec40-8f4f-4904-8130-f33157427ca9"
                  },
                  {
                    "id": "59440443-f117-43b1-a345-1e30735be404",
                    "type": "istar.DependencyLink",
                    "source": "76d9cfde-d464-4203-907a-af97c32f7501",
                    "target": "9250b018-fb16-4b82-b7bf-5f5589b6b259"
                  },
                  {
                    "id": "ef9948ab-cc15-4322-8cbd-a05bea0a6358",
                    "type": "istar.DependencyLink",
                    "source": "8cc94931-99dd-441e-bf97-9b08c03ae576",
                    "target": "76d9cfde-d464-4203-907a-af97c32f7501"
                  },
                  {
                    "id": "d27dafd6-ca6f-446d-8d90-fa42e763e0c6",
                    "type": "istar.DependencyLink",
                    "source": "4d80aa30-a36b-4737-9299-056aa7748073",
                    "target": "825269c5-af60-4db1-b55c-316987dcb880"
                  },
                  {
                    "id": "6f4d51a3-98aa-4c38-bdb3-43562a8d9547",
                    "type": "istar.DependencyLink",
                    "source": "ab3313df-175f-4b2b-9486-c0915a3d1cd4",
                    "target": "4d80aa30-a36b-4737-9299-056aa7748073"
                  },
                  {
                    "id": "b3f353b6-46e2-4568-a649-2b8cbe07da99",
                    "type": "istar.ContributionLink",
                    "source": "8d716a61-1ca4-44f4-934c-26166ea44d11",
                    "target": "e159ce92-b29d-4fdc-a533-ee1e904f9f57",
                    "label": "help"
                  },
                  {
                    "id": "0a1280e4-bf53-4553-96fc-680b69dfa349",
                    "type": "istar.ContributionLink",
                    "source": "3c4eacd1-cc6b-4c1e-8a9e-2260229d831f",
                    "target": "339417b8-0430-4ceb-be12-d6cf7b440a35",
                    "label": "help"
                  },
                  {
                    "id": "8a7e151d-2639-43f6-b6a8-7b2bd3bb77d9",
                    "type": "istar.ContributionLink",
                    "source": "2904a233-4620-461c-978a-0058a4d3bdc4",
                    "target": "339417b8-0430-4ceb-be12-d6cf7b440a35",
                    "label": "make"
                  },
                  {
                    "id": "8fce3d90-d392-4410-ae03-b805e5543914",
                    "type": "istar.QualificationLink",
                    "source": "e159ce92-b29d-4fdc-a533-ee1e904f9f57",
                    "target": "71c7aeb6-fb99-40a1-bcd1-5a29e5b45252"
                  },
                  {
                    "id": "3aa7b88a-f561-498d-9910-c9e4d22a0b0d",
                    "type": "istar.OrRefinementLink",
                    "source": "f9035e8c-0294-44a8-a93e-85a349d2f21a",
                    "target": "825269c5-af60-4db1-b55c-316987dcb880"
                  },
                  {
                    "id": "7785223d-b88c-4f54-9f59-c76b33901d48",
                    "type": "istar.OrRefinementLink",
                    "source": "c9d1ae28-8b77-4643-a7ac-7e70903dadb7",
                    "target": "825269c5-af60-4db1-b55c-316987dcb880"
                  },
                  {
                    "id": "ad173d65-a054-43e7-b980-915f36e2ea2f",
                    "type": "istar.OrRefinementLink",
                    "source": "d2d100ae-ba57-424b-864c-dc3ec69cb2fb",
                    "target": "825269c5-af60-4db1-b55c-316987dcb880"
                  },
                  {
                    "id": "891fbd71-2b7c-4ce8-b38a-e89167ad93d7",
                    "type": "istar.OrRefinementLink",
                    "source": "8cc94931-99dd-441e-bf97-9b08c03ae576",
                    "target": "8d716a61-1ca4-44f4-934c-26166ea44d11"
                  },
                  {
                    "id": "053cbb6d-0940-44df-9d5f-57f525459ad8",
                    "type": "istar.OrRefinementLink",
                    "source": "ab3313df-175f-4b2b-9486-c0915a3d1cd4",
                    "target": "8d716a61-1ca4-44f4-934c-26166ea44d11"
                  },
                  {
                    "id": "4b4cee26-bd28-41f6-9da1-3409d3f2c3a5",
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
                  "536ae298-2a07-4178-ab8e-e069046f9f9d": {
                    "vertices": [
                      {
                        "x": 546,
                        "y": 195
                      }
                    ]
                  },
                  "d8a3db62-397f-4ffe-bcfa-5ba92dfcaba0": {
                    "vertices": [
                      {
                        "x": 348,
                        "y": 214
                      }
                    ]
                  },
                  "59440443-f117-43b1-a345-1e30735be404": {
                    "vertices": [
                      {
                        "x": 345,
                        "y": 481
                      }
                    ]
                  },
                  "ef9948ab-cc15-4322-8cbd-a05bea0a6358": {
                    "vertices": [
                      {
                        "x": 95,
                        "y": 398
                      }
                    ]
                  },
                  "d27dafd6-ca6f-446d-8d90-fa42e763e0c6": {
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
                  "6f4d51a3-98aa-4c38-bdb3-43562a8d9547": {
                    "vertices": [
                      {
                        "x": 229,
                        "y": 433
                      }
                    ]
                  },
                  "0a1280e4-bf53-4553-96fc-680b69dfa349": {
                    "vertices": [
                      {
                        "x": 728,
                        "y": 172
                      }
                    ]
                  },
                  "8a7e151d-2639-43f6-b6a8-7b2bd3bb77d9": {
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
                "saveDate": "Mon, 04 Mar 2024 12:55:32 GMT",
                "diagram": {
                  "width": 1000,
                  "height": 700,
                  "name": "Welcome Model",
                  "customProperties": {
                    "Description": "Welcome to the piStar tool version 2.1.0, released on November, 2021! This model describes some of the recent improvements in the tool. Click on the purple elements for further info.\n\nFor help using this tool, please check the Help menu above"
                  }
                }
              }';
            ui.resetCellDisplayStates();
                        istar.fileManager.loadModel(data);//do the actual loading
                        ui.selectPaper();//select the model (as a whole)
        }
    };
}();
