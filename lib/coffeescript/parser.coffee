remove = require("lodash.remove")
module.exports = parse = (line) ->
  keys = line.match(/'[^']+'|\S+/g)
  valid = ["such", "wow", "plz", ".plz", "very", "shh", "rly", "many", "much", "so"]
  statement = ""
  return line + "\n"  if keys is null
  
  # not dogescript, such javascript
  return line + "\n"  if valid.indexOf(keys[0]) is -1 and keys[1] isnt "is"
  
  # such function
  if keys[0] is "such"
    statement += "function " + keys[1]
    if keys[2] is "much"
      statement += " ("
      i = 3

      while i < keys.length
        statement += keys[i]
        statement += ", "  if i isnt keys.length - 1
        i++
      statement += ") { \n"
    else
      statement += " () { \n"
  
  # wow end function and return 
  if keys[0] is "wow"
    if typeof keys[1] isnt "undefined"
      statement += "return"
      i = 1

      while i < keys.length
        statement += " " + keys[i]
        i++
      statement += ";\n"
      statement += "} \n"
    else
      statement += "} \n"
  
  # plz execute function
  if keys[0] is "plz" or keys[0] is ".plz"
    statement += "."  if keys[0].charAt(0) is "."
    keys[1] = "console.log"  if keys[1] is "woof"
    if keys[2] is "with"
      statement += keys[1] + "("
      dupe = keys.slice(0)
      i = 3

      while i < keys.length
        continue  if keys[i] is "," or keys[i] is "&"
        if keys[i] is "much" # lambda functions - thanks @00Davo!
          statement += "function ("
          if keys[i + 1]
            j = i + 1

            while j < keys.length
              statement += keys[j]
              statement += ", "  if j isnt keys.length - 1
              j++
            statement += ") {\n"
            return statement
          else
            statement += ") {\n"
            return statement
        keys[i] = keys[i].slice(0, -1)  if keys[i].substr(-1) is "&" or keys[i].substr(-1) is ","
        statement += keys[i]
        statement += " "  if keys[i].substr(-1) is ":"
        statement += ", "  if i isnt keys.length - 1 and keys[i].substr(-1) isnt ":"
        i++
      statement = statement.slice(0, -2)  if statement.substr(-2) is ", "
      statement = statement.replace(statement.substr(-3), statement.substr(-1))  if statement.substr(-3) is ", ]" or statement.substr(-3) is ", }"
      if dupe[keys.length - 1].slice(-1) is "&"
        statement += ")\n"
      else
        statement += ");\n"
    else
      if keys[1].slice(-1) is "&"
        statement += keys[1] + "()\n"
      else
        statement += keys[1] + "();\n"
  
  # very new variable
  if keys[0] is "very"
    statement += "var " + keys[1] + " = "
    if keys[3] is "new"
      statement += "new " + keys[4] + "("
      if keys[5] is "with"
        i = 6

        while i < keys.length
          continue  if keys[i] is ","
          keys[i] = keys[i].slice(0, -1)  if keys[i].substr(-1) is "," and keys[i].charAt(keys[i].length - 2) isnt "}"
          statement += keys[i]
          statement += ", "  if i isnt keys.length - 1
          i++
      statement += ");\n"
      return statement
    if keys.length > 3
      recurse = ""
      i = 3

      while i < keys.length
        keys[i] = keys[i].slice(0, -1)  if keys[i].substr(-1) is "," and keys[i].charAt(keys[i].length - 2) isnt "}"
        recurse += keys[i] + " "
        i++
      statement += parse(recurse)
    else
      statement += keys[3] + ";\n"
  
  # is existing variable
  if keys[1] is "is"
    statement += keys[0] + " = "
    if keys[2] is "new"
      statement += "new " + keys[3] + "("
      if keys[4] is "with"
        i = 5

        while i < keys.length
          continue  if keys[i] is ","
          statement += keys[i]
          statement += ", "  if i isnt keys.length - 1
          i++
      statement += ");\n"
      return statement
    if keys.length > 2
      recurse = ""
      i = 2

      while i < keys.length
        recurse += keys[i] + " "
        i++
      statement += parse(recurse)
    else
      statement += keys[2] + ";\n"
  
  # shh comment
  if keys[0] is "shh"
    statement += "// "
    i = 1

    while i < keys.length
      statement += keys[i] + " "
      i++
    statement += "\n"
  keyParser = (key) ->
    if key is "is"
      statement += " === "
      true
    else if key is "not"
      statement += " !== "
      true
    else if key is "and"
      statement += " && "
      true
    else if key is "or"
      statement += " || "
      true
    else if key is "next"
      statement += "; "
      true
    else if key is "as"
      statement += " = "
      true
    else if key is "more"
      statement += " += "
      true
    else if key is "less"
      statement += " -= "
      true
    else if key is "lots"
      statement += " *= "
      true
    else if key is "few"
      statement += " /= "
      true
    else if key is "very"
      statement += " var "
      true
    else if key is "lesser"
      statement += " < "
      true
    else if key is "greater"
      statement += " > "
      true
    else
      false

  
  # rly if
  if keys[0] is "rly"
    statement += "if ("
    i = 1

    while i < keys.length
      parsed = keyParser(keys[i])
      continue  if parsed
      statement += keys[i] + " "
      i++
    statement += ") {\n"
  
  # many while
  if keys[0] is "many"
    statement += "while ("
    i = 1

    while i < keys.length
      parsed = keyParser(keys[i])
      continue  if parsed
      statement += keys[i] + " "
      i++
    statement += ") {\n"
  
  # much for
  if keys[0] is "much"
    statement += "for ("
    i = 1

    while i < keys.length
      parsed = keyParser(keys[i])
      continue  if parsed
      statement += keys[i] + " "
      i++
    statement += ") {\n"
  
  # so require (thanks @maxogden!)
  if keys[0] is "so"
    if keys[2] is "as"
      statement += "var " + keys[3] + " = require('" + keys[1] + "');\n"
    else
      statement += "var " + keys[1] + " = require('" + keys[1] + "');\n"
  statement