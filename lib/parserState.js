var stateStack = [];

var StateEnum = {
  /**
   * Indicates that we are parsing the inner parts of a control flow statement, like if(CONDITION). We need this distinction to disambiguate the usage of 'is' as '=' vs '===' for legacy reasons.
   * This parser state should be popped as soon as the processing of the condition is complete and be preceeded by a CONTROL_FLOW_BLOCK state
   */
  CONTROL_FLOW_CONDITION: 1,
  /**
   * Indicates that we are in the process of parsing a multiline comment (with quiet) so we can ignore everything until the closing keyword
   */
  MULTILINE_COMMENT: 2,
  /**
   * Indicates that we are starting an object declaration with obj, most parser rules don't apply until we close the object
   */
  OBJECT: 3,
  /**
   * Indicates we are starting a function declaration
   */
  FUNCTION: 4,
  /**
   * Indicates we are starting a class declaration, useful when disabling adding the 'function' keyword for inner class methods
   */
  CLASS: 5,
  /**
   * Indicates we are done processing a control flow block
   */
  CONTROL_FLOW_BLOCK: 6
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

function stack() {
  return stateStack;
}

module.exports = {
  hasState,
  pushState,
  popState,
  StateEnum,
  stack
};
