import BPMNModdle from 'bpmn-moddle';
import { assign, map, pick, isFunction } from 'min-dash';

function isConnection(element) {
  return !!element.sourceRef;
}

function isBoundaryEvent(element) {
  return !!element.attachedToRef;
}

class Grid {
  constructor() {
    this.grid = [];
  }

  add(element, position) {
    if (!position) {
      this._addStart(element);
      return;
    }

    const [ row, col ] = position;
    if (!row && !col) {
      this._addStart(element);
    }

    if (!this.grid[row]) {
      this.grid[row] = [];
    }

    if (this.grid[row][col]) {
      throw new Error('Grid is occupied please ensure the place you insert at is not occupied');
    }

    this.grid[row][col] = element;
  }

  createRow(afterIndex) {
    if (!afterIndex) {
      this.grid.push([]);
    }

    this.grid.splice(afterIndex + 1, 0, []);
  }

  _addStart(element) {
    this.grid.push([ element ]);
  }

  addAfter(element, newElement) {
    if (!element) {
      this._addStart(newElement);
    }

    const [ row, col ] = this.find(element);
    this.grid[row].splice(col + 1, 0, newElement);
  }

  addBelow(element, newElement) {
    if (!element) {
      this._addStart(newElement);
    }

    const [ row, col ] = this.find(element);

    // We are at the bottom of the current grid - add empty row below
    if (!this.grid[row + 1]) {
      this.grid[row + 1] = [];
    }

    // The element below is already occupied - insert new row
    if (this.grid[row + 1][col]) {
      this.grid.splice(row + 1, 0, []);
    }

    if (this.grid[row + 1][col]) {
      throw new Error('Grid is occupied and we could not find a place - this should not happen');
    }

    this.grid[row + 1][col] = newElement;
  }

  find(element) {
    let row, col;
    row = this.grid.findIndex((row) => {
      col = row.findIndex((el) => {
        return el === element;
      });

      return col !== -1;
    });

    return [ row, col ];
  }

  get(row, col) {
    return (this.grid[row] || [])[col];
  }

  getElementsInRange({ row: startRow, col: startCol }, { row: endRow, col: endCol }) {
    const elements = [];

    if (startRow > endRow) {
      [ startRow, endRow ] = [ endRow, startRow ];
    }

    if (startCol > endCol) {
      [ startCol, endCol ] = [ endCol, startCol ];
    }

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const element = this.get(row, col);

        if (element) {
          elements.push(element);
        }
      }
    }

    return elements;
  }

  elementsByPosition() {
    const elements = [];

    this.grid.forEach((row, rowIndex) => {
      row.forEach((element, colIndex) => {
        if (!element) {
          return;
        }
        elements.push({
          element,
          row: rowIndex,
          col: colIndex
        });
      });
    });

    return elements;
  }
}

class DiFactory {
  constructor(moddle) {
    this.moddle = moddle;
  }

  create(type, attrs) {
    return this.moddle.create(type, attrs || {});
  }

  createDiBounds(bounds) {
    return this.create('dc:Bounds', bounds);
  }

  createDiLabel() {
    return this.create('bpmndi:BPMNLabel', {
      bounds: this.createDiBounds()
    });
  }

  createDiShape(semantic, bounds, attrs) {
    return this.create('bpmndi:BPMNShape', assign({
      bpmnElement: semantic,
      bounds: this.createDiBounds(bounds)
    }, attrs));
  }

  createDiWaypoints(waypoints) {
    var self = this;

    return map(waypoints, function(pos) {
      return self.createDiWaypoint(pos);
    });
  }

  createDiWaypoint(point) {
    return this.create('dc:Point', pick(point, [ 'x', 'y' ]));
  }

  createDiEdge(semantic, waypoints, attrs) {
    return this.create('bpmndi:BPMNEdge', assign({
      bpmnElement: semantic,
      waypoint: this.createDiWaypoints(waypoints)
    }, attrs));
  }

  createDiPlane(attrs) {
    return this.create('bpmndi:BPMNPlane', attrs);
  }

  createDiDiagram(attrs) {
    return this.create('bpmndi:BPMNDiagram', attrs);
  }
}

