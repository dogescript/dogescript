import Promise from "bluebird"

let fs = Promise.promisifyAll(require("fs"))

export default {fs}


export function readFile(path, file) {
  return fs.readFileAsync(path + "/" + file)
    .then((content) => {
      return content
    })
    .catch(err => {
      throw err
    })

}
