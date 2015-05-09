import {readFile} from "./reader"
import Promise from "bluebird"

export function main(dir, args) {
    readFile(dir, args).then(file => {
      console.log(file)
    })
}
