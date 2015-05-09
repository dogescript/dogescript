import Promise from "bluebird"
import readline from "readline"
import Stream from "stream"

let fs = Promise.promisifyAll(require("fs"))

export default {fs}

export function readFile(path, file) {
  // Find the file relative to the current directory
  let filePath = path + "/" + file
  let inStream = fs.createReadStream(filePath)
  let outStream = new Stream

  // Create a read stream so we don't load everything in memory
  let buffer = readline.createInterface(inStream, outStream)

  return buffer

}

//
