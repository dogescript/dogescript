import Promise from "bluebird"
import readline from "readline"
import Stream from "stream"

let fs = Promise.promisifyAll(require("fs"))

export default {fs}

// Takes a path to a file, and a function to process each line
// in that file
export async function mapOverLines(path, func, cb) {
  let inStream = fs.createReadStream(path)

  let outStream = new Stream

  // Create a read stream so we don't load everything in memory
  let buffer = readline.createInterface(inStream, outStream)

  // Apply the function to the line:
  return buffer.on("line", line => {
    return func(null, line).then(cb)
  })


}

//