function getDefaultSize(element) {
  if (is(element, 'bpmn:SubProcess')) {
    return { width: 100, height: 80 };
  }

  if (is(element, 'bpmn:Task')) {
    return { width: 100, height: 80 };
  }

  if (is(element, 'bpmn:Gateway')) {
    return { width: 50, height: 50 };
  }

  if (is(element, 'bpmn:Event')) {
    return { width: 36, height: 36 };
  }

  if (is(element, 'bpmn:Participant')) {
    return { width: 400, height: 100 };
  }

  if (is(element, 'bpmn:Lane')) {
    return { width: 400, height: 100 };
  }

  if (is(element, 'bpmn:DataObjectReference')) {
    return { width: 36, height: 50 };
  }

  if (is(element, 'bpmn:DataStoreReference')) {
    return { width: 50, height: 50 };
  }

  if (is(element, 'bpmn:TextAnnotation')) {
    return { width: 100, height: 30 };
  }

  return { width: 100, height: 80 };
}

function is(element, type) {
  return element.$instanceOf(type);
}

const DEFAULT_CELL_WIDTH = 150;
const DEFAULT_CELL_HEIGHT = 140;

function getMid(bounds) {
  return {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2
  };
}

function getDockingPoint(point, rectangle, dockingDirection = 'r', targetOrientation = 'top-left') {

  // ensure we end up with a specific docking direction
  // based on the targetOrientation, if <h|v> is being passed

  if (dockingDirection === 'h') {
    dockingDirection = /left/.test(targetOrientation) ? 'l' : 'r';
  }

  if (dockingDirection === 'v') {
    dockingDirection = /top/.test(targetOrientation) ? 't' : 'b';
  }

  if (dockingDirection === 't') {
    return { original: point, x: point.x, y: rectangle.y };
  }

  if (dockingDirection === 'r') {
    return { original: point, x: rectangle.x + rectangle.width, y: point.y };
  }

  if (dockingDirection === 'b') {
    return { original: point, x: point.x, y: rectangle.y + rectangle.height };
  }

  if (dockingDirection === 'l') {
    return { original: point, x: rectangle.x, y: point.y };
  }

  throw new Error('unexpected dockingDirection: <' + dockingDirection + '>');
}

/**
     * Modified Manhattan layout: Uses space between grid coloumns to route connections
     * if direct connection is not possible.
     * @param {*} source
     * @param {*} target
     * @returns waypoints
     */
function connectElements(source, target, layoutGrid) {
  const sourceDi = source.di;
  const targetDi = target.di;

  const sourceBounds = sourceDi.get('bounds');
  const targetBounds = targetDi.get('bounds');

  const sourceMid = getMid(sourceBounds);
  const targetMid = getMid(targetBounds);

  const dX = target.gridPosition.col - source.gridPosition.col;
  const dY = target.gridPosition.row - source.gridPosition.row;

  const dockingSource = `${(dY > 0 ? 'bottom' : 'top')}-${dX > 0 ? 'right' : 'left'}`;
  const dockingTarget = `${(dY > 0 ? 'top' : 'bottom')}-${dX > 0 ? 'left' : 'right'}`;

  // Source === Target ==> Build loop
  if (dX === 0 && dY === 0) {
    const { x, y } = coordinatesToPosition(source.gridPosition.row, source.gridPosition.col);
    return [
      getDockingPoint(sourceMid, sourceBounds, 'r', dockingSource),
      { x: x + DEFAULT_CELL_WIDTH, y: sourceMid.y },
      { x: x + DEFAULT_CELL_WIDTH, y: y },
      { x: targetMid.x, y: y },
      getDockingPoint(targetMid, targetBounds, 't', dockingTarget)
    ];
  }

  // connect horizontally
  if (dY === 0) {
    if (isDirectPathBlocked(source, target, layoutGrid)) {

      // Route on top
      return [
        getDockingPoint(sourceMid, sourceBounds, 't'),
        { x: sourceMid.x, y: sourceMid.y - DEFAULT_CELL_HEIGHT / 2 },
        { x: targetMid.x, y: sourceMid.y - DEFAULT_CELL_HEIGHT / 2 },
        getDockingPoint(targetMid, targetBounds, 't')
      ];
    } else {

      // if space is clear, connect directly
      return [
        getDockingPoint(sourceMid, sourceBounds, 'h', dockingSource),
        getDockingPoint(targetMid, targetBounds, 'h', dockingTarget)
      ];
    }
  }

  // connect vertically
  if (dX === 0) {
    if (isDirectPathBlocked(source, target, layoutGrid)) {

      // Route parallel
      const yOffset = -Math.sign(dY) * DEFAULT_CELL_HEIGHT / 2;
      return [
        getDockingPoint(sourceMid, sourceBounds, 'r'),
        { x: sourceMid.x + DEFAULT_CELL_WIDTH / 2, y: sourceMid.y }, // out right
        { x: targetMid.x + DEFAULT_CELL_WIDTH / 2, y: targetMid.y + yOffset },
        { x: targetMid.x, y: targetMid.y + yOffset },
        getDockingPoint(targetMid, targetBounds, Math.sign(yOffset) > 0 ? 'b' : 't')
      ];
    } else {

      // if space is clear, connect directly
      return [ getDockingPoint(sourceMid, sourceBounds, 'v', dockingSource),
        getDockingPoint(targetMid, targetBounds, 'v', dockingTarget)
      ];
    }
  }

  const directManhattan = directManhattanConnect(source, target, layoutGrid);

  if (directManhattan) {
    const startPoint = getDockingPoint(sourceMid, sourceBounds, directManhattan[0], dockingSource);
    const endPoint = getDockingPoint(targetMid, targetBounds, directManhattan[1], dockingTarget);

    const midPoint = directManhattan[0] === 'h' ? { x: endPoint.x, y: startPoint.y } : { x: startPoint.x, y: endPoint.y };

    return [
      startPoint,
      midPoint,
      endPoint
    ];
  }
  const yOffset = -Math.sign(dY) * DEFAULT_CELL_HEIGHT / 2;

  return [
    getDockingPoint(sourceMid, sourceBounds, 'r', dockingSource),
    { x: sourceMid.x + DEFAULT_CELL_WIDTH / 2, y: sourceMid.y }, // out right
    { x: sourceMid.x + DEFAULT_CELL_WIDTH / 2, y: targetMid.y + yOffset }, // to target row
    { x: targetMid.x - DEFAULT_CELL_WIDTH / 2, y: targetMid.y + yOffset }, // to target column
    { x: targetMid.x - DEFAULT_CELL_WIDTH / 2, y: targetMid.y }, // to mid
    getDockingPoint(targetMid, targetBounds, 'l', dockingTarget)
  ];
}

