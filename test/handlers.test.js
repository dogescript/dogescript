import operatorHandlers from "../lib/handlers/operatorHandlers";
import statementHandlers from "../lib/handlers/statementHandlers";

describe("operatorHandlers", function() {
  describe("handleBinaryOperator", function() {
    it("throws an error when called with an unsupported token", function() {
      var parseContext = {
        tokens: ["wow"],
        inputTokens: ["wow"],
        input: "wow"
      };
      var expectedMsg =
        'Expected one of [bigger,biggerish,smaller,smallerish,and,or,not] but got wow. Parsed tokens [wow] from input "wow"';
      var test = function() {
        return operatorHandlers.handleBinaryOperator(parseContext);
      };
      expect(test).toThrow(new Error(expectedMsg));
    });
  });

  describe("handleAssignmentOperator", function() {
    it("throws an error when called with an unsupported token", function() {
      var parseContext = {
        tokens: ["wow"],
        inputTokens: ["wow"],
        input: "wow"
      };
      var expectedMsg =
        'Expected one of [more,less,lots,few,is,as] but got wow. Parsed tokens [wow] from input "wow"';
      var test = function() {
        return operatorHandlers.handleAssignmentOperator(parseContext);
      };
      expect(test).toThrow(new Error(expectedMsg));
    });
  });

  describe("handleMaybe", function() {
    it("throws an error when called with an unsupported token", function() {
      var parseContext = {
        tokens: ["wow"],
        inputTokens: ["wow"],
        input: "wow"
      };
      var expectedMsg =
        "Invalid parse state! Expected: 'maybe' but got: 'wow' from chain: [wow]. Parsed tokens [wow] from input \"wow\"";
      var test = function() {
        return operatorHandlers.handleMaybe(parseContext);
      };
      expect(test).toThrow(new Error(expectedMsg));
    });
  });
});

describe("statementHandlers", function() {
  describe("handleNext", function() {
    it("throws an error when called with an unsupported token", function() {
      var parseContext = {
        tokens: ["wow"],
        inputTokens: ["wow"],
        input: "wow"
      };
      var expectedMsg =
        "Invalid parse state! Expected: 'next' but got: 'wow' from chain: [wow]. Parsed tokens [wow] from input \"wow\"";
      var test = function() {
        return statementHandlers.handleNext(parseContext);
      };
      expect(test).toThrow(new Error(expectedMsg));
    });
  });

  describe("handleObj", function() {
    it("throws an error when called with an unsupported token", function() {
      var parseContext = {
        tokens: ["wow"],
        inputTokens: ["wow"],
        input: "wow"
      };
      var expectedMsg =
        "Invalid parse state! Expected: 'obj' but got: 'wow' from chain: [wow]. Parsed tokens [wow] from input \"wow\"";
      var test = function() {
        return statementHandlers.handleObj(parseContext);
      };
      expect(test).toThrow(new Error(expectedMsg));
    });
  });
});
