var parse, remove;

remove = require("lodash.remove");

module.exports = parse = function(line) {
  var dupe, i, j, keyParser, keys, parsed, recurse, statement, valid;
  keys = line.match(/'[^']+'|\S+/g);
  valid = ["such", "wow", "plz", ".plz", "very", "shh", "rly", "many", "much", "so"];
  statement = "";
  if (keys === null) {
    return line + "\n";
  }
  if (valid.indexOf(keys[0]) === -1 && keys[1] !== "is") {
    return line + "\n";
  }
  if (keys[0] === "such") {
    statement += "function " + keys[1];
    if (keys[2] === "much") {
      statement += " (";
      i = 3;
      while (i < keys.length) {
        statement += keys[i];
        if (i !== keys.length - 1) {
          statement += ", ";
        }
        i++;
      }
      statement += ") { \n";
    } else {
      statement += " () { \n";
    }
  }
  if (keys[0] === "wow") {
    if (typeof keys[1] !== "undefined") {
      statement += "return";
      i = 1;
      while (i < keys.length) {
        statement += " " + keys[i];
        i++;
      }
      statement += ";\n";
      statement += "} \n";
    } else {
      statement += "} \n";
    }
  }
  if (keys[0] === "plz" || keys[0] === ".plz") {
    if (keys[0].charAt(0) === ".") {
      statement += ".";
    }
    if (keys[1] === "woof") {
      keys[1] = "console.log";
    }
    if (keys[2] === "with") {
      statement += keys[1] + "(";
      dupe = keys.slice(0);
      i = 3;
      while (i < keys.length) {
        if (keys[i] === "," || keys[i] === "&") {
          continue;
        }
        if (keys[i] === "much") {
          statement += "function (";
          if (keys[i + 1]) {
            j = i + 1;
            while (j < keys.length) {
              statement += keys[j];
              if (j !== keys.length - 1) {
                statement += ", ";
              }
              j++;
            }
            statement += ") {\n";
            return statement;
          } else {
            statement += ") {\n";
            return statement;
          }
        }
        if (keys[i].substr(-1) === "&" || keys[i].substr(-1) === ",") {
          keys[i] = keys[i].slice(0, -1);
        }
        statement += keys[i];
        if (keys[i].substr(-1) === ":") {
          statement += " ";
        }
        if (i !== keys.length - 1 && keys[i].substr(-1) !== ":") {
          statement += ", ";
        }
        i++;
      }
      if (statement.substr(-2) === ", ") {
        statement = statement.slice(0, -2);
      }
      if (statement.substr(-3) === ", ]" || statement.substr(-3) === ", }") {
        statement = statement.replace(statement.substr(-3), statement.substr(-1));
      }
      if (dupe[keys.length - 1].slice(-1) === "&") {
        statement += ")\n";
      } else {
        statement += ");\n";
      }
    } else {
      if (keys[1].slice(-1) === "&") {
        statement += keys[1] + "()\n";
      } else {
        statement += keys[1] + "();\n";
      }
    }
  }
  if (keys[0] === "very") {
    statement += "var " + keys[1] + " = ";
    if (keys[3] === "new") {
      statement += "new " + keys[4] + "(";
      if (keys[5] === "with") {
        i = 6;
        while (i < keys.length) {
          if (keys[i] === ",") {
            continue;
          }
          if (keys[i].substr(-1) === "," && keys[i].charAt(keys[i].length - 2) !== "}") {
            keys[i] = keys[i].slice(0, -1);
          }
          statement += keys[i];
          if (i !== keys.length - 1) {
            statement += ", ";
          }
          i++;
        }
      }
      statement += ");\n";
      return statement;
    }
    if (keys.length > 3) {
      recurse = "";
      i = 3;
      while (i < keys.length) {
        if (keys[i].substr(-1) === "," && keys[i].charAt(keys[i].length - 2) !== "}") {
          keys[i] = keys[i].slice(0, -1);
        }
        recurse += keys[i] + " ";
        i++;
      }
      statement += parse(recurse);
    } else {
      statement += keys[3] + ";\n";
    }
  }
  if (keys[1] === "is") {
    statement += keys[0] + " = ";
    if (keys[2] === "new") {
      statement += "new " + keys[3] + "(";
      if (keys[4] === "with") {
        i = 5;
        while (i < keys.length) {
          if (keys[i] === ",") {
            continue;
          }
          statement += keys[i];
          if (i !== keys.length - 1) {
            statement += ", ";
          }
          i++;
        }
      }
      statement += ");\n";
      return statement;
    }
    if (keys.length > 2) {
      recurse = "";
      i = 2;
      while (i < keys.length) {
        recurse += keys[i] + " ";
        i++;
      }
      statement += parse(recurse);
    } else {
      statement += keys[2] + ";\n";
    }
  }
  if (keys[0] === "shh") {
    statement += "// ";
    i = 1;
    while (i < keys.length) {
      statement += keys[i] + " ";
      i++;
    }
    statement += "\n";
  }
  keyParser = function(key) {
    if (key === "is") {
      statement += " === ";
      return true;
    } else if (key === "not") {
      statement += " !== ";
      return true;
    } else if (key === "and") {
      statement += " && ";
      return true;
    } else if (key === "or") {
      statement += " || ";
      return true;
    } else if (key === "next") {
      statement += "; ";
      return true;
    } else if (key === "as") {
      statement += " = ";
      return true;
    } else if (key === "more") {
      statement += " += ";
      return true;
    } else if (key === "less") {
      statement += " -= ";
      return true;
    } else if (key === "lots") {
      statement += " *= ";
      return true;
    } else if (key === "few") {
      statement += " /= ";
      return true;
    } else if (key === "very") {
      statement += " var ";
      return true;
    } else if (key === "lesser") {
      statement += " < ";
      return true;
    } else if (key === "greater") {
      statement += " > ";
      return true;
    } else {
      return false;
    }
  };
  if (keys[0] === "rly") {
    statement += "if (";
    i = 1;
    while (i < keys.length) {
      parsed = keyParser(keys[i]);
      if (parsed) {
        continue;
      }
      statement += keys[i] + " ";
      i++;
    }
    statement += ") {\n";
  }
  if (keys[0] === "many") {
    statement += "while (";
    i = 1;
    while (i < keys.length) {
      parsed = keyParser(keys[i]);
      if (parsed) {
        continue;
      }
      statement += keys[i] + " ";
      i++;
    }
    statement += ") {\n";
  }
  if (keys[0] === "much") {
    statement += "for (";
    i = 1;
    while (i < keys.length) {
      parsed = keyParser(keys[i]);
      if (parsed) {
        continue;
      }
      statement += keys[i] + " ";
      i++;
    }
    statement += ") {\n";
  }
  if (keys[0] === "so") {
    if (keys[2] === "as") {
      statement += "var " + keys[3] + " = require('" + keys[1] + "');\n";
    } else {
      statement += "var " + keys[1] + " = require('" + keys[1] + "');\n";
    }
  }
  return statement;
};