// helpers /////
function coordinatesToPosition(row, col) {
  return {
    width: DEFAULT_CELL_WIDTH,
    height: DEFAULT_CELL_HEIGHT,
    x: col * DEFAULT_CELL_WIDTH,
    y: row * DEFAULT_CELL_HEIGHT
  };
}

function getBounds(element, row, col, attachedTo) {
  const { width, height } = getDefaultSize(element);

  // Center in cell
  if (!attachedTo) {
    return {
      width, height,
      x: (col * DEFAULT_CELL_WIDTH) + (DEFAULT_CELL_WIDTH - width) / 2,
      y: row * DEFAULT_CELL_HEIGHT + (DEFAULT_CELL_HEIGHT - height) / 2
    };
  }

  const hostBounds = getBounds(attachedTo, row, col);

  return {
    width, height,
    x: Math.round(hostBounds.x + hostBounds.width / 2 - width / 2),
    y: Math.round(hostBounds.y + hostBounds.height - height / 2)
  };
}

function isDirectPathBlocked(source, target, layoutGrid) {
  const { row: sourceRow, col: sourceCol } = source.gridPosition;
  const { row: targetRow, col: targetCol } = target.gridPosition;

  const dX = targetCol - sourceCol;
  const dY = targetRow - sourceRow;

  let totalElements = 0;

  if (dX) {
    totalElements += layoutGrid.getElementsInRange({ row: sourceRow, col: sourceCol }, { row: sourceRow, col: targetCol }).length;
  }

  if (dY) {
    totalElements += layoutGrid.getElementsInRange({ row: sourceRow, col: targetCol }, { row: targetRow, col: targetCol }).length;
  }

  return totalElements > 2;
}

function directManhattanConnect(source, target, layoutGrid) {
  const { row: sourceRow, col: sourceCol } = source.gridPosition;
  const { row: targetRow, col: targetCol } = target.gridPosition;

  const dX = targetCol - sourceCol;
  const dY = targetRow - sourceRow;

  // Only directly connect left-to-right flow
  if (!(dX > 0 && dY !== 0)) {
    return;
  }

  // If below, go down then horizontal
  if (dY > 0) {
    let totalElements = 0;
    const bendPoint = { row: targetRow, col: sourceCol };
    totalElements += layoutGrid.getElementsInRange({ row: sourceRow, col: sourceCol }, bendPoint).length;
    totalElements += layoutGrid.getElementsInRange(bendPoint, { row: targetRow, col: targetCol }).length;

    return totalElements > 2 ? false : [ 'v', 'h' ];
  } else {

    // If above, go horizontal than vertical
    let totalElements = 0;
    const bendPoint = { row: sourceRow, col: targetCol };

    totalElements += layoutGrid.getElementsInRange({ row: sourceRow, col: sourceCol }, bendPoint).length;
    totalElements += layoutGrid.getElementsInRange(bendPoint, { row: targetRow, col: targetCol }).length;

    return totalElements > 2 ? false : [ 'h', 'v' ];
  }
}

