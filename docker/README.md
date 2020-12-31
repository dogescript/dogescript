# docker

Dockerfiles for `dogescript` images

## Usage

```bash
# repl
docker run -it dogescript
# transpiler
docker run -v ${PWD}/samples:/samples dogescript /samples/fizzbuzz.djs --beautify > fizzbuzz.js
# interpreter
docker run -v ${PWD}/samples:/samples dogescript /samples/fizzbuzz.djs --run
```
