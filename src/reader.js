import Promise from "bluebird"
import readline from "readline"
import R from "ramda"

import Stream from "stream"

let fs = Promise.promisifyAll(require("fs"))

export default {fs}

// Takes a path to a file, and a function to process each line
// in that file
export async function mapOverLines(path, func) {

  // TODO: Read in through a buffer
  let f = (await fs.readFileAsync(path))

  // Filter out any false-y values
  let filterLines = R.filter(x => {return !!x})

  return filterLines(
      f
      .toString()
      .split("\n")
      .map(func)
  )

}