var attacherHandler = {
  'addToGrid': ({ element, grid, visited }) => {
    const nextElements = [];

    const attachedOutgoing = (element.attachers || [])
      .map(att => att.outgoing.reverse())
      .flat()
      .map(out => out.targetRef);

    // handle boundary events
    attachedOutgoing.forEach((nextElement, index, arr) => {
      if (visited.has(nextElement)) {
        return;
      }

      // Add below and to the right of the element
      insertIntoGrid(nextElement, element, grid);
      nextElements.push(nextElement);
    });

    return nextElements;
  },

  'createElementDi': ({ element, row, col, diFactory }) => {
    const hostBounds = getBounds(element, row, col);

    const DIs = [];
    (element.attachers || []).forEach((att, i, arr) => {
      att.gridPosition = { row, col };
      const bounds = getBounds(att, row, col, element);

      // distribute along lower edge
      bounds.x = hostBounds.x + (i + 1) * (hostBounds.width / (arr.length + 1)) - bounds.width / 2;

      const attacherDi = diFactory.createDiShape(att, bounds, {
        id: att.id + '_di'
      });
      att.di = attacherDi;
      att.gridPosition = { row, col };

      DIs.push(attacherDi);
    });

    return DIs;
  },

  'createConnectionDi': ({ element, row, col, layoutGrid, diFactory }) => {
    const attachers = element.attachers || [];

    return attachers.flatMap(att => {
      const outgoing = att.outgoing || [];

      return outgoing.map(out => {
        const target = out.targetRef;
        const waypoints = connectElements(att, target, layoutGrid);

        // Correct waypoints if they don't automatically attach to the bottom
        ensureExitBottom(att, waypoints, [ row, col ]);

        const connectionDi = diFactory.createDiEdge(out, waypoints, {
          id: out.id + '_di'
        });

        return connectionDi;
      });
    });
  }
};


function insertIntoGrid(newElement, host, grid) {
  const [ row, col ] = grid.find(host);

  // Grid is occupied
  if (grid.get(row + 1, col) || grid.get(row + 1, col + 1)) {
    grid.createRow(row);
  }

  // Host has element directly after, add space
  if (grid.get(row, col + 1)) {
    grid.addAfter(host, null);
  }

  grid.add(newElement, [ row + 1, col + 1 ]);
}

function ensureExitBottom(source, waypoints, [ row, col ]) {

  const sourceDi = source.di;
  const sourceBounds = sourceDi.get('bounds');
  const sourceMid = getMid(sourceBounds);

  const dockingPoint = getDockingPoint(sourceMid, sourceBounds, 'b');
  if (waypoints[0].x === dockingPoint.x && waypoints[0].y === dockingPoint.y) {
    return;
  }

  if (waypoints.length === 2) {
    const newStart = [
      dockingPoint,
      { x: dockingPoint.x, y: (row + 1) * DEFAULT_CELL_HEIGHT },
      { x: (col + 1) * DEFAULT_CELL_WIDTH, y: (row + 1) * DEFAULT_CELL_HEIGHT },
      { x: (col + 1) * DEFAULT_CELL_WIDTH, y: (row + 0.5) * DEFAULT_CELL_HEIGHT },
    ];

    waypoints.splice(0, 1, ...newStart);
    return;
  }

  // add waypoints to exit bottom and connect to existing path
  const newStart = [
    dockingPoint,
    { x: dockingPoint.x, y: (row + 1) * DEFAULT_CELL_HEIGHT },
    { x: waypoints[1].x, y: (row + 1) * DEFAULT_CELL_HEIGHT },
  ];

  waypoints.splice(0, 1, ...newStart);
  return;
}

var elementHandler = {
  'createElementDi': ({ element, row, col, diFactory }) => {

    const bounds = getBounds(element, row, col);

    const options = {
      id: element.id + '_di'
    };

    if (is(element, 'bpmn:ExclusiveGateway')) {
      options.isMarkerVisible = true;
    }

    const shapeDi = diFactory.createDiShape(element, bounds, options);
    element.di = shapeDi;
    element.gridPosition = { row, col };

    return shapeDi;
  }
};

