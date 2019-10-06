var stateStack = [];

var StateEnum = {
  CONTROL_FLOW: 1,
  MULTILINE_COMMENT: 2,
  OBJECT: 3
};

/**
 * Determines whether the parser has entered the desired state or not
 */
function hasState(state) {
  if (stateStack.length < 1) {
    return false;
  }

  return stateStack[stateStack.length - 1] == state;
}

/**
 * Sets the parser state
 * @param {StateEnum} a state
 */
function pushState(state) {
  stateStack.push(state);
}

/**
 * Pops the last entered state
 */
function popState() {
  stateStack.pop();
}

module.exports = {
  hasState,
  pushState,
  popState,
  StateEnum
};
