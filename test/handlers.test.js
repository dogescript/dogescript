import operatorHandlers from '../lib/handlers/operatorHandlers'

describe("operatorHandlers", function() {

    describe("handleBinaryOperator", function() {
        it("throws an error when called with an unsupported token", function () {
            var parseContext = {
                tokens: ['wow'],
                inputTokens: ['wow'],
                input: "wow"
            }
            var expectedMsg = "Expected one of [bigger,biggerish,smaller,smallerish,and,or,not] but got wow. Parsed tokens [wow] from input \"wow\""
            var test = function() {
                return operatorHandlers.handleBinaryOperator(parseContext);
            };
            expect(test).toThrow(new Error(expectedMsg));
        });
        });
    

    describe("handleAssignmentOperator", function() {
        it("throws an error when called with an unsupported token", function () {
          var parseContext = {
              tokens: ['wow'],
              inputTokens: ['wow'],
              input: "wow"
          }
          var expectedMsg = "Expected one of [more,less,lots,few,is,as] but got wow. Parsed tokens [wow] from input \"wow\""
          var test = function() {
              return operatorHandlers.handleAssignmentOperator(parseContext);
            };
          expect(test).toThrow(new Error(expectedMsg));
        });
      });
});