var outgoingHandler = {
  'addToGrid': ({ element, grid, visited }) => {
    const nextElements = [];

    // Handle outgoing paths
    const outgoing = (element.outgoing || [])
      .map(out => out.targetRef)
      .filter(el => el);

    let previousElement = null;
    outgoing.forEach((nextElement, index, arr) => {
      if (visited.has(nextElement)) {
        return;
      }

      if (!previousElement) {
        grid.addAfter(element, nextElement);
      }
      else {
        grid.addBelow(arr[index - 1], nextElement);
      }

      // Is self-looping
      if (nextElement !== element) {
        previousElement = nextElement;
      }

      nextElements.unshift(nextElement);
      visited.add(nextElement);
    });

    return nextElements;
  },
  'createConnectionDi': ({ element, row, col, layoutGrid, diFactory }) => {
    const outgoing = element.outgoing || [];

    return outgoing.map(out => {
      const target = out.targetRef;
      const waypoints = connectElements(element, target, layoutGrid);

      const connectionDi = diFactory.createDiEdge(out, waypoints, {
        id: out.id + '_di'
      });

      return connectionDi;
    });

  }
};

const handlers = [ elementHandler, outgoingHandler, attacherHandler ];

class Layouter {
  constructor() {
    this.moddle = new BPMNModdle();
    this.diFactory = new DiFactory(this.moddle);
    this._handlers = handlers;
  }

  handle(operation, options) {
    return this._handlers
      .filter(handler => isFunction(handler[operation]))
      .map(handler => handler[operation](options));

  }

  async layoutProcess(xml) {
    const { rootElement } = await this.moddle.fromXML(xml);

    this.diagram = rootElement;

    const root = this.getProcess();

    this.cleanDi();
    this.handlePlane(root);

    return (await this.moddle.toXML(this.diagram, { format: true })).xml;
  }

  handlePlane(planeElement) {
    const layout = this.createGridLayout(planeElement);
    this.generateDi(planeElement, layout);
  }

  cleanDi() {
    this.diagram.diagrams = [];
  }

  createGridLayout(root) {
    const grid = new Grid();

    const flowElements = root.flowElements;

    const startingElements = flowElements.filter(el => {
      return !isConnection(el) && !isBoundaryEvent(el) && (!el.incoming || el.length === 0);
    });

    const boundaryEvents = flowElements.filter(el => isBoundaryEvent(el));
    boundaryEvents.forEach(boundaryEvent => {
      const attachedTask = boundaryEvent.attachedToRef;
      const attachers = attachedTask.attachers || [];
      attachers.push(boundaryEvent);
      attachedTask.attachers = attachers;
    });

    // Depth-first-search
    const stack = [ ...startingElements ];
    const visited = new Set();

    startingElements.forEach(el => {
      grid.add(el);
      visited.add(el);
    });

    while (stack.length > 0) {
      const currentElement = stack.pop();

      if (is(currentElement, 'bpmn:SubProcess')) {
        this.handlePlane(currentElement);
      }

      const nextElements = this.handle('addToGrid', { element: currentElement, grid, visited });

      nextElements.flat().forEach(el => {
        stack.push(el);
        visited.add(el);
      });
    }

    return grid;
  }

  generateDi(root, layoutGrid) {
    const diFactory = this.diFactory;

    // Step 0: Create Root element
    const diagram = this.diagram;

    var planeDi = diFactory.createDiPlane({
      id: 'BPMNPlane_' + root.id,
      bpmnElement: root
    });
    var diagramDi = diFactory.createDiDiagram({
      id: 'BPMNDiagram_' + root.id,
      plane: planeDi
    });

    // deepest subprocess is added first - insert at the front
    diagram.diagrams.unshift(diagramDi);

    const planeElement = planeDi.get('planeElement');

    // Step 1: Create DI for all elements
    layoutGrid.elementsByPosition().forEach(({ element, row, col }) => {
      const dis = this
        .handle('createElementDi', { element, row, col, layoutGrid, diFactory })
        .flat();

      planeElement.push(...dis);
    });

    // Step 2: Create DI for all connections
    layoutGrid.elementsByPosition().forEach(({ element, row, col }) => {
      const dis = this
        .handle('createConnectionDi', { element, row, col, layoutGrid, diFactory })
        .flat();

      planeElement.push(...dis);
    });
  }


  getProcess() {
    return this.diagram.get('rootElements').find(el => el.$type === 'bpmn:Process');
  }
}

function layoutProcess(xml) {
  return new Layouter().layoutProcess(xml);
}

export { layoutProcess };
//# sourceMappingURL=index.esm.js.map
