import operatorHandlers from "../lib/handlers/operatorHandlers";
import statementHandlers from "../lib/handlers/statementHandlers";
import propertyHandlers from "../lib/handlers/propertyAccessorHandlers";

describe("operatorHandlers", function() {
  describe("handleBinaryOperator", function() {
    it("throws an error when called with an unsupported token", function() {
      var parseContext = {
        tokens: ["wow"],
        inputTokens: ["wow"],
        input: "wow"
      };
      var expectedMsg =
        'Expected one of [bigger,biggerish,smaller,smallerish,and,or,not,isa] but got wow. Parsed tokens [wow] from input "wow"';
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

  describe("handleKindOf", function() {
    it("throws an error when called with an unsupported token", function() {
      var parseContext = {
        tokens: ["wow"],
        inputTokens: ["wow"],
        input: "wow"
      };
      var expectedMsg =
        "Invalid parse state! Expected: 'kindof' but got: 'wow' from chain: [wow]. Parsed tokens [wow] from input \"wow\"";
      var test = function() {
        return operatorHandlers.handleKindOf(parseContext);
      };
      expect(test).toThrow(new Error(expectedMsg));
    });
    it("throws an error when called without an argument", function() {
      var parseContext = {
        tokens: ["kindof"],
        inputTokens: ["kindof"],
        input: "kindof"
      };
      var expectedMsg =
        "Expected argument but got nothing. Allowed construct: kindof [arg]. Parsed tokens [kindof] from input \"kindof\"";
      var test = function() {
        return operatorHandlers.handleKindOf(parseContext);
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

describe("propertyHandlers", function () {

  describe("handleProto", function() {
    it("throws an error when called with an unsupported token", function() {
      var parseContext = {
        tokens: ["wow"],
        inputTokens: ["wow"],
        input: "wow"
      };
      var expectedMsg =
        "Invalid parse state! Expected: 'proto' but got: 'wow' from chain: [wow]. Parsed tokens [wow] from input \"wow\"";
      var test = function() {
        return propertyHandlers.handleProto(parseContext);
      };
      expect(test).toThrow(new Error(expectedMsg));
    });

    it("throws an error when called without an argument", function() {
      var parseContext = {
        tokens: ["proto"],
        inputTokens: ["proto"],
        input: "proto"
      };
      var expectedMsg =
        "Expected argument but got nothing. Allowed construct: obj proto [arg]. Parsed tokens [proto] from input \"proto\"";
      var test = function() {
        return propertyHandlers.handleProto(parseContext);
      };
      expect(test).toThrow(new Error(expectedMsg));
    });
  });
});
