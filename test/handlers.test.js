import operatorHandlers from "../lib/handlers/operatorHandlers";
import statementHandlers from "../lib/handlers/statementHandlers";
import propertyHandlers from "../lib/handlers/propertyAccessorHandlers";
import functionHandlers from "../lib/handlers/functionHandlers";

describe("operatorHandlers", function() {
  describe("handleBinaryOperator", function() {
    it("throws an error when called with an unsupported token", function() {
      var parseContext = {
        tokens: ["wow"],
        inputTokens: ["wow"],
        input: "wow"
      };
      var expectedMsg =
        'Expected one of [bigger,biggerish,smaller,smallerish,and,or,not,isa,like,same] but got wow. Parsed tokens [wow] from input "wow"';
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
        "Invalid parse state! Expected argument but got nothing. Allowed construct: kindof <arg>. Parsed tokens [kindof] from input \"kindof\"";
      var test = function() {
        return operatorHandlers.handleKindOf(parseContext);
      };
      expect(test).toThrow(new Error(expectedMsg));
    });
  });

  describe("handleYelde", function() {
    it("throws an error when called with an unsupported token", function() {
      var parseContext = {
        tokens: ["wow"],
        inputTokens: ["wow"],
        input: "wow"
      };
      var expectedMsg =
        "Invalid parse state! Expected: 'yelde' but got: 'wow' from chain: [wow]. Parsed tokens [wow] from input \"wow\"";
      var test = function() {
        return operatorHandlers.handleYelde(parseContext);
      };
      expect(test).toThrow(new Error(expectedMsg));
    });
    it("throws an error when called without an argument", function() {
      var parseContext = {
        tokens: ["yelde"],
        inputTokens: ["yelde"],
        input: "yelde"
      };
      var expectedMsg =
        "Invalid parse state! Expected argument but got nothing. Allowed construct: yelde <arg>. Parsed tokens [yelde] from input \"yelde\"";
      var test = function() {
        return operatorHandlers.handleYelde(parseContext);
      };
      expect(test).toThrow(new SyntaxError(expectedMsg));
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

  describe("handleWaite", function() {
    it("throws an error when called with an unsupported token", function() {
      var parseContext = {
        tokens: ["wow"],
        inputTokens: ["wow"],
        input: "wow"
      };
      var expectedMsg =
      "Invalid parse state! Expected: 'waite' but got: 'wow' from chain: [wow]. Parsed tokens [wow] from input \"wow\"";
      var test = function() {
        return statementHandlers.handleWaite(parseContext);
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


describe("functionHandlers", function(){

  describe("handleAsink", function(){
    it("throws an error when called with an unsupported token", function() {
      var parseContext = {
        tokens: ["wow"],
        inputTokens: ["wow"],
        input: "wow"
      };
      var expectedMsg =
        "Invalid parse state! Expected: 'asink' but got: 'wow' from chain: [wow]. Parsed tokens [wow] from input \"wow\"";
      var test = function() {
        return functionHandlers.handleAsink(parseContext);
      };
      expect(test).toThrow(new Error(expectedMsg));
    });
    it("throws an error when neither such or much follow asink", function() {
      var parseContext = {
        tokens: ["asink","blah"],
        inputTokens: ["asink","blah"],
        input: "asink blah"
      };
      var expectedMsg =
        "Invalid parse state! Expected: ['such' | 'much'] but got: 'blah' from chain: [blah]. Allowed construct: 'asink such [lazy] <function_name> [much <args>]' or 'asink much <args>'. Parsed tokens [asink,blah] from input \"asink blah\"";
      var test = function() {
        return functionHandlers.handleAsink(parseContext);
      };
      expect(test).toThrow(new Error(expectedMsg));
    });
  });

  describe("handleSuch", function(){
    it("throws an error when called with an unsupported token", function() {
      var parseContext = {
        tokens: ["wow"],
        inputTokens: ["wow"],
        input: "wow"
      };
      var expectedMsg =
        "Invalid parse state! Expected: 'such' but got: 'wow' from chain: [wow]. Parsed tokens [wow] from input \"wow\"";
      var test = function() {
        return functionHandlers.handleSuch(parseContext);
      };
      expect(test).toThrow(new Error(expectedMsg));
    });
    it("throws an error when called without a function name", function() {
      var parseContext = {
        tokens: ["such"],
        inputTokens: ["such"],
        input: "such"
      };
      var expectedMsg =
        "Invalid parse state! Expected function name but got nothing. Allowed construct: 'such [lazy] <function_name>'. Parsed tokens [such] from input \"such\"";
      var test = function() {
        return functionHandlers.handleSuch(parseContext);
      };
      expect(test).toThrow(new SyntaxError(expectedMsg));
    });
    it("throws an error when called with arguments without a much", function() {
      var parseContext = {
        tokens: ["such", "foo", "bar"],
        inputTokens: ["such", "foo", "bar"],
        input: "such foo bar"
      };
      var expectedMsg =
        "Invalid parse state! Expected: 'much' but got: 'bar' from chain: [bar]. Allowed construct: 'such [lazy] <function_name> [much <args>]'. Parsed tokens [such,foo,bar] from input \"such foo bar\"";
      var test = function() {
        return functionHandlers.handleSuch(parseContext);
      };
      expect(test).toThrow(new SyntaxError(expectedMsg));
    });
    it("throws an error when called with much witout parameters", function() {
      var parseContext = {
        tokens: ["such", "foo", "much"],
        inputTokens: ["such", "foo", "much"],
        input: "such foo much"
      };
      var expectedMsg =
        "Invalid parse state! Expected parameters but got nothing. Allowed construct: 'much <params>'. Parsed tokens [such,foo,much] from input \"such foo much\"";
      var test = function() {
        return functionHandlers.handleSuch(parseContext);
      };
      expect(test).toThrow(new SyntaxError(expectedMsg));
    });
    });
});