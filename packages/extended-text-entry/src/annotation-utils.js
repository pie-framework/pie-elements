// returns DOM Nodes before the stopOffset
const getAllTextNodesBeforePosition = (node, stopOffset, nodeArray) => {
  const nodes = (nodeArray) ? nodeArray : [];
  const offset = nodes.reduce((acc, node) => acc + node.textContent.length, 0);
  let keepWalking = true;

  if (offset > stopOffset) {
    return false;
  }

  // 3 = HTML DOM node value for text nodes
  if (node.nodeType === 3 && node.parentNode && !node.parentNode.hasAttribute('data-ann-id')) {
    nodes.push(node);
  }

  node = node.firstChild;

  while(node && keepWalking) {
    keepWalking = getAllTextNodesBeforePosition(node, stopOffset, nodes);
    node = node.nextSibling;
  }

  return nodes;
};

// returns DOM Nodes that overlap the start or end position
export const getDOMNodes = (startOffset, endOffset, rootNode) => {
  const textNodesToEnd = getAllTextNodesBeforePosition(rootNode, endOffset);
  const domNodes = [];
  let start = 0;

  textNodesToEnd.forEach((node) => {
    const end = start + node.textContent.length;

    [startOffset, endOffset].forEach((offset) => {
      if (start <= offset && offset < end) {
        domNodes.push({
          node,
          offset: offset - start
        });
      }
    });

    start = end;
  });

  return domNodes;
};

// returns [ textNodes, text ]
// textNodes = DOM Text Nodes between start range and end range node
// text = plain text in range
const getTextNodesBetween = (range) => {
  const {
    commonAncestorContainer: rootNode,
    startContainer: startNode,
    endContainer: endNode,
    startOffset,
    endOffset
  } = range;
  let pastStartNode = false;
  let reachedEndNode = false;
  const textNodes = [];
  let text = '';

  const getTextNodes = (node) => {
    const { nodeValue: value, childNodes } = node;

    if(node === startNode && node === endNode) {
      if (value) {
        text += value.substring(startOffset, endOffset);
      }
      pastStartNode = reachedEndNode = true;
    } else if(node === startNode) {
      if (value) {
        text += value.substring(startOffset);
      }
      pastStartNode = true;
    } else if(node === endNode) {
      if (value) {
        text += value.substring(0, endOffset);
      }
      reachedEndNode = true;
    } else if(node.nodeType === 3 && node.parentNode && !node.parentNode.hasAttribute('data-ann-id')) {
      // 3 = HTML DOM node value for text nodes
      if (value && pastStartNode && !reachedEndNode) {
        text += value;
        textNodes.push(node);
      }
    }

    childNodes.forEach((childNode) => {
      if (!reachedEndNode) {
        getTextNodes(childNode);
      } else {
        return;
      }
    });
  };

  getTextNodes(rootNode);
  return [textNodes, text];
};

const surroundContent = range => {
  const wrapper = document.createElement('SPAN');

  range.surroundContents(wrapper);

  return wrapper;
};

// wrap each DOM Text Node in range into a span
export const wrapRange = (range) => {
  if (range.startContainer === range.endContainer) {
    return [ surroundContent(range) ];
  }

  const [ nodesBetween ] = getTextNodesBetween(range);

  // wrap the start node
  const startRange = document.createRange();
  startRange.selectNodeContents(range.startContainer);
  startRange.setStart(range.startContainer, range.startOffset);
  const startWrapper = surroundContent(startRange);

  // wrap the end node
  const endRange = document.createRange();
  endRange.selectNode(range.endContainer);
  endRange.setEnd(range.endContainer, range.endOffset);
  const endWrapper = surroundContent(endRange);

  // wrap the nodes between start and end nodes, if any
  const centerWrappers = nodesBetween.map((node) => {
    const wrapper = document.createElement('SPAN');

    node.parentNode.insertBefore(wrapper, node);
    wrapper.appendChild(node);

    return wrapper;
  });

  return [ startWrapper, ...centerWrappers, endWrapper ];
};

// returns text in range with start and end position in rootNode
export const getRangeDetails = (range, rootNode) => {
  const rangeBefore = document.createRange();
  rangeBefore.setStart(rootNode, 0);
  rangeBefore.setEnd(range.startContainer, range.startOffset);

  const [ , text ] = getTextNodesBetween(rangeBefore);
  const [ , textSelected ] = getTextNodesBetween(range);
  const start = text.length;
  const end = start + textSelected.length;

  return {
    quote: textSelected,
    start,
    end
  };
};

// removes the annotation spans without changing the content inside
export const removeElemsWrapping = (elems, container) => {
  elems.forEach(elem => {
    const parent = elem.parentNode;
    const childNodes = elem.childNodes;
    const childNodesLength = childNodes.length;

    if (childNodesLength > 0) {
      for (let i = 0; i < childNodesLength; i++) {
        parent.insertBefore(childNodes[0], elem);
      }
    } else {
      parent.insertBefore(document.createTextNode(elem.textContent), elem);
    }

    parent.removeChild(elem);
  });

  container.normalize();
};

// also used in select-text
export const clearSelection = () => {
  if (document.getSelection) {
    // for all new browsers (IE9+, Chrome, Firefox)
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(document.createRange());
  } else if (window.getSelection) {
    // equals with the document.getSelection (MSDN info)
    if (window.getSelection().removeAllRanges) {
      // for all new browsers (IE9+, Chrome, Firefox)
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(document.createRange());
    } else if (window.getSelection().empty) {
      // Chrome supports this as well
      window.getSelection().empty();
    }
  } else if (document.selection) {
    // IE8-
    document.selection.empty();
  }
};

// check if annotation label contains line breaks or its length >= 20 characters
export const isSideLabel = text => text.length >= 20 || text.search(/\n|\r|\r\n/) !== -1;

export const getAnnotationElements = id => {
  return Array.from(document.querySelectorAll(`[data-id='${id}']`));
};

export const getLabelElement = id => {
  return document.querySelector(`[data-ann-id='${id}']`);
};